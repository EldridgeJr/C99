import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import type { User } from '@supabase/supabase-js';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CourseCatalog from './components/CourseCatalog';
import CourseDetail from './components/CourseDetail';
import LessonPlayer from './components/LessonPlayer';
import ProgressTracking from './components/ProgressTracking';
import OperationsDashboard from './components/OperationsDashboard';
import Login from './components/Login';
import Court99Dashboard from './components/Court99Dashboard';
import LawFirmDashboard from './components/LawFirmDashboard';
import ClientDashboard from './components/ClientDashboard';
import ContentViewer from './components/ContentViewer';
import Podcasts from './components/Podcasts';
import Resources from './components/Resources';
import Community from './components/Community';
import MockHearings from './components/MockHearings';
import QASessions from './components/QASessions';
import MobileWarning from './components/MobileWarning';
import Documents from './components/Documents';
import GuidedCaseWriting from './components/GuidedCaseWriting';

interface Profile {
  id: string;
  full_name: string;
  user_type: string;
  law_firm_id: string | null;
  email: string;
}

interface LawFirm {
  id: string;
  name: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [lawFirm, setLawFirm] = useState<LawFirm | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (profile) {
      if (profile.user_type === 'admin' && !profile.law_firm_id) {
        setActiveView('court99-dashboard');
      } else if (profile.user_type === 'admin' && profile.law_firm_id) {
        setActiveView('law-firm-dashboard');
      } else if (profile.user_type === 'client') {
        setActiveView('documents');
      } else {
        setActiveView('documents');
      }
    }
  }, [profile]);

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setActiveView('course-detail');
  };

  const handleBackFromCourse = () => {
    setSelectedCourseId(null);
    setActiveView('catalog');
  };

  const handleStartLesson = (lessonId: string, moduleId: string) => {
    setSelectedLessonId(lessonId);
    setSelectedModuleId(moduleId);
    setActiveView('lesson-player');
  };

  const handleBackFromLesson = () => {
    setSelectedLessonId(null);
    setSelectedModuleId(null);
    setActiveView('course-detail');
  };

  const handleStartContent = (contentId: string) => {
    setSelectedContentId(contentId);
    setActiveView('content-viewer');
  };

  const handleBackFromContent = () => {
    setSelectedContentId(null);
    setActiveView('home');
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, user_type, law_firm_id, email')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);

      if (data?.law_firm_id) {
        const { data: firmData, error: firmError } = await supabase
          .from('law_firms')
          .select('id, name')
          .eq('id', data.law_firm_id)
          .maybeSingle();

        if (firmError) {
          console.error('Error fetching law firm:', firmError);
        } else {
          setLawFirm(firmData);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setLoading(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setActiveView('');
  };

  if (isMobile) {
    return <MobileWarning />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'court99-dashboard':
        return <Court99Dashboard />;
      case 'law-firm-dashboard':
        return <LawFirmDashboard profile={profile} />;
      case 'client-dashboard':
        return <ClientDashboard userId={profile.id} onStartContent={handleStartContent} />;
      case 'case-writing':
        return <GuidedCaseWriting userId={profile.id} />;
      case 'documents':
        return <Documents
          userId={profile.id}
          userName={profile.full_name}
          onNavigate={(section, itemId) => {
            if (section === 'courses' && itemId) {
              handleSelectCourse(itemId);
            } else if (section === 'podcasts') {
              setActiveView('podcasts');
            } else if (section === 'resources') {
              setActiveView('resources');
            } else {
              setActiveView(section);
            }
          }}
        />;
      case 'catalog':
        return <CourseCatalog onSelectCourse={handleSelectCourse} userId={profile.id} />;
      case 'course-detail':
        return selectedCourseId ? (
          <CourseDetail
            courseId={selectedCourseId}
            onBack={handleBackFromCourse}
            onStartLesson={handleStartLesson}
          />
        ) : null;
      case 'lesson-player':
        return selectedLessonId && selectedModuleId ? (
          <LessonPlayer
            lessonId={selectedLessonId}
            moduleId={selectedModuleId}
            onBack={handleBackFromLesson}
          />
        ) : null;
      case 'content-viewer':
        return selectedContentId ? (
          <ContentViewer
            contentId={selectedContentId}
            userId={profile.id}
            onBack={handleBackFromContent}
          />
        ) : null;
      case 'progress':
        return <ProgressTracking userId={profile.id} />;
      case 'operations':
        return <OperationsDashboard />;
      case 'podcasts':
        return <Podcasts userId={profile.id} />;
      case 'resources':
        return <Resources userId={profile.id} />;
      case 'community':
        return <Community />;
      case 'hearings':
        return <MockHearings />;
      case 'qna':
        return <QASessions />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        userType={profile.user_type}
        lawFirmId={profile.law_firm_id}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          userName={profile.full_name}
          userType={profile.user_type}
          lawFirmName={lawFirm?.name}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default App;
