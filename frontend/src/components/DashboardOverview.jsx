import React from 'react';
import { TrendingUp, FileCheck, AlertCircle, Clock } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, trend, color }) => (
  <div className="glass-card p-6 flex flex-col space-y-2">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
    <p className="text-slate-400 text-sm font-medium">{label}</p>
    <div className="flex items-end justify-between">
      <h3 className="text-2xl font-bold">{value}</h3>
      <span className="text-emerald-400 text-xs font-semibold flex items-center">
        <TrendingUp size={14} className="mr-1" />
        {trend}
      </span>
    </div>
  </div>
);

const DashboardOverview = () => {
  const stats = [
    { icon: FileCheck, label: 'Tax Filings', value: '12', trend: '+20%', color: 'bg-indigo-500' },
    { icon: AlertCircle, label: 'Pending Issues', value: '03', trend: '-5%', color: 'bg-amber-500' },
    { icon: Clock, label: 'Next Deadline', value: '15 May', trend: '4 Days', color: 'bg-emerald-500' },
    { icon: TrendingUp, label: 'Tax Saved', value: '₹45,200', trend: '+12%', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col space-y-1">
        <h2 className="text-3xl font-bold">Welcome back, Rohit</h2>
        <p className="text-slate-400">Here's what's happening with your tax compliance today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-8 min-h-[400px]">
          <h3 className="text-xl font-bold mb-6">Tax Liability Projection</h3>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-white/5 rounded-2xl">
            <p className="text-slate-500">Analytics Chart Visualization</p>
          </div>
        </div>

        <div className="glass-card p-8">
          <h3 className="text-xl font-bold mb-6">Recent Documents</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-500/10 rounded flex items-center justify-center text-red-400">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">GST_Invoice_April_{i}.pdf</p>
                    <p className="text-xs text-slate-500">Uploaded 2h ago</p>
                  </div>
                </div>
                <button className="text-slate-500 group-hover:text-white transition-colors">
                  <Download size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal icons needed
const FileText = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>
  </svg>
);

const Download = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y1="3"/>
  </svg>
);

export default DashboardOverview;
