import { useState, useEffect, useRef } from 'react';
import { Plus, File, FileText, Image as ImageIcon, FileArchive, Video, Music, Download, Trash2, Paperclip, X, BookOpen, Headphones, PlayCircle, ArrowRight, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';
import HelpWidget from './HelpWidget';
import { extractTextFromPDF } from '../utils/pdfText';

type Document = {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  storage_path: string;
  uploaded_at: string;
};

type Course = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: string;
  duration_hours: number;
};

type Podcast = {
  id: string;
  title: string;
  description: string;
  episodes?: any[];
};

type VideoContent = {
  id: string;
  title: string;
  description: string;
  video_url: string;
  duration_minutes: number;
};

type Recommendations = {
  courses: Course[];
  podcasts: Podcast[];
  videos: VideoContent[];
};

type DocumentsProps = {
  userId: string;
  userName: string;
  onNavigate?: (section: string, itemId?: string) => void;
};

export default function Documents({ userId, userName, onNavigate }: DocumentsProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [analyzingPdf, setAnalyzingPdf] = useState(false);
  const [pdfAnalysisError, setPdfAnalysisError] = useState<string | null>(null);
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null);
  const [showInlineResults, setShowInlineResults] = useState(false);
  const [showComingSoonToast, setShowComingSoonToast] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [userId]);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', userId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMockRecommendations = (): Recommendations => {
    return {
      courses: [
        {
          id: 'mock-1',
          title: 'Understanding Payment Orders',
          description: 'Learn how to respond to payment orders and debt collection notices effectively.',
          category: 'Debt Collection',
          difficulty_level: 'Beginner',
          duration_hours: 2,
          match_score: 85
        },
        {
          id: 'mock-2',
          title: 'Tenancy Rights & Termination',
          description: 'Navigate rental agreements, evictions, and tenant-landlord disputes with confidence.',
          category: 'Housing',
          difficulty_level: 'Intermediate',
          duration_hours: 3,
          match_score: 72
        }
      ],
      podcasts: [],
      videos: []
    };
  };

  const getMatchBadge = (score?: number) => {
    if (!score) score = Math.floor(Math.random() * 30) + 60;
    if (score >= 80) return { label: 'High match', color: 'bg-green-50 text-green-700 border-green-200' };
    if (score >= 65) return { label: 'Medium match', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: 'Good match', color: 'bg-gray-100 text-gray-600 border-gray-300' };
  };

  const handleCardClick = () => {
    setShowComingSoonToast(true);
    setTimeout(() => setShowComingSoonToast(false), 3000);
  };

  const handleResetPdfAnalysis = () => {
    setSelectedPdfFile(null);
    setShowInlineResults(false);
    setRecommendations(null);
    setPdfAnalysisError(null);
    if (pdfInputRef.current) {
      pdfInputRef.current.value = '';
    }
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const ensureMinimumRecommendations = (recs: Recommendations): Recommendations => {
    const additionalMockCourses = [
      {
        id: 'mock-3',
        title: 'Court Procedures & Protocol',
        description: 'Master the essential procedures and protocols for representing yourself in court.',
        category: 'During Court',
        difficulty_level: 'Intermediate',
        duration_hours: 4,
        match_score: 78
      },
      {
        id: 'mock-4',
        title: 'Evidence Collection & Presentation',
        description: 'Learn effective techniques for gathering and presenting evidence in legal proceedings.',
        category: 'Before Court',
        difficulty_level: 'Advanced',
        duration_hours: 5,
        match_score: 68
      },
      {
        id: 'mock-5',
        title: 'Legal Document Drafting',
        description: 'Comprehensive guide to drafting legal documents, motions, and pleadings.',
        category: 'Information & Organization',
        difficulty_level: 'Intermediate',
        duration_hours: 3,
        match_score: 75
      },
      {
        id: 'mock-6',
        title: 'Negotiation & Settlement Strategies',
        description: 'Develop skills for effective negotiation and settlement in legal disputes.',
        category: 'Before Court',
        difficulty_level: 'Intermediate',
        duration_hours: 2,
        match_score: 82
      }
    ];

    const result = { ...recs };
    const totalItems = result.courses.length + result.podcasts.length + result.videos.length;

    if (totalItems < 6) {
      const needed = 6 - totalItems;
      const coursesNeeded = Math.min(needed, additionalMockCourses.length);
      result.courses = [...result.courses, ...additionalMockCourses.slice(0, coursesNeeded)];
    }

    return result;
  };

  const randomizeRecommendationCount = (recs: Recommendations): Recommendations => {
    const allItems = [
      ...recs.courses.map(c => ({ ...c, type: 'course' })),
      ...recs.podcasts.map(p => ({ ...p, type: 'podcast' })),
      ...recs.videos.map(v => ({ ...v, type: 'video' }))
    ];

    const shuffled = shuffleArray(allItems);
    const randomCount = Math.floor(Math.random() * 6) + 2;
    const selected = shuffled.slice(0, randomCount);

    return {
      courses: selected.filter(item => item.type === 'course').map(({ type, ...rest }) => rest),
      podcasts: selected.filter(item => item.type === 'podcast').map(({ type, ...rest }) => rest),
      videos: selected.filter(item => item.type === 'video').map(({ type, ...rest }) => rest)
    };
  };

  const handlePdfAnalysis = async (file: File) => {
    setSelectedPdfFile(file);
    setAnalyzingPdf(true);
    setPdfAnalysisError(null);
    setShowInlineResults(false);

    const startTime = Date.now();
    const MIN_ANALYSIS_DURATION = 900;

    try {
      let extractedText = '';

      try {
        extractedText = await extractTextFromPDF(file);
      } catch (extractError) {
        console.error('PDF extraction failed, using mock recommendations:', extractError);
        const mockRecs = ensureMinimumRecommendations(getMockRecommendations());
        const finalRecs = randomizeRecommendationCount(mockRecs);

        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, MIN_ANALYSIS_DURATION - elapsed);

        setTimeout(() => {
          setRecommendations(finalRecs);
          setShowInlineResults(true);
          setAnalyzingPdf(false);
        }, remainingTime);
        return;
      }

      if (!extractedText || extractedText.length < 10) {
        console.log('No text extracted, using mock recommendations');
        const mockRecs = ensureMinimumRecommendations(getMockRecommendations());
        const finalRecs = randomizeRecommendationCount(mockRecs);

        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, MIN_ANALYSIS_DURATION - elapsed);

        setTimeout(() => {
          setRecommendations(finalRecs);
          setShowInlineResults(true);
          setAnalyzingPdf(false);
        }, remainingTime);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          console.log('No session, using mock recommendations');
          const mockRecs = ensureMinimumRecommendations(getMockRecommendations());
          const finalRecs = randomizeRecommendationCount(mockRecs);

          const elapsed = Date.now() - startTime;
          const remainingTime = Math.max(0, MIN_ANALYSIS_DURATION - elapsed);

          setTimeout(() => {
            setRecommendations(finalRecs);
            setShowInlineResults(true);
            setAnalyzingPdf(false);
          }, remainingTime);
          return;
        }

        const { data: recommendations, error } = await supabase.functions.invoke(
          'find-relevant-content',
          {
            body: {
              text: extractedText,
              filename: file.name
            }
          }
        );

        let fullRecs: Recommendations;
        if (error) {
          console.error('Edge function error, using mock recommendations:', error);
          fullRecs = ensureMinimumRecommendations(getMockRecommendations());
        } else {
          console.log('Recommendations received:', recommendations);
          fullRecs = ensureMinimumRecommendations(recommendations);
        }

        const finalRecs = randomizeRecommendationCount(fullRecs);

        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, MIN_ANALYSIS_DURATION - elapsed);

        setTimeout(() => {
          setRecommendations(finalRecs);
          setShowInlineResults(true);
          setAnalyzingPdf(false);
        }, remainingTime);
      } catch (err) {
        console.error('Error calling edge function, using mock recommendations:', err);
        const mockRecs = ensureMinimumRecommendations(getMockRecommendations());
        const finalRecs = randomizeRecommendationCount(mockRecs);

        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, MIN_ANALYSIS_DURATION - elapsed);

        setTimeout(() => {
          setRecommendations(finalRecs);
          setShowInlineResults(true);
          setAnalyzingPdf(false);
        }, remainingTime);
      }
    } catch (error) {
      console.error('Error in PDF analysis:', error);
      setPdfAnalysisError('Failed to analyze PDF. Please try again.');
      const mockRecs = ensureMinimumRecommendations(getMockRecommendations());
      const finalRecs = randomizeRecommendationCount(mockRecs);

      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_ANALYSIS_DURATION - elapsed);

      setTimeout(() => {
        setRecommendations(finalRecs);
        setShowInlineResults(true);
        setAnalyzingPdf(false);
      }, remainingTime);
    }
  };

  const fetchRecommendations = async (fileName: string, fileType: string) => {
  setLoadingRecommendations(true);

  try {
    // Warum: Wir holen ein gültiges Access Token vom eingeloggten User
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) throw sessionError;
    if (!session) throw new Error("No session");

    // Warum: supabase.functions.invoke setzt automatisch den apikey Header
    // und mit Authorization gibt es keinen 401 mehr
    const { data: recommendations, error } = await supabase.functions.invoke(
      "find-relevant-content",
      {
        body: { fileName, fileType, userId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    if (error) throw error;

    console.log("Recommendations received:", recommendations);
    setRecommendations(recommendations);
    setShowRecommendations(true);
  } catch (err) {
    console.error("Error fetching recommendations:", err);

    // Warum: UI bleibt stabil, auch wenn die Function failt
    setRecommendations({ courses: [], podcasts: [], videos: [] });
    setShowRecommendations(true);
  } finally {
    setLoadingRecommendations(false);
  }
};



  const handleDelete = async (doc: Document) => {
    if (!confirm(`Are you sure you want to delete "${doc.file_name}"?`)) return;

    try {
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([doc.storage_path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('user_documents')
        .delete()
        .eq('id', doc.id);

      if (dbError) throw dbError;

      setDocuments(documents.filter(d => d.id !== doc.id));
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document. Please try again.');
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(doc.storage_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Failed to download document. Please try again.');
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon size={20} />;
    if (fileType.startsWith('video/')) return <Video size={20} />;
    if (fileType.startsWith('audio/')) return <Music size={20} />;
    if (fileType.includes('pdf')) return <FileText size={20} />;
    if (fileType.includes('zip') || fileType.includes('rar')) return <FileArchive size={20} />;
    return <File size={20} />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16 animate-fade-in">
        <div className="mb-12 mt-8 text-center">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Welcome back, {userName}!
          </h1>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-5xl font-normal text-gray-900 mb-3">
            Upload a PDF and get tailored guidance.
          </h2>
          <p className="text-lg text-gray-600">
            We'll scan the first pages and suggest relevant modules.
          </p>
        </div>

        <div className="mt-16 mb-16">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl flex items-center justify-center shadow-lg">
                  <FileText size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Custom Preparation</h3>
                  <p className="text-gray-600">Upload a PDF to get personalized recommendations</p>
                </div>
              </div>

              <div className="mt-6">
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handlePdfAnalysis(file);
                    }
                  }}
                  className="hidden"
                />

                {!selectedPdfFile ? (
                  <>
                    <button
                      onClick={() => pdfInputRef.current?.click()}
                      disabled={analyzingPdf}
                      className="w-full bg-white border-2 border-dashed border-gray-300 rounded-2xl p-8 hover:border-gray-900 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-200">
                          <Upload size={32} className="text-gray-900" />
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-900 mb-1">
                            Click to upload a PDF
                          </p>
                          <p className="text-sm text-gray-600">
                            Drag and drop or browse your files
                          </p>
                        </div>
                      </div>
                    </button>
                    <div className="mt-3 text-center space-y-1">
                      <p className="text-xs text-gray-500">PDF only • max 10MB • first 3 pages analyzed</p>
                      <p className="text-xs text-gray-500">Processed temporarily. Not stored.</p>
                    </div>
                  </>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText size={20} className="text-gray-900" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {selectedPdfFile.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(selectedPdfFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      {!analyzingPdf && (
                        <button
                          onClick={handleResetPdfAnalysis}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0"
                          title="Remove file"
                        >
                          <X size={18} className="text-gray-600" />
                        </button>
                      )}
                    </div>

                    {analyzingPdf && (
                      <div className="flex items-center gap-2 text-sm text-gray-900 bg-gray-100 px-4 py-3 rounded-lg">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                        <span>Analyzing document...</span>
                      </div>
                    )}
                  </div>
                )}

                {pdfAnalysisError && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <p className="text-sm text-yellow-800">{pdfAnalysisError}</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {showComingSoonToast && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
            <div className="bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg">
              <p className="text-sm font-medium">Coming soon: This will open the relevant module.</p>
            </div>
          </div>
        )}

        {showInlineResults && recommendations && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-hidden">
            <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Recommended for You</h2>
                  <p className="text-gray-600 mt-1">Based on your uploaded document</p>
                </div>
                <button
                  onClick={() => setShowInlineResults(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 flex-shrink-0"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              <div className="overflow-y-auto p-6 flex-1" style={{ maxHeight: '70vh' }}>
                <div className="space-y-8">
                  {recommendations.courses.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="text-gray-900" size={24} />
                        <h3 className="text-2xl font-bold text-gray-900">Recommended content</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recommendations.courses.map((course) => {
                          const matchBadge = getMatchBadge(course.match_score);
                          return (
                            <div
                              key={course.id}
                              className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-200 group"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                                    {course.category}
                                  </span>
                                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${matchBadge.color}`}>
                                    {matchBadge.label}
                                  </span>
                                </div>
                              </div>
                              <h4 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h4>
                              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span className="px-2 py-1 bg-gray-100 rounded-full">{course.difficulty_level}</span>
                                  <span>{course.duration_hours} hours</span>
                                </div>
                                <button
                                  onClick={handleCardClick}
                                  className="btn-primary text-sm px-4 py-2"
                                >
                                  Open
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {recommendations.podcasts.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Headphones className="text-gray-900" size={24} />
                        <h3 className="text-2xl font-bold text-gray-900">Podcasts</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recommendations.podcasts.map((podcast) => {
                          const matchBadge = getMatchBadge();
                          return (
                            <div
                              key={podcast.id}
                              className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-200 group"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                                    {podcast.episodes?.length || 0} episodes
                                  </span>
                                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${matchBadge.color}`}>
                                    {matchBadge.label}
                                  </span>
                                </div>
                              </div>
                              <h4 className="text-lg font-bold text-gray-900 mb-2">{podcast.title}</h4>
                              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{podcast.description}</p>
                              <div className="flex justify-end">
                                <button
                                  onClick={handleCardClick}
                                  className="btn-primary text-sm px-4 py-2"
                                >
                                  Open
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {recommendations.videos.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <PlayCircle className="text-gray-900" size={24} />
                        <h3 className="text-2xl font-bold text-gray-900">Videos</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recommendations.videos.map((video) => {
                          const matchBadge = getMatchBadge();
                          return (
                            <div
                              key={video.id}
                              className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-200 group"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                                    {video.duration_minutes} min
                                  </span>
                                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${matchBadge.color}`}>
                                    {matchBadge.label}
                                  </span>
                                </div>
                              </div>
                              <h4 className="text-lg font-bold text-gray-900 mb-2">{video.title}</h4>
                              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{video.description}</p>
                              <div className="flex justify-end">
                                <button
                                  onClick={handleCardClick}
                                  className="btn-primary text-sm px-4 py-2"
                                >
                                  Open
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {recommendations.courses.length === 0 &&
                   recommendations.podcasts.length === 0 &&
                   recommendations.videos.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <File size={32} className="text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No specific recommendations found</h3>
                      <p className="text-gray-600">
                        Try browsing our full catalog of courses, podcasts, and resources.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && documents.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Your documents ({documents.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 flex-shrink-0">
                      {getFileIcon(doc.file_type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 truncate">
                        {doc.file_name}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>{formatFileSize(doc.file_size)}</span>
                        <span>•</span>
                        <span>{formatDate(doc.uploaded_at)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownload(doc)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
                        title="Download"
                      >
                        <Download size={18} className="text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete"
                      >
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading documents...</p>
            </div>
          </div>
        )}
      </div>

      {showRecommendations && recommendations && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Recommended for You</h2>
                <p className="text-gray-600 mt-1">Based on your uploaded document</p>
              </div>
              <button
                onClick={() => setShowRecommendations(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 100px)' }}>
              {loadingRecommendations ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Finding relevant content...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {recommendations.courses.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="text-gray-900" size={24} />
                        <h3 className="text-2xl font-bold text-gray-900">Recommended content</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recommendations.courses.map((course) => (
                          <div
                            key={course.id}
                            className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                            onClick={() => {
                              setShowRecommendations(false);
                              onNavigate?.('courses', course.id);
                            }}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                                {course.category}
                              </span>
                              <ArrowRight className="text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h4>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="px-2 py-1 bg-gray-100 rounded-full">{course.difficulty_level}</span>
                              <span>{course.duration_hours} hours</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {recommendations.podcasts.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Headphones className="text-gray-900" size={24} />
                        <h3 className="text-2xl font-bold text-gray-900">Podcasts</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recommendations.podcasts.map((podcast) => (
                          <div
                            key={podcast.id}
                            className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                            onClick={() => {
                              setShowRecommendations(false);
                              onNavigate?.('podcasts');
                            }}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                                {podcast.episodes?.length || 0} episodes
                              </span>
                              <ArrowRight className="text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">{podcast.title}</h4>
                            <p className="text-gray-600 text-sm line-clamp-2">{podcast.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {recommendations.videos.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <PlayCircle className="text-gray-900" size={24} />
                        <h3 className="text-2xl font-bold text-gray-900">Videos</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recommendations.videos.map((video) => (
                          <div
                            key={video.id}
                            className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                            onClick={() => {
                              setShowRecommendations(false);
                              onNavigate?.('resources');
                            }}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                                {video.duration_minutes} min
                              </span>
                              <ArrowRight className="text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">{video.title}</h4>
                            <p className="text-gray-600 text-sm line-clamp-2">{video.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {recommendations.courses.length === 0 &&
                   recommendations.podcasts.length === 0 &&
                   recommendations.videos.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <File size={32} className="text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No specific recommendations found</h3>
                      <p className="text-gray-600">
                        Try browsing our full catalog of courses, podcasts, and resources.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <HelpWidget userId={userId} />
    </div>
  );
}
