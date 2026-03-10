import { useState, useEffect } from 'react';
import { ArrowLeft, Play, BookOpen, Lock, CheckCircle, Clock, Award } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Module = {
  id: string;
  title: string;
  description: string;
  xp_reward: number;
  order_index: number;
  lessons?: Lesson[];
};

type Lesson = {
  id: string;
  title: string;
  lesson_type: string;
  order_index: number;
  duration_minutes: number;
  completed?: boolean;
};

type CourseDetailProps = {
  courseId: string;
  onBack: () => void;
  onStartLesson?: (lessonId: string, moduleId: string) => void;
};

export default function CourseDetail({ courseId, onBack, onStartLesson }: CourseDetailProps) {
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const { data: courseData } = await supabase
          .from('courses')
          .select('*')
          .eq('id', courseId)
          .single();

        setCourse(courseData);

        const { data: modulesData } = await supabase
          .from('modules')
          .select('*')
          .eq('course_id', courseId)
          .order('order_index', { ascending: true });

        const modulesWithLessons = await Promise.all(
          (modulesData || []).map(async (module) => {
            const { data: lessonsData } = await supabase
              .from('lessons')
              .select('*')
              .eq('module_id', module.id)
              .order('order_index', { ascending: true });

            return {
              ...module,
              lessons: lessonsData || [],
            };
          })
        );

        setModules(modulesWithLessons);
        if (modulesWithLessons.length > 0) {
          setSelectedModule(modulesWithLessons[0]);
          setExpandedModuleId(modulesWithLessons[0].id);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Course not found</p>
        </div>
      </div>
    );
  }

  const totalLessons = modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0);
  const totalXP = modules.reduce((sum, m) => sum + m.xp_reward, 0);

  const handleStartLearning = () => {
    if (modules.length > 0 && modules[0].lessons && modules[0].lessons.length > 0) {
      const firstModule = modules[0];
      const firstLesson = firstModule.lessons[0];
      onStartLesson?.(firstLesson.id, firstModule.id);
    }
  };

  const handleStartModule = (module: Module) => {
    if (module.lessons && module.lessons.length > 0) {
      const firstLesson = module.lessons[0];
      onStartLesson?.(firstLesson.id, module.id);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-black font-semibold hover:text-gray-700 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Catalog
        </button>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 border border-gray-200">
          <div className="h-48 bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-center">
            <BookOpen className="text-white" size={64} />
          </div>
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-black mb-2">{course.title}</h1>
                <p className="text-gray-600 text-lg mb-4">{course.description}</p>
              </div>
              <button
                onClick={handleStartLearning}
                className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors whitespace-nowrap ml-6"
              >
                Start Learning
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border-l-4 border-gray-400 pl-4 py-2">
                <div className="text-sm text-gray-600">Modules</div>
                <div className="text-2xl font-bold text-black">{modules.length}</div>
              </div>
              <div className="border-l-4 border-gray-400 pl-4 py-2">
                <div className="text-sm text-gray-600">Lessons</div>
                <div className="text-2xl font-bold text-black">{totalLessons}</div>
              </div>
              <div className="border-l-4 border-gray-400 pl-4 py-2">
                <div className="text-sm text-gray-600">Duration</div>
                <div className="text-2xl font-bold text-black">{course.estimated_hours}h</div>
              </div>
              <div className="border-l-4 border-gray-400 pl-4 py-2">
                <div className="text-sm text-gray-600">Total XP</div>
                <div className="text-2xl font-bold text-black">{totalXP}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-black">Course Modules</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {modules.map((module, index) => (
                  <div key={module.id} className="border-l-4 border-gray-400">
                    <button
                      onClick={() => {
                        setSelectedModule(module);
                        setExpandedModuleId(expandedModuleId === module.id ? null : module.id);
                      }}
                      className="w-full p-6 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="inline-block bg-black text-white px-3 py-1 rounded-full text-sm font-semibold">
                              Module {index + 1}
                            </span>
                            <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-medium">
                              {module.xp_reward} XP
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-black mb-1">{module.title}</h3>
                          <p className="text-sm text-gray-600">{module.description}</p>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <CheckCircle className="text-gray-400" size={24} />
                        </div>
                      </div>
                    </button>

                    {expandedModuleId === module.id && (
                      <div className="bg-gray-50 border-t border-gray-200 divide-y divide-gray-200">
                        {module.lessons?.map((lesson, lessonIndex) => (
                          <div key={lesson.id} className="px-6 py-4 hover:bg-gray-100 transition-colors">
                            <div className="flex items-start gap-4">
                              <div className="mt-1">
                                {lesson.lesson_type === 'video' && <Play className="text-gray-700" size={20} />}
                                {lesson.lesson_type === 'reading' && <BookOpen className="text-gray-700" size={20} />}
                                {lesson.lesson_type === 'quiz' && <Award className="text-gray-700" size={20} />}
                                {lesson.lesson_type === 'interactive' && <Lock className="text-gray-700" size={20} />}
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium text-black">{lesson.title}</div>
                                <div className="text-xs text-gray-500 mt-1 flex items-center gap-4">
                                  <span>{lesson.lesson_type.charAt(0).toUpperCase() + lesson.lesson_type.slice(1)}</span>
                                  <span className="flex items-center gap-1">
                                    <Clock size={12} /> {lesson.duration_minutes} min
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => onStartLesson?.(lesson.id, module.id)}
                                className="mt-1 px-3 py-1 bg-black text-white rounded text-xs font-medium hover:bg-gray-800 transition-colors"
                              >
                                {lesson.lesson_type === 'quiz' ? 'Take Quiz' : 'Start'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-black mb-4">Course Info</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Difficulty Level</div>
                  <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm font-medium">
                    {course.difficulty_level.charAt(0).toUpperCase() + course.difficulty_level.slice(1)} Friendly
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Category</div>
                  <div className="text-sm text-black">{course.category}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Certificate</div>
                  <div className="flex items-center gap-2">
                    <Award className="text-gray-700" size={18} />
                    <span className="text-sm text-black">Included</span>
                  </div>
                </div>
              </div>
            </div>

            {selectedModule && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-black mb-4">Selected Module</h3>
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">Module {selectedModule.order_index}</div>
                  <div className="text-lg font-semibold text-black mb-3">{selectedModule.title}</div>
                  <p className="text-sm text-gray-600 mb-4">{selectedModule.description}</p>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Lessons</span>
                    <span className="font-semibold text-black">{selectedModule.lessons?.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">XP Reward</span>
                    <span className="font-semibold text-gray-700">{selectedModule.xp_reward} XP</span>
                  </div>
                </div>
                <button
                  onClick={() => handleStartModule(selectedModule)}
                  className="w-full bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Start Module
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}