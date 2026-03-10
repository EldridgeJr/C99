import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Headphones,
  Clock,
  CheckCircle2,
  Filter,
  Search,
} from 'lucide-react';

interface Podcast {
  id: string;
  title: string;
  description: string;
  host_name: string;
  category: string;
  thumbnail_url: string;
}

interface Episode {
  id: string;
  podcast_id: string;
  episode_number: number;
  title: string;
  description: string;
  audio_url: string;
  duration_minutes: number;
  published_date: string;
  transcript_url: string | null;
  script: string | null;
  podcast?: Podcast;
}

interface Progress {
  episode_id: string;
  progress_seconds: number;
  completed: boolean;
  last_listened_at: string;
}

export default function Podcasts({ userId }: { userId: string }) {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [selectedPodcast, setSelectedPodcast] = useState<string | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [generatingAudio, setGeneratingAudio] = useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [useClientSideTTS, setUseClientSideTTS] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    fetchPodcasts();
    fetchProgress();

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [userId]);

  useEffect(() => {
    if (selectedPodcast) {
      fetchEpisodes(selectedPodcast);
    } else {
      fetchAllEpisodes();
    }
  }, [selectedPodcast]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      if (currentEpisode) {
        markAsCompleted(currentEpisode.id);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentEpisode]);

  useEffect(() => {
    if (!currentEpisode || !audioRef.current) return;

    const interval = setInterval(() => {
      if (isPlaying && audioRef.current) {
        saveProgress(currentEpisode.id, Math.floor(audioRef.current.currentTime));
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [currentEpisode, isPlaying]);

  const fetchPodcasts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('law_firm_id')
        .eq('id', user.id)
        .maybeSingle();

      const { data: allPodcasts, error } = await supabase
        .from('podcasts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      let filteredPodcasts = allPodcasts || [];

      if (profile?.law_firm_id) {
        const { data: contentAccess } = await supabase
          .from('law_firm_content_access')
          .select('content_id, is_enabled')
          .eq('law_firm_id', profile.law_firm_id)
          .eq('content_type', 'podcast');

        if (contentAccess && contentAccess.length > 0) {
          const disabledPodcastIds = contentAccess
            .filter((access) => !access.is_enabled)
            .map((access) => access.content_id);

          filteredPodcasts = allPodcasts?.filter(
            (podcast) => !disabledPodcastIds.includes(podcast.id)
          ) || [];
        }
      }

      setPodcasts(filteredPodcasts);
    } catch (error) {
      console.error('Error fetching podcasts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEpisodes = async (podcastId: string) => {
    try {
      const { data, error } = await supabase
        .from('podcast_episodes')
        .select('id, podcast_id, episode_number, title, description, audio_url, duration_minutes, published_date, transcript_url, script, is_published, podcast:podcasts(*)')
        .eq('podcast_id', podcastId)
        .eq('is_published', true)
        .order('episode_number', { ascending: true });

      if (error) throw error;
      setEpisodes(data || []);
    } catch (error) {
      console.error('Error fetching episodes:', error);
    }
  };

  const fetchAllEpisodes = async () => {
    try {
      const { data, error } = await supabase
        .from('podcast_episodes')
        .select('id, podcast_id, episode_number, title, description, audio_url, duration_minutes, published_date, transcript_url, script, is_published, podcast:podcasts(*)')
        .eq('is_published', true)
        .order('published_date', { ascending: false });

      if (error) throw error;
      setEpisodes(data || []);
    } catch (error) {
      console.error('Error fetching episodes:', error);
    }
  };

  const fetchProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('podcast_progress')
        .select('*')
        .eq('client_id', userId);

      if (error) throw error;
      setProgress(data || []);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const saveProgress = async (episodeId: string, progressSeconds: number) => {
    try {
      const { error } = await supabase
        .from('podcast_progress')
        .upsert({
          client_id: userId,
          episode_id: episodeId,
          progress_seconds: progressSeconds,
          last_listened_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      fetchProgress();
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const markAsCompleted = async (episodeId: string) => {
    try {
      const { error } = await supabase
        .from('podcast_progress')
        .upsert({
          client_id: userId,
          episode_id: episodeId,
          progress_seconds: 0,
          completed: true,
          last_listened_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      fetchProgress();
    } catch (error) {
      console.error('Error marking as completed:', error);
    }
  };

  const generateAudio = async (episode: Episode) => {
    if (!episode.script) {
      console.error('No script available for this episode');
      return null;
    }

    setGeneratingAudio(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(
        `${supabaseUrl}/functions/v1/generate-podcast-audio?episodeId=${episode.id}`,
        {
          headers: {
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const contentType = response.headers.get('Content-Type');

      if (contentType?.includes('application/json')) {
        const data = await response.json();
        if (data.useClientSideTTS) {
          setUseClientSideTTS(true);
          return { useClientSideTTS: true, script: data.script };
        }
      } else if (contentType?.includes('audio')) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        setGeneratedAudioUrl(audioUrl);
        return { audioUrl };
      }

      return null;
    } catch (error) {
      console.error('Error generating audio:', error);
      if (episode.script) {
        setUseClientSideTTS(true);
        return { useClientSideTTS: true, script: episode.script };
      }
      return null;
    } finally {
      setGeneratingAudio(false);
    }
  };

  const playWithClientSideTTS = (script: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(script);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = volume;

      utterance.onend = () => {
        setIsPlaying(false);
        if (currentEpisode) {
          markAsCompleted(currentEpisode.id);
        }
      };

      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    } else {
      console.error('Speech synthesis not supported');
      alert('Audio generation is not available. Please try again later.');
    }
  };

  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const playEpisode = async (episode: Episode) => {
    if (currentEpisode?.id === episode.id) {
      if (useClientSideTTS) {
        if (isPlaying) {
          window.speechSynthesis.pause();
          setIsPlaying(false);
        } else {
          window.speechSynthesis.resume();
          setIsPlaying(true);
        }
      } else if (isYouTubeUrl(episode.audio_url)) {
        setIsPlaying(!isPlaying);
      } else {
        if (isPlaying) {
          audioRef.current?.pause();
          setIsPlaying(false);
        } else {
          audioRef.current?.play();
          setIsPlaying(true);
        }
      }
    } else {
      setCurrentEpisode(episode);
      setUseClientSideTTS(false);
      setGeneratedAudioUrl(null);

      if (isYouTubeUrl(episode.audio_url)) {
        setIsPlaying(true);
      } else if (episode.script) {
        const result = await generateAudio(episode);

        if (result?.useClientSideTTS && result.script) {
          playWithClientSideTTS(result.script);
        } else if (result?.audioUrl) {
          setIsPlaying(true);
        }
      } else if (episode.audio_url && !episode.audio_url.includes('example.com')) {
        setIsPlaying(true);
      }

      const episodeProgress = progress.find((p) => p.episode_id === episode.id);
      if (episodeProgress && episodeProgress.progress_seconds > 0 && !episodeProgress.completed && !useClientSideTTS && !isYouTubeUrl(episode.audio_url)) {
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.currentTime = episodeProgress.progress_seconds;
          }
        }, 100);
      }
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const skipBackward = () => {
    seekTo(Math.max(0, currentTime - 15));
  };

  const skipForward = () => {
    seekTo(Math.min(duration, currentTime + 15));
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
      if (newVolume === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        setIsMuted(false);
      }
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEpisodeProgress = (episodeId: string) => {
    return progress.find((p) => p.episode_id === episodeId);
  };

  const filteredPodcasts =
    categoryFilter === 'all'
      ? podcasts
      : podcasts.filter((p) => p.category === categoryFilter);

  const filteredEpisodes = episodes.filter((episode) =>
    episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    episode.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const uniqueCategories = Array.from(new Set(podcasts.map(p => p.category))).sort();
  const categories = [
    { id: 'all', label: 'All Podcasts' },
    ...uniqueCategories.map(cat => ({ id: cat, label: cat }))
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-40">
      <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Podcasts</h1>
          <p className="text-lg text-gray-600 font-medium">Listen to expert advice and inspiring stories</p>
        </div>

        {generatingAudio && (
          <div className="mb-8 card-premium p-6 flex items-center gap-4 animate-scale-in">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="flex-1">
              <p className="text-gray-900 font-bold text-lg mb-1">Generating audio for you...</p>
              <p className="text-sm text-gray-600 font-medium">High-quality AI voice generation in progress.</p>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search episodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/70 border-2 border-gray-200/80 rounded-2xl focus:outline-none focus:ring-4 focus:ring-gray-900/10 focus:border-gray-900 transition-all duration-200"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setCategoryFilter(category.id)}
                className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all duration-200 font-bold text-sm ${
                  categoryFilter === category.id
                    ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200 hover:border-gray-300 hover:scale-105'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {!selectedPodcast && (
          <div className="mb-10">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center">
                <Headphones className="text-white" size={20} />
              </div>
              Podcast Series
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredPodcasts.map((podcast) => (
                <div
                  key={podcast.id}
                  onClick={() => setSelectedPodcast(podcast.id)}
                  className="group card-premium overflow-hidden cursor-pointer hover-lift hover-glow animate-scale-in"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={podcast.thumbnail_url}
                      alt={podcast.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=600';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="font-black text-white text-lg mb-1 line-clamp-2 drop-shadow-lg">
                        {podcast.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-gray-600 mb-3 font-semibold">by {podcast.host_name}</p>
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{podcast.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card-premium overflow-hidden">
          <div className="p-8 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center">
                  <Headphones className="text-white" size={20} />
                </div>
                {selectedPodcast
                  ? podcasts.find((p) => p.id === selectedPodcast)?.title
                  : 'Recent Episodes'}
              </h2>
              {selectedPodcast && (
                <button
                  onClick={() => setSelectedPodcast(null)}
                  className="text-gray-600 hover:text-gray-900 text-sm font-bold hover:underline transition-all"
                >
                  ← View All Podcasts
                </button>
              )}
            </div>
          </div>

          <div className="divide-y divide-gray-200/50">
            {filteredEpisodes.map((episode) => {
              const episodeProgress = getEpisodeProgress(episode.id);
              const isCurrentlyPlaying = currentEpisode?.id === episode.id && isPlaying;

              return (
                <div
                  key={episode.id}
                  className="p-7 hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="flex gap-6">
                    <button
                      onClick={() => playEpisode(episode)}
                      disabled={generatingAudio && currentEpisode?.id !== episode.id}
                      className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-lg ${
                        isCurrentlyPlaying
                          ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white scale-110 shadow-gray-900/30'
                          : generatingAudio && currentEpisode?.id === episode.id
                          ? 'bg-gray-600 text-white'
                          : 'bg-gray-100 text-gray-900 hover:bg-gradient-to-br hover:from-gray-900 hover:to-gray-800 hover:text-white hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                    >
                      {generatingAudio && currentEpisode?.id === episode.id ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : isCurrentlyPlaying ? (
                        <Pause size={22} />
                      ) : (
                        <Play size={22} className="ml-0.5" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2 text-lg">
                            {episode.episode_number}. {episode.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                            {episode.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 flex-shrink-0">
                          <div className="flex items-center gap-1.5 font-bold bg-gray-100 px-3 py-1.5 rounded-lg">
                            <Clock size={16} />
                            {episode.duration_minutes}m
                          </div>
                          {episodeProgress?.completed && (
                            <CheckCircle2 size={24} className="text-green-600" />
                          )}
                        </div>
                      </div>

                      {episodeProgress && !episodeProgress.completed && episodeProgress.progress_seconds > 0 && (
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-gray-600 font-bold uppercase tracking-wider">In Progress</span>
                            <span className="text-xs text-gray-600 font-bold">
                              {formatTime(episodeProgress.progress_seconds)} / {episode.duration_minutes}m
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 shadow-inner">
                            <div
                              className="bg-gradient-to-r from-gray-900 to-gray-700 h-2 rounded-full transition-all duration-300 shadow-lg"
                              style={{
                                width: `${(episodeProgress.progress_seconds / (episode.duration_minutes * 60)) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredEpisodes.length === 0 && (
            <div className="p-20 text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
                <Headphones className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-600 font-semibold text-lg">No episodes found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {currentEpisode && (
        <div className="fixed bottom-0 left-0 right-0 glass-panel border-t border-gray-200/50 shadow-2xl z-50 backdrop-blur-2xl">
          <div className="max-w-7xl mx-auto px-8 py-4">
            {isYouTubeUrl(currentEpisode.audio_url) ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={currentEpisode.podcast?.thumbnail_url}
                    alt={currentEpisode.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-black truncate">
                      {currentEpisode.title}
                    </h4>
                    <p className="text-sm text-gray-600 truncate">
                      {currentEpisode.podcast?.host_name}
                    </p>
                  </div>
                </div>
                <div className="w-full">
                  <iframe
                    className="w-full aspect-video rounded-lg"
                    src={`https://www.youtube.com/embed/${
                      currentEpisode.audio_url.includes('youtu.be')
                        ? currentEpisode.audio_url.split('youtu.be/')[1]?.split('?')[0]
                        : currentEpisode.audio_url.split('v=')[1]?.split('&')[0]
                    }?autoplay=${isPlaying ? '1' : '0'}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <img
                    src={currentEpisode.podcast?.thumbnail_url}
                    alt={currentEpisode.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-black truncate">
                      {currentEpisode.title}
                    </h4>
                    <p className="text-sm text-gray-600 truncate">
                      {currentEpisode.podcast?.host_name}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={skipBackward}
                      className="text-gray-600 hover:text-black transition-colors"
                    >
                      <SkipBack size={24} />
                    </button>
                    <button
                      onClick={() => playEpisode(currentEpisode)}
                      className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                    >
                      {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
                    </button>
                    <button
                      onClick={skipForward}
                      className="text-gray-600 hover:text-black transition-colors"
                    >
                      <SkipForward size={24} />
                    </button>
                  </div>

                  <div className="flex-1 flex items-center gap-4">
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {formatTime(currentTime)}
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={duration || 0}
                      value={currentTime}
                      onChange={(e) => seekTo(Number(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                    />
                    <span className="text-sm text-gray-600 w-12">
                      {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleMute}
                      className="text-gray-600 hover:text-black transition-colors"
                    >
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={isMuted ? 0 : volume}
                      onChange={(e) => handleVolumeChange(Number(e.target.value))}
                      className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                    />
                  </div>
                </div>

                {!useClientSideTTS && (
                  <audio
                    ref={audioRef}
                    src={generatedAudioUrl || currentEpisode.audio_url}
                    autoPlay={isPlaying}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
