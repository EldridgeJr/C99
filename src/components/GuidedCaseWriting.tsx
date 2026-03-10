import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  BookOpen, List, Target, FileCheck, Calendar, HelpCircle,
  CheckCircle, Circle, ArrowLeft, ArrowRight, Save, AlertCircle,
  TrendingUp, TrendingDown, Minus, Lightbulb
} from 'lucide-react';

type Section = {
  id: string;
  title: string;
  description: string;
  order_index: number;
  icon: string;
};

type Prompt = {
  id: string;
  section_id: string;
  question: string;
  helper_text: string | null;
  order_index: number;
  word_limit: number;
};

type Response = {
  id: string;
  prompt_id: string;
  response_text: string;
  clarity_score: number;
  focus_score: number;
  stress_indicators: string[];
  word_count: number;
};

type FeedbackMetrics = {
  clarity: number;
  focus: number;
  stressLevel: number;
  stressWords: string[];
  wordCount: number;
};

type GuidedCaseWritingProps = {
  userId: string;
};

const iconMap: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen size={24} />,
  List: <List size={24} />,
  Target: <Target size={24} />,
  FileCheck: <FileCheck size={24} />,
  Calendar: <Calendar size={24} />,
  HelpCircle: <HelpCircle size={24} />,
};

export default function GuidedCaseWriting({ userId }: GuidedCaseWritingProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [responses, setResponses] = useState<Map<string, Response>>(new Map());
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [feedback, setFeedback] = useState<FeedbackMetrics>({
    clarity: 0,
    focus: 0,
    stressLevel: 0,
    stressWords: [],
    wordCount: 0
  });
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      const { data: sectionsData } = await supabase
        .from('case_writing_sections')
        .select('*')
        .order('order_index');

      const { data: promptsData } = await supabase
        .from('case_writing_prompts')
        .select('*')
        .order('order_index');

      const { data: responsesData } = await supabase
        .from('case_writing_responses')
        .select('*')
        .eq('user_id', userId);

      const { data: progressData } = await supabase
        .from('case_writing_progress')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (sectionsData) setSections(sectionsData);
      if (promptsData) setPrompts(promptsData);

      if (responsesData) {
        const responseMap = new Map();
        responsesData.forEach((r: Response) => {
          responseMap.set(r.prompt_id, r);
        });
        setResponses(responseMap);
      }

      if (progressData && sectionsData && promptsData) {
        const sectionIdx = sectionsData.findIndex(s => s.id === progressData.current_section_id);
        if (sectionIdx !== -1) setCurrentSectionIndex(sectionIdx);

        const currentSectionPrompts = promptsData.filter(
          p => p.section_id === (sectionsData[sectionIdx]?.id || sectionsData[0]?.id)
        );
        const promptIdx = currentSectionPrompts.findIndex(p => p.id === progressData.current_prompt_id);
        if (promptIdx !== -1) setCurrentPromptIndex(promptIdx);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading case writing data:', error);
      setLoading(false);
    }
  };

  const currentSection = sections[currentSectionIndex];
  const currentSectionPrompts = prompts.filter(p => p.section_id === currentSection?.id);
  const currentPrompt = currentSectionPrompts[currentPromptIndex];

  useEffect(() => {
    if (currentPrompt) {
      const existingResponse = responses.get(currentPrompt.id);
      if (existingResponse) {
        setCurrentText(existingResponse.response_text);
        analyzeFeedback(existingResponse.response_text);
      } else {
        setCurrentText('');
        setFeedback({
          clarity: 0,
          focus: 0,
          stressLevel: 0,
          stressWords: [],
          wordCount: 0
        });
      }
    }
  }, [currentPrompt?.id]);

  const analyzeFeedback = useCallback((text: string): FeedbackMetrics => {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    const stressKeywords = [
      'worried', 'anxious', 'scared', 'terrified', 'panic', 'fear', 'afraid',
      'stressed', 'overwhelmed', 'desperate', 'hopeless', 'helpless', 'confused',
      'angry', 'furious', 'upset', 'devastated', 'terrible', 'horrible', 'awful'
    ];

    const fillerWords = [
      'very', 'really', 'just', 'actually', 'basically', 'literally',
      'sort of', 'kind of', 'like', 'you know', 'I mean', 'I think', 'I guess'
    ];

    const lowerText = text.toLowerCase();
    const foundStressWords = stressKeywords.filter(word =>
      lowerText.includes(word)
    );

    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWordsPerSentence = sentences.length > 0 ? wordCount / sentences.length : 0;

    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
    const hasStructure = paragraphs.length > 1;

    let clarityScore = 50;
    if (avgWordsPerSentence > 15 && avgWordsPerSentence < 25) clarityScore += 20;
    if (hasStructure) clarityScore += 15;
    if (wordCount > 50) clarityScore += 10;

    const fillerCount = fillerWords.reduce((count, filler) =>
      count + (lowerText.match(new RegExp(`\\b${filler}\\b`, 'gi')) || []).length, 0
    );
    if (fillerCount < wordCount * 0.05) clarityScore += 5;

    clarityScore = Math.min(100, Math.max(0, clarityScore));

    let focusScore = 60;
    if (wordCount >= 50 && wordCount <= (currentPrompt?.word_limit || 500) * 1.2) {
      focusScore += 20;
    }
    if (sentences.length >= 3) focusScore += 10;
    if (avgWordsPerSentence >= 12 && avgWordsPerSentence <= 30) focusScore += 10;

    focusScore = Math.min(100, Math.max(0, focusScore));

    const stressLevel = Math.min(100, (foundStressWords.length / Math.max(1, wordCount / 100)) * 20);

    const metrics = {
      clarity: clarityScore,
      focus: focusScore,
      stressLevel: Math.round(stressLevel),
      stressWords: foundStressWords,
      wordCount
    };

    setFeedback(metrics);
    return metrics;
  }, [currentPrompt]);

  useEffect(() => {
    if (currentText) {
      const timer = setTimeout(() => {
        analyzeFeedback(currentText);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentText, analyzeFeedback]);

  const saveResponse = async () => {
    if (!currentPrompt) return;

    setIsSaving(true);
    try {
      const metrics = analyzeFeedback(currentText);

      const { error } = await supabase
        .from('case_writing_responses')
        .upsert({
          user_id: userId,
          prompt_id: currentPrompt.id,
          response_text: currentText,
          clarity_score: metrics.clarity,
          focus_score: metrics.focus,
          stress_indicators: metrics.stressWords,
          word_count: metrics.wordCount,
          last_edited_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,prompt_id'
        });

      if (error) throw error;

      await supabase
        .from('case_writing_progress')
        .upsert({
          user_id: userId,
          current_section_id: currentSection.id,
          current_prompt_id: currentPrompt.id,
          last_active_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      const updatedResponses = new Map(responses);
      updatedResponses.set(currentPrompt.id, {
        id: responses.get(currentPrompt.id)?.id || '',
        prompt_id: currentPrompt.id,
        response_text: currentText,
        clarity_score: metrics.clarity,
        focus_score: metrics.focus,
        stress_indicators: metrics.stressWords,
        word_count: metrics.wordCount
      });
      setResponses(updatedResponses);

      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving response:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const goToNextPrompt = async () => {
    await saveResponse();

    if (currentPromptIndex < currentSectionPrompts.length - 1) {
      setCurrentPromptIndex(currentPromptIndex + 1);
    } else if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentPromptIndex(0);
    }
  };

  const goToPreviousPrompt = () => {
    if (currentPromptIndex > 0) {
      setCurrentPromptIndex(currentPromptIndex - 1);
    } else if (currentSectionIndex > 0) {
      const prevSection = sections[currentSectionIndex - 1];
      const prevSectionPrompts = prompts.filter(p => p.section_id === prevSection.id);
      setCurrentSectionIndex(currentSectionIndex - 1);
      setCurrentPromptIndex(prevSectionPrompts.length - 1);
    }
  };

  const goToSection = (sectionIndex: number) => {
    setCurrentSectionIndex(sectionIndex);
    setCurrentPromptIndex(0);
  };

  const getTotalProgress = () => {
    const totalPrompts = prompts.length;
    const completedPrompts = Array.from(responses.values()).filter(
      r => r.response_text && r.response_text.trim().length > 0
    ).length;
    return totalPrompts > 0 ? (completedPrompts / totalPrompts) * 100 : 0;
  };

  const getSectionProgress = (section: Section) => {
    const sectionPrompts = prompts.filter(p => p.section_id === section.id);
    const completed = sectionPrompts.filter(p => {
      const response = responses.get(p.id);
      return response && response.response_text && response.response_text.trim().length > 0;
    }).length;
    return sectionPrompts.length > 0 ? (completed / sectionPrompts.length) * 100 : 0;
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 75) return <TrendingUp size={16} className="text-green-600" />;
    if (score >= 50) return <Minus size={16} className="text-yellow-600" />;
    return <TrendingDown size={16} className="text-orange-600" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your case writing workspace...</p>
        </div>
      </div>
    );
  }

  if (!currentSection || !currentPrompt) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No case writing sections available</p>
        </div>
      </div>
    );
  }

  const isFirstPrompt = currentSectionIndex === 0 && currentPromptIndex === 0;
  const isLastPrompt = currentSectionIndex === sections.length - 1 &&
                        currentPromptIndex === currentSectionPrompts.length - 1;
  const progress = getTotalProgress();

  return (
    <div className="flex h-full bg-gray-50">
      <div className="w-80 glass-panel border-r border-gray-200/50 flex flex-col">
        <div className="p-6 border-b border-gray-200/50">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Guided Case Writing</h2>
          <p className="text-sm text-gray-600 mb-4">
            Work through your case step-by-step with structured guidance
          </p>
          <div className="bg-gray-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-700">Overall Progress</span>
              <span className="text-xs font-bold text-gray-900">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-gray-900 to-gray-700 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {sections.map((section, idx) => {
              const sectionProgress = getSectionProgress(section);
              const isActive = idx === currentSectionIndex;
              return (
                <button
                  key={section.id}
                  onClick={() => goToSection(idx)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg'
                      : 'bg-white hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 ${isActive ? 'text-white' : 'text-gray-600'}`}>
                      {iconMap[section.icon] || <BookOpen size={24} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm mb-1">{section.title}</div>
                      <div className="flex items-center gap-2">
                        <div className={`flex-1 h-1.5 rounded-full ${
                          isActive ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                          <div
                            className={`h-1.5 rounded-full ${
                              isActive ? 'bg-white' : 'bg-gray-900'
                            }`}
                            style={{ width: `${sectionProgress}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold ${
                          isActive ? 'text-white' : 'text-gray-600'
                        }`}>
                          {Math.round(sectionProgress)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200/50 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-start gap-3 text-sm">
            <Lightbulb size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900 mb-1">Remember</p>
              <p className="text-gray-700 text-xs leading-relaxed">
                This tool helps you organize your thoughts. It does not provide legal advice.
                Always consult with your lawyer about legal matters.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="glass-panel border-b border-gray-200/50 px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold text-gray-600 mb-1">
                Section {currentSectionIndex + 1} of {sections.length}: {currentSection.title}
              </div>
              <div className="text-xs text-gray-500">
                Question {currentPromptIndex + 1} of {currentSectionPrompts.length}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {lastSaved && (
                <span className="text-xs text-gray-500">
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={saveResponse}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 text-sm font-semibold"
              >
                <Save size={16} />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-2">{currentPrompt.question}</h3>
          {currentPrompt.helper_text && (
            <p className="text-gray-600 text-sm leading-relaxed">{currentPrompt.helper_text}</p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            <textarea
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              placeholder="Start writing here... Be honest and detailed. Focus on facts."
              className="w-full h-96 p-6 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 resize-none text-gray-900 leading-relaxed transition-colors"
              style={{ fontSize: '16px' }}
            />

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Clarity</span>
                  {getScoreIcon(feedback.clarity)}
                </div>
                <div className={`text-3xl font-bold ${getScoreColor(feedback.clarity)}`}>
                  {feedback.clarity}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {feedback.clarity >= 75 ? 'Very clear' : feedback.clarity >= 50 ? 'Moderately clear' : 'Could be clearer'}
                </p>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Focus</span>
                  {getScoreIcon(feedback.focus)}
                </div>
                <div className={`text-3xl font-bold ${getScoreColor(feedback.focus)}`}>
                  {feedback.focus}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {feedback.focus >= 75 ? 'Well focused' : feedback.focus >= 50 ? 'Reasonably focused' : 'Stay on topic'}
                </p>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Word Count</span>
                  <span className="text-xs text-gray-500">/ {currentPrompt.word_limit}</span>
                </div>
                <div className={`text-3xl font-bold ${
                  feedback.wordCount > currentPrompt.word_limit * 1.2
                    ? 'text-orange-600'
                    : 'text-gray-900'
                }`}>
                  {feedback.wordCount}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {feedback.wordCount > currentPrompt.word_limit * 1.2
                    ? 'Consider shortening'
                    : feedback.wordCount < 50
                    ? 'Add more detail'
                    : 'Good length'}
                </p>
              </div>
            </div>

            {feedback.stressLevel > 30 && feedback.stressWords.length > 0 && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-900 mb-1">High stress detected</p>
                    <p className="text-sm text-yellow-800 leading-relaxed">
                      Your writing shows emotional language. While feelings are valid, try to also include
                      objective facts. This helps create a clearer picture of your situation.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="glass-panel border-t border-gray-200/50 px-8 py-6">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <button
              onClick={goToPreviousPrompt}
              disabled={isFirstPrompt}
              className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-semibold"
            >
              <ArrowLeft size={20} />
              Previous
            </button>

            <div className="flex items-center gap-2">
              {currentSectionPrompts.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === currentPromptIndex
                      ? 'bg-gray-900 w-6'
                      : idx < currentPromptIndex
                      ? 'bg-gray-400'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={goToNextPrompt}
              disabled={isLastPrompt}
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-semibold"
            >
              {isLastPrompt ? 'Finished' : 'Next'}
              {!isLastPrompt && <ArrowRight size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}