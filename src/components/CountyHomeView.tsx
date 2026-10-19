import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  Send,
  Droplets,
  Lightbulb,
  Construction,
  Trash2,
  HeartPulse,
  Wheat,
  GraduationCap,
  FileText,
  Clock,
  CheckCircle2,
  Wrench,
  MapPin,
  Shield,
  Layers,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { ServiceRequest, RequestCategory, CitizenUser } from '../types';
import { CATEGORIES, MURANGA_SUB_COUNTIES } from '../data/murangaData';
import { MurangaEmblem } from './MurangaEmblem';

interface CountyHomeViewProps {
  requests: ServiceRequest[];
  currentUser: CitizenUser | null;
  onOpenSubmitModal: (category?: RequestCategory) => void;
  onTrackRequest: (trackingNumber: string) => void;
  onNavigateTab: (tab: 'track' | 'admin' | 'analytics' | 'my-requests') => void;
  onPromptAuth: (mode: 'login' | 'register', reason?: string) => void;
}

export const CountyHomeView: React.FC<CountyHomeViewProps> = ({
  requests,
  currentUser,
  onOpenSubmitModal,
  onTrackRequest,
  onNavigateTab,
  onPromptAuth,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const handleActionClick = (category?: RequestCategory) => {
    if (!currentUser) {
      onPromptAuth(
        'login',
        'Citizen Authentication Required: Under Murang\'a County regulations, you must log in with your verified National ID to file a public service request.'
      );
    } else {
      onOpenSubmitModal(category);
    }
  };

  // Filter requests for live feed
  const filteredFeed = requests
    .filter((r) => {
      const matchCat = selectedCategory === 'All' || r.category === selectedCategory;
      const matchSearch =
        !searchTerm.trim() ||
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.subCounty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    })
    .slice(0, 6);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Street Lighting':
        return <Lightbulb className="w-5 h-5 text-amber-600" />;
      case 'Water & Sanitation':
        return <Droplets className="w-5 h-5 text-blue-600" />;
      case 'Roads & Infrastructure':
        return <Construction className="w-5 h-5 text-orange-600" />;
      case 'Garbage & Environment':
        return <Trash2 className="w-5 h-5 text-emerald-600" />;
      case 'Public Health':
        return <HeartPulse className="w-5 h-5 text-rose-600" />;
      case 'Agriculture & Livestock':
        return <Wheat className="w-5 h-5 text-yellow-600" />;
      case 'Education & Bursary':
        return <GraduationCap className="w-5 h-5 text-indigo-600" />;
      default:
        return <FileText className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-10">
      {/* 1. Official eCitizen County Banner Card (matching screencapture-accounts-ecitizen-go-ke-en-counties-001) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* County Title Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <MurangaEmblem size="sm" showText={false} />
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight font-display">
              021 - Murang'a County
            </h1>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Official eCitizen Node</span>
          </span>
        </div>

        {/* Hero Banner Scenic Graphic */}
        <div className="relative h-48 md:h-64 bg-linear-to-r from-emerald-900 via-emerald-800 to-teal-900 overflow-hidden flex items-center px-8 text-white">
          {/* Subtle Decorative Civic Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
              Devolution in Action · Central Kenya
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold font-display leading-tight text-white drop-shadow-sm">
              Public Service Request System
            </h2>
            <p className="text-xs md:text-sm text-emerald-100 leading-relaxed max-w-xl">
              Report infrastructure defects, broken streetlights, water pipeline bursts, and sanitation issues directly to Murang'a County Government departments.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => handleActionClick()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-emerald-700" />
                <span>Submit Service Request</span>
              </button>
              <button
                onClick={() => onNavigateTab('track')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-950/60 hover:bg-emerald-950 text-white text-xs font-semibold rounded-lg border border-emerald-700/60 transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-emerald-300" />
                <span>Track Existing Ticket</span>
              </button>
            </div>
          </div>
        </div>

        {/* Overview & Total Services Strip */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-slate-200">
          <div className="md:col-span-3 text-center md:text-left border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0 md:pr-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              TOTAL SERVICES
            </span>
            <span className="font-mono text-5xl font-black text-emerald-800 block mt-2 tabular-nums">
              8
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              Active Murang'a County Portals
            </span>
          </div>

          <div className="md:col-span-9 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                OVERVIEW
              </h3>
              {currentUser ? (
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Logged in as {currentUser.fullName}
                </span>
              ) : (
                <span className="text-xs font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Sign In Required to File Requests
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              Murang'a County is situated in the Central region of the Republic of Kenya and is renowned for its fertile agricultural landscapes, thriving tea and coffee belts, and vibrant trade. Under Governor Dr. Irungu Kang'ata, the county has modernized public administration through automated digital platforms, the Kang'ataCare health insurance scheme, smart city initiatives, and direct citizen engagement.
            </p>
          </div>
        </div>

        {/* Services Directory List */}
        <div className="p-6 md:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              SERVICES DIRECTORY
            </h3>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-900"
              />
            </div>
          </div>

          <div className="space-y-2.5">
            {/* Primary Action Row: Public Service Request System */}
            <div
              onClick={() => handleActionClick()}
              className="group p-4 bg-emerald-50/60 hover:bg-emerald-100/60 border-2 border-emerald-600/40 hover:border-emerald-700 rounded-xl transition-all flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2 bg-emerald-800 text-white rounded-lg">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-sm group-hover:text-emerald-950 transition-colors">
                    Public Service Request & Defect Reporting System
                  </span>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Report streetlights, water pipeline leaks, potholes, sewage, or dumpsites in your ward.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-800 hidden sm:inline">
                  {currentUser ? 'Log Request' : 'Sign In & Request'}
                </span>
                <ArrowRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Other County Services */}
            {[
              {
                title: 'Kang\'ataCare Comprehensive Social Health Scheme',
                desc: 'Health insurance verification, medical dispensaries drug allocation, optical & dental benefits.',
                category: 'Public Health' as RequestCategory,
              },
              {
                title: 'Water & Sanitation Inquiries (MUWASCO / MUSWASCO)',
                desc: 'Clean water connectivity applications, burst pipe interventions, sewer line unblocking.',
                category: 'Water & Sanitation' as RequestCategory,
              },
              {
                title: 'Roads & Culvert Maintenance Reporting',
                desc: 'Feeder road grading, stormwater culvert clearance, pothole repairs.',
                category: 'Roads & Infrastructure' as RequestCategory,
              },
              {
                title: 'Inua Mkulima Subsidized Fertilizer & Agriculture Support',
                desc: 'Farmer registration, tea & coffee seedlings, animal vaccination schedules.',
                category: 'Agriculture & Livestock' as RequestCategory,
              },
              {
                title: 'Street Lighting & Public Solar Infrastructure',
                desc: 'Faulty high-mast security lights, trading center lighting, solar panel repairs.',
                category: 'Street Lighting' as RequestCategory,
              },
              {
                title: 'Single Business Permit (SBP) & County Licensing',
                desc: 'Automated revenue portal, trading licenses, health inspection clearances.',
                category: 'Other County Services' as RequestCategory,
              },
              {
                title: 'Nyota Zetu County Education Bursary & ECDE Support',
                desc: 'Secondary school scholarship disbursement inquiries, vocational college subsidies.',
                category: 'Education & Bursary' as RequestCategory,
              },
            ].map((srv, idx) => (
              <div
                key={idx}
                onClick={() => handleActionClick(srv.category)}
                className="group p-3.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-slate-100 text-slate-600 rounded-lg group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
                    {getCategoryIcon(srv.category)}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 text-xs md:text-sm group-hover:text-emerald-800 transition-colors">
                      {srv.title}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{srv.desc}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all shrink-0 ml-3" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Flagship County Programmes */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
        <div className="text-center max-w-xl mx-auto mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            County Executive Committee
          </span>
          <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 font-display mt-1">
            Murang'a County Government Flagship Programmes
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Transforming livelihoods through technology, accountable governance, and subsidized services.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-center">
          {[
            { name: 'Kang\'ataCare Social Health', sub: 'Comprehensive Health Insurance' },
            { name: 'Inua Mkulima Subsidy', sub: 'Free Certified Maize & Fertilizer' },
            { name: 'Smart City Automation', sub: 'eCitizen & Digital Public Works' },
            { name: 'Uji Programme', sub: 'Nutrition for All ECDE Pupils' },
            { name: 'Water Connectivity', sub: 'Piped Clean Tap Water to Homes' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100 flex flex-col justify-center"
            >
              <span className="font-bold text-xs text-emerald-950">{item.name}</span>
              <span className="text-[10px] text-emerald-700 mt-1">{item.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Live Recent Public Requests Docket Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              PUBLIC TRANSPARENCY FEED
            </span>
            <h3 className="text-xl font-bold text-slate-900 font-display mt-0.5">
              Recent Service Requests & Resolution Status
            </h3>
            <p className="text-xs text-slate-500">
              Live updates across Murang'a 7 Sub-Counties.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('track')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>Track by Reference #</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filter Pills for Feed */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
              selectedCategory === 'All'
                ? 'bg-emerald-800 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.slice(0, 5).map((c) => (
            <button
              key={c.label}
              onClick={() => setSelectedCategory(c.label)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                selectedCategory === c.label
                  ? 'bg-emerald-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFeed.map((req) => (
            <div
              key={req.id}
              onClick={() => onTrackRequest(req.trackingNumber)}
              className="p-4 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="font-mono font-bold text-slate-700 uppercase">
                    {req.trackingNumber}
                  </span>
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

                <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                  {req.title}
                </h4>

                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {req.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {req.subCounty} ({req.ward})
                </span>
                <span className="text-emerald-800 font-semibold hover:underline">
                  View Timeline →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
