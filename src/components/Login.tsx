import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Scale } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [loginType, setLoginType] = useState<'admin' | 'client'>('admin');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDebugInfo(null);

    const hasUrl = !!import.meta.env.VITE_SUPABASE_URL;
    const hasAnon = !!import.meta.env.VITE_SUPABASE_ANON_KEY;
    console.log('[LOGIN DEBUG] env check:', { hasUrl, hasAnon });

    if (!hasUrl || !hasAnon) {
      const msg = `Config error: VITE_SUPABASE_URL=${hasUrl}, VITE_SUPABASE_ANON_KEY=${hasAnon}`;
      console.error('[LOGIN DEBUG]', msg);
      setError('Network/config error');
      setDebugInfo(msg);
      setLoading(false);
      return;
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('[LOGIN DEBUG] signIn response:', {
        hasUser: !!data?.user,
        errorMessage: signInError?.message,
        errorStatus: signInError?.status,
        errorName: signInError?.name,
      });

      if (signInError) {
        setDebugInfo(`Auth failed | status=${signInError.status} | ${signInError.name}: ${signInError.message}`);
        throw signInError;
      }

      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', data.user.id)
          .maybeSingle();

        console.log('[LOGIN DEBUG] profile lookup:', {
          userType: profile?.user_type,
          profileError: profileError?.message,
        });

        if (profileError) {
          setDebugInfo(`Profile lookup failed: ${profileError.message}`);
          throw profileError;
        }

        if (profile?.user_type === 'client') {
          if (!caseNumber.trim()) {
            throw new Error('Case number is required for client login');
          }

          const { data: caseData, error: caseError } = await supabase
            .from('cases')
            .select('id')
            .eq('client_id', data.user.id)
            .eq('case_number', caseNumber.trim())
            .maybeSingle();

          console.log('[LOGIN DEBUG] case lookup:', {
            found: !!caseData,
            caseError: caseError?.message,
          });

          if (caseError) {
            setDebugInfo(`Case lookup failed: ${caseError.message}`);
            throw caseError;
          }

          if (!caseData) {
            setDebugInfo('Case number invalid — no matching case for this user');
            throw new Error('Invalid case number for this account');
          }
        } else if (loginType === 'client') {
          setDebugInfo(`Profile user_type="${profile?.user_type}" is not client`);
          throw new Error('This account is not a client account. Please use admin login.');
        }

        onLoginSuccess();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to login';
      setError(msg);
      console.error('[LOGIN DEBUG] caught:', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-xl mb-4">
            <Scale className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-black mb-2 tracking-tight">Court99</h1>
          <p className="text-gray-600">Legal Education Platform</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-black mb-6">Sign In</h2>

          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setLoginType('admin');
                setCaseNumber('');
                setError(null);
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                loginType === 'admin'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Admin/Law Firm
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginType('client');
                setError(null);
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                loginType === 'client'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Client
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-gray-100 border border-gray-300 rounded-lg">
              <p className="text-sm text-black">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
                placeholder="••••••••"
              />
            </div>

            {loginType === 'client' && (
              <div>
                <label htmlFor="caseNumber" className="block text-sm font-medium text-black mb-2">
                  Case Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="caseNumber"
                  type="text"
                  value={caseNumber}
                  onChange={(e) => setCaseNumber(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
                  placeholder="CASE-2024-001"
                />
                <p className="mt-1 text-xs text-gray-600">
                  Your case number was provided by your law firm
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          {debugInfo && (
            <p className="mt-3 text-xs text-gray-400 font-mono break-all">[DEBUG] {debugInfo}</p>
          )}
          {loginType === 'admin' && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-black mb-3 font-medium">Test Accounts:</p>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="font-medium text-black mb-1">Court99 Admin</p>
                  <p>admin@court99.com / Admin123!</p>
                </div>
              </div>
            </div>
          )}

          {loginType === 'client' && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-black font-medium mb-2">Client Login</p>
                <p className="text-xs text-gray-600">
                  Use the email, password, and case number provided by your law firm to access your legal preparation materials.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
