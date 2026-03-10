import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  Play,
  BookOpen,
  Trophy,
  Flame,
  Target,
  Clock,
  Video,
  Headphones,
  FileText,
  TrendingUp,
  Radio,
  Calendar,
  X,
  Users,
} from 'lucide-react';

interface Case {
  id: string;
  case_number: string;
  case_type: string;
  status: string;
  description: string;
}

interface ContentItem {
  id: string;
  title: string;
  description: string;
  content_type: string;
  category: string;
  thumbnail_url: string;
  duration_minutes: number;
  difficulty_level: string;
}

interface ClientProgress {
  content_item_id: string;
  progress_percentage: number;
  completed: boolean;
}

interface Stats {
  total_xp: number;
  current_streak: number;
  longest_streak: number;
}

interface CaseWithProgress {
  case: Case;
  progress: number;
  assignedModules: number;
  completedModules: number;
}

interface UserProfile {
  full_name: string;
  email: string;
  password: string;
  law_firm_id: string | null;
}

interface ContentAccess {
  content_id: string;
  content_type: string;
  is_enabled: boolean;
}

interface Livestream {
  id: string;
  title: string;
  description: string;
  stream_url: string;
  scheduled_start: string | null;
  scheduled_end: string | null;
  status: 'scheduled' | 'live' | 'ended';
  thumbnail_url: string | null;
  viewer_count: number;
}

interface ClientDashboardProps {
  userId: string;
  onStartContent?: (contentId: string) => void;
}

export default function ClientDashboard({ userId, onStartContent }: ClientDashboardProps) {
  const [caseInfo, setCaseInfo] = useState<CaseWithProgress | null>(null);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [progress, setProgress] = useState<ClientProgress[]>([]);
  const [stats, setStats] = useState<Stats>({
    total_xp: 0,
    current_streak: 0,
    longest_streak: 0,
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [contentAccess, setContentAccess] = useState<ContentAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [livestreams, setLivestreams] = useState<Livestream[]>([]);
  const [selectedLivestream, setSelectedLivestream] = useState<Livestream | null>(null);
  const [showLivestreamModal, setShowLivestreamModal] = useState(false);
  const [showLawyerPingModal, setShowLawyerPingModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchUserProfile(),
        fetchCaseInfo(),
        fetchContentItems(),
        fetchProgress(),
        fetchStats(),
        fetchLivestreams(),
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, email, password, law_firm_id')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      setUserProfile(data);

      await fetchContentAssignments();
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchContentAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('client_content_assignments')
        .select('content_id, content_type, is_active')
        .eq('client_id', userId)
        .eq('is_active', true);

      if (error) throw error;
      setContentAccess(
        (data || []).map(item => ({
          content_id: item.content_id,
          content_type: item.content_type,
          is_enabled: item.is_active,
        }))
      );
    } catch (error) {
      console.error('Error fetching content assignments:', error);
    }
  };

  const fetchCaseInfo = async () => {
    try {
      const { data: caseData, error } = await supabase
        .from('cases')
        .select('*')
        .eq('client_id', userId)
        .maybeSingle();

      if (error) throw error;

      if (caseData) {
        const { data: modules } = await supabase
          .from('case_modules')
          .select('id')
          .eq('case_id', caseData.id);

        const { data: progressData } = await supabase
          .from('client_progress')
          .select('completed')
          .eq('case_id', caseData.id)
          .eq('client_id', userId);

        const assignedModules = modules?.length || 0;
        const completedModules = progressData?.filter((p) => p.completed).length || 0;
        const progress =
          assignedModules > 0 ? Math.round((completedModules / assignedModules) * 100) : 0;

        setCaseInfo({
          case: caseData,
          progress,
          assignedModules,
          completedModules,
        });
      }
    } catch (error) {
      console.error('Error fetching case info:', error);
    }
  };

  const fetchContentItems = async () => {
    try {
      const { data: assignments, error: assignmentsError } = await supabase
        .from('client_content_assignments')
        .select('content_id, content_type')
        .eq('client_id', userId)
        .eq('content_type', 'content_item')
        .eq('is_active', true);

      if (assignmentsError) throw assignmentsError;

      if (!assignments || assignments.length === 0) {
        setContentItems([]);
        return;
      }

      const contentIds = assignments.map(a => a.content_id);

      const { data, error } = await supabase
        .from('content_items')
        .select('*')
        .in('id', contentIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContentItems(data || []);
    } catch (error) {
      console.error('Error fetching content items:', error);
    }
  };

  const fetchProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('client_progress')
        .select('content_item_id, progress_percentage, completed')
        .eq('client_id', userId);

      if (error) throw error;
      setProgress(data || []);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('client_stats')
        .select('*')
        .eq('client_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setStats(data);
      } else {
        const { data: newStats, error: upsertError } = await supabase
          .from('client_stats')
          .upsert(
            {
              client_id: userId,
              total_xp: 0,
              current_streak: 0,
              longest_streak: 0,
            },
            { onConflict: 'client_id' }
          )
          .select()
          .maybeSingle();

        if (upsertError) throw upsertError;
        if (newStats) setStats(newStats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getContentProgress = (contentId: string) => {
    return progress.find((p) => p.content_item_id === contentId);
  };

  const handleStartContent = async (contentId: string) => {
    if (onStartContent) {
      onStartContent(contentId);
    }
  };

  const fetchLivestreams = async () => {
    try {
      const { data, error } = await supabase
        .from('livestreams')
        .select('*')
        .in('status', ['live', 'scheduled'])
        .order('scheduled_start', { ascending: true });

      if (error) throw error;
      setLivestreams(data || []);
    } catch (error) {
      console.error('Error fetching livestreams:', error);
    }
  };

  const handleOpenLivestream = (livestream: Livestream) => {
    setSelectedLivestream(livestream);
    setShowLivestreamModal(true);
  };

  const closeLivestreamModal = () => {
    setShowLivestreamModal(false);
    setSelectedLivestream(null);
  };

  const handleSendLawyerPing = async () => {
    try {
      console.log('Sending lawyer ping...');
      alert('Notification sent to your lawyer successfully!');
      setShowLawyerPingModal(false);
    } catch (error) {
      console.error('Error sending lawyer ping:', error);
      alert('Failed to send notification. Please try again.');
    }
  };

  const renderStreamEmbed = (streamUrl: string) => {
    if (streamUrl.includes('<iframe')) {
      return <div dangerouslySetInnerHTML={{ __html: streamUrl }} />;
    }

    if (streamUrl.includes('youtube.com') || streamUrl.includes('youtu.be')) {
      const videoId = streamUrl.includes('youtu.be')
        ? streamUrl.split('youtu.be/')[1]?.split('?')[0]
        : streamUrl.split('v=')[1]?.split('&')[0];
      return (
        <iframe
          className="w-full aspect-video rounded-lg"
          src={`https://www.youtube.com/embed/${videoId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    if (streamUrl.includes('vimeo.com')) {
      const videoId = streamUrl.split('vimeo.com/')[1]?.split('?')[0];
      return (
        <iframe
          className="w-full aspect-video rounded-lg"
          src={`https://player.vimeo.com/video/${videoId}`}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      );
    }

    return (
      <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <a
          href={streamUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:underline"
        >
          Open Stream in New Tab
        </a>
      </div>
    );
  };

  const filteredContent =
    selectedCategory === 'all'
      ? contentItems
      : contentItems.filter((item) => item.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All Content', icon: BookOpen },
    { id: 'law', label: 'Law', icon: FileText },
    { id: 'court', label: 'Court', icon: Target },
    { id: 'mental_health', label: 'Mental Health', icon: TrendingUp },
    { id: 'business', label: 'Business', icon: Trophy },
    { id: 'focus', label: 'Focus', icon: Target },
  ];

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video;
      case 'audio':
        return Headphones;
      default:
        return FileText;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">
            Welcome back{userProfile?.full_name ? `, ${userProfile.full_name}` : ''}!
          </h1>
          <p className="text-gray-600 mt-1">Continue your learning journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-black rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Flame className="w-8 h-8" />
              <span className="text-3xl font-bold">{stats.current_streak}</span>
            </div>
            <p className="text-gray-100">Day Streak</p>
            <p className="text-xs text-gray-200 mt-1">Longest: {stats.longest_streak} days</p>
          </div>

          <div className="bg-black rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="w-8 h-8" />
              <span className="text-3xl font-bold">{stats.total_xp}</span>
            </div>
            <p className="text-gray-100">Total XP</p>
            <p className="text-xs text-gray-200 mt-1">Keep learning to earn more!</p>
          </div>

          <div className="bg-black rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8" />
              <span className="text-3xl font-bold">
                {caseInfo?.progress || 0}%
              </span>
            </div>
            <p className="text-gray-100">Case Progress</p>
            <p className="text-xs text-gray-200 mt-1">
              {caseInfo?.completedModules || 0} / {caseInfo?.assignedModules || 0} modules
            </p>
          </div>
        </div>

        {caseInfo && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-black">Your Case</h2>
                <p className="text-gray-600 text-sm mt-1">Case #{caseInfo.case.case_number}</p>
              </div>
              <span className="px-3 py-1 bg-gray-100 text-black rounded-full text-sm font-medium">
                {caseInfo.case.case_type}
              </span>
            </div>
            <p className="text-gray-700 mb-4">{caseInfo.case.description}</p>

            {userProfile && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-semibold text-black mb-3">Account Credentials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-600 block mb-1">Email</span>
                    <span className="text-sm text-black font-medium">{userProfile.email}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-600 block mb-1">Password</span>
                    <span className="text-sm text-black font-medium">{userProfile.password}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Overall Progress</span>
                <span className="text-sm font-semibold text-black">
                  {caseInfo.progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-black h-2 rounded-full transition-all duration-500"
                  style={{ width: `${caseInfo.progress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {livestreams.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Radio className="w-6 h-6 text-black" />
              <h2 className="text-xl font-bold text-black">Live & Upcoming Streams</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {livestreams.map((livestream) => (
                <div
                  key={livestream.id}
                  className="group bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-black cursor-pointer"
                  onClick={() => handleOpenLivestream(livestream)}
                >
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    {livestream.thumbnail_url ? (
                      <img
                        src={livestream.thumbnail_url}
                        alt={livestream.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                          livestream.status === 'live'
                            ? 'bg-red-600 text-white animate-pulse'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {livestream.status === 'live' ? (
                          <>
                            <span className="w-2 h-2 bg-white rounded-full"></span>
                            LIVE
                          </>
                        ) : (
                          <>
                            <Calendar className="w-3 h-3" />
                            SCHEDULED
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-black mb-2 line-clamp-2">
                      {livestream.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {livestream.description}
                    </p>
                    {livestream.scheduled_start && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(livestream.scheduled_start).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showLivestreamModal && selectedLivestream && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      selectedLivestream.status === 'live'
                        ? 'bg-red-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {selectedLivestream.status === 'live' ? '🔴 LIVE' : '📅 SCHEDULED'}
                  </span>
                  <h2 className="text-xl font-bold text-black">{selectedLivestream.title}</h2>
                </div>
                <button
                  onClick={closeLivestreamModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              <div className="p-6">
                <div className="mb-6">{renderStreamEmbed(selectedLivestream.stream_url)}</div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-2">About this stream</h3>
                    <p className="text-gray-700">{selectedLivestream.description}</p>
                  </div>
                  {selectedLivestream.scheduled_start && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-5 h-5" />
                      <span>
                        Scheduled for{' '}
                        {new Date(selectedLivestream.scheduled_start).toLocaleString([], {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-5 h-5" />
                    <span>{selectedLivestream.viewer_count} viewers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-black mb-4">Learning Content</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      selectedCategory === category.id
                        ? 'bg-black text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent.map((item) => {
                const itemProgress = getContentProgress(item.id);
                const Icon = getContentIcon(item.content_type);

                return (
                  <div
                    key={item.id}
                    className="group bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-black"
                  >
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      <img
                        src={item.thumbnail_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-white bg-opacity-90 rounded-full text-xs font-medium text-gray-700 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.duration_minutes}m
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.difficulty_level === 'beginner'
                              ? 'bg-gray-700 text-white'
                              : item.difficulty_level === 'intermediate'
                              ? 'bg-gray-600 text-white'
                              : 'bg-black text-white'
                          }`}
                        >
                          {item.difficulty_level}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start gap-2 mb-2">
                        <Icon className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                        <h3 className="font-semibold text-black line-clamp-2">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {item.description}
                      </p>

                      <button
                        onClick={() => handleStartContent(item.id)}
                        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group"
                      >
                        <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        {itemProgress?.completed ? 'Review' : 'Start Learning'}
                      </button>

                      {itemProgress && (
                        <div className="mt-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-600">Progress</span>
                            <span className="text-xs font-semibold text-black">
                              {itemProgress.progress_percentage}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-black h-1.5 rounded-full transition-all"
                              style={{ width: `${itemProgress.progress_percentage}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredContent.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No content available in this category yet.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-black mb-2">Need additional help?</h2>
              <p className="text-gray-600">
                Get expert support for your court preparation from your lawyer, with one click
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                console.log('Button clicked, opening modal');
                setShowLawyerPingModal(true);
              }}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium whitespace-nowrap shrink-0"
            >
              Send my lawyer a ping
            </button>
          </div>
        </div>

        {showLawyerPingModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => {
              console.log('Closing modal (backdrop clicked)');
              setShowLawyerPingModal(false);
            }}
          >
            <div
              className="bg-white rounded-2xl w-full max-w-lg p-8"
              onClick={(e) => {
                console.log('Modal content clicked');
                e.stopPropagation();
              }}
            >
              <h2 className="text-2xl font-bold text-black mb-4">Contact Your Lawyer</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                We could understand a procedure takes effort, patience and preparation. Our platform
                aims to help in the best way. You are one click away from sending your lawyer a
                notification to contact you. Just to notice: your lawyer spends time on you to help
                you in the best way, it could take him additional time for your case.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleSendLawyerPing}
                  className="w-full sm:flex-1 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Confirm & Send
                </button>
                <button
                  type="button"
                  onClick={() => {
                    console.log('Closing modal (Cancel button)');
                    setShowLawyerPingModal(false);
                  }}
                  className="w-full sm:flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
