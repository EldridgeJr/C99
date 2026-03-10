import { useState, useEffect } from 'react';
import { Search, Filter, Award, Clock, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabase';
import HelpWidget from './HelpWidget';

type Course = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: string;
  estimated_hours: number;
  is_free: boolean;
  certificate_enabled: boolean;
  module_count?: number;
  enrolled?: boolean;
};

type CourseCatalogProps = {
  onSelectCourse?: (courseId: string) => void;
  userId: string;
};

export default function CourseCatalog({ onSelectCourse, userId }: CourseCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all-levels');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        const { data: allCourses } = await supabase.from('courses').select('*');

        let filteredCourses = allCourses || [];

        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('law_firm_id')
            .eq('id', user.id)
            .maybeSingle();

          if (profile?.law_firm_id) {
            const { data: contentAccess } = await supabase
              .from('law_firm_content_access')
              .select('content_id, is_enabled')
              .eq('law_firm_id', profile.law_firm_id)
              .eq('content_type', 'course');

            if (contentAccess && contentAccess.length > 0) {
              const disabledCourseIds = contentAccess
                .filter((access) => !access.is_enabled)
                .map((access) => access.content_id);

              filteredCourses = allCourses?.filter(
                (course) => !disabledCourseIds.includes(course.id)
              ) || [];
            }
          }
        }

        const coursesWithModuleCount = await Promise.all(
          filteredCourses.map(async (course) => {
            const { count } = await supabase
              .from('modules')
              .select('*', { count: 'exact', head: true })
              .eq('course_id', course.id);

            return {
              ...course,
              module_count: count || 0,
            };
          })
        );

        setCourses(coursesWithModuleCount);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const categoryGroups = {
    'Court Preparation': [
      'Before Court',
      'During Court',
      'Communication & Behavior',
      'Mental Readiness',
      'Information & Organization',
      'After Court',
    ],
    'Core / General Law Subjects': [
      'Constitutional Law',
      'Administrative Law',
      'Civil Law',
      'Criminal Law',
      'Procedural Law',
      'Evidence Law',
      'Jurisprudence / Legal Theory',
      'Comparative Law',
    ],
    'Private Law (Civil / Commercial)': [
      'Contract Law',
      'Tort Law',
      'Property Law / Real Estate Law',
      'Family Law',
      'Inheritance / Succession Law',
      'Trusts & Estates',
      'Consumer Protection Law',
    ],
    'Commercial & Business Law': [
      'Corporate Law',
      'Company Law',
      'Commercial Law',
      'Business Litigation',
      'Shareholder Law',
      'Mergers & Acquisitions (M&A)',
      'Insolvency / Bankruptcy Law',
      'Restructuring Law',
      'Securities Law',
      'Banking & Finance Law',
      'Investment Law',
    ],
    'Employment & Labor Law': [
      'Employment Law',
      'Labor Law',
      'Workplace Discrimination Law',
      'Collective Bargaining Law',
      'Occupational Health & Safety Law',
    ],
    'Public Law & Government': [
      'Administrative Law',
      'Public International Law',
      'Constitutional Litigation',
      'Government Contracts',
      'Regulatory Law',
      'Public Procurement Law',
    ],
    'Criminal & Enforcement': [
      'Criminal Law',
      'White-Collar Crime',
      'Financial Crime',
      'Fraud Law',
      'Anti-Money Laundering (AML)',
      'Cybercrime Law',
      'Sanctions Law',
    ],
    'Litigation & Dispute Resolution': [
      'Civil Litigation',
      'Commercial Litigation',
      'Arbitration',
      'Mediation',
      'Alternative Dispute Resolution (ADR)',
      'Class Action Litigation',
      'International Arbitration',
    ],
    'Intellectual Property (IP)': [
      'Intellectual Property Law',
      'Copyright Law',
      'Trademark Law',
      'Patent Law',
      'Trade Secrets Law',
      'Licensing Law',
    ],
    'Technology & Data': [
      'Technology Law',
      'IT Law',
      'Data Protection & Privacy Law',
      'GDPR / Privacy Compliance',
      'Cybersecurity Law',
      'Artificial Intelligence Law',
      'Platform Regulation',
    ],
    'Regulatory & Compliance': [
      'Regulatory Compliance',
      'Financial Regulation',
      'Competition / Antitrust Law',
      'Consumer Regulation',
      'Telecommunications Law',
      'Energy Regulation',
    ],
    'International & Cross-Border': [
      'International Law',
      'International Trade Law',
      'Customs Law',
      'WTO Law',
      'Cross-Border Transactions',
      'Conflict of Laws / Private International Law',
    ],
    'Sector-Specific Law': [
      'Healthcare Law',
      'Medical Malpractice Law',
      'Pharmaceutical Law',
      'Insurance Law',
      'Construction Law',
      'Infrastructure Law',
      'Transportation & Aviation Law',
      'Maritime / Admiralty Law',
      'Sports Law',
      'Entertainment & Media Law',
      'Gaming & Gambling Law',
    ],
    'Tax & Finance': [
      'Tax Law',
      'International Tax Law',
      'Corporate Tax',
      'VAT / Sales Tax',
      'Transfer Pricing',
    ],
    'Environmental & Sustainability': [
      'Environmental Law',
      'Climate Change Law',
      'Energy Law',
      'Sustainability & ESG Law',
    ],
    'Human Rights & Social Law': [
      'Human Rights Law',
      'Refugee & Asylum Law',
      'Immigration Law',
      'Social Security Law',
    ],
    'Education & Nonprofit': [
      'Education Law',
      'Nonprofit / Charity Law',
      'NGO Law',
    ],
    'Military & Security': [
      'Military Law',
      'National Security Law',
    ],
  };

  const levels = ['All Levels', 'Beginner Friendly', 'Intermediate', 'Advanced'];

  const slugifyCategory = (cat: string) => {
    return cat.toLowerCase().replace(/\s+/g, '-').replace(/[()\/&]/g, '').replace(/--+/g, '-');
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = searchQuery === '' ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' ||
      slugifyCategory(course.category) === selectedCategory;

    const matchesLevel = selectedLevel === 'all-levels' ||
      course.difficulty_level === selectedLevel.replace('-', ' ');

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Course Catalog</h1>
          <p className="text-lg text-gray-600 font-medium">Explore comprehensive courses to prepare for your legal proceedings</p>
        </div>

        <div className="card-premium p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200/80 rounded-xl focus:outline-none focus:ring-4 focus:ring-gray-900/10 focus:border-gray-900 transition-all duration-200"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-5 py-3 border-2 border-gray-200/80 rounded-xl focus:outline-none focus:ring-4 focus:ring-gray-900/10 focus:border-gray-900 transition-all duration-200 font-semibold bg-white"
            >
              <option value="all">All Categories</option>
              {Object.entries(categoryGroups).map(([groupName, categories]) => (
                <optgroup key={groupName} label={groupName}>
                  {categories.map((cat) => (
                    <option key={cat} value={cat.toLowerCase().replace(/\s+/g, '-').replace(/[()\/&]/g, '').replace(/--+/g, '-')}>
                      {cat}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-5 py-3 border-2 border-gray-200/80 rounded-xl focus:outline-none focus:ring-4 focus:ring-gray-900/10 focus:border-gray-900 transition-all duration-200 font-semibold bg-white"
            >
              {levels.map((level) => (
                <option key={level} value={level.toLowerCase().replace(' ', '-')}>
                  {level}
                </option>
              ))}
            </select>
            <button className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold hover:scale-105">
              <Filter size={20} />
              Filters
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mx-auto mb-6"></div>
              <p className="text-gray-600 font-semibold text-lg">Loading courses...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => onSelectCourse?.(course.id)}
                className="group card-premium overflow-hidden cursor-pointer hover-lift hover-glow animate-scale-in"
              >
                <div className="relative h-48 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                  <BookOpen className="text-white/90 relative z-10 group-hover:scale-110 transition-transform duration-300" size={56} />
                  {course.is_free && (
                    <div className="absolute top-4 right-4 px-4 py-2 bg-white text-gray-900 text-xs font-black rounded-xl shadow-lg z-20">
                      FREE
                    </div>
                  )}
                </div>
                <div className="p-7">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-xs font-black text-gray-500 uppercase tracking-wider bg-gray-100 px-3 py-1.5 rounded-lg">
                      {course.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-gray-700 transition-colors line-clamp-2 leading-tight">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-6 line-clamp-2 leading-relaxed">{course.description}</p>

                  <div className="flex items-center gap-5 text-xs text-gray-500 mb-6 pb-6 border-b border-gray-200/50">
                    <span className="flex items-center gap-1.5 font-bold">
                      <BookOpen size={16} /> {course.module_count}
                    </span>
                    <span className="flex items-center gap-1.5 font-bold">
                      <Clock size={16} /> {course.estimated_hours}h
                    </span>
                    {course.certificate_enabled && (
                      <span className="flex items-center gap-1.5 font-bold">
                        <Award size={16} />
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
                      {course.difficulty_level.charAt(0).toUpperCase() + course.difficulty_level.slice(1)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCourse?.(course.id);
                      }}
                      className="btn-primary text-sm px-6 py-2.5"
                    >
                      View Course
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto mb-4 text-gray-300" size={48} />
            <p className="text-gray-600 font-semibold">No courses found matching your search criteria.</p>
          </div>
        )}
      </div>

      <HelpWidget userId={userId} />
    </div>
  );
}