export const mockStats = {
  total_xp: 620,
  current_streak: 5,
  longest_streak: 8,
};

export const mockProgressSummary = {
  coursesCompleted: 3,
  contentCompleted: 8,
  podcastsCompleted: 3,
  totalStudyTime: 210,
};

export const mockWeeklyActivity = [
  { day: 'Mon', xp: 40 },
  { day: 'Tue', xp: 25 },
  { day: 'Wed', xp: 0 },
  { day: 'Thu', xp: 55 },
  { day: 'Fri', xp: 30 },
  { day: 'Sat', xp: 10 },
  { day: 'Sun', xp: 0 },
];

export const mockWeeklyGoal = 200;

export const mockCategoryProgress = [
  { name: 'Preparation', percent: 72, itemsCompleted: 5, totalItems: 7 },
  { name: 'Documents', percent: 60, itemsCompleted: 3, totalItems: 5 },
  { name: 'Hearing Procedure', percent: 40, itemsCompleted: 2, totalItems: 5 },
  { name: 'Communication', percent: 25, itemsCompleted: 1, totalItems: 4 },
  { name: 'Stress Management', percent: 50, itemsCompleted: 2, totalItems: 4 },
  { name: 'Mock Hearings', percent: 33, itemsCompleted: 1, totalItems: 3 },
];

export const mockAchievements = [
  {
    title: 'First Upload',
    description: 'Upload your first legal document',
    earned: true,
    icon: 'upload' as const,
  },
  {
    title: 'First Module Completed',
    description: 'Complete your first preparation module',
    earned: true,
    icon: 'book' as const,
  },
  {
    title: '3-Day Streak',
    description: 'Prepare for 3 consecutive days',
    earned: true,
    icon: 'flame' as const,
  },
  {
    title: 'Weekly Goal Achieved',
    description: 'Reach your weekly readiness point goal',
    earned: false,
    icon: 'target' as const,
  },
  {
    title: 'Mock Hearing Completed',
    description: 'Complete your first mock hearing session',
    earned: false,
    icon: 'mic' as const,
  },
  {
    title: '10 Modules Completed',
    description: 'Complete 10 preparation modules',
    earned: false,
    icon: 'trophy' as const,
  },
];
