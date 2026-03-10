import { useState, useEffect } from 'react';
import { Building2, Users, TrendingUp, Calendar, Eye, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

type LawFirm = {
  id: string;
  name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  admin_code: string;
  subscription_plan: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  client_accounts_total: number;
  client_accounts_this_month: number;
  total_cases: number;
  open_cases: number;
  closed_cases: number;
  new_cases_this_month: number;
};

type AdminProfile = {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
};

export default function OperationsDashboard() {
  const [lawFirms, setLawFirms] = useState<LawFirm[]>([]);
  const [selectedFirm, setSelectedFirm] = useState<LawFirm | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [firmToDelete, setFirmToDelete] = useState<LawFirm | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch law firms
      const { data: firmsData } = await supabase
        .from('law_firms')
        .select('*');

      if (firmsData) {
        const firmsWithCounts = await Promise.all(
          firmsData.map(async (firm) => {
            const now = new Date();
            const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));

            const [clientsTotal, clientsMonth, casesData, casesThisMonth] = await Promise.all([
              supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('law_firm_id', firm.id)
                .eq('user_type', 'client'),
              supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('law_firm_id', firm.id)
                .eq('user_type', 'client')
                .gte('created_at', startOfMonth.toISOString()),
              supabase
                .from('cases')
                .select('id, status, created_at')
                .eq('law_firm_id', firm.id),
              supabase
                .from('cases')
                .select('*', { count: 'exact', head: true })
                .eq('law_firm_id', firm.id)
                .gte('created_at', startOfMonth.toISOString())
            ]);

            const totalCases = casesData.data?.length || 0;
            const openCases = casesData.data?.filter(c => c.status === 'open').length || 0;
            const closedCases = casesData.data?.filter(c => c.status === 'closed').length || 0;
            const newCasesThisMonth = casesThisMonth.count || 0;

            return {
              ...firm,
              client_accounts_total: clientsTotal.count || 0,
              client_accounts_this_month: clientsMonth.count || 0,
              total_cases: totalCases,
              open_cases: openCases,
              closed_cases: closedCases,
              new_cases_this_month: newCasesThisMonth,
            };
          })
        );

        setLawFirms(firmsWithCounts);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
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
      fetchDashboardData();
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

  const totalStats = {
    totalFirms: lawFirms.length,
    activeFirms: lawFirms.filter(f => f.status === 'active').length,
    totalClientAccounts: lawFirms.reduce((sum, f) => sum + f.client_accounts_total, 0),
    clientAccountsThisMonth: lawFirms.reduce((sum, f) => sum + f.client_accounts_this_month, 0),
    newCasesThisMonth: lawFirms.reduce((sum, f) => sum + f.new_cases_this_month, 0),
    totalCases: lawFirms.reduce((sum, f) => sum + f.total_cases, 0),
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading operations dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Operations Dashboard</h1>
          <p className="text-gray-600">Manage law firms and track platform growth</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Law Firms</span>
              <Building2 className="text-black" size={24} />
            </div>
            <div className="text-3xl font-bold text-black">{totalStats.totalFirms}</div>
            <div className="text-sm text-gray-600 mt-1">
              {totalStats.activeFirms} active
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">New Cases (This Month)</span>
              <TrendingUp className="text-black" size={24} />
            </div>
            <div className="text-3xl font-bold text-black">{totalStats.newCasesThisMonth}</div>
            <div className="text-sm text-gray-600 mt-1">This month</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Avg Cases/Firm</span>
              <Calendar className="text-black" size={24} />
            </div>
            <div className="text-3xl font-bold text-black">
              {totalStats.totalFirms > 0 ? Math.round(totalStats.totalCases / totalStats.totalFirms) : 0}
            </div>
            <div className="text-sm text-gray-500 mt-1">Per firm</div>
          </div>
        </div>

        {/* Cases Analytics */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-bold text-black mb-6">Cases Analytics by Law Firm</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-black mb-4">Open Cases per Law Firm</h3>
              <div className="space-y-4">
                {lawFirms.map((firm) => {
                  const maxCases = Math.max(...lawFirms.map(f => f.open_cases), 1);
                  const percentage = (firm.open_cases / maxCases) * 100;
                  return (
                    <div key={firm.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-black">{firm.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">
                            {firm.open_cases} open
                          </span>
                          <span className="text-sm font-semibold text-black">
                            {firm.total_cases} total
                          </span>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                          <div
                            className="bg-black h-8 rounded-full flex items-center justify-end pr-3 transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          >
                            {firm.open_cases > 0 && (
                              <span className="text-white text-xs font-medium">{firm.open_cases}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-black mb-4">Case Status Overview</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Total Cases</div>
                <div className="text-3xl font-bold text-black">
                  {lawFirms.reduce((sum, f) => sum + f.total_cases, 0)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Across all firms</div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Modal */}
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
                      Admin Account Information
                    </h3>

                    {adminProfile ? (
                      <>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Admin Full Name</label>
                          <p className="text-lg text-black mt-1">{adminProfile.full_name}</p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-600">Admin Email</label>
                          <p className="text-lg text-black mt-1">{adminProfile.email}</p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-600">Admin Password</label>
                          <p className="text-lg font-mono bg-white px-3 py-2 rounded border border-gray-300 text-black mt-1">
                            password123
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Default password for test accounts. Admin should change this after first login.
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
                      <TrendingUp className="w-6 h-6 text-black" />
                      Statistics
                    </h3>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Client Accounts</span>
                        <span className="text-2xl font-bold text-black">
                          {selectedFirm.client_accounts_total}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">New This Month</span>
                        <span className="text-2xl font-bold text-black">
                          {selectedFirm.client_accounts_this_month}
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