import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Image as ImageIcon,
  MapPin,
  FileText,
  User,
  Sparkles,
  Phone,
  Printer,
  ShieldCheck,
  Lock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { CitizenUser, RequestCategory, RequestPriority, ServiceRequest } from '../types';
import { MURANGA_SUB_COUNTIES, CATEGORIES } from '../data/murangaData';
import { MurangaEmblem } from './MurangaEmblem';
import { MurangaOfficialCrest } from './MurangaOfficialCrest';

interface SubmitRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CitizenUser | null;
  onRequestCreated: (newRequest: ServiceRequest) => void;
  onViewDocket: (req: ServiceRequest) => void;
  onPromptAuth: (mode: 'login' | 'register', reason?: string) => void;
  initialCategory?: RequestCategory;
}

export const SubmitRequestModal: React.FC<SubmitRequestModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onRequestCreated,
  onViewDocket,
  onPromptAuth,
  initialCategory,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdRequest, setCreatedRequest] = useState<ServiceRequest | null>(null);

  // Form Fields
  const [category, setCategory] = useState<RequestCategory>(initialCategory || 'Street Lighting');
  const [title, setTitle] = useState('');
  const [subCounty, setSubCounty] = useState(currentUser?.subCounty || 'Kiharu');
  const [ward, setWard] = useState(currentUser?.ward || 'Murang\'a Township');
  const [landmark, setLandmark] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<RequestPriority>('Standard');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    if (currentUser) {
      setSubCounty(currentUser.subCounty || 'Kiharu');
      const wards = MURANGA_SUB_COUNTIES.find((s) => s.name === currentUser.subCounty)?.wards || [];
      setWard(currentUser.ward || wards[0] || 'Murang\'a Township');
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const currentWards = MURANGA_SUB_COUNTIES.find((s) => s.name === subCounty)?.wards || [];

  const handleSubCountyChange = (scName: string) => {
    setSubCounty(scName);
    const wards = MURANGA_SUB_COUNTIES.find((s) => s.name === scName)?.wards || [];
    if (wards.length > 0) {
      setWard(wards[0]);
    }
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setError('Photo exceeds 8MB. Please select a smaller photo or camera image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Strictly enforce citizen authentication
    if (!currentUser) {
      onPromptAuth('login', 'You must log in with your verified Kenyan National ID before submitting a service request.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          subCounty,
          ward,
          landmark,
          description,
          priority,
          imageUrl: imagePreview || '',
          citizenId: currentUser.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit service request.');
      }

      setCreatedRequest(data.request);
      onRequestCreated(data.request);
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setCreatedRequest(null);
    setTitle('');
    setDescription('');
    setLandmark('');
    setImagePreview(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-md">
              <MurangaEmblem size="sm" showText={false} />
            </div>
            <div>
              <h3 className="font-bold text-base font-display leading-tight">
                Public Service Request System
              </h3>
              <p className="text-xs text-emerald-100">
                Murang'a County Government (021) · Verified Citizen Portal
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* CASE 1: CITIZEN NOT LOGGED IN -> HARD AUTHENTICATION GATE */}
          {!currentUser ? (
            <div className="py-6 px-4 text-center space-y-6 flex flex-col items-center">
              <div className="mb-1">
                <MurangaOfficialCrest size="lg" />
              </div>

              <div className="max-w-md">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldAlert className="w-4 h-4 text-amber-700" />
                  <span>Citizen Authentication Mandatory</span>
                </div>
                <h4 className="text-xl font-black text-slate-900 font-display">
                  Please Sign In or Register to Submit a Service Request
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  To prevent anonymous spam, avoid duplicate service dockets, and enable direct follow-up by County Field Officers, all public defect reports must be submitted through a verified Kenyan eCitizen account.
                </p>
              </div>

              <div className="w-full max-w-md bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2">
                <span className="font-bold text-slate-800 block">Verified Citizen Benefits:</span>
                <div className="flex items-center gap-2 text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Automatic SMS tracking updates dispatched to your mobile phone.</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Official printable County Acknowledgment Docket with tracking barcode.</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Direct accountability and priority response under the Murang'a County Service Charter.</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onPromptAuth('login', 'Please sign in with your National ID to submit your service request.');
                  }}
                  className="w-full sm:flex-1 py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sign In with National ID</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onPromptAuth('register', 'Register your citizen profile once to submit requests anytime.');
                  }}
                  className="w-full sm:flex-1 py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs rounded-lg border border-slate-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Register Account</span>
                </button>
              </div>
            </div>
          ) : createdRequest ? (
            /* CASE 2: SUCCESS VIEW */
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
                  Service Request Registered Successfully
                </span>
                <h4 className="text-2xl font-extrabold text-slate-900 mt-1 font-display">
                  {createdRequest.title}
                </h4>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 max-w-md mx-auto">
                <span className="text-xs text-emerald-800 font-medium block">
                  Official Murang'a County Tracking Reference:
                </span>
                <span className="font-mono text-2xl font-black text-emerald-950 tracking-wider block mt-1">
                  {createdRequest.trackingNumber}
                </span>
                <div className="text-xs text-emerald-700 mt-2 flex items-center justify-center gap-2">
                  <span>Category: {createdRequest.category}</span>
                  <span>·</span>
                  <span>{createdRequest.subCounty} ({createdRequest.ward})</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 max-w-md mx-auto text-left text-xs text-slate-600 flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1 shrink-0" />
                <div>
                  <strong className="text-slate-800">SMS Notification Dispatched to {createdRequest.citizenPhone}:</strong>
                  <p className="mt-0.5 text-slate-500 font-mono text-[11px]">
                    "Murang'a County: Your request {createdRequest.trackingNumber} for {createdRequest.category} in {createdRequest.ward} has been received. Track status at muranga.go.ke"
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onViewDocket(createdRequest);
                    handleResetAndClose();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Download / Print Official County Docket</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <span>Done & Return to Portal</span>
                </button>
              </div>
            </div>
          ) : (
            /* CASE 3: AUTHENTICATED SUBMISSION FORM */
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-700">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Verified Citizen Account Header Strip */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-950 block">
                      Filing as: {currentUser.fullName}
                    </span>
                    <span className="text-emerald-800 text-[11px]">
                      National ID: {currentUser.nationalId} · Phone: {currentUser.phone} · {currentUser.subCounty} Sub-County
                    </span>
                  </div>
                </div>
                <span className="bg-emerald-200 text-emerald-900 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">
                  eCitizen Verified
                </span>
              </div>

              {/* 1. Category Picker */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-2">
                  1. Service Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORIES.map((c) => {
                    const isSelected = category === c.label;
                    return (
                      <button
                        key={c.label}
                        type="button"
                        onClick={() => setCategory(c.label)}
                        className={`p-2.5 text-left rounded-lg border text-xs font-medium transition-all cursor-pointer flex flex-col justify-between h-20 ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-2 ring-emerald-600/20'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span className="font-semibold text-xs leading-snug line-clamp-2">
                          {c.label}
                        </span>
                        <span className="text-[10px] text-slate-500 line-clamp-1">
                          {c.dept.split(',')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Issue Title & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                    Issue Title / Summary *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Broken streetlights along Hospital Road"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                    Urgency / Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as RequestPriority)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-900 font-medium"
                  >
                    <option value="Standard">Standard (Normal)</option>
                    <option value="High">High Priority</option>
                    <option value="Urgent">Urgent / Emergency Hazard</option>
                  </select>
                </div>
              </div>

              {/* 3. Location Details (Murang'a Sub-County, Ward, Landmark) */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-700 tracking-wider">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>2. Location in Murang'a County *</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Sub-County
                    </label>
                    <select
                      value={subCounty}
                      onChange={(e) => handleSubCountyChange(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 font-medium text-slate-900"
                    >
                      {MURANGA_SUB_COUNTIES.map((sc) => (
                        <option key={sc.name} value={sc.name}>
                          {sc.name} Sub-County
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Ward
                    </label>
                    <select
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 font-medium text-slate-900"
                    >
                      {currentWards.map((w) => (
                        <option key={w} value={w}>
                          {w} Ward
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Specific Landmark / Village / Street Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Near Mukuyu Market, opposite Total Energies petrol station"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 text-slate-900"
                  />
                </div>
              </div>

              {/* 4. Description */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                  3. Request Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide precise details of the issue, severity, duration, and how it impacts residents..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-900"
                />
              </div>

              {/* 5. Optional Image Attachment */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                  4. Attach Photo / Evidence (Optional)
                </label>
                {imagePreview ? (
                  <div className="relative border border-slate-200 rounded-lg p-2 bg-slate-50 flex items-center gap-3">
                    <img
                      src={imagePreview}
                      alt="Attached evidence preview"
                      className="w-20 h-20 object-cover rounded-md border border-slate-300"
                    />
                    <div className="flex-1 text-xs">
                      <span className="font-semibold text-slate-800 block">Photo Attached</span>
                      <span className="text-slate-500">Will be inspected by County Response Officer</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 rounded-md font-medium border border-red-200"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50 hover:bg-emerald-50/30">
                    <Upload className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="text-xs font-semibold text-slate-700">
                      Upload Photo or Capture with Camera
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      JPG, PNG, WEBP up to 8MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFile}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  {submitting ? 'Transmitting to County...' : 'Submit Service Request'}
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
