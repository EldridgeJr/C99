import { useState } from 'react';
import { Calendar, Clock, Award, Play, CheckCircle, AlertCircle, X } from 'lucide-react';

export default function MockHearings() {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{ title: string; url: string } | null>(null);

  const pastSessions = [
    {
      id: 1,
      title: 'Witness Examination - Basic',
      date: '2024-03-10',
      score: 85,
      feedback: 'Excellent questioning technique. Work on pacing.',
      recording: true,
      recordingUrl: 'https://www.youtube.com/watch?v=SsiJFOXOQx4&t=2267s',
    },
    {
      id: 2,
      title: 'Closing Arguments Workshop',
      date: '2024-03-05',
      score: 92,
      feedback: 'Strong delivery and persuasive arguments. Well done!',
      recording: true,
      recordingUrl: 'https://www.youtube.com/watch?v=SsiJFOXOQx4&t=2267s',
    },
    {
      id: 3,
      title: 'Objections and Responses',
      date: '2024-02-28',
      score: 78,
      feedback: 'Good foundation. Practice responding more quickly to objections.',
      recording: true,
      recordingUrl: 'https://www.youtube.com/watch?v=SsiJFOXOQx4&t=2267s',
    },
  ];

  const handleWatchRecording = (title: string, url: string) => {
    setSelectedVideo({ title, url });
    setShowVideoModal(true);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
    setSelectedVideo(null);
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(/[?&]v=([^&]+)/);
    const timeMatch = url.match(/[?&]t=(\d+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : '';
    const startTime = timeMatch ? timeMatch[1] : '';
    return `https://www.youtube.com/embed/${videoId}${startTime ? `?start=${startTime}` : ''}`;
  };

  const stats = [
    {
      label: 'Sessions Completed',
      value: '12',
      icon: <CheckCircle className="text-black" size={20} />,
    },
    {
      label: 'Average Score',
      value: '85%',
      icon: <Award className="text-black" size={20} />,
    },
    {
      label: 'Hours Practiced',
      value: '18',
      icon: <Clock className="text-black" size={20} />,
    },
    {
      label: 'Next Session',
      value: '2 days',
      icon: <Calendar className="text-black" size={20} />,
    },
  ];

  const skills = [
    { name: 'Opening Statements', progress: 85 },
    { name: 'Cross-Examination', progress: 72 },
    { name: 'Evidence Presentation', progress: 90 },
    { name: 'Closing Arguments', progress: 88 },
    { name: 'Objections', progress: 65 },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Mock Hearings</h1>
          <p className="text-gray-600">Practice courtroom procedures in realistic simulations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-black mt-1">{stat.value}</p>
                </div>
                <div className="p-3 bg-gray-100 rounded-lg">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-black">Past Sessions & Recordings</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {pastSessions.map((session) => (
                  <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-black mb-1">{session.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{session.date}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-gray-600">Score:</span>
                          <span className="text-lg font-bold text-black">{session.score}%</span>
                        </div>
                        <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                          <AlertCircle size={16} className="text-gray-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">{session.feedback}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {session.recording && (
                        <>
                          <button
                            onClick={() => handleWatchRecording(session.title, session.recordingUrl)}
                            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                          >
                            <Play size={16} />
                            Watch Recording
                          </button>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                            View Feedback
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
              <h2 className="text-lg font-bold text-black mb-6">Skill Progress</h2>
              <div className="space-y-5">
                {skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                      <span className="text-sm font-bold text-black">{skill.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-black h-2 rounded-full transition-all"
                        style={{ width: `${skill.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-black mb-4">Session Guidelines</h2>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-black mt-0.5 flex-shrink-0" />
                  <span>Join sessions 5 minutes early</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-black mt-0.5 flex-shrink-0" />
                  <span>Have case materials prepared</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-black mt-0.5 flex-shrink-0" />
                  <span>Professional attire recommended</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-black mt-0.5 flex-shrink-0" />
                  <span>Take notes during feedback</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-black mt-0.5 flex-shrink-0" />
                  <span>Review recordings after sessions</span>
                </li>
              </ul>
              <button className="w-full mt-6 bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                Schedule Session
              </button>
            </div>
          </div>
        </div>

        {showVideoModal && selectedVideo && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={closeVideoModal}
          >
            <div
              className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-black">{selectedVideo.title}</h2>
                <button
                  onClick={closeVideoModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              <div className="p-6">
                <div className="aspect-video w-full">
                  <iframe
                    className="w-full h-full rounded-lg"
                    src={getYouTubeEmbedUrl(selectedVideo.url)}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
