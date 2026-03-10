import { useState, useEffect } from 'react';
import { ArrowLeft, Play, CheckCircle, Clock, Volume2, Settings, BookOpen, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BUNNY_VIDEO_MAP } from '../lib/bunnyVideoMap';

function getVideoProvider(url: string): 'bunny' | 'youtube' {
  if (url.includes('iframe.mediadelivery.net')) return 'bunny';
  return 'youtube';
}

type Lesson = {
  id: string;
  title: string;
  content: string;
  lesson_type: string;
  duration_minutes: number;
  module_id: string;
};

type VideoContent = {
  description: string;
  key_points?: string[];
  transcript?: string;
  video_url?: string;
};

type ReadingSection = {
  title: string;
  content: string;
};

type ReadingContent = {
  sections: ReadingSection[];
};

type InteractiveScenario = {
  title: string;
  content: string;
};

type InteractiveContent = {
  description: string;
  scenarios: InteractiveScenario[];
};

type QuizQuestion = {
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
};

type QuizContent = {
  questions: QuizQuestion[];
};

type LessonPlayerProps = {
  lessonId: string;
  moduleId: string;
  onBack: () => void;
};

export default function LessonPlayer({ lessonId, moduleId, onBack }: LessonPlayerProps) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [activeScenario, setActiveScenario] = useState(0);
  const [userId, setUserId] = useState<string>('');
  const [courseId, setCourseId] = useState<string>('');

  useEffect(() => {
    setIframeLoaded(false);
    setIframeError(false);
    const fetchLesson = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
        }

        const { data } = await supabase
          .from('lessons')
          .select('*, modules!inner(course_id)')
          .eq('id', lessonId)
          .single();

        setLesson(data);
        if (data?.modules) {
          setCourseId(data.modules.course_id);
        }

        if (user && data) {
          const { data: progressData } = await supabase
            .from('user_progress')
            .select('completed, progress_percentage')
            .eq('user_id', user.id)
            .eq('lesson_id', lessonId)
            .maybeSingle();

          if (progressData) {
            setIsCompleted(progressData.completed);
            setProgress(progressData.progress_percentage);
          }
        }
      } catch (error) {
        console.error('Error fetching lesson:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  const handleComplete = async () => {
    setProgress(100);
    setIsCompleted(true);

    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          course_id: courseId,
          module_id: moduleId,
          lesson_id: lessonId,
          progress_percentage: 100,
          completed: true,
          last_accessed: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving completion:', error);
    }
  };

  const parseContent = () => {
    if (!lesson) return null;
    try {
      return JSON.parse(lesson.content);
    } catch {
      return { text: lesson.content };
    }
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers({ ...selectedAnswers, [questionIndex]: answerIndex });
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
    setProgress(100);
  };

  const renderVideoContent = (content: VideoContent) => (
    <div>
      <div className="mb-6 p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg">
        <p className="text-gray-200 leading-relaxed">{content.description}</p>
      </div>

      {content.key_points && content.key_points.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <BookOpen size={20} className="text-blue-400" />
            Key Points
          </h3>
          <ul className="space-y-2">
            {content.key_points.map((point, idx) => (
              <li key={idx} className="flex gap-3 text-gray-300">
                <span className="text-blue-400 mt-1">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {content.transcript && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <FileText size={20} className="text-blue-400" />
            Transcript
          </h3>
          <div className="text-gray-300 leading-relaxed whitespace-pre-line bg-gray-900/50 p-4 rounded-lg">
            {content.transcript}
          </div>
        </div>
      )}
    </div>
  );

  const renderReadingContent = (content: ReadingContent) => (
    <div className="space-y-6">
      {content.sections?.map((section, idx) => (
        <div key={idx} className="mb-6">
          <h3 className="text-xl font-bold mb-3 text-blue-400">{section.title}</h3>
          <div className="text-gray-300 leading-relaxed whitespace-pre-line">
            {section.content}
          </div>
        </div>
      ))}
    </div>
  );

  const renderInteractiveContent = (content: InteractiveContent) => (
    <div>
      {content.description && (
        <div className="mb-6 p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg">
          <p className="text-gray-200 leading-relaxed">{content.description}</p>
        </div>
      )}

      {content.scenarios && content.scenarios.length > 0 && (
        <div>
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {content.scenarios.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveScenario(idx)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeScenario === idx
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Section {idx + 1}
              </button>
            ))}
          </div>

          <div className="bg-gray-900/50 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-blue-400">
              {content.scenarios[activeScenario].title}
            </h3>
            <div className="text-gray-300 leading-relaxed whitespace-pre-line">
              {content.scenarios[activeScenario].content}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderQuizContent = (content: QuizContent) => (
    <div className="space-y-6">
      {content.questions?.map((question, qIdx) => (
        <div key={qIdx} className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
          <h3 className="font-semibold mb-4 text-lg">
            Question {qIdx + 1}: {question.question}
          </h3>
          <div className="space-y-2 mb-4">
            {question.options.map((option, oIdx) => {
              const isSelected = selectedAnswers[qIdx] === oIdx;
              const isCorrect = question.correct_answer === oIdx;
              const showCorrect = showResults && isCorrect;
              const showIncorrect = showResults && isSelected && !isCorrect;

              return (
                <label
                  key={oIdx}
                  className={`flex items-start gap-3 cursor-pointer p-4 rounded transition-colors ${
                    showCorrect
                      ? 'bg-green-900/30 border border-green-500'
                      : showIncorrect
                      ? 'bg-red-900/30 border border-red-500'
                      : isSelected
                      ? 'bg-blue-900/30 border border-blue-500'
                      : 'hover:bg-gray-800 border border-transparent'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${qIdx}`}
                    checked={isSelected}
                    onChange={() => handleAnswerSelect(qIdx, oIdx)}
                    disabled={showResults}
                    className="w-4 h-4 mt-1 flex-shrink-0"
                  />
                  <span className="flex-1">{option}</span>
                  {showCorrect && (
                    <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                  )}
                </label>
              );
            })}
          </div>

          {showResults && (
            <div className="mt-4 p-4 bg-blue-900/20 border border-blue-700/30 rounded">
              <p className="text-sm font-semibold text-blue-300 mb-2">Explanation:</p>
              <p className="text-gray-300 text-sm">{question.explanation}</p>
            </div>
          )}
        </div>
      ))}

      {!showResults && (
        <button
          onClick={handleSubmitQuiz}
          disabled={Object.keys(selectedAnswers).length < (content.questions?.length || 0)}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Submit Quiz
        </button>
      )}

      {showResults && (
        <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-6 text-center">
          <CheckCircle size={48} className="text-green-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold mb-2">Quiz Complete!</h3>
          <p className="text-gray-300">
            You got {Object.keys(selectedAnswers).filter((key) =>
              selectedAnswers[parseInt(key)] === content.questions?.[parseInt(key)]?.correct_answer
            ).length} out of {content.questions?.length} correct
          </p>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-white">Loading lesson...</div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-white">Lesson not found</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-6xl mx-auto">
        <div className="bg-black/40 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 hover:text-gray-300 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Volume2 size={20} />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 p-6">
          <div className="flex-1">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg aspect-video flex items-center justify-center mb-6 relative overflow-hidden">
              {lesson.lesson_type === 'video' && (() => {
                const content = parseContent() as VideoContent;
                const resolvedUrl = BUNNY_VIDEO_MAP[lesson.title] || content?.video_url;
                const provider = resolvedUrl ? getVideoProvider(resolvedUrl) : null;

                if (resolvedUrl && provider === 'bunny') {
                  return (
                    <>
                      {!iframeLoaded && !iframeError && (
                        <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center z-10">
                          <div className="text-center">
                            <div className="w-16 h-16 rounded-full border-4 border-gray-600 border-t-white animate-spin mx-auto mb-3"></div>
                            <p className="text-gray-400 text-sm">Loading video...</p>
                          </div>
                        </div>
                      )}
                      {iframeError && (
                        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center z-10">
                          <div className="text-center px-6">
                            <p className="text-red-400 font-semibold mb-2">Bunny embed blocked.</p>
                            <p className="text-gray-400 text-sm">Check Bunny Stream allowed domains/security settings.</p>
                          </div>
                        </div>
                      )}
                      <iframe
                        src={resolvedUrl}
                        className="absolute inset-0 w-full h-full"
                        loading="lazy"
                        style={{ border: 0 }}
                        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                        allowFullScreen={true}
                        onLoad={() => setIframeLoaded(true)}
                        onError={() => setIframeError(true)}
                      />
                    </>
                  );
                }

                return resolvedUrl ? (
                  <iframe
                    src={resolvedUrl}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="absolute z-10 p-4 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors"
                    >
                      {isPlaying ? (
                        <div className="w-16 h-16 flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/30 rounded-full"></div>
                        </div>
                      ) : (
                        <Play className="w-16 h-16 fill-white text-white" />
                      )}
                    </button>

                    {isPlaying && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="text-center">
                          <Play className="w-20 h-20 fill-white text-white mx-auto mb-4 animate-pulse" />
                          <p className="text-lg font-semibold">Video playing...</p>
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
              {lesson.lesson_type !== 'video' && (
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute z-10 p-4 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors"
                >
                  <Play className="w-16 h-16 fill-white text-white" />
                </button>
              )}
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">Progress</span>
                <span className="text-sm font-semibold">{progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-6">
              <h1 className="text-2xl font-bold mb-6">{lesson.title}</h1>

              <div className="mb-6">
                {(() => {
                  const content = parseContent();
                  if (!content) return null;

                  switch (lesson.lesson_type) {
                    case 'video':
                      return renderVideoContent(content as VideoContent);
                    case 'reading':
                      return renderReadingContent(content as ReadingContent);
                    case 'interactive':
                      return renderInteractiveContent(content as InteractiveContent);
                    case 'quiz':
                      return renderQuizContent(content as QuizContent);
                    default:
                      return <p className="text-gray-300">{lesson.content}</p>;
                  }
                })()}
              </div>

              {lesson.lesson_type !== 'quiz' && (
                <div className="flex gap-3">
                  {!isCompleted ? (
                    <>
                      <button
                        onClick={handleComplete}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={20} />
                        Mark as Complete
                      </button>
                      <button className="px-6 py-3 border border-gray-600 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                        Skip Lesson
                      </button>
                    </>
                  ) : (
                    <button className="flex-1 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                      <CheckCircle size={20} />
                      Lesson Complete
                    </button>
                  )}
                </div>
              )}

              {lesson.lesson_type === 'quiz' && showResults && !isCompleted && (
                <button
                  onClick={handleComplete}
                  className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle size={20} />
                  Mark as Complete
                </button>
              )}
            </div>
          </div>

          <div className="w-full lg:w-80">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-bold mb-4">Lesson Info</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-xs font-semibold text-gray-400 uppercase mb-1">Type</div>
                  <div className="inline-block px-3 py-1 bg-blue-600/30 border border-blue-500 rounded text-sm font-medium">
                    {lesson.lesson_type.charAt(0).toUpperCase() + lesson.lesson_type.slice(1)}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-gray-400 uppercase mb-1">Duration</div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} />
                    <span>{lesson.duration_minutes} minutes</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-gray-400 uppercase mb-1">Status</div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-sm">{isCompleted ? 'Completed' : 'In Progress'}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4 mb-4">
                <div className="text-xs font-semibold text-gray-400 uppercase mb-3">Estimated Time</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total</span>
                    <span>{lesson.duration_minutes} min</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Watched</span>
                    <span>{Math.round((progress / 100) * lesson.duration_minutes)} min</span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                Download Transcript
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}