import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Clock,
  Wrench,
  CheckCircle2,
  Printer,
  ChevronRight,
  MapPin,
  Calendar,
  AlertCircle,
  User,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { CitizenUser, ServiceRequest } from '../types';

interface CitizenMyRequestsViewProps {
  currentUser: CitizenUser;
  requests: ServiceRequest[];
  onOpenSubmitModal: () => void;
  onTrackRequest: (trackingNumber: string) => void;
  onViewDocket: (req: ServiceRequest) => void;
}

export const CitizenMyRequestsView: React.FC<CitizenMyRequestsViewProps> = ({
  currentUser,
  requests,
  onOpenSubmitModal,
  onTrackRequest,
  onViewDocket,
}) => {
  const [filter, setFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Resolved'>('All');

  // Filter requests strictly for this logged-in citizen
  const myRequests = requests.filter(
    (r) => r.citizenId === currentUser.id || r.nationalId === currentUser.nationalId
  );

  const filtered = myRequests.filter((r) => {
    if (filter === 'All') return true;
    return r.status === filter;
  });

  const pendingCount = myRequests.filter((r) => r.status === 'Pending').length;
  const inProgressCount = myRequests.filter((r) => r.status === 'In Progress').length;
  const resolvedCount = myRequests.filter((r) => r.status === 'Resolved').length;

  return (
    <div className="space-y-6">
      {/* Citizen Profile Hero Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center font-bold text-lg shadow-inner">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 font-display">
                {currentUser.fullName}
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified eCitizen
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              National ID: <strong className="text-slate-800">{currentUser.nationalId}</strong> · Phone: {currentUser.phone} · {currentUser.subCounty} Sub-County ({currentUser.ward} Ward)
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSubmitModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Submit New Request</span>
        </button>
      </div>

      {/* Citizen Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block">Total Requests Filed</span>
          <span className="font-mono text-2xl font-bold text-slate-900 block mt-1 tabular-nums">
            {myRequests.length}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">Your civic service dockets</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-blue-600 block">Under Review</span>
          <span className="font-mono text-2xl font-bold text-blue-900 block mt-1 tabular-nums">
            {pendingCount}
          </span>
          <span className="text-[10px] text-blue-600/80 mt-1 block">Awaiting field assignment</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-amber-600 block">Work In Progress</span>
          <span className="font-mono text-2xl font-bold text-amber-900 block mt-1 tabular-nums">
            {inProgressCount}
          </span>
          <span className="text-[10px] text-amber-600/80 mt-1 block">County maintenance active</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-emerald-600 block">Resolved & Closed</span>
          <span className="font-mono text-2xl font-bold text-emerald-900 block mt-1 tabular-nums">
            {resolvedCount}
          </span>
          <span className="text-[10px] text-emerald-600/80 mt-1 block">Repairs completed</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl max-w-md">
        {(['All', 'Pending', 'In Progress', 'Resolved'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              filter === tab
                ? 'bg-white text-emerald-950 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">No service requests found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't submitted any service requests under this filter. If you notice a broken streetlight, water pipe leak, or road defect, submit a report.
            </p>
            <button
              onClick={onOpenSubmitModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-lg hover:bg-emerald-900 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit Request Now</span>
            </button>
          </div>
        ) : (
          filtered.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-800">
                    {req.trackingNumber}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-emerald-800 font-semibold">{req.category}</span>
                  <span className="text-slate-300">·</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
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
                </div>

                <h4 className="text-sm font-bold text-slate-900 font-display">
                  {req.title}
                </h4>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {req.description}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {req.subCounty} ({req.ward})
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {new Date(req.createdAt).toLocaleDateString('en-KE')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => onViewDocket(req)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Docket</span>
                </button>
                <button
                  onClick={() => onTrackRequest(req.trackingNumber)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors cursor-pointer"
                >
                  <span>Track Status</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
