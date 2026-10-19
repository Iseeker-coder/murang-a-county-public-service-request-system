import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  Wrench,
  AlertCircle,
  MapPin,
  Calendar,
  Printer,
  Star,
  Send,
  MessageSquare,
  Shield,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { ServiceRequest } from '../types';
import { MurangaEmblem } from './MurangaEmblem';

interface TrackRequestViewProps {
  initialTrackingNumber?: string;
  onViewDocket: (req: ServiceRequest) => void;
  onNavigateSubmit: () => void;
}

export const TrackRequestView: React.FC<TrackRequestViewProps> = ({
  initialTrackingNumber = '',
  onViewDocket,
  onNavigateSubmit,
}) => {
  const [query, setQuery] = useState(initialTrackingNumber);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [request, setRequest] = useState<ServiceRequest | null>(null);

  // Feedback form state
  const [rating, setRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const handleSearch = async (e?: React.FormEvent, customId?: string) => {
    if (e) e.preventDefault();
    const target = customId || query;
    if (!target.trim()) return;

    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/requests/${encodeURIComponent(target.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Request tracking reference not found.');
      }

      setRequest(data);
      setFeedbackSubmitted(Boolean(data.feedbackRating));
    } catch (err: any) {
      setRequest(null);
      setError(err.message || 'Unable to find service request. Please double-check the tracking ID.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request) return;

    setSubmittingFeedback(true);
    try {
      const res = await fetch(`/api/requests/${request.id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment: feedbackComment }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit feedback.');

      setRequest(data.request);
      setFeedbackSubmitted(true);
    } catch (err: any) {
      alert(err.message || 'Error submitting feedback.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            Resolved & Completed
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Wrench className="w-3.5 h-3.5 text-amber-700 animate-spin" />
            Assigned & In Progress
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
            <AlertCircle className="w-3.5 h-3.5 text-red-700" />
            Rejected / Out of Scope
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Clock className="w-3.5 h-3.5 text-blue-700" />
            Pending County Review
          </span>
        );
    }
  };

  // Status step progression calculation
  const getStepProgress = (status: string) => {
    if (status === 'Pending') return 1;
    if (status === 'In Progress') return 2;
    if (status === 'Resolved') return 3;
    return 1;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search Bar Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="max-w-2xl mx-auto text-center mb-6">
          <div className="flex justify-center mb-2">
            <MurangaEmblem size="sm" showText={false} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-display">
            Track Public Service Request
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time tracking of public complaints, repair tickets, and community works in Murang'a County.
          </p>
        </div>

        <form onSubmit={(e) => handleSearch(e)} className="max-w-xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Reference (e.g. MCG-2026-4819)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-900 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer shrink-0"
            >
              {loading ? 'Searching...' : 'Track Ticket'}
            </button>
          </div>

          {/* Quick Click Samples */}
          <div className="flex items-center justify-center gap-2 mt-3 text-[11px] text-slate-500">
            <span>Sample tickets:</span>
            {['MCG-2026-4819', 'MCG-2026-4820', 'MCG-2026-4821'].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => {
                  setQuery(sample);
                  handleSearch(undefined, sample);
                }}
                className="text-emerald-700 hover:underline font-mono"
              >
                {sample}
              </button>
            ))}
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-xs text-red-700">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-red-800">Tracking Reference Not Found</strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      {request && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-6">
          {/* Header of Request */}
          <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-slate-500 uppercase">
                  {request.trackingNumber}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-600 font-semibold">{request.category}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display">
                {request.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {request.subCounty} Sub-County, {request.ward} Ward
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(request.createdAt).toLocaleDateString('en-KE', {
                    dateStyle: 'medium',
                  })}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
              {getStatusBadge(request.status)}
              <button
                onClick={() => onViewDocket(request)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Docket</span>
              </button>
            </div>
          </div>

          {/* 3-Step Civic Progress Bar */}
          <div className="px-6 py-4">
            <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-4">
              Lifecycle Stage
            </h4>
            <div className="relative flex items-center justify-between max-w-xl mx-auto">
              {/* Connecting Line */}
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-200 -z-0">
                <div
                  className="h-full bg-emerald-600 transition-all duration-500"
                  style={{
                    width:
                      getStepProgress(request.status) === 1
                        ? '0%'
                        : getStepProgress(request.status) === 2
                        ? '50%'
                        : '100%',
                  }}
                />
              </div>

              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center bg-white px-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                    getStepProgress(request.status) >= 1
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-800 mt-2">1. Submitted</span>
                <span className="text-[10px] text-slate-400">Logged on eCitizen</span>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center bg-white px-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                    getStepProgress(request.status) >= 2
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <Wrench className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-800 mt-2">2. In Progress</span>
                <span className="text-[10px] text-slate-400">Assigned to Directorate</span>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center bg-white px-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                    getStepProgress(request.status) >= 3
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-800 mt-2">3. Resolved</span>
                <span className="text-[10px] text-slate-400">Inspected & Closed</span>
              </div>
            </div>
          </div>

          {/* Details & Assignment Box */}
          <div className="px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">
                  Citizen Request Description
                </h4>
                <p className="text-xs md:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 whitespace-pre-wrap">
                  {request.description}
                </p>
              </div>

              {request.imageUrl && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">
                    Attached Photographic Evidence
                  </h4>
                  <img
                    src={request.imageUrl}
                    alt="Citizen evidence"
                    className="max-h-60 rounded-xl border border-slate-200 object-cover"
                  />
                </div>
              )}

              {/* Official Resolution Report if resolved or in progress */}
              {request.resolutionNotes && (
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wide">
                    <Shield className="w-4 h-4 text-emerald-700" />
                    <span>Official Directorate Action Log</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed pt-1">
                    {request.resolutionNotes}
                  </p>
                  {request.resolvedAt && (
                    <span className="text-[10px] text-emerald-700 block pt-1 font-medium">
                      Date Resolved: {new Date(request.resolvedAt).toLocaleString('en-KE')}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar particulars */}
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-3">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-2">
                  County Assignment
                </h4>
                <div>
                  <span className="text-slate-500 block text-[11px]">Department:</span>
                  <span className="font-semibold text-slate-800">
                    {request.assignedDepartment || 'Public Service Board (Initial Triage)'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Assigned Officer:</span>
                  <span className="font-semibold text-slate-800">
                    {request.assignedOfficer || 'Pending Field Officer Allocation'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Priority:</span>
                  <span className="font-semibold text-slate-800">{request.priority}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Landmark:</span>
                  <span className="text-slate-700">{request.landmark || 'Not provided'}</span>
                </div>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-xl p-4 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Applicant Privacy Protected</span>
                </div>
                <p className="text-[11px] text-emerald-800/90 leading-relaxed">
                  In compliance with the Kenya Data Protection Act (2019), citizen personal details (National ID, telephone, and applicant name) are confidential and omitted from public ticket tracking.
                </p>
                <div className="pt-1 border-t border-emerald-200/60 flex items-center justify-between text-[10px] text-emerald-700 font-medium">
                  <span>Data Protection Officer</span>
                  <span className="font-mono">Murang'a eCitizen Node</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Audit History */}
          <div className="px-6 pb-6">
            <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3">
              Detailed Audit Timeline
            </h4>
            <div className="space-y-3 border-l-2 border-emerald-600/30 ml-3 pl-4">
              {request.timeline?.map((ev, idx) => (
                <div key={ev.id || idx} className="relative text-xs">
                  <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-white" />
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{ev.title}</span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(ev.timestamp).toLocaleString('en-KE', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{ev.description}</p>
                  <span className="text-[10px] text-emerald-800 font-medium">
                    By: {ev.role === 'Citizen' ? 'Verified Citizen (Applicant)' : ev.actor} ({ev.role})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Citizen Feedback Rating on Resolved Requests (Bonus Feature) */}
          {request.status === 'Resolved' && (
            <div className="p-6 bg-emerald-50/50 border-t border-emerald-200">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-display">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                Citizen Service Satisfaction Rating
              </h4>

              {feedbackSubmitted ? (
                <div className="mt-3 p-4 bg-white rounded-xl border border-emerald-200 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Thank You! Rating Recorded: {request.feedbackRating || 5}/5 Stars
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      "{request.feedbackComment || 'Service satisfactorily completed.'}"
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSendFeedback} className="mt-3 space-y-3">
                  <p className="text-xs text-slate-600">
                    Was this service request resolved satisfactorily by Murang'a County Government?
                    Your feedback helps the Public Service Board ensure accountability.
                  </p>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-semibold text-slate-700 ml-2">
                      {rating} out of 5 Stars
                    </span>
                  </div>

                  <div>
                    <textarea
                      rows={2}
                      placeholder="Optional citizen remarks on the quality of repair or service..."
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 text-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingFeedback}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    {submittingFeedback ? 'Submitting...' : 'Submit Satisfaction Rating'}
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      )}

      {/* Helpful banner for other issues */}
      <div className="bg-slate-100 rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-slate-900 text-sm font-display">
            Need to report a new problem or request county assistance?
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit a new ticket under streetlights, water, roads, waste, or health services.
          </p>
        </div>
        <button
          onClick={onNavigateSubmit}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer shrink-0"
        >
          <span>Submit New Request</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
