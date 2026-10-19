/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CountyHeader } from './components/CountyHeader';
import { CountyHomeView } from './components/CountyHomeView';
import { TrackRequestView } from './components/TrackRequestView';
import { AdminPortalView } from './components/AdminPortalView';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { CitizenMyRequestsView } from './components/CitizenMyRequestsView';
import { SubmitRequestModal } from './components/SubmitRequestModal';
import { CitizenAuthModal } from './components/CitizenAuthModal';
import { AcknowledgmentSlipModal } from './components/AcknowledgmentSlipModal';
import { ServiceRequest, CitizenUser, AdminUser, RequestCategory } from './types';

export default function App() {
  const [activeView, setActiveView] = useState<
    'home' | 'submit' | 'track' | 'admin' | 'analytics' | 'my-requests'
  >('home');

  // Requests state
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Authentication states
  const [citizenUser, setCitizenUser] = useState<CitizenUser | null>(() => {
    const saved = localStorage.getItem('muranga_citizen_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('muranga_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Modal & Auth Prompt states
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitCategory, setSubmitCategory] = useState<RequestCategory | undefined>(undefined);
  const [isCitizenAuthOpen, setIsCitizenAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authReason, setAuthReason] = useState<string | null>(null);
  const [pendingSubmitAfterLogin, setPendingSubmitAfterLogin] = useState<boolean>(false);

  const [docketRequest, setDocketRequest] = useState<ServiceRequest | null>(null);
  const [trackQuery, setTrackQuery] = useState<string>('');

  // Fetch all requests
  const loadRequests = async () => {
    setLoadingRequests(true);
    try {
      const res = await fetch('/api/requests');
      const data = await res.json();
      setRequests(data.requests || []);
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handlePromptAuth = (
    mode: 'login' | 'register' = 'login',
    reason?: string,
    resumeSubmit: boolean = true
  ) => {
    setAuthMode(mode);
    setAuthReason(
      reason ||
        'Citizen Authentication Required: Under Murang\'a County regulations, citizens must log in with their National ID to file an official public service docket to prevent spam and verify jurisdiction.'
    );
    setPendingSubmitAfterLogin(resumeSubmit);
    setIsCitizenAuthOpen(true);
  };

  const handleCitizenLogin = (user: CitizenUser) => {
    setCitizenUser(user);
    localStorage.setItem('muranga_citizen_user', JSON.stringify(user));

    // If user was attempting to submit a request before login, open the form directly!
    if (pendingSubmitAfterLogin) {
      setPendingSubmitAfterLogin(false);
      setIsSubmitModalOpen(true);
    }
  };

  const handleCitizenLogout = () => {
    setCitizenUser(null);
    localStorage.removeItem('muranga_citizen_user');
    if (activeView === 'my-requests') {
      setActiveView('home');
    }
  };

  const handleAdminLogin = (admin: AdminUser) => {
    setAdminUser(admin);
    localStorage.setItem('muranga_admin_user', JSON.stringify(admin));
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('muranga_admin_user');
  };

  const handleOpenSubmit = (cat?: RequestCategory) => {
    setSubmitCategory(cat);
    if (!citizenUser) {
      handlePromptAuth(
        'login',
        'Citizen Authentication Required: You must sign in or register with your National ID to access the service request submission form.',
        true
      );
    } else {
      setIsSubmitModalOpen(true);
    }
  };

  const handleRequestCreated = (newReq: ServiceRequest) => {
    setRequests((prev) => [newReq, ...prev]);
  };

  const handleTrackRequest = (trackingNumber: string) => {
    setTrackQuery(trackingNumber);
    setActiveView('track');
  };

  // Count of requests belonging to current citizen
  const citizenRequestsCount = citizenUser
    ? requests.filter(
        (r) => r.citizenId === citizenUser.id || r.nationalId === citizenUser.nationalId
      ).length
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-emerald-600 selection:text-white">
      {/* Official Header */}
      <CountyHeader
        activeView={activeView}
        setActiveView={setActiveView}
        citizenUser={citizenUser}
        adminUser={adminUser}
        onOpenCitizenAuth={(mode, reason) => handlePromptAuth(mode || 'login', reason, false)}
        onCitizenLogout={handleCitizenLogout}
        onOpenSubmitModal={() => handleOpenSubmit()}
        citizenRequestsCount={citizenRequestsCount}
      />

      {/* Main View Area */}
      <main className="max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex-1">
        {activeView === 'home' && (
          <CountyHomeView
            requests={requests}
            currentUser={citizenUser}
            onOpenSubmitModal={handleOpenSubmit}
            onTrackRequest={handleTrackRequest}
            onNavigateTab={(tab) => setActiveView(tab)}
            onPromptAuth={(mode, reason) => handlePromptAuth(mode, reason, true)}
          />
        )}

        {activeView === 'my-requests' && citizenUser && (
          <CitizenMyRequestsView
            currentUser={citizenUser}
            requests={requests}
            onOpenSubmitModal={() => handleOpenSubmit()}
            onTrackRequest={handleTrackRequest}
            onViewDocket={(req) => setDocketRequest(req)}
          />
        )}

        {activeView === 'track' && (
          <TrackRequestView
            initialTrackingNumber={trackQuery}
            onViewDocket={(req) => setDocketRequest(req)}
            onNavigateSubmit={() => handleOpenSubmit()}
          />
        )}

        {activeView === 'admin' && (
          <AdminPortalView
            currentAdmin={adminUser}
            onAdminLogin={handleAdminLogin}
            onAdminLogout={handleAdminLogout}
            onViewDocket={(req) => setDocketRequest(req)}
          />
        )}

        {activeView === 'analytics' && <AnalyticsDashboard />}
      </main>

      {/* Submit Request Modal (Guarded: only authenticated citizens can submit) */}
      <SubmitRequestModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        currentUser={citizenUser}
        onRequestCreated={handleRequestCreated}
        onViewDocket={(req) => setDocketRequest(req)}
        onPromptAuth={(mode, reason) => handlePromptAuth(mode, reason, true)}
        initialCategory={submitCategory}
      />

      {/* Citizen eCitizen Auth Modal (Featuring uploaded logo3 single crest) */}
      <CitizenAuthModal
        isOpen={isCitizenAuthOpen}
        onClose={() => {
          setIsCitizenAuthOpen(false);
          setAuthReason(null);
        }}
        onLoginSuccess={handleCitizenLogin}
        initialMode={authMode}
        authReason={authReason}
      />

      {/* Printable Official County Acknowledgment Docket Modal */}
      <AcknowledgmentSlipModal
        isOpen={Boolean(docketRequest)}
        request={docketRequest}
        onClose={() => setDocketRequest(null)}
      />
    </div>
  );
}
