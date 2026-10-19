import React from 'react';
import { Printer, X, CheckCircle2, Shield, Calendar, MapPin, User, FileText } from 'lucide-react';
import { ServiceRequest } from '../types';
import { MurangaEmblem } from './MurangaEmblem';
import { useEscapeToClose } from '../hooks/useEscapeToClose';

interface AcknowledgmentSlipModalProps {
  request: ServiceRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AcknowledgmentSlipModal: React.FC<AcknowledgmentSlipModalProps> = ({
  request,
  isOpen,
  onClose,
}) => {
  useEscapeToClose(isOpen, onClose);

  if (!isOpen || !request) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Action Header - Hidden on Print */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-900 text-sm md:text-base">
              Official County Service Acknowledgment Docket
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Docket</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official County Docket */}
        <div className="p-8 space-y-6 bg-white">
          {/* Header Lockup */}
          <div className="border-b-2 border-emerald-800 pb-5 text-center">
            <div className="flex justify-center mb-2">
              <MurangaEmblem size="lg" showText={false} />
            </div>
            <h2 className="text-xl font-extrabold uppercase text-slate-900 tracking-tight font-display">
              MURANG'A COUNTY GOVERNMENT
            </h2>
            <p className="text-xs uppercase font-semibold text-emerald-800 tracking-wider">
              DIRECTORATE OF PUBLIC SERVICE DELIVERY · CITIZEN SERVICE REQUEST DESK
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              County Headquarters, P.O. Box 52 - 10200 Murang'a, Kenya | Call Centre: +254 757 562 988
            </p>
          </div>

          {/* Reference & Barcode Strip */}
          <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div>
              <span className="text-xs font-semibold uppercase text-emerald-900 block">
                Official Tracking Reference
              </span>
              <span className="font-mono text-xl font-bold text-emerald-950 tracking-wider">
                {request.trackingNumber}
              </span>
              <span className="text-[11px] text-emerald-700 block mt-0.5">
                Status: <strong className="uppercase">{request.status}</strong> · Priority: {request.priority}
              </span>
            </div>

            {/* Visual Barcode Graphic */}
            <div className="text-right">
              <div className="h-8 flex items-end gap-0.5 justify-end">
                {[3, 1, 2, 4, 1, 3, 2, 4, 2, 1, 3, 4, 1, 2, 3, 1, 4, 2, 3, 1].map((w, i) => (
                  <div
                    key={i}
                    style={{ height: `${w * 7}px`, width: `${(i % 3) + 1.5}px` }}
                    className="bg-slate-900"
                  />
                ))}
              </div>
              <span className="font-mono text-[9px] text-slate-500 mt-1 block">
                021-{request.trackingNumber.replace(/[^0-9]/g, '')}
              </span>
            </div>
          </div>

          {/* Request Particulars Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 block">Applicant Citizen</span>
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {request.citizenName || 'Verified Resident (Protected)'}
              </div>
              <p className="text-slate-600">
                {request.nationalId ? `ID: ${request.nationalId} | ${request.citizenPhone}` : 'Identity Protected under KDPA 2019'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 block">Date & Time Logged</span>
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {new Date(request.createdAt).toLocaleString('en-KE', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </div>
              <p className="text-slate-600">eCitizen Murang'a County Node</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 block">Sub-County & Ward</span>
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {request.subCounty} Sub-County, {request.ward} Ward
              </div>
              <p className="text-slate-600">Landmark: {request.landmark || 'Not specified'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 block">Assigned Directorate</span>
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                {request.assignedDepartment || 'Service Delivery Desk (Triage)'}
              </div>
              <p className="text-slate-600">
                Service Charter Standard: 48–72 Hrs
              </p>
            </div>
          </div>

          {/* Issue Summary */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
            <div className="flex items-center gap-1.5 mb-1 text-slate-700 font-semibold text-xs uppercase tracking-wide">
              <FileText className="w-3.5 h-3.5 text-emerald-700" />
              Service Category: {request.category}
            </div>
            <h4 className="font-bold text-sm text-slate-900">{request.title}</h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-wrap">
              {request.description}
            </p>
          </div>

          {/* Legal / Service Charter Guarantee */}
          <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 leading-normal flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-slate-700">Notice to Citizen:</p>
              <p>
                In compliance with the Kenya Access to Information Act (2016) and the Murang'a County
                Citizen Service Charter, this docket serves as legal proof of receipt. Keep this reference
                safe to track resolution progress or present at your Sub-County Ward Office.
              </p>
            </div>

            <div className="text-center shrink-0 w-32 border-t border-dashed border-slate-400 pt-2 mt-4">
              <p className="font-semibold text-slate-800 text-[10px]">County Secretary</p>
              <p className="text-[9px] text-slate-500">Authorized Digital Seal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
