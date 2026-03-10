import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { TrendingUp, Award, Target, Flame, Calendar, BookOpen, Video, Headphones, FileText, Upload, Mic, Trophy } from 'lucide-react';
import {
  mockStats,
  mockProgressSummary,
  mockWeeklyActivity,
  mockWeeklyGoal,
  mockCategoryProgress,
  mockAchievements,
} from '../lib/mock/progressTracking';

interface Stats {
  total_xp: number;
  current_streak: number;
  longest_streak: number;
}

interface ProgressSummary {
  coursesCompleted: number;
  contentCompleted: number;
  podcastsCompleted: number;
  totalStudyTime: number;
}

interface WeeklyData {
  day: string;
  xp: number;
}

interface CategoryProgress {
  name: string;
  percent: number;
  itemsCompleted: number;
  totalItems: number;
}

interface XPTransaction {
  source_type: string;
  xp_amount: number;
  earned_at: string;
}

const achievementIcons: Record<string, React.ReactNode> = {
  upload: <Upload className="text-white" size={20} />,
  book: <BookOpen className="text-white" size={20} />,
  flame: <Flame className="text-white" size={20} />,
  target: <Target className="text-white" size={20} />,
  mic: <Mic className="text-white" size={20} />,
  trophy: <Trophy className="text-white" size={20} />,
};

function formatStudyTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export default function ProgressTracking({ userId }: { userId: string }) {
  const [stats, setStats] = useState<Stats>(mockStats);
  const [progressSummary, setProgressSummary] = useState<ProgressSummary>(mockProgressSummary);
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyData[]>(mockWeeklyActivity);
  const [categoryProgress, setCategoryProgress] = useState<CategoryProgress[]>(mockCategoryProgress);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, [userId]);

  const fetchAllData = async () => {
    try {
      await Promise.all([
        fetchStats(),
        fetchProgressSummary(),
        fetchWeeklyProgress(),
      ]);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('client_stats')
        .select('*')
        .eq('client_id', userId)
        .maybeSingle();

      if (error) throw error;
      if (data && data.total_xp > 0) setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchProgressSummary = async () => {
    try {
      const [coursesData, contentData, podcastsData] = await Promise.all([
        supabase
          .from('user_progress')
          .select('course_id')
          .eq('user_id', userId)
          .eq('completed', true)
          .not('course_id', 'is', null),
        supabase
          .from('client_progress')
          .select('content_item_id, content_items(duration_minutes)')
          .eq('client_id', userId)
          .eq('completed', true),
        supabase
          .from('podcast_progress')
          .select('episode_id, podcast_episodes(duration_minutes)')
          .eq('client_id', userId)
          .eq('completed', true),
      ]);

      const uniqueCourses = new Set(coursesData.data?.map(p => p.course_id)).size;
      const contentCompleted = contentData.data?.length || 0;
      const podcastsCompleted = podcastsData.data?.length || 0;

      const contentTime = contentData.data?.reduce((sum, item: any) =>
        sum + (item.content_items?.duration_minutes || 0), 0) || 0;
      const podcastTime = podcastsData.data?.reduce((sum, item: any) =>
        sum + (item.podcast_episodes?.duration_minutes || 0), 0) || 0;

      const total = uniqueCourses + contentCompleted + podcastsCompleted;
      if (total > 0) {
        setProgressSummary({
          coursesCompleted: uniqueCourses,
          contentCompleted,
          podcastsCompleted,
          totalStudyTime: contentTime + podcastTime,
        });
      }
    } catch (error) {
      console.error('Error fetching progress summary:', error);
    }
  };

  const fetchWeeklyProgress = async () => {
    try {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 6);

      const { data, error } = await supabase
        .from('xp_transactions')
        .select('xp_amount, earned_at')
        .eq('client_id', userId)
        .gte('earned_at', weekAgo.toISOString())
        .order('earned_at', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const xpByDay: { [key: string]: number } = {};

        for (let i = 0; i < 7; i++) {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          const dayName = days[date.getDay()];
          xpByDay[dayName] = 0;
        }

        data.forEach((transaction: XPTransaction) => {
          const date = new Date(transaction.earned_at);
          const dayName = days[date.getDay()];
          xpByDay[dayName] += transaction.xp_amount;
        });

        const today = new Date().getDay();
        const orderedDays: WeeklyData[] = [];
        for (let i = 0; i < 7; i++) {
          const dayIndex = (today - 6 + i + 7) % 7;
          orderedDays.push({
            day: days[dayIndex],
            xp: xpByDay[days[dayIndex]] || 0,
          });
        }

        setWeeklyProgress(orderedDays);
      }
    } catch (error) {
      console.error('Error fetching weekly progress:', error);
    }
  };

  const maxXP = Math.max(...weeklyProgress.map(d => d.xp), 1);
  const weeklyTotal = weeklyProgress.reduce((sum, d) => sum + d.xp, 0);
  const weeklyGoal = mockWeeklyGoal;
  const remaining = Math.max(0, weeklyGoal - weeklyTotal);

  const totalItemsCompleted =
    progressSummary.coursesCompleted + progressSummary.contentCompleted + progressSummary.podcastsCompleted;

  const achievements = mockAchievements;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Progress Tracking</h1>
          <p className="text-gray-600">Track your preparation progress and readiness</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Readiness Points</span>
              <Award className="text-black" size={24} />
            </div>
            <div className="text-3xl font-bold text-black">{stats.total_xp}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Items Completed</span>
              <Target className="text-black" size={24} />
            </div>
            <div className="text-3xl font-bold text-black">{totalItemsCompleted}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Current Streak</span>
              <Flame className="text-black" size={24} />
            </div>
            <div className="text-3xl font-bold text-black">{stats.current_streak} days</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Preparation Time</span>
              <Calendar className="text-black" size={24} />
            </div>
            <div className="text-3xl font-bold text-black">{formatStudyTime(progressSummary.totalStudyTime)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black">Weekly Activity</h2>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Goal:</span>
                <span className="font-bold text-black">{weeklyGoal} RP/week</span>
              </div>
            </div>

            <div className="flex items-end justify-between gap-3 h-56 px-2">
              {weeklyProgress.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-xs font-semibold text-gray-700 h-5">
                    {day.xp > 0 ? day.xp : ''}
                  </div>
                  <div className="w-full bg-gray-100 rounded-lg relative flex-1 flex items-end">
                    <div
                      className={`w-full rounded-lg transition-all duration-500 ${
                        day.xp > 0
                          ? 'bg-gradient-to-t from-gray-900 to-gray-700'
                          : 'bg-gray-200'
                      }`}
                      style={{ height: day.xp > 0 ? `${Math.max((day.xp / maxXP) * 100, 8)}%` : '4px' }}
                    ></div>
                  </div>
                  <div className="text-xs font-medium text-gray-500">{day.day}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">This week's total</span>
                <span className="text-2xl font-bold text-black">{weeklyTotal} RP</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-black h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((weeklyTotal / weeklyGoal) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">
                  {Math.round((weeklyTotal / weeklyGoal) * 100)}% of weekly goal
                </span>
                <span className="text-xs text-gray-500">
                  {remaining > 0 ? `${remaining} RP to go` : 'Goal reached!'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-black mb-6">Preparation Categories</h2>
            <div className="space-y-5">
              {categoryProgress.map((category, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    <span className="text-xs font-semibold text-gray-500">
                      {category.itemsCompleted}/{category.totalItems}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-black h-2 rounded-full transition-all duration-500"
                      style={{ width: `${category.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button className="w-full bg-black text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm">
                Adjust Weekly Goal
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-black">Achievements</h2>
            <span className="text-sm text-gray-600">
              {achievements.filter(a => a.earned).length} of {achievements.length} unlocked
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`border rounded-xl p-4 transition-all ${
                  achievement.earned
                    ? 'border-gray-300 bg-white'
                    : 'border-gray-200 bg-gray-50 opacity-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      achievement.earned ? 'bg-black' : 'bg-gray-300'
                    }`}
                  >
                    {achievementIcons[achievement.icon] || <Award className="text-white" size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-black text-sm">{achievement.title}</h3>
                      {achievement.earned ? (
                        <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200 flex-shrink-0">
                          Unlocked
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200 flex-shrink-0">
                          Locked
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{achievement.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
