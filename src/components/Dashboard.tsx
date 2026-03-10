import { ArrowRight, Award, Clock, TrendingUp, BookOpen } from 'lucide-react';
import HelpWidget from './HelpWidget';
type DashboardProps = {
  userName: string;
  userId: string;
};

export default function Dashboard({ userName, userId }: DashboardProps) {
  const learningAreas = [
    { name: 'Before Court', xp: 340 },
    { name: 'During Court', xp: 280 },
    { name: 'Communication & Behavior', xp: 195 },
    { name: 'Mental Readiness', xp: 150 },
  ];

  const recommendedCourses = [
    {
      title: 'Civil Litigation Basics',
      description: 'Learn the fundamentals of civil court procedures and what to expect during your hearing.',
      modules: 6,
      hours: 12,
      level: 'Beginner Friendly',
      badge: 'Course Path',
      badgeColor: 'bg-gray-100 text-gray-700',
      certificate: true,
    },
    {
      title: 'Effective Testimony',
      description: 'Master the art of clear, confident testimony and learn how to handle cross-examination.',
      modules: 5,
      hours: 8,
      level: 'Intermediate',
      badge: 'Skill Path',
      badgeColor: 'bg-gray-100 text-gray-700',
      certificate: true,
    },
    {
      title: 'Court Etiquette 101',
      description: 'Start with the basics of courtroom behavior and proper etiquette for your hearing.',
      modules: 3,
      hours: 4,
      level: 'Beginner Friendly',
      badge: 'Free Course',
      badgeColor: 'bg-gray-100 text-gray-700',
      certificate: false,
    },
  ];

  const liveSessionTypes = [
    { label: 'Testimony Preparation', type: 'testimony' },
    { label: 'Court Procedures', type: 'procedures' },
    { label: 'Evidence Presentation', type: 'evidence' },
    { label: 'Cross-Examination Prep', type: 'cross-exam' },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Welcome back, {userName}</h1>
          <p className="text-lg text-gray-600 font-medium">Continue preparing for your upcoming court hearing</p>
        </div>

        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-10 mb-10 text-white shadow-2xl overflow-hidden animate-slide-up">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-gray-700/20 to-transparent rounded-full blur-3xl"></div>
          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                Live Sessions
              </div>
              <h2 className="text-3xl font-black mb-4 leading-tight">Accelerate Your Court Preparation</h2>
              <p className="text-gray-200 mb-8 max-w-2xl text-lg leading-relaxed">
                Join live preparation sessions led by experienced legal professionals. Build confidence
                and understanding to succeed in your court hearing.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {liveSessionTypes.map((session) => (
                  <span
                    key={session.type}
                    className="px-5 py-2.5 bg-white/15 backdrop-blur-sm rounded-xl text-sm font-semibold border border-white/20 hover:bg-white/25 transition-all duration-200 cursor-pointer hover:scale-105"
                  >
                    {session.label}
                  </span>
                ))}
              </div>
              <button className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-200 shadow-xl hover:scale-105 hover:shadow-2xl">
                Explore All Sessions →
              </button>
            </div>
            <div className="ml-8 hidden lg:block">
              <div className="w-56 h-56 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 flex items-center justify-center">
                <TrendingUp className="text-white/80" size={80} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="card-premium p-8 hover-glow animate-slide-up">
              <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center">
                  <BookOpen className="text-white" size={20} />
                </div>
                Keep Learning
              </h3>
              <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200/50 rounded-2xl p-8 hover:border-gray-300 transition-all duration-300">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="inline-block px-3 py-1 bg-gray-900 text-white text-xs font-bold rounded-lg mb-3">
                      IN PROGRESS
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Court Procedures & Etiquette</h4>
                    <p className="text-sm text-gray-600 font-medium">Current Module: Understanding Court Protocols</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1">23%</div>
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Progress</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-6 shadow-inner">
                  <div className="bg-gradient-to-r from-gray-900 to-gray-700 h-3 rounded-full shadow-lg transition-all duration-500" style={{ width: '23%' }}></div>
                </div>
                <div className="flex gap-4">
                  <button className="flex-1 btn-primary">
                    Continue Learning
                  </button>
                  <button className="btn-secondary">
                    View Full Path
                  </button>
                </div>
              </div>
            </div>

            <div className="card-premium p-8 hover-glow animate-slide-up">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center">
                    <Award className="text-white" size={20} />
                  </div>
                  Recommended for You
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendedCourses.map((course, index) => (
                  <div key={index} className="group bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200/50 rounded-2xl p-6 hover:border-gray-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <span className={`inline-block px-3 py-1.5 rounded-xl text-xs font-bold mb-4 ${course.badgeColor} border border-gray-300`}>
                      {course.badge}
                    </span>
                    <h4 className="font-black text-gray-900 mb-3 text-lg group-hover:text-gray-700 transition-colors">{course.title}</h4>
                    <p className="text-sm text-gray-600 mb-5 line-clamp-2 leading-relaxed">{course.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-5 pb-5 border-b border-gray-200">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <BookIcon /> {course.modules}
                      </span>
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Clock size={14} /> {course.hours}h
                      </span>
                      {course.certificate && (
                        <span className="flex items-center gap-1.5 font-semibold">
                          <Award size={14} />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
                        {course.level}
                      </span>
                      <button className="text-gray-900 font-bold text-sm hover:text-gray-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                        {course.badge === 'Free Course' ? 'Start Free' : 'Start'} →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="card-premium p-8 hover-glow animate-slide-up">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-gray-900">Follow Your Progress</h3>
                <button className="text-sm text-gray-600 font-bold hover:text-gray-900 hover:underline transition-all">
                  View Details →
                </button>
              </div>

              <div className="mb-8">
                <h4 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                  Learning Areas
                </h4>
                <div className="space-y-4">
                  {learningAreas.map((area, index) => (
                    <div key={index} className="group bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">{area.name}</span>
                        <span className="font-black text-gray-900 text-lg">{area.xp} <span className="text-xs text-gray-500">XP</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
                <h4 className="font-bold mb-4 text-lg">Weekly Goals</h4>
                <div className="text-center py-6">
                  <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center">
                    <TrendingUp className="text-white" size={32} />
                  </div>
                  <p className="text-sm text-gray-200 mb-6 font-medium">No weekly target set yet</p>
                  <button className="bg-white text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all duration-200 hover:scale-105 shadow-lg">
                    Set Target
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-premium p-10 hover-glow animate-slide-up">
          <h3 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="text-white" size={24} />
            </div>
            Discover More Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Video className="text-white" size={32} />}
              title="Mock Hearings"
              description="Practice in simulated court environments with real-time feedback"
            />
            <FeatureCard
              icon={<Users className="text-white" size={32} />}
              title="Community Support"
              description="Connect with others preparing for court and share experiences"
            />
            <FeatureCard
              icon={<MessageCircle className="text-white" size={32} />}
              title="Expert Q&A"
              description="Get your questions answered by experienced legal professionals"
            />
          </div>
        </div>
      </div>

      <HelpWidget userId={userId} />
    </div>
  );
}

function BookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  );
}

function Video({ className, size }: { className?: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M23 7l-7 5 7 5V7z"></path>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
    </svg>
  );
}

function Users({ className, size }: { className?: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );
}

function MessageCircle({ className, size }: { className?: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
  );
}

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-gray-700/50 rounded-2xl p-8 hover:border-gray-600 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl"></div>
      <div className="relative">
        <div className="mb-6 w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h4 className="font-black text-white mb-3 text-xl group-hover:text-gray-100 transition-colors">{title}</h4>
        <p className="text-sm text-gray-300 mb-6 leading-relaxed">{description}</p>
        <button className="text-white font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
          Learn More <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}