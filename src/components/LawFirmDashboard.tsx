import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Search, X, BookOpen, Headphones, FileText, ChevronRight, ChevronLeft } from 'lucide-react';

interface Client {
  id: string;
  full_name: string;
  email: string;
  password?: string;
  created_at: string;
  case?: Case;
}

interface Case {
  id: string;
  case_number: string;
  case_type: string;
  status: string;
  description: string;
  created_at: string;
  client_id: string;
}

interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
}

interface Podcast {
  id: string;
  title: string;
  description: string;
  category: string;
}

interface ContentItem {
  id: string;
  title: string;
  description: string;
  category: string;
  content_type: string;
}

interface Profile {
  id: string;
  law_firm_id: string | null;
  email: string;
}

interface ClientContentAssignment {
  client_id: string;
  content_type: 'course' | 'podcast' | 'content_item';
  content_id: string;
  content_title?: string;
}

export default function LawFirmDashboard({ profile }: { profile: Profile }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [clientContentAssignments, setClientContentAssignments] = useState<ClientContentAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddClientCase, setShowAddClientCase] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [selectedCaseClient, setSelectedCaseClient] = useState<Client | null>(null);
  const [showModuleSelector, setShowModuleSelector] = useState(false);
  const [showCaseDetails, setShowCaseDetails] = useState(false);
  const [lawFirmName, setLawFirmName] = useState('');

  const [newClientCase, setNewClientCase] = useState({
    client_email: '',
    client_password: '',
    case_number: '',
  });

  const [addClientStep, setAddClientStep] = useState<1 | 2>(1);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [availablePodcasts, setAvailablePodcasts] = useState<Podcast[]>([]);
  const [availableContentItems, setAvailableContentItems] = useState<ContentItem[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [selectedPodcasts, setSelectedPodcasts] = useState<string[]>([]);
  const [selectedContentItems, setSelectedContentItems] = useState<string[]>([]);
  const [contentTab, setContentTab] = useState<'courses' | 'podcasts' | 'content'>('content');

  useEffect(() => {
    if (profile.law_firm_id) {
      fetchLawFirm();
      fetchClients();
      fetchCases();
      fetchModules();
      fetchAvailableContent();
      fetchClientContentAssignments();
    }
  }, [profile.law_firm_id]);

  useEffect(() => {
    if (selectedCase?.client_id) {
      fetchCaseClient(selectedCase.client_id);
    }
  }, [selectedCase]);

  const fetchLawFirm = async () => {
    try {
      const { data, error } = await supabase
        .from('law_firms')
        .select('name')
        .eq('id', profile.law_firm_id)
        .maybeSingle();

      if (error) throw error;
      setLawFirmName(data?.name || 'Your Law Firm');
    } catch (error) {
      console.error('Error fetching law firm:', error);
      setLawFirmName('Your Law Firm');
    }
  };

  const fetchCaseClient = async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, password, created_at')
        .eq('id', clientId)
        .maybeSingle();

      if (error) throw error;
      setSelectedCaseClient(data);
    } catch (error) {
      console.error('Error fetching case client:', error);
      setSelectedCaseClient(null);
    }
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, password, created_at')
        .eq('law_firm_id', profile.law_firm_id)
        .eq('user_type', 'client')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCases = async () => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('law_firm_id', profile.law_firm_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCases(data || []);
    } catch (error) {
      console.error('Error fetching cases:', error);
    }
  };

  const fetchModules = async () => {
    try {
      const { data, error } = await supabase
        .from('modules')
        .select('id, course_id, title, description')
        .order('title');

      if (error) throw error;
      setModules(data || []);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  const fetchAvailableContent = async () => {
    try {
      const [coursesRes, podcastsRes, contentItemsRes] = await Promise.all([
        supabase.from('courses').select('id, title, description, category').order('title'),
        supabase.from('podcasts').select('id, title, description, category').order('title'),
        supabase.from('content_items').select('id, title, description, category, content_type').order('title'),
      ]);

      if (coursesRes.error) throw coursesRes.error;
      if (podcastsRes.error) throw podcastsRes.error;
      if (contentItemsRes.error) throw contentItemsRes.error;

      setAvailableCourses(coursesRes.data || []);
      setAvailablePodcasts(podcastsRes.data || []);
      setAvailableContentItems(contentItemsRes.data || []);
    } catch (error) {
      console.error('Error fetching available content:', error);
    }
  };

  const fetchClientContentAssignments = async () => {
    try {
      const { data: assignments, error } = await supabase
        .from('client_content_assignments')
        .select('client_id, content_type, content_id')
        .eq('is_active', true);

      if (error) throw error;

      const assignmentsWithTitles = await Promise.all(
        (assignments || []).map(async (assignment) => {
          let content_title = '';

          if (assignment.content_type === 'course') {
            const { data } = await supabase
              .from('courses')
              .select('title')
              .eq('id', assignment.content_id)
              .maybeSingle();
            content_title = data?.title || '';
          } else if (assignment.content_type === 'podcast') {
            const { data } = await supabase
              .from('podcasts')
              .select('title')
              .eq('id', assignment.content_id)
              .maybeSingle();
            content_title = data?.title || '';
          } else if (assignment.content_type === 'content_item') {
            const { data } = await supabase
              .from('content_items')
              .select('title')
              .eq('id', assignment.content_id)
              .maybeSingle();
            content_title = data?.title || '';
          }

          return {
            ...assignment,
            content_title,
          };
        })
      );

      setClientContentAssignments(assignmentsWithTitles);
    } catch (error) {
      console.error('Error fetching client content assignments:', error);
    }
  };

  const handleAddClientCase = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('No active session');
      }

      const contentAssignments = [
        ...selectedCourses.map(id => ({ content_type: 'course', content_id: id })),
        ...selectedPodcasts.map(id => ({ content_type: 'podcast', content_id: id })),
        ...selectedContentItems.map(id => ({ content_type: 'content_item', content_id: id })),
      ];

      const response = await fetch(
        `${supabaseUrl}/functions/v1/create-client-and-case`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
            'apikey': supabaseAnonKey,
          },
          body: JSON.stringify({
            client_email: newClientCase.client_email,
            client_password: newClientCase.client_password,
            case_number: newClientCase.case_number,
            law_firm_id: profile.law_firm_id,
            content_assignments: contentAssignments,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create client and case');
      }

      setShowAddClientCase(false);
      setAddClientStep(1);
      setNewClientCase({
        client_email: '',
        client_password: '',
        case_number: '',
      });
      setSelectedCourses([]);
      setSelectedPodcasts([]);
      setSelectedContentItems([]);
      fetchClients();
      fetchCases();
      fetchClientContentAssignments();
      alert('Client and case created successfully!');
    } catch (error) {
      console.error('Error adding client and case:', error);
      const errorMessage = error instanceof Error ? error.message : 'Please try again.';

      if (errorMessage.includes('duplicate key') || errorMessage.includes('case_number')) {
        alert(`This case number already exists for your law firm. Please use a different case number.`);
      } else if (errorMessage.includes('email')) {
        alert(`This email address is already registered. Please use a different email.`);
      } else {
        alert(`Error adding client and case: ${errorMessage}`);
      }
    }
  };

  const toggleContentSelection = (contentId: string, type: 'course' | 'podcast' | 'content_item') => {
    if (type === 'course') {
      setSelectedCourses(prev =>
        prev.includes(contentId) ? prev.filter(id => id !== contentId) : [...prev, contentId]
      );
    } else if (type === 'podcast') {
      setSelectedPodcasts(prev =>
        prev.includes(contentId) ? prev.filter(id => id !== contentId) : [...prev, contentId]
      );
    } else {
      setSelectedContentItems(prev =>
        prev.includes(contentId) ? prev.filter(id => id !== contentId) : [...prev, contentId]
      );
    }
  };


  const handleAssignModule = async (moduleId: string) => {
    if (!selectedCase) return;

    try {
      const { error } = await supabase.from('case_modules').insert([
        {
          case_id: selectedCase.id,
          module_id: moduleId,
          course_id: modules.find((m) => m.id === moduleId)?.course_id,
        },
      ]);

      if (error) throw error;
      alert('Module assigned successfully!');
    } catch (error) {
      console.error('Error assigning module:', error);
      alert('Error assigning module. Please try again.');
    }
  };

  const getClientCase = (clientId: string) => {
    return cases.find((c) => c.client_id === clientId);
  };

  const getClientAssignments = (clientId: string) => {
    return clientContentAssignments.filter((a) => a.client_id === clientId);
  };

  const getAssignmentsSummary = (clientId: string) => {
    const assignments = getClientAssignments(clientId);
    const courses = assignments.filter(a => a.content_type === 'course').length;
    const podcasts = assignments.filter(a => a.content_type === 'podcast').length;
    const content = assignments.filter(a => a.content_type === 'content_item').length;

    const parts = [];
    if (courses > 0) parts.push(`${courses} course${courses > 1 ? 's' : ''}`);
    if (podcasts > 0) parts.push(`${podcasts} podcast${podcasts > 1 ? 's' : ''}`);
    if (content > 0) parts.push(`${content} content item${content > 1 ? 's' : ''}`);

    return parts.length > 0 ? parts.join(', ') : 'No content assigned';
  };

  const filteredClients = clients.filter(
    (client) =>
      client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMonthlyCount = (items: Array<{ created_at: string }>) => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    return items.filter((item) => {
      const created = new Date(item.created_at);
      return created >= firstDay && created <= lastDay;
    }).length;
  };

  const monthlyCasesCount = getMonthlyCount(cases);
  const totalCasesCount = cases.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">Law Firm Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Total Cases</div>
            <div className="text-3xl font-bold text-black">{totalCasesCount}</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Cases Added This Month</div>
            <div className="text-3xl font-bold text-black">{monthlyCasesCount}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-black mb-4">Cases Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cases.map((caseItem) => {
                const client = clients.find(c => c.id === caseItem.client_id);
                const assignments = getClientAssignments(caseItem.client_id);

                return (
                  <div
                    key={caseItem.id}
                    onClick={() => {
                      if (caseItem.status === 'open') {
                        setSelectedCase(caseItem);
                        setShowCaseDetails(true);
                      }
                    }}
                    className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all ${
                      caseItem.status === 'open' ? 'cursor-pointer hover:border-gray-400' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-black">{caseItem.case_number}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{caseItem.case_type}</p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          caseItem.status === 'open'
                            ? 'bg-black text-white'
                            : caseItem.status === 'closed'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {caseItem.status}
                      </span>
                    </div>

                    {client && (
                      <div className="mb-3 pb-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{client.full_name}</p>
                        <p className="text-xs text-gray-600 mt-1">Email: {client.email}</p>
                        <p className="text-xs text-gray-600 mt-1">Password: {client.password || '-'}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Client since: {new Date(client.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Assigned Content:</span>
                        <span className="font-medium text-black">{assignments.length}</span>
                      </div>

                      {caseItem.description && (
                        <p className="text-xs text-gray-600 line-clamp-2">{caseItem.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}

              {cases.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No cases yet. Add a client to create your first case.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-black">Clients</h2>
            <button
              onClick={() => setShowAddClientCase(true)}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Client & Case
            </button>
          </div>

          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search clients by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Client Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Password
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Case Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Assigned Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => {
                  const clientCase = getClientCase(client.id);
                  return (
                    <tr key={client.id} className="hover:bg-gray-100">
                      <td className="px-6 py-4 text-sm font-medium text-black">
                        {client.full_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{client.email}</td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-600">
                        {client.password || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-black">
                        {clientCase?.case_number || '-'}
                      </td>
                      <td className="px-6 py-4">
                        {clientCase ? (
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              clientCase.status === 'open'
                                ? 'bg-black text-white'
                                : clientCase.status === 'closed'
                                ? 'bg-gray-100 text-gray-700'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {clientCase.status}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {getAssignmentsSummary(client.id)}
                      </td>
                      <td className="px-6 py-4">
                        {clientCase && (
                          <button
                            onClick={() => {
                              setSelectedCase(clientCase);
                              setShowModuleSelector(true);
                            }}
                            className="text-black hover:text-gray-700 text-sm font-medium"
                          >
                            Assign Modules
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {showAddClientCase && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-black">Add Client & Case</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Step {addClientStep} of 2: {addClientStep === 1 ? 'Client Information' : 'Assign Content'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAddClientCase(false);
                    setAddClientStep(1);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddClientCase}>
                {addClientStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={newClientCase.client_email}
                        onChange={(e) =>
                          setNewClientCase({ ...newClientCase, client_email: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="john.smith@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Temporary Password
                      </label>
                      <input
                        type="password"
                        required
                        value={newClientCase.client_password}
                        onChange={(e) =>
                          setNewClientCase({ ...newClientCase, client_password: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Minimum 6 characters"
                        minLength={6}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Client can change this password after their first login
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Case Number
                      </label>
                      <input
                        type="text"
                        required
                        value={newClientCase.case_number}
                        onChange={(e) =>
                          setNewClientCase({ ...newClientCase, case_number: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="CASE-2024-001"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setAddClientStep(2)}
                        className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <span>Next: Assign Content</span>
                        <ChevronRight size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddClientCase(false);
                          setAddClientStep(1);
                        }}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {addClientStep === 2 && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-900">
                        Select the content that <strong>{newClientCase.client_email}</strong> will have access to.
                        You can select courses, podcasts, and learning materials.
                      </p>
                      <p className="text-xs text-gray-600 mt-2">
                        Selected: {selectedCourses.length} courses, {selectedPodcasts.length} podcasts, {selectedContentItems.length} learning items
                      </p>
                    </div>

                    <div className="border-b border-gray-200">
                      <div className="flex">
                        <button
                          type="button"
                          onClick={() => setContentTab('content')}
                          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                            contentTab === 'content'
                              ? 'text-black border-b-2 border-black bg-gray-50'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <FileText size={16} />
                            <span>Learning Content ({availableContentItems.length})</span>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setContentTab('courses')}
                          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                            contentTab === 'courses'
                              ? 'text-black border-b-2 border-black bg-gray-50'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <BookOpen size={16} />
                            <span>Courses ({availableCourses.length})</span>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setContentTab('podcasts')}
                          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                            contentTab === 'podcasts'
                              ? 'text-black border-b-2 border-black bg-gray-50'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <Headphones size={16} />
                            <span>Podcasts ({availablePodcasts.length})</span>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto space-y-2">
                      {contentTab === 'content' && availableContentItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => toggleContentSelection(item.id, 'content_item')}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedContentItems.includes(item.id)
                              ? 'border-black bg-gray-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selectedContentItems.includes(item.id)}
                              onChange={() => {}}
                              className="w-4 h-4"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-sm text-gray-900">{item.title}</h4>
                                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                                  {item.category}
                                </span>
                                <span className="text-xs px-2 py-0.5 bg-black text-white rounded">
                                  {item.content_type}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 line-clamp-1">{item.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {contentTab === 'courses' && availableCourses.map((course) => (
                        <div
                          key={course.id}
                          onClick={() => toggleContentSelection(course.id, 'course')}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedCourses.includes(course.id)
                              ? 'border-black bg-gray-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selectedCourses.includes(course.id)}
                              onChange={() => {}}
                              className="w-4 h-4"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-sm text-gray-900">{course.title}</h4>
                                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                                  {course.category}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 line-clamp-1">{course.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {contentTab === 'podcasts' && availablePodcasts.map((podcast) => (
                        <div
                          key={podcast.id}
                          onClick={() => toggleContentSelection(podcast.id, 'podcast')}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedPodcasts.includes(podcast.id)
                              ? 'border-black bg-gray-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selectedPodcasts.includes(podcast.id)}
                              onChange={() => {}}
                              className="w-4 h-4"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-sm text-gray-900">{podcast.title}</h4>
                                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                                  {podcast.category}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 line-clamp-1">{podcast.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setAddClientStep(1)}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                      >
                        <ChevronLeft size={20} />
                        <span>Back</span>
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                      >
                        Create Client & Case
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {showModuleSelector && selectedCase && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">
                  Assign Modules - {selectedCase.case_number}
                </h2>
                <button
                  onClick={() => setShowModuleSelector(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-3">
                {modules.map((module) => (
                  <div
                    key={module.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-100"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-black">{module.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                    </div>
                    <button
                      onClick={() => handleAssignModule(module.id)}
                      className="ml-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                    >
                      Assign
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showCaseDetails && selectedCase && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-black">Case Details</h2>
                  <p className="text-sm text-gray-600 mt-1">{selectedCase.case_number}</p>
                </div>
                <button
                  onClick={() => {
                    setShowCaseDetails(false);
                    setSelectedCase(null);
                    setSelectedCaseClient(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {selectedCaseClient && (
                  <div className="bg-black text-white rounded-lg p-5 border border-gray-800">
                    <h3 className="text-sm font-semibold uppercase tracking-wide mb-4 text-gray-300">
                      Client Login Credentials
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-gray-400 block mb-1">Full Name:</span>
                        <span className="text-base font-mono font-medium">{selectedCaseClient.full_name}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 block mb-1">Email:</span>
                        <span className="text-base font-mono font-medium">{selectedCaseClient.email}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 block mb-1">Password:</span>
                        <span className="text-base font-mono font-medium">{selectedCaseClient.password || 'Not available'}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 block mb-1">Case Number:</span>
                        <span className="text-base font-mono font-medium">{selectedCase.case_number}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 italic mt-4 pt-3 border-t border-gray-700">
                      Share these credentials with your client to access the platform
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                    Case Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Case Number:</span>
                      <span className="text-sm font-medium text-black">{selectedCase.case_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Case Type:</span>
                      <span className="text-sm font-medium text-black">{selectedCase.case_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          selectedCase.status === 'open'
                            ? 'bg-black text-white'
                            : selectedCase.status === 'closed'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {selectedCase.status}
                      </span>
                    </div>
                    {selectedCase.description && (
                      <div className="pt-2">
                        <span className="text-sm text-gray-600">Description:</span>
                        <p className="text-sm text-black mt-1">{selectedCase.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                {(() => {
                  const assignments = getClientAssignments(selectedCase.client_id);
                  const courseAssignments = assignments.filter((a) => a.content_type === 'course');
                  const podcastAssignments = assignments.filter((a) => a.content_type === 'podcast');
                  const contentAssignments = assignments.filter((a) => a.content_type === 'content_item');

                  return (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                        Assigned Content
                      </h3>

                      {assignments.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No content assigned yet.</p>
                      ) : (
                        <div className="space-y-4">
                          {courseAssignments.length > 0 && (
                            <div>
                              <h4 className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-2">
                                <BookOpen size={14} />
                                Courses ({courseAssignments.length})
                              </h4>
                              <div className="space-y-1">
                                {courseAssignments.map((assignment, idx) => (
                                  <div key={idx} className="text-sm text-black bg-white rounded px-3 py-2 border border-gray-200">
                                    {assignment.content_title}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {podcastAssignments.length > 0 && (
                            <div>
                              <h4 className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-2">
                                <Headphones size={14} />
                                Podcasts ({podcastAssignments.length})
                              </h4>
                              <div className="space-y-1">
                                {podcastAssignments.map((assignment, idx) => (
                                  <div key={idx} className="text-sm text-black bg-white rounded px-3 py-2 border border-gray-200">
                                    {assignment.content_title}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {contentAssignments.length > 0 && (
                            <div>
                              <h4 className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-2">
                                <FileText size={14} />
                                Learning Content ({contentAssignments.length})
                              </h4>
                              <div className="space-y-1">
                                {contentAssignments.map((assignment, idx) => (
                                  <div key={idx} className="text-sm text-black bg-white rounded px-3 py-2 border border-gray-200">
                                    {assignment.content_title}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              <div className="mt-6">
                <button
                  onClick={() => {
                    setShowCaseDetails(false);
                    setSelectedCase(null);
                    setSelectedCaseClient(null);
                  }}
                  className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
