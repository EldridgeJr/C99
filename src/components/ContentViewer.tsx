import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft, CheckCircle, Play, Clock } from 'lucide-react';

interface ContentViewerProps {
  contentId: string;
  userId: string;
  onBack: () => void;
}

interface ContentItem {
  id: string;
  title: string;
  description: string;
  content_type: string;
  category: string;
  url: string;
  thumbnail_url: string;
  duration_minutes: number;
  difficulty_level: string;
  xp_reward: number;
}

export default function ContentViewer({ contentId, userId, onBack }: ContentViewerProps) {
  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchContent();
  }, [contentId]);

  const fetchContent = async () => {
    try {
      const { data: contentData, error: contentError } = await supabase
        .from('content_items')
        .select('*')
        .eq('id', contentId)
        .maybeSingle();

      if (contentError) throw contentError;
      setContent(contentData);

      const { data: progressData, error: progressError } = await supabase
        .from('client_progress')
        .select('*')
        .eq('client_id', userId)
        .eq('content_item_id', contentId)
        .maybeSingle();

      if (!progressError && progressData) {
        setProgress(progressData.progress_percentage);
        setCompleted(progressData.completed);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!content) return;

    try {
      const { error } = await supabase
        .from('client_progress')
        .upsert({
          client_id: userId,
          content_item_id: contentId,
          case_id: null,
          progress_percentage: 100,
          completed: true,
          last_accessed: new Date().toISOString(),
        });

      if (error) throw error;

      setProgress(100);
      setCompleted(true);
    } catch (error) {
      console.error('Error marking content complete:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-600">Content not found</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-black hover:text-gray-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Learning Content
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="relative h-96 bg-gray-900">
            <img
              src={content.thumbnail_url}
              alt={content.title}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="bg-black bg-opacity-80 hover:bg-opacity-100 text-white rounded-full p-6 transition-all transform hover:scale-110">
                <Play className="w-12 h-12" />
              </button>
            </div>
            {completed && (
              <div className="absolute top-4 right-4 bg-black text-white px-4 py-2 rounded-full flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Completed
              </div>
            )}
          </div>

          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    content.difficulty_level === 'beginner'
                      ? 'bg-gray-100 text-gray-700'
                      : content.difficulty_level === 'intermediate'
                      ? 'bg-gray-200 text-gray-800'
                      : 'bg-gray-900 text-white'
                  }`}>
                    {content.difficulty_level}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {content.duration_minutes} minutes
                  </span>
                  <span className="px-3 py-1 bg-black text-white rounded-full text-xs font-medium">
                    {content.xp_reward} XP
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-black mb-3">{content.title}</h1>
                <p className="text-gray-600 text-lg leading-relaxed">{content.description}</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Progress</span>
                <span className="text-sm font-semibold text-black">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-black h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold text-black mb-4">Content Overview</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  This {content.content_type} content will help you understand key concepts related to {content.category.replace('_', ' ')}.
                  Take your time to absorb the material, and feel free to review it as many times as needed.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Once you've completed this content, you'll earn {content.xp_reward} XP towards your total progress.
                  This will also count towards your daily streak and learning goals.
                </p>
              </div>
            </div>

            {!completed && (
              <button
                onClick={handleComplete}
                className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group"
              >
                <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Mark as Complete
              </button>
            )}

            {completed && (
              <div className="text-center py-4">
                <p className="text-gray-600">
                  You've completed this content! Ready to learn more?
                </p>
                <button
                  onClick={onBack}
                  className="mt-4 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Back to Learning Content
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
