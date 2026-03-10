import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Building2, Users, FolderOpen, Plus, Trash2, Edit, Eye, Video, Radio } from 'lucide-react';

interface LawFirm {
  id: string;
  name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  subscription_plan: string;
  status: string;
  admin_code: string;
  admin_password: string;
  created_at: string;
}

interface FirmStats {
  firmId: string;
  firmName: string;
  totalCases: number;
  openCases: number;
  totalUsers: number;
  currentMonthCases: number;
  lastMonthCases: number;
}

interface AdminProfile {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
}

interface Livestream {
  id: string;
  title: string;
  description: string;
  stream_url: string;
  scheduled_start: string | null;
  scheduled_end: string | null;
  status: 'scheduled' | 'live' | 'ended';
  created_by: string;
  created_at: string;
  updated_at: string;
  thumbnail_url: string | null;
  viewer_count: number;
}

export default function Court99Dashboard() {
  const [lawFirms, setLawFirms] = useState<LawFirm[]>([]);
  const [stats, setStats] = useState<FirmStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFirm, setSelectedFirm] = useState<LawFirm | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'firms' | 'livestreams'>('firms');
  const [livestreams, setLivestreams] = useState<Livestream[]>([]);
  const [showLivestreamForm, setShowLivestreamForm] = useState(false);
  const [editingLivestream, setEditingLivestream] = useState<Livestream | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [firmToDelete, setFirmToDelete] = useState<LawFirm | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [newFirm, setNewFirm] = useState({
    name: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    subscription_plan: 'starter',
    admin_code: '',
    admin_email: '',
    admin_password: '',
    admin_full_name: '',
  });
  const [newLivestream, setNewLivestream] = useState({
    title: '',
    description: '',
    stream_url: '',
    scheduled_start: '',
    scheduled_end: '',
    status: 'scheduled' as 'scheduled' | 'live' | 'ended',
    thumbnail_url: '',
  });

  useEffect(() => {
    fetchLawFirms();
    fetchLivestreams();
  }, []);

  const fetchLawFirms = async () => {
    try {
      const { data: firms, error } = await supabase
        .from('law_firms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setLawFirms(firms || []);
      await fetchStats(firms || []);
    } catch (error) {
      console.error('Error fetching law firms:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (firms: LawFirm[]) => {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();

    const statsPromises = firms.map(async (firm) => {
      const [casesResult, usersResult, currentMonthResult, lastMonthResult] = await Promise.all([
        supabase
          .from('cases')
          .select('id, status', { count: 'exact' })
          .eq('law_firm_id', firm.id),
        supabase
          .from('profiles')
          .select('id', { count: 'exact' })
          .eq('law_firm_id', firm.id),
        supabase
          .from('cases')
          .select('id', { count: 'exact' })
          .eq('law_firm_id', firm.id)
          .gte('created_at', currentMonthStart)
          .lte('created_at', currentMonthEnd),
        supabase
          .from('cases')
          .select('id', { count: 'exact' })
          .eq('law_firm_id', firm.id)
          .gte('created_at', lastMonthStart)
          .lte('created_at', lastMonthEnd),
      ]);

      const openCases = casesResult.data?.filter((c) => c.status === 'open').length || 0;

      return {
        firmId: firm.id,
        firmName: firm.name,
        totalCases: casesResult.data?.length || 0,
        openCases,
        totalUsers: usersResult.data?.length || 0,
        currentMonthCases: currentMonthResult.data?.length || 0,
        lastMonthCases: lastMonthResult.data?.length || 0,
      };
    });

    const firmStats = await Promise.all(statsPromises);
    setStats(firmStats);
  };

  const handleAddFirm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: firmData, error: firmError } = await supabase.from('law_firms').insert([
        {
          name: newFirm.name,
          contact_email: newFirm.contact_email,
          contact_phone: newFirm.contact_phone,
          address: newFirm.address,
          subscription_plan: newFirm.subscription_plan,
          admin_code: newFirm.admin_code,
          admin_password: newFirm.admin_password,
          status: 'active',
        },
      ]).select().single();

      if (firmError) {
        console.error('Error details:', firmError);
        alert(`Error adding law firm: ${firmError.message}`);
        return;
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newFirm.admin_email,
        password: newFirm.admin_password,
      });

      if (authError) {
        await supabase.from('law_firms').delete().eq('id', firmData.id);
        alert(`Error creating admin account: ${authError.message}`);
        return;
      }

      if (authData.user) {
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            id: authData.user.id,
            full_name: newFirm.admin_full_name,
            email: newFirm.admin_email,
            user_type: 'admin',
            law_firm_id: firmData.id,
          },
        ]);

        if (profileError) {
          await supabase.from('law_firms').delete().eq('id', firmData.id);
          alert(`Error creating admin profile: ${profileError.message}`);
          return;
        }
      }

      setShowAddForm(false);
      setNewFirm({
        name: '',
        contact_email: '',
        contact_phone: '',
        address: '',
        subscription_plan: 'starter',
        admin_code: '',
        admin_email: '',
        admin_password: '',
        admin_full_name: '',
      });
      fetchLawFirms();
      alert('Law firm and admin account created successfully!');
    } catch (error) {
      console.error('Error adding law firm:', error);
      alert(`Error adding law firm: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteFirm = (firm: LawFirm) => {
    setFirmToDelete(firm);
    setDeleteConfirmText('');
    setShowDeleteConfirm(true);
  };

  const confirmDeleteFirm = async () => {
    if (!firmToDelete || deleteConfirmText !== 'DELETE') {
      return;
    }

    try {
      const { error } = await supabase.from('law_firms').delete().eq('id', firmToDelete.id);

      if (error) throw error;

      setShowDeleteConfirm(false);
      setFirmToDelete(null);
      setDeleteConfirmText('');
      fetchLawFirms();
      alert('Law firm deleted successfully');
    } catch (error) {
      console.error('Error deleting law firm:', error);
      alert('Error deleting law firm. Please try again.');
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setFirmToDelete(null);
    setDeleteConfirmText('');
  };

  const getFirmStats = (firmId: string) => {
    return stats.find((s) => s.firmId === firmId);
  };

  const handleViewDetails = async (firm: LawFirm) => {
    setSelectedFirm(firm);
    setAdminProfile(null);
    setShowDetailsModal(true);

    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email, created_at')
        .eq('law_firm_id', firm.id)
        .eq('user_type', 'admin')
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching admin profile:', profileError);
        setAdminProfile({
          id: '',
          full_name: 'Error loading',
          email: 'Unable to fetch',
          created_at: new Date().toISOString(),
        });
        return;
      }

      if (profileData) {
        setAdminProfile({
          id: profileData.id,
          full_name: profileData.full_name,
          email: profileData.email || 'N/A',
          created_at: profileData.created_at,
        });
      } else {
        setAdminProfile({
          id: '',
          full_name: 'No admin found',
          email: 'N/A',
          created_at: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error fetching admin details:', error);
      setAdminProfile({
        id: '',
        full_name: 'Error loading',
        email: 'Unable to fetch',
        created_at: new Date().toISOString(),
      });
    }
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedFirm(null);
    setAdminProfile(null);
  };

  const fetchLivestreams = async () => {
    try {
      const { data, error } = await supabase
        .from('livestreams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLivestreams(data || []);
    } catch (error) {
      console.error('Error fetching livestreams:', error);
    }
  };

  const handleAddLivestream = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase.from('livestreams').insert([
        {
          title: newLivestream.title,
          description: newLivestream.description,
          stream_url: newLivestream.stream_url,
          scheduled_start: newLivestream.scheduled_start || null,
          scheduled_end: newLivestream.scheduled_end || null,
          status: newLivestream.status,
          thumbnail_url: newLivestream.thumbnail_url || null,
          created_by: user.id,
        },
      ]);

      if (error) throw error;

      setShowLivestreamForm(false);
      setNewLivestream({
        title: '',
        description: '',
        stream_url: '',
        scheduled_start: '',
        scheduled_end: '',
        status: 'scheduled',
        thumbnail_url: '',
      });
      fetchLivestreams();
      alert('Livestream created successfully!');
    } catch (error) {
      console.error('Error adding livestream:', error);
      alert(`Error adding livestream: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleUpdateLivestream = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLivestream) return;

    try {
      const { error } = await supabase
        .from('livestreams')
        .update({
          title: newLivestream.title,
          description: newLivestream.description,
          stream_url: newLivestream.stream_url,
          scheduled_start: newLivestream.scheduled_start || null,
          scheduled_end: newLivestream.scheduled_end || null,
          status: newLivestream.status,
          thumbnail_url: newLivestream.thumbnail_url || null,
        })
        .eq('id', editingLivestream.id);

      if (error) throw error;

      setShowLivestreamForm(false);
      setEditingLivestream(null);
      setNewLivestream({
        title: '',
        description: '',
        stream_url: '',
        scheduled_start: '',
        scheduled_end: '',
        status: 'scheduled',
        thumbnail_url: '',
      });
      fetchLivestreams();
      alert('Livestream updated successfully!');
    } catch (error) {
      console.error('Error updating livestream:', error);
      alert(`Error updating livestream: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteLivestream = async (id: string) => {
    if (!confirm('Are you sure you want to delete this livestream?')) return;

    try {
      const { error } = await supabase.from('livestreams').delete().eq('id', id);
      if (error) throw error;
      fetchLivestreams();
    } catch (error) {
      console.error('Error deleting livestream:', error);
    }
  };

  const handleEditLivestream = (livestream: Livestream) => {
    setEditingLivestream(livestream);
    setNewLivestream({
      title: livestream.title,
      description: livestream.description,
      stream_url: livestream.stream_url,
      scheduled_start: livestream.scheduled_start || '',
      scheduled_end: livestream.scheduled_end || '',
      status: livestream.status,
      thumbnail_url: livestream.thumbnail_url || '',
    });
    setShowLivestreamForm(true);
  };

  const closeLivestreamForm = () => {
    setShowLivestreamForm(false);
    setEditingLivestream(null);
    setNewLivestream({
      title: '',
      description: '',
      stream_url: '',
      scheduled_start: '',
      scheduled_end: '',
      status: 'scheduled',
      thumbnail_url: '',
    });
  };

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">Court99 Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage law firms and monitor platform activity</p>
          </div>
          <button
            onClick={() => activeTab === 'firms' ? setShowAddForm(true) : setShowLivestreamForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-5 h-5" />
            {activeTab === 'firms' ? 'Add Law Firm' : 'Add Livestream'}
          </button>
        </div>

        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('firms')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'firms'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Law Firms
            </div>
          </button>
          <button
            onClick={() => setActiveTab('livestreams')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'livestreams'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              Livestreams
            </div>
          </button>
        </div>

        {activeTab === 'firms' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Building2 className="w-6 h-6 text-black" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Law Firms</p>
                  <p className="text-2xl font-bold text-black">{lawFirms.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <FolderOpen className="w-6 h-6 text-black" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Cases</p>
                  <p className="text-2xl font-bold text-black">
                    {stats.reduce((sum, s) => sum + s.totalCases, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'livestreams' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Video className="w-6 h-6 text-black" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Livestreams</p>
                  <p className="text-2xl font-bold text-black">{livestreams.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Radio className="w-6 h-6 text-black" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Live Now</p>
                  <p className="text-2xl font-bold text-black">
                    {livestreams.filter(l => l.status === 'live').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Users className="w-6 h-6 text-black" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Viewers</p>
                  <p className="text-2xl font-bold text-black">
                    {livestreams.reduce((sum, l) => sum + l.viewer_count, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDetailsModal && selectedFirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-black">{selectedFirm.name}</h2>
                  <span
                    className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full ${
                      selectedFirm.status === 'active'
                        ? 'bg-gray-100 text-black'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {selectedFirm.status.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={closeDetailsModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-black mb-4 flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-black" />
                    Law Firm Details
                  </h3>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Firm Name</label>
                    <p className="text-lg text-black mt-1">{selectedFirm.name}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Contact Email</label>
                    <p className="text-lg text-black mt-1">{selectedFirm.contact_email}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Contact Phone</label>
                    <p className="text-lg text-black mt-1">{selectedFirm.contact_phone}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Address</label>
                    <p className="text-lg text-black mt-1">{selectedFirm.address}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Subscription Plan</label>
                    <p className="text-lg text-black mt-1 capitalize">{selectedFirm.subscription_plan}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Admin Code</label>
                    <p className="text-lg font-mono bg-white px-3 py-2 rounded border border-gray-300 text-black mt-1">
                      {selectedFirm.admin_code}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Created At</label>
                    <p className="text-lg text-black mt-1">
                      {new Date(selectedFirm.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                    <h3 className="text-xl font-semibold text-black mb-4 flex items-center gap-2">
                      <Users className="w-6 h-6 text-black" />
                      Admin Account
                    </h3>

                    {adminProfile ? (
                      <>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Full Name</label>
                          <p className="text-lg text-black mt-1">{adminProfile.full_name}</p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-600">Email (Username)</label>
                          <p className="text-lg text-black mt-1">{adminProfile.email}</p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-600">Password</label>
                          <p className="text-lg font-mono bg-white px-3 py-2 rounded border border-gray-300 text-black mt-1">
                            {selectedFirm.admin_password || 'password123'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Admin should change this password after first login.
                          </p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-600">Admin Code</label>
                          <p className="text-lg font-mono bg-white px-3 py-2 rounded border border-gray-300 text-black mt-1">
                            {selectedFirm.admin_code}
                          </p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-600">Account Created</label>
                          <p className="text-lg text-black mt-1">
                            {new Date(adminProfile.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
                        <p className="text-sm text-gray-600 mt-2">Loading admin details...</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-black mb-4 flex items-center gap-2">
                      <FolderOpen className="w-6 h-6 text-black" />
                      Statistics
                    </h3>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Cases</span>
                        <span className="text-2xl font-bold text-black">
                          {getFirmStats(selectedFirm.id)?.totalCases || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Open Cases</span>
                        <span className="text-2xl font-bold text-black">
                          {getFirmStats(selectedFirm.id)?.openCases || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Users</span>
                        <span className="text-2xl font-bold text-black">
                          {getFirmStats(selectedFirm.id)?.totalUsers || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={closeDetailsModal}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showLivestreamForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-black mb-6">
                {editingLivestream ? 'Edit Livestream' : 'Add New Livestream'}
              </h2>
              <form onSubmit={editingLivestream ? handleUpdateLivestream : handleAddLivestream} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newLivestream.title}
                    onChange={(e) => setNewLivestream({ ...newLivestream, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Courtroom Basics Livestream"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    value={newLivestream.description}
                    onChange={(e) => setNewLivestream({ ...newLivestream, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    rows={4}
                    placeholder="Learn the basics of courtroom procedures..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stream URL or Embed Code
                  </label>
                  <textarea
                    required
                    value={newLivestream.stream_url}
                    onChange={(e) => setNewLivestream({ ...newLivestream, stream_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    rows={3}
                    placeholder="https://youtube.com/embed/... or <iframe>..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Paste a YouTube/Vimeo URL or embed code
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    value={newLivestream.thumbnail_url}
                    onChange={(e) => setNewLivestream({ ...newLivestream, thumbnail_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scheduled Start
                    </label>
                    <input
                      type="datetime-local"
                      value={newLivestream.scheduled_start}
                      onChange={(e) => setNewLivestream({ ...newLivestream, scheduled_start: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scheduled End
                    </label>
                    <input
                      type="datetime-local"
                      value={newLivestream.scheduled_end}
                      onChange={(e) => setNewLivestream({ ...newLivestream, scheduled_end: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={newLivestream.status}
                    onChange={(e) => setNewLivestream({ ...newLivestream, status: e.target.value as 'scheduled' | 'live' | 'ended' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="live">Live</option>
                    <option value="ended">Ended</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    {editingLivestream ? 'Update Livestream' : 'Add Livestream'}
                  </button>
                  <button
                    type="button"
                    onClick={closeLivestreamForm}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-black mb-6">Add New Law Firm</h2>
              <form onSubmit={handleAddFirm} className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-black mb-3">Law Firm Information</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Firm Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newFirm.name}
                      onChange={(e) => setNewFirm({ ...newFirm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Smith & Associates Law Firm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      required
                      value={newFirm.contact_email}
                      onChange={(e) => setNewFirm({ ...newFirm, contact_email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="info@smithlaw.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={newFirm.contact_phone}
                      onChange={(e) => setNewFirm({ ...newFirm, contact_phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      required
                      value={newFirm.address}
                      onChange={(e) => setNewFirm({ ...newFirm, address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      rows={3}
                      placeholder="123 Main Street, Suite 100, City, State 12345"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subscription Plan
                    </label>
                    <select
                      value={newFirm.subscription_plan}
                      onChange={(e) => setNewFirm({ ...newFirm, subscription_plan: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="starter">Starter</option>
                      <option value="professional">Professional</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Code
                    </label>
                    <input
                      type="text"
                      required
                      value={newFirm.admin_code}
                      onChange={(e) => setNewFirm({ ...newFirm, admin_code: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="e.g., FIRM2024"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This code will be used by the admin to verify their access
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-black mb-3">Admin Account Information</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newFirm.admin_full_name}
                      onChange={(e) => setNewFirm({ ...newFirm, admin_full_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      required
                      value={newFirm.admin_email}
                      onChange={(e) => setNewFirm({ ...newFirm, admin_email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="john.smith@smithlaw.com"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This will be used to log into the admin dashboard
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Password
                    </label>
                    <input
                      type="password"
                      required
                      value={newFirm.admin_password}
                      onChange={(e) => setNewFirm({ ...newFirm, admin_password: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Minimum 6 characters"
                      minLength={6}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Admin can change this password after first login
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Add Firm
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'firms' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-black">Law Firms</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Firm Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Cases
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Users
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lawFirms.map((firm) => {
                    const firmStats = getFirmStats(firm.id);
                    return (
                      <tr key={firm.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-black">{firm.name}</div>
                          <div className="text-sm text-gray-500">{firm.subscription_plan}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-black">{firm.contact_email}</div>
                          <div className="text-sm text-gray-500">{firm.contact_phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <span className="font-medium text-black">
                              {firmStats?.totalCases || 0}
                            </span>{' '}
                            total
                          </div>
                          <div className="text-sm text-gray-600">
                            {firmStats?.openCases || 0} open
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            This month: {firmStats?.currentMonthCases || 0} | Last month: {firmStats?.lastMonthCases || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-black">
                          {firmStats?.totalUsers || 0}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              firm.status === 'active'
                                ? 'bg-gray-100 text-black'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {firm.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDetails(firm)}
                              className="text-black hover:text-gray-700"
                              title="View Details"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteFirm(firm)}
                              className="text-gray-600 hover:text-black"
                              title="Delete Firm"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'livestreams' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-black">Livestreams</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Scheduled Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Viewers
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {livestreams.map((livestream) => (
                    <tr key={livestream.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-black">{livestream.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{livestream.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        {livestream.scheduled_start ? (
                          <div className="text-sm">
                            <div className="text-black">
                              {new Date(livestream.scheduled_start).toLocaleDateString()}
                            </div>
                            <div className="text-gray-500">
                              {new Date(livestream.scheduled_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Not scheduled</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            livestream.status === 'live'
                              ? 'bg-red-100 text-red-800'
                              : livestream.status === 'scheduled'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {livestream.status === 'live' && '🔴 '}
                          {livestream.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-black">
                        {livestream.viewer_count}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditLivestream(livestream)}
                            className="text-black hover:text-gray-700"
                            title="Edit Livestream"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteLivestream(livestream.id)}
                            className="text-gray-600 hover:text-black"
                            title="Delete Livestream"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showDeleteConfirm && firmToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">Delete Law Firm</h3>
                <p className="text-gray-600 mb-4">
                  You are about to delete <span className="font-semibold text-black">{firmToDelete.name}</span>
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800 font-medium mb-2">
                  Warning: This action cannot be undone!
                </p>
                <p className="text-sm text-red-700">
                  All data associated with this law firm will be permanently deleted, including:
                </p>
                <ul className="text-sm text-red-700 list-disc list-inside mt-2 space-y-1">
                  <li>All client accounts</li>
                  <li>All cases and case data</li>
                  <li>All progress tracking</li>
                  <li>Admin account access</li>
                </ul>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <span className="font-mono font-bold text-black">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE here"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteFirm}
                  disabled={deleteConfirmText !== 'DELETE'}
                  className={`flex-1 py-3 rounded-lg transition-colors font-medium ${
                    deleteConfirmText === 'DELETE'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
