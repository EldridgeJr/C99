import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BookOpen, Headphones, Eye, EyeOff, AlertCircle, ArrowLeft, FileText } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
}

interface Podcast {
  id: string;
  title: string;
  description: string;
  category: string;
}

interface ContentItem {
  id: string;
  title: string;
  description: string;
  category: string;
  content_type: string;
}

interface ContentAccess {
  id: string;
  law_firm_id: string;
  content_type: string;
  content_id: string;
  is_enabled: boolean;
}

interface ContentManagementProps {
  lawFirmId: string;
  onBack?: () => void;
}

export default function ContentManagement({ lawFirmId, onBack }: ContentManagementProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [contentAccess, setContentAccess] = useState<ContentAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'courses' | 'podcasts' | 'content'>('content');
  const [updatingContent, setUpdatingContent] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, [lawFirmId]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const [coursesRes, podcastsRes, contentItemsRes, accessRes] = await Promise.all([
        supabase.from('courses').select('id, title, description').order('title'),
        supabase.from('podcasts').select('id, title, description, category').order('title'),
        supabase.from('content_items').select('id, title, description, category, content_type').order('title'),
        supabase.from('law_firm_content_access').select('*').eq('law_firm_id', lawFirmId),
      ]);

      if (coursesRes.error) throw coursesRes.error;
      if (podcastsRes.error) throw podcastsRes.error;
      if (contentItemsRes.error) throw contentItemsRes.error;
      if (accessRes.error) throw accessRes.error;

      setCourses(coursesRes.data || []);
      setPodcasts(podcastsRes.data || []);
      setContentItems(contentItemsRes.data || []);
      setContentAccess(accessRes.data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const isContentEnabled = (contentId: string, contentType: string): boolean => {
    const access = contentAccess.find(
      (a) => a.content_id === contentId && a.content_type === contentType
    );
    return access ? access.is_enabled : true;
  };

  const toggleContentAccess = async (contentId: string, contentType: string) => {
    setUpdatingContent(contentId);
    try {
      const currentAccess = contentAccess.find(
        (a) => a.content_id === contentId && a.content_type === contentType
      );

      if (currentAccess) {
        const { error } = await supabase
          .from('law_firm_content_access')
          .update({
            is_enabled: !currentAccess.is_enabled,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentAccess.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('law_firm_content_access')
          .insert({
            law_firm_id: lawFirmId,
            content_type: contentType,
            content_id: contentId,
            is_enabled: false,
          });

        if (error) throw error;
      }

      await fetchContent();
    } catch (error) {
      console.error('Error toggling content access:', error);
      alert('Failed to update content access. Please try again.');
    } finally {
      setUpdatingContent(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white min-h-full">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </button>
          )}
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Content Management</h1>
          <p className="text-slate-600">
            Control which courses and podcasts are visible to your clients
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-900">
            <p className="font-medium mb-1">How Content Visibility Works</p>
            <p>
              By default, all content is visible to your clients. Toggle the eye icon to hide
              specific courses or podcasts. Hidden content will not appear in your clients' dashboards.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('content')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'content'
                    ? 'text-black border-b-2 border-black bg-gray-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <FileText size={18} />
                  <span>Learning Content ({contentItems.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'courses'
                    ? 'text-black border-b-2 border-black bg-gray-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <BookOpen size={18} />
                  <span>Courses ({courses.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('podcasts')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'podcasts'
                    ? 'text-black border-b-2 border-black bg-gray-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Headphones size={18} />
                  <span>Podcasts ({podcasts.length})</span>
                </div>
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'content' && (
              <div className="space-y-4">
                {contentItems.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600">No learning content available</p>
                  </div>
                ) : (
                  contentItems.map((item) => {
                    const enabled = isContentEnabled(item.id, 'content_item');
                    const isUpdating = updatingContent === item.id;

                    return (
                      <div
                        key={item.id}
                        className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-900">{item.title}</h3>
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-slate-600 rounded-full">
                              {item.category}
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-black text-white rounded-full">
                              {item.content_type}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleContentAccess(item.id, 'content_item')}
                          disabled={isUpdating}
                          className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                            enabled
                              ? 'bg-gray-900 text-white hover:bg-black border border-gray-900'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {isUpdating ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : enabled ? (
                            <>
                              <Eye size={16} />
                              <span>Visible</span>
                            </>
                          ) : (
                            <>
                              <EyeOff size={16} />
                              <span>Hidden</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="space-y-4">
                {courses.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600">No courses available</p>
                  </div>
                ) : (
                  courses.map((course) => {
                    const enabled = isContentEnabled(course.id, 'course');
                    const isUpdating = updatingContent === course.id;

                    return (
                      <div
                        key={course.id}
                        className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 mb-1">{course.title}</h3>
                          <p className="text-sm text-slate-600 line-clamp-2">
                            {course.description}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleContentAccess(course.id, 'course')}
                          disabled={isUpdating}
                          className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                            enabled
                              ? 'bg-gray-900 text-white hover:bg-black border border-gray-900'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {isUpdating ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : enabled ? (
                            <>
                              <Eye size={16} />
                              <span>Visible</span>
                            </>
                          ) : (
                            <>
                              <EyeOff size={16} />
                              <span>Hidden</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {activeTab === 'podcasts' && (
              <div className="space-y-4">
                {podcasts.length === 0 ? (
                  <div className="text-center py-12">
                    <Headphones className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600">No podcasts available</p>
                  </div>
                ) : (
                  podcasts.map((podcast) => {
                    const enabled = isContentEnabled(podcast.id, 'podcast');
                    const isUpdating = updatingContent === podcast.id;

                    return (
                      <div
                        key={podcast.id}
                        className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-900">{podcast.title}</h3>
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-slate-600 rounded-full">
                              {podcast.category}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 line-clamp-2">
                            {podcast.description}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleContentAccess(podcast.id, 'podcast')}
                          disabled={isUpdating}
                          className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                            enabled
                              ? 'bg-gray-900 text-white hover:bg-black border border-gray-900'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {isUpdating ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : enabled ? (
                            <>
                              <Eye size={16} />
                              <span>Visible</span>
                            </>
                          ) : (
                            <>
                              <EyeOff size={16} />
                              <span>Hidden</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-slate-900 mb-2">Quick Stats</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-600">Visible Content</p>
              <p className="text-2xl font-bold text-slate-900">
                {contentItems.filter((c) => isContentEnabled(c.id, 'content_item')).length} / {contentItems.length}
              </p>
            </div>
            <div>
              <p className="text-slate-600">Visible Courses</p>
              <p className="text-2xl font-bold text-slate-900">
                {courses.filter((c) => isContentEnabled(c.id, 'course')).length} / {courses.length}
              </p>
            </div>
            <div>
              <p className="text-slate-600">Visible Podcasts</p>
              <p className="text-2xl font-bold text-slate-900">
                {podcasts.filter((p) => isContentEnabled(p.id, 'podcast')).length} /{' '}
                {podcasts.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
