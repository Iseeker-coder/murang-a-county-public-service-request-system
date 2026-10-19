import React from 'react';
import {
  PhoneCall,
  Mail,
  Shield,
  User,
  LogOut,
  Send,
  Search,
  BarChart3,
  Home,
  CheckCircle2,
  FolderOpen,
} from 'lucide-react';
import { CitizenUser, AdminUser } from '../types';
import { MurangaEmblem } from './MurangaEmblem';

interface CountyHeaderProps {
  activeView: 'home' | 'submit' | 'track' | 'admin' | 'analytics' | 'my-requests';
  setActiveView: (view: 'home' | 'submit' | 'track' | 'admin' | 'analytics' | 'my-requests') => void;
  citizenUser: CitizenUser | null;
  adminUser: AdminUser | null;
  onOpenCitizenAuth: (mode?: 'login' | 'register', reason?: string) => void;
  onCitizenLogout: () => void;
  onOpenSubmitModal: () => void;
  citizenRequestsCount?: number;
}

export const CountyHeader: React.FC<CountyHeaderProps> = ({
  activeView,
  setActiveView,
  citizenUser,
  adminUser,
  onOpenCitizenAuth,
  onCitizenLogout,
  onOpenSubmitModal,
  citizenRequestsCount = 0,
}) => {
  const handleSubmitClick = () => {
    if (!citizenUser) {
      onOpenCitizenAuth(
        'login',
        'Citizen Authentication Required: Under Murang\'a County regulations, citizens must log in with their National ID to file an official public service docket to prevent spam and verify jurisdiction.'
      );
    } else {
      onOpenSubmitModal();
    }
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* 1. Official County Top Emergency & Hotline Strip (as seen in muranga.go.ke) */}
      <div className="bg-[#007A3D] text-white text-[11px] font-medium py-1.5 px-4 md:px-8 flex flex-wrap items-center justify-between gap-3 border-b border-emerald-900">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <PhoneCall className="w-3 h-3 text-emerald-200" />
            <span>Ambulance Hotline:</span>
            <a href="tel:+254716017296" className="font-bold hover:underline">
              +254 716 017 296
            </a>
          </div>

          <span className="hidden sm:inline text-emerald-300/60">|</span>

          <div className="flex items-center gap-1.5">
            <PhoneCall className="w-3 h-3 text-emerald-200" />
            <span>Call Centre:</span>
            <a href="tel:+254757562988" className="font-bold hover:underline">
              +254 757 562 988
            </a>
          </div>

          <span className="hidden md:inline text-emerald-300/60">|</span>

          <div className="hidden md:flex items-center gap-1.5">
            <Mail className="w-3 h-3 text-emerald-200" />
            <a href="mailto:info@muranga.go.ke" className="hover:underline">
              info@muranga.go.ke
            </a>
          </div>
        </div>

        {/* eCitizen Unified Portal Badge */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-600/40 font-semibold tracking-wide uppercase">
            021 - Murang'a County · eCitizen Verified Access
          </span>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        {/* Murang'a County Government Brand */}
        <button
          onClick={() => setActiveView('home')}
          className="text-left cursor-pointer hover:opacity-95 transition-opacity"
        >
          <MurangaEmblem size="md" />
        </button>

        {/* Middle Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-700">
          <button
            onClick={() => setActiveView('home')}
            className={`py-1 transition-colors whitespace-nowrap cursor-pointer ${
              activeView === 'home'
                ? 'text-emerald-800 font-bold border-b-2 border-emerald-700'
                : 'hover:text-emerald-800'
            }`}
          >
            County Portal
          </button>

          {/* Citizen My Requests Tab - Visible when logged in */}
          {citizenUser && (
            <button
              onClick={() => setActiveView('my-requests')}
              className={`py-1 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeView === 'my-requests'
                  ? 'text-emerald-800 font-bold border-b-2 border-emerald-700'
                  : 'hover:text-emerald-800'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5 text-emerald-700" />
              <span>My Requests</span>
              <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {citizenRequestsCount}
              </span>
            </button>
          )}

          <button
            onClick={() => setActiveView('track')}
            className={`py-1 transition-colors whitespace-nowrap cursor-pointer ${
              activeView === 'track'
                ? 'text-emerald-800 font-bold border-b-2 border-emerald-700'
                : 'hover:text-emerald-800'
            }`}
          >
            Track Status
          </button>

          <button
            onClick={() => setActiveView('admin')}
            className={`py-1 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              activeView === 'admin'
                ? 'text-emerald-800 font-bold border-b-2 border-emerald-700'
                : 'hover:text-emerald-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Service Desk Admin</span>
          </button>

          <button
            onClick={() => setActiveView('analytics')}
            className={`py-1 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              activeView === 'analytics'
                ? 'text-emerald-800 font-bold border-b-2 border-emerald-700'
                : 'hover:text-emerald-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </button>
        </nav>

        {/* Right CTA / Session Area */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Submit Request CTA with Auth Guard */}
          <button
            onClick={handleSubmitClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Submit Service Request</span>
            <span className="sm:hidden">Submit</span>
          </button>

          {/* Citizen Account state */}
          {citizenUser ? (
            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <div
                onClick={() => setActiveView('my-requests')}
                className="text-right hidden sm:block cursor-pointer hover:opacity-80"
              >
                <span className="text-xs font-bold text-slate-800 block line-clamp-1">
                  {citizenUser.fullName}
                </span>
                <span className="text-[10px] text-emerald-800 font-semibold block">
                  ID: {citizenUser.nationalId} · {citizenUser.subCounty}
                </span>
              </div>
              <button
                onClick={onCitizenLogout}
                title="Sign out citizen"
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenCitizenAuth('login')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-800 border border-slate-300 hover:border-emerald-600 rounded-lg transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">eCitizen Sign In</span>
              <span className="sm:hidden">Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav strip */}
      <div className="lg:hidden border-t border-slate-200 bg-slate-50 px-4 py-2 flex items-center justify-around text-xs font-semibold overflow-x-auto gap-2">
        <button
          onClick={() => setActiveView('home')}
          className={`px-2 py-1 rounded cursor-pointer whitespace-nowrap ${
            activeView === 'home' ? 'bg-emerald-800 text-white' : 'text-slate-600'
          }`}
        >
          County
        </button>
        {citizenUser && (
          <button
            onClick={() => setActiveView('my-requests')}
            className={`px-2 py-1 rounded cursor-pointer whitespace-nowrap ${
              activeView === 'my-requests' ? 'bg-emerald-800 text-white' : 'text-slate-600'
            }`}
          >
            My Requests ({citizenRequestsCount})
          </button>
        )}
        <button
          onClick={() => setActiveView('track')}
          className={`px-2 py-1 rounded cursor-pointer whitespace-nowrap ${
            activeView === 'track' ? 'bg-emerald-800 text-white' : 'text-slate-600'
          }`}
        >
          Track
        </button>
        <button
          onClick={() => setActiveView('admin')}
          className={`px-2 py-1 rounded cursor-pointer whitespace-nowrap ${
            activeView === 'admin' ? 'bg-emerald-800 text-white' : 'text-slate-600'
          }`}
        >
          Desk Admin
        </button>
        <button
          onClick={() => setActiveView('analytics')}
          className={`px-2 py-1 rounded cursor-pointer whitespace-nowrap ${
            activeView === 'analytics' ? 'bg-emerald-800 text-white' : 'text-slate-600'
          }`}
        >
          Analytics
        </button>
      </div>
    </header>
  );
};
