import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  Wrench,
  AlertTriangle,
  MapPin,
  Layers,
  Calendar,
  RefreshCw,
  Award,
} from 'lucide-react';
import { AnalyticsSummary } from '../types';

export const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-medium">
          Compiling Murang'a County service analytics...
        </p>
      </div>
    );
  }

  const maxCategoryCount = Math.max(...data.categoryBreakdown.map((c) => c.count), 1);
  const maxSubCountyCount = Math.max(...data.subCountyBreakdown.map((s) => s.total), 1);

  return (
    <div className="space-y-6">
      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Logged
            </span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <span className="font-mono text-3xl font-extrabold text-slate-900 block mt-2 tabular-nums">
            {data.total}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">Countywide citizen requests</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Resolution Rate
            </span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="font-mono text-3xl font-extrabold text-emerald-900 block mt-2 tabular-nums">
            {data.resolvedRate}%
          </span>
          <span className="text-[11px] text-emerald-700/80 block mt-1">
            {data.resolved} out of {data.total} cases closed
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Active In Progress
            </span>
            <Wrench className="w-4 h-4 text-amber-600" />
          </div>
          <span className="font-mono text-3xl font-extrabold text-amber-900 block mt-2 tabular-nums">
            {data.inProgress}
          </span>
          <span className="text-[11px] text-amber-700/80 block mt-1">Directorate field teams</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
              Avg Turnaround
            </span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <span className="font-mono text-3xl font-extrabold text-blue-900 block mt-2 tabular-nums">
            {data.averageResolutionDays} <span className="text-base font-normal">Days</span>
          </span>
          <span className="text-[11px] text-blue-600/80 block mt-1">Under Service Charter</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm md:text-base font-display">
                Service Requests by Category
              </h3>
              <p className="text-xs text-slate-500">Distribution across county public directorates</p>
            </div>
            <BarChart3 className="w-4 h-4 text-emerald-700" />
          </div>

          <div className="space-y-3 pt-2">
            {data.categoryBreakdown.map((cat) => {
              const pct = Math.round((cat.count / maxCategoryCount) * 100);
              return (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800">{cat.category}</span>
                    <span className="font-mono text-slate-600 font-semibold tabular-nums">
                      {cat.count} requests
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-700 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sub-County Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm md:text-base font-display">
                Murang'a 7 Sub-Counties Distribution
              </h3>
              <p className="text-xs text-slate-500">Incidence density and resolution rate</p>
            </div>
            <MapPin className="w-4 h-4 text-emerald-700" />
          </div>

          <div className="space-y-3 pt-2">
            {data.subCountyBreakdown.map((sc) => {
              const resRate = sc.total > 0 ? Math.round((sc.resolved / sc.total) * 100) : 0;
              return (
                <div key={sc.subCounty} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-900">{sc.subCounty} Sub-County</span>
                    <span className="font-mono text-slate-600 font-semibold tabular-nums">
                      {sc.total} Total · <span className="text-emerald-700 font-bold">{sc.resolved} Resolved ({resRate}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{ width: `${resRate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Priority & Urgency Distribution */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-slate-900 text-sm font-display">
            Prioritization Protocol Status
          </h4>
          <p className="text-xs text-slate-500">
            Emergency issues (water pipeline bursts, dark health center corridors) get immediate 24h response.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {data.priorityBreakdown.map((pr) => (
            <div
              key={pr.priority}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                pr.priority === 'Urgent'
                  ? 'bg-red-50 text-red-800 border-red-200'
                  : pr.priority === 'High'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-slate-50 text-slate-800 border-slate-200'
              }`}
            >
              <span>{pr.priority}: </span>
              <span className="font-mono font-bold tabular-nums">{pr.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
