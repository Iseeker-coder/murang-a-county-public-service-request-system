import React, { useState } from 'react';
import {
  X,
  Lock,
  User,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { CitizenUser } from '../types';
import { MURANGA_SUB_COUNTIES } from '../data/murangaData';
import { MurangaOfficialCrest } from './MurangaOfficialCrest';

interface CitizenAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: CitizenUser) => void;
  initialMode?: 'login' | 'register';
  authReason?: string | null;
}

export const CitizenAuthModal: React.FC<CitizenAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
  authReason = null,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('29837124');
  const [loginPassword, setLoginPassword] = useState('Citizen2026!');

  // Register form state
  const [regNationalId, setRegNationalId] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('+254 7');
  const [regSubCounty, setRegSubCounty] = useState('Kiharu');
  const [regWard, setRegWard] = useState('Murang\'a Township');
  const [regPassword, setRegPassword] = useState('Citizen2026!');

  if (!isOpen) return null;

  const currentWards = MURANGA_SUB_COUNTIES.find((s) => s.name === regSubCounty)?.wards || [];

  const handleSubCountyChange = (scName: string) => {
    setRegSubCounty(scName);
    const wards = MURANGA_SUB_COUNTIES.find((s) => s.name === scName)?.wards || [];
    if (wards.length > 0) {
      setRegWard(wards[0]);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: loginIdentifier, password: loginPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to login.');
      }

      onLoginSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nationalId: regNationalId,
          fullName: regFullName,
          email: regEmail,
          phone: regPhone,
          subCounty: regSubCounty,
          ward: regWard,
          password: regPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      onLoginSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Registration error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickCitizen = () => {
    setLoginIdentifier('29837124');
    setLoginPassword('Citizen2026!');
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="citizen-auth-heading"
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Close Button Top Right */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Official Murang'a County Crest Header (Using uploaded logo3.webp single crest) */}
        <div className="pt-7 pb-4 px-6 text-center border-b border-slate-100 bg-linear-to-b from-emerald-50/50 to-white flex flex-col items-center">
          <div className="mb-2">
            <MurangaOfficialCrest size="md" />
          </div>
          <h2 className="text-xl font-extrabold uppercase text-emerald-950 tracking-tight font-display">
            Murang'a County Government
          </h2>
          <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            Public Service Request System
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            eCitizen Kenya Integrated Gateway · County Code: 021
          </p>
        </div>

        <div className="p-6">
          {/* Abuse Prevention Notice when triggered by Submit action */}
          {authReason && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-amber-950 font-semibold">
                  Citizen Authentication Required
                </strong>
                <span>{authReason}</span>
              </div>
            </div>
          )}

          <div className="text-center mb-5">
            <h3 id="citizen-auth-heading" className="text-lg font-bold text-slate-900 font-display">
              {mode === 'login' ? 'Sign In with National ID' : 'Register Citizen Account'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {mode === 'login'
                ? 'Enter your Kenyan credentials to file and manage service requests'
                : 'Create your authenticated profile for Murang\'a County e-Services'}
            </p>
          </div>

          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-700"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4" noValidate>
              <div>
                <label htmlFor="login-identifier" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Kenyan National ID Number or Email *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                  <input
                    id="login-identifier"
                    name="identifier"
                    type="text"
                    required
                    autoComplete="username"
                    placeholder="e.g. 29837124 or citizen@gmail.com"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-900"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="login-password" className="text-xs font-semibold text-slate-700">Password *</label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset SMS link will be sent to your registered Safaricom/Airtel phone number.')}
                    className="text-xs text-emerald-700 hover:underline cursor-pointer bg-transparent p-0"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                  <input
                    id="login-password"
                    name="password"
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((v) => !v)}
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showLoginPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showLoginPassword ? (
                      <EyeOff className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <Eye className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? 'Authenticating Citizen...' : 'Sign In to Access Services'}
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick Fill Test Account */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={fillQuickCitizen}
                  className="text-xs text-slate-500 hover:text-emerald-700 inline-flex items-center gap-1 font-medium underline cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Autofill Sample Citizen (Kamau Njoroge - Kiharu)
                </button>
              </div>

              <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-600">
                New Murang'a resident without an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-emerald-800 hover:underline cursor-pointer"
                >
                  Register here
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3" noValidate aria-label="Citizen registration form">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reg-national-id" className="block text-xs font-semibold text-slate-700 mb-1">
                    National ID No. *
                  </label>
                  <input
                    id="reg-national-id"
                    name="nationalId"
                    type="text"
                    required
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="e.g. 34190822"
                    value={regNationalId}
                    onChange={(e) => setRegNationalId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="reg-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                    Safaricom/Airtel Tel *
                  </label>
                  <input
                    id="reg-phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="+254 7..."
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-full-name" className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name (As on Kenyan ID) *
                </label>
                <input
                  id="reg-full-name"
                  name="fullName"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="e.g. Mary Wanjiru Kariuki"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reg-sub-county" className="block text-xs font-semibold text-slate-700 mb-1">
                    Sub-County *
                  </label>
                  <select
                    id="reg-sub-county"
                    name="subCounty"
                    value={regSubCounty}
                    onChange={(e) => handleSubCountyChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  >
                    {MURANGA_SUB_COUNTIES.map((sc) => (
                      <option key={sc.name} value={sc.name}>
                        {sc.name} Sub-County
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="reg-ward" className="block text-xs font-semibold text-slate-700 mb-1">
                    Ward *
                  </label>
                  <select
                    id="reg-ward"
                    name="ward"
                    value={regWard}
                    onChange={(e) => setRegWard(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  >
                    {currentWards.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="reg-password" className="block text-xs font-semibold text-slate-700 mb-1">
                  Create Password *
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    name="newPassword"
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    aria-describedby="reg-password-hint"
                    placeholder="At least 6 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-9 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword((v) => !v)}
                    aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showRegPassword}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showRegPassword ? (
                      <EyeOff className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <Eye className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
                <p id="reg-password-hint" className="mt-1 text-[11px] text-slate-500">
                  Must be at least 6 characters.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 mt-3 cursor-pointer"
              >
                {loading ? 'Registering Citizen...' : 'Register & Continue to Services'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-3 border-t border-slate-200 text-center text-xs text-slate-600">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-emerald-800 hover:underline cursor-pointer"
                >
                  Sign In instead
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
