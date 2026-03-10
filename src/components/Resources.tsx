import { useState, useEffect } from 'react';
import { BookOpen, X, CheckCircle2, ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BusinessResource {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  category: string;
  order_index: number;
  thumbnail_url: string | null;
  is_published: boolean;
}

interface ResourceRead {
  resource_id: string;
  completed: boolean;
}

export default function Resources({ userId }: { userId: string }) {
  const [resources, setResources] = useState<BusinessResource[]>([]);
  const [selectedResource, setSelectedResource] = useState<BusinessResource | null>(null);
  const [readStatus, setReadStatus] = useState<ResourceRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchResources();
    fetchReadStatus();
  }, [userId]);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('business_resources')
        .select('*')
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReadStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('resource_reads')
        .select('resource_id, completed')
        .eq('client_id', userId);

      if (error) throw error;
      setReadStatus(data || []);
    } catch (error) {
      console.error('Error fetching read status:', error);
    }
  };

  const markAsRead = async (resourceId: string) => {
    try {
      const { error } = await supabase
        .from('resource_reads')
        .upsert({
          client_id: userId,
          resource_id: resourceId,
          completed: true,
          last_read_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      fetchReadStatus();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const isRead = (resourceId: string) => {
    return readStatus.some(r => r.resource_id === resourceId && r.completed);
  };

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

  const slugifyCategory = (cat: string) => {
    return cat.toLowerCase().replace(/\s+/g, '-').replace(/[()\/&]/g, '').replace(/--+/g, '-');
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchQuery === '' ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' ||
      slugifyCategory(resource.category) === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold text-black mb-6 mt-8">{line.substring(2)}</h1>;
      } else if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold text-black mb-4 mt-6">{line.substring(3)}</h2>;
      } else if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-semibold text-black mb-3 mt-5">{line.substring(4)}</h3>;
      } else if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={index} className="font-bold text-black mb-2">{line.substring(2, line.length - 2)}</p>;
      } else if (line.startsWith('- ')) {
        return <li key={index} className="ml-6 mb-2 text-gray-700">{line.substring(2)}</li>;
      } else if (line.trim() === '') {
        return <div key={index} className="h-4" />;
      } else {
        return <p key={index} className="text-gray-700 mb-3 leading-relaxed">{line}</p>;
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (selectedResource) {
    return (
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => {
                markAsRead(selectedResource.id);
                setSelectedResource(null);
              }}
              className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Resources</span>
            </button>
            <button
              onClick={() => markAsRead(selectedResource.id)}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <CheckCircle2 size={18} />
              Mark as Read
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          {selectedResource.thumbnail_url && (
            <img
              src={selectedResource.thumbnail_url}
              alt={selectedResource.title}
              className="w-full h-64 object-cover rounded-xl mb-8"
            />
          )}

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-black mb-3">{selectedResource.title}</h1>
            <p className="text-xl text-gray-600">{selectedResource.subtitle}</p>
          </div>

          <div className="prose prose-lg max-w-none">
            {renderContent(selectedResource.content)}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <button
              onClick={() => {
                markAsRead(selectedResource.id);
                setSelectedResource(null);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              <ArrowLeft size={20} />
              Back to Resources
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Business Resources</h1>
          <p className="text-lg text-gray-600 font-medium">Essential guides for navigating court hearings and building business strength</p>
        </div>

        <div className="card-premium p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search resources..."
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
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              onClick={() => setSelectedResource(resource)}
              className="group card-premium overflow-hidden cursor-pointer hover-lift hover-glow animate-scale-in"
            >
              {resource.thumbnail_url && (
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={resource.thumbnail_url}
                    alt={resource.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
                  {isRead(resource.id) && (
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg">
                      <CheckCircle2 size={18} className="text-green-600" />
                      Completed
                    </div>
                  )}
                </div>
              )}
              <div className="p-7">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    <BookOpen className="text-white" size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-gray-700 transition-colors line-clamp-2 leading-tight">
                      {resource.title}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-6 leading-relaxed">
                  {resource.subtitle}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Resource {resource.order_index}</span>
                  <span className="text-gray-900 font-bold group-hover:translate-x-2 transition-transform flex items-center gap-2">
                    Read <ArrowRight size={18} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto mb-4 text-gray-300" size={48} />
            <p className="text-gray-600 font-semibold">
              {searchQuery
                ? 'No resources found matching your search criteria.'
                : selectedCategory === 'all'
                ? 'No resources available at this time.'
                : 'No resources found in this category.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
