import React, { useState, useEffect } from 'react';
import {
  Shield,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Wrench,
  AlertCircle,
  FileDown,
  RefreshCw,
  LogOut,
  User,
  MapPin,
  Calendar,
  X,
  Save,
  Printer,
  ChevronRight,
  Eye,
  Lock,
  Mail,
} from 'lucide-react';
import { AdminUser, ServiceRequest, RequestStatus, RequestCategory } from '../types';
import { MURANGA_SUB_COUNTIES, CATEGORIES, COUNTY_DEPARTMENTS } from '../data/murangaData';
import { MurangaEmblem } from './MurangaEmblem';
import { MurangaOfficialCrest } from './MurangaOfficialCrest';
import { useEscapeToClose } from '../hooks/useEscapeToClose';

interface AdminPortalViewProps {
  currentAdmin: AdminUser | null;
  onAdminLogin: (admin: AdminUser) => void;
  onAdminLogout: () => void;
  onViewDocket: (req: ServiceRequest) => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  currentAdmin,
  onAdminLogin,
  onAdminLogout,
  onViewDocket,
}) => {
  // Login Form States (Standalone Public Service Request Desk)
  const [adminEmail, setAdminEmail] = useState('requests.admin@muranga.go.ke');
  const [adminPassword, setAdminPassword] = useState('Muranga2026!');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard States
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [subCountyFilter, setSubCountyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Selected Request for Inspection / Action Modal
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [actionStatus, setActionStatus] = useState<RequestStatus>('In Progress');
  const [actionDept, setActionDept] = useState(COUNTY_DEPARTMENTS[0]);
  const [actionOfficer, setActionOfficer] = useState('');
  const [actionNote, setActionNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'All') params.append('status', statusFilter);
      if (categoryFilter !== 'All') params.append('category', categoryFilter);
      if (subCountyFilter !== 'All') params.append('subCounty', subCountyFilter);
      if (search.trim()) params.append('search', search.trim());

      const res = await fetch(`/api/requests?${params.toString()}`);
      const data = await res.json();
      setRequests(data.requests || []);
    } catch (err) {
      console.error('Error fetching admin requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentAdmin) {
      fetchRequests();
    }
  }, [currentAdmin, statusFilter, categoryFilter, subCountyFilter]);

  useEscapeToClose(!!selectedRequest, () => setSelectedRequest(null));

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed.');
      }

      onAdminLogin(data.admin);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed.');
    } finally {
      setLoginLoading(false);
    }
  };

  const openInspector = (req: ServiceRequest) => {
    setSelectedRequest(req);
    setActionStatus(req.status);
    setActionDept(req.assignedDepartment || COUNTY_DEPARTMENTS[0]);
    setActionOfficer(req.assignedOfficer || '');
    setActionNote(req.resolutionNotes || '');
    setUpdateSuccess(false);
  };

  const handleUpdateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/requests/${selectedRequest.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: actionStatus,
          assignedDepartment: actionDept,
          assignedOfficer: actionOfficer,
          officerNote: actionNote,
          actorName: currentAdmin?.fullName || 'Service Desk Officer',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update request.');

      setSelectedRequest(data.request);
      setUpdateSuccess(true);
      fetchRequests();
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Update failed.');
    } finally {
      setUpdating(false);
    }
  };

  const exportCSV = () => {
    if (requests.length === 0) return;
    const headers = [
      'Tracking Number',
      'Title',
      'Category',
      'Sub-County',
      'Ward',
      'Priority',
      'Status',
      'Citizen Name',
      'National ID',
      'Phone',
      'Assigned Dept',
      'Created At',
    ];

    const rows = requests.map((r) => [
      r.trackingNumber,
      `"${r.title.replace(/"/g, '""')}"`,
      r.category,
      r.subCounty,
      r.ward,
      r.priority,
      r.status,
      `"${(r.citizenName || '').replace(/"/g, '""')}"`,
      r.nationalId || '',
      r.citizenPhone || '',
      `"${(r.assignedDepartment || '').replace(/"/g, '""')}"`,
      r.createdAt,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Muranga_County_Requests_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If Not Logged In, Render County Service Desk Admin Login
  if (!currentAdmin) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center py-10 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Emblem & Top Bar */}
          <div className="pt-8 pb-4 text-center flex flex-col items-center">
            <div className="mb-3">
              <MurangaOfficialCrest size="md" />
            </div>
            <h2 className="text-2xl font-black text-emerald-950 tracking-tight font-display">
              County Service Desk Portal
            </h2>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mt-0.5">
              Murang'a County Government
            </p>
            <p className="text-[11px] text-slate-500">Public Service Delivery & Complaints Management</p>
          </div>

          <div className="p-8 pt-2">
            <div className="mb-6 text-center">
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Sign in to your account
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter officer credentials to access the service request desk.
              </p>
            </div>

            {loginError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="admin@muranga.go.ke"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  <span className="text-xs text-emerald-700 hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{loginLoading ? 'Authenticating...' : 'Sign In'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="pt-4 text-center text-xs text-slate-500 space-y-1">
                <p>
                  First time here?{' '}
                  <span className="font-semibold text-emerald-700 hover:underline cursor-pointer">
                    Set up your password
                  </span>
                </p>
                <p>
                  Need access?{' '}
                  <span className="text-emerald-700 hover:underline cursor-pointer">
                    Contact the administrator
                  </span>
                </p>
              </div>
            </form>
          </div>

          <div className="bg-slate-50 py-3 border-t border-slate-200 text-center text-[10px] text-slate-400">
            © 2026 Murang'a County Government · Public Service Request System. All rights reserved.
          </div>
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const totalCount = requests.length;
  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const inProgressCount = requests.filter((r) => r.status === 'In Progress').length;
  const resolvedCount = requests.filter((r) => r.status === 'Resolved').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Administrator Info */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl">
            <MurangaEmblem size="sm" showText={false} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 font-display">
                Service Request Operations Desk
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Service Desk Admin
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Logged in as <strong className="text-slate-800">{currentAdmin.fullName}</strong> · {currentAdmin.department} ({currentAdmin.badgeNumber})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchRequests}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onAdminLogout}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 block">Total Requests</span>
          <span className="font-mono text-2xl font-bold text-slate-900 block mt-1 tabular-nums">
            {totalCount}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">All registered county dockets</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-blue-600 block">Pending Triage</span>
          <span className="font-mono text-2xl font-bold text-blue-900 block mt-1 tabular-nums">
            {pendingCount}
          </span>
          <span className="text-[10px] text-blue-600/80 mt-1 block">Awaiting directorate allocation</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-amber-600 block">In Progress</span>
          <span className="font-mono text-2xl font-bold text-amber-900 block mt-1 tabular-nums">
            {inProgressCount}
          </span>
          <span className="text-[10px] text-amber-600/80 mt-1 block">Work orders active on ground</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-emerald-600 block">Resolved Cases</span>
          <span className="font-mono text-2xl font-bold text-emerald-900 block mt-1 tabular-nums">
            {resolvedCount}
          </span>
          <span className="text-[10px] text-emerald-600/80 mt-1 block">
            {totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0}% Resolution Rate
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ID, title, or citizen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchRequests()}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-900"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.label} value={c.label}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sub-County Filter */}
          <div>
            <select
              value={subCountyFilter}
              onChange={(e) => setSubCountyFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
            >
              <option value="All">All 7 Sub-Counties</option>
              {MURANGA_SUB_COUNTIES.map((sc) => (
                <option key={sc.name} value={sc.name}>
                  {sc.name} Sub-County
                </option>
              ))}
            </select>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {(['All', 'Pending', 'In Progress', 'Resolved'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`flex-1 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Requests Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                <th className="py-3 px-4">Ref Number</th>
                <th className="py-3 px-4">Issue Title & Category</th>
                <th className="py-3 px-4">Sub-County & Ward</th>
                <th className="py-3 px-4">Citizen / Contact</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No requests match your current filters.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => openInspector(req)}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                      {req.trackingNumber}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 block max-w-xs truncate">
                        {req.title}
                      </span>
                      <span className="text-[11px] text-slate-500">{req.category}</span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-medium text-slate-800 block">{req.subCounty}</span>
                      <span className="text-[11px] text-slate-500">{req.ward}</span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-medium text-slate-900 block">{req.citizenName}</span>
                      <span className="text-[11px] text-slate-500">{req.citizenPhone}</span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          req.priority === 'Urgent'
                            ? 'bg-red-100 text-red-700'
                            : req.priority === 'High'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {req.priority}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          req.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'In Progress'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {req.status === 'Resolved' && <CheckCircle2 className="w-3 h-3" />}
                        {req.status === 'In Progress' && <Wrench className="w-3 h-3" />}
                        {req.status === 'Pending' && <Clock className="w-3 h-3" />}
                        {req.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openInspector(req)}
                          className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-md border border-emerald-200 transition-colors"
                        >
                          Manage
                        </button>
                        <button
                          onClick={() => onViewDocket(req)}
                          title="Print Docket"
                          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspector & Action Modal */}
      {selectedRequest && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedRequest(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-emerald-200" />
                <div>
                  <h3 className="font-bold text-sm md:text-base font-display">
                    Public Service Docket: {selectedRequest.trackingNumber}
                  </h3>
                  <span className="text-xs text-emerald-200">
                    Category: {selectedRequest.category} · {selectedRequest.subCounty} Sub-County
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5">
              {updateSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Docket status & directorate assignment updated successfully.</span>
                </div>
              )}

              {/* Citizen & Location Brief */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                <div>
                  <span className="text-slate-500 block">Applicant Citizen</span>
                  <strong className="text-slate-900 block text-sm">{selectedRequest.citizenName}</strong>
                  <span className="text-slate-600 block">ID: {selectedRequest.nationalId}</span>
                  <span className="text-slate-600 block">Phone: {selectedRequest.citizenPhone}</span>
                </div>

                <div>
                  <span className="text-slate-500 block">Location Coordinates</span>
                  <strong className="text-slate-900 block text-sm">
                    {selectedRequest.subCounty} Sub-County
                  </strong>
                  <span className="text-slate-600 block">{selectedRequest.ward} Ward</span>
                  <span className="text-slate-600 block">
                    Landmark: {selectedRequest.landmark || 'None specified'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">
                  Reported Issue: {selectedRequest.title}
                </h4>
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 whitespace-pre-wrap">
                  {selectedRequest.description}
                </p>
              </div>

              {selectedRequest.imageUrl && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">
                    Citizen Photo Attachment
                  </h4>
                  <img
                    src={selectedRequest.imageUrl}
                    alt="Evidence"
                    className="max-h-48 rounded-lg border border-slate-200 object-cover"
                  />
                </div>
              )}

              {/* Action Update Form */}
              <form onSubmit={handleUpdateRequest} className="border-t border-slate-200 pt-4 space-y-4">
                <h4 className="text-xs font-bold uppercase text-emerald-800 tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Administrative Action & Dispatch</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Status Workflow *
                    </label>
                    <select
                      value={actionStatus}
                      onChange={(e) => setActionStatus(e.target.value as RequestStatus)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 font-semibold text-slate-900"
                    >
                      <option value="Pending">Pending (Under Triage Review)</option>
                      <option value="In Progress">In Progress (Work Order Dispatched)</option>
                      <option value="Resolved">Resolved (Completed & Verified)</option>
                      <option value="Rejected">Rejected (Out of County Jurisdiction)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Assigned County Directorate
                    </label>
                    <select
                      value={actionDept}
                      onChange={(e) => setActionDept(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                    >
                      {COUNTY_DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assigned Field Officer / Team Lead
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Eng. Peter Gitau or Inspector Beatrice Karanja"
                    value={actionOfficer}
                    onChange={(e) => setActionOfficer(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Directorate Notes / Resolution Report
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Document work performed, equipment deployed, contractor info, or reason for resolution..."
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => onViewDocket(selectedRequest)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Official Docket</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRequest(null)}
                      className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      disabled={updating}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{updating ? 'Saving Changes...' : 'Update Docket'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
