import React from 'react';
import { TrendingUp, FileCheck, AlertCircle, Clock, FileText, Download, ArrowUpRight } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, trend, color, positive = true }) => (
  <div className="glass-card p-6 flex flex-col space-y-3 hover:scale-[1.02] transition-transform duration-200 cursor-default">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-slate-400 text-sm font-medium">{label}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
    </div>
    <span className={`text-xs font-semibold flex items-center gap-1 ${positive ? 'text-emerald-400' : 'text-amber-400'}`}>
      <ArrowUpRight size={14} />
      {trend}
    </span>
  </div>
);

const recentDocs = [
  { name: 'GST_Return_April_2025.pdf', time: '2 hours ago', type: 'PDF', color: 'bg-red-500/10 text-red-400' },
  { name: 'Income_TDS_Q4.xlsx', time: '1 day ago', type: 'XLS', color: 'bg-green-500/10 text-green-400' },
  { name: 'ITR_FY24-25_Draft.pdf', time: '3 days ago', type: 'PDF', color: 'bg-red-500/10 text-red-400' },
];

const deadlines = [
  { label: 'GSTR-1 Filing', date: 'May 15, 2025', days: 4, urgent: true },
  { label: 'Advance Tax Q1', date: 'Jun 15, 2025', days: 35, urgent: false },
  { label: 'TDS Return Q4', date: 'May 31, 2025', days: 20, urgent: false },
];

const DashboardOverview = () => {
  const stats = [
    { icon: FileCheck, label: 'Tax Filings Done', value: '12', trend: '+20% this quarter', color: 'bg-indigo-500', positive: true },
    { icon: AlertCircle, label: 'Pending Issues', value: '03', trend: 'Needs attention', color: 'bg-amber-500', positive: false },
    { icon: Clock, label: 'Next Deadline', value: '15 May', trend: '4 Days away', color: 'bg-emerald-500', positive: true },
    { icon: TrendingUp, label: 'Tax Optimized', value: '₹45,200', trend: '+12% vs last year', color: 'bg-purple-500', positive: true },
  ];

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h2 className="text-3xl font-bold">Welcome back, Rohit 👋</h2>
        <p className="text-slate-400 mt-1">Here's your tax compliance status for today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Main Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Upcoming Deadlines */}
        <div className="lg:col-span-1 glass-card p-6">
          <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
            <Clock size={18} className="text-indigo-400" /> Upcoming Deadlines
          </h3>
          <div className="space-y-3">
            {deadlines.map((d, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${d.urgent ? 'border-red-500/20 bg-red-500/5' : 'border-white/5 bg-white/3'}`}>
                <div>
                  <p className="text-sm font-semibold">{d.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{d.date}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${d.urgent ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-300'}`}>
                  {d.days}d
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Documents */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <FileText size={18} className="text-indigo-400" /> Recent Documents
            </h3>
            <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">View all →</button>
          </div>
          <div className="space-y-3">
            {recentDocs.map((doc, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${doc.color}`}>
                    {doc.type}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-slate-500">{doc.time}</p>
                  </div>
                </div>
                <button className="p-1.5 text-slate-500 opacity-0 group-hover:opacity-100 hover:text-white transition-all">
                  <Download size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Quick Action Banner */}
          <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">🚀 Ready to file GSTR-1?</p>
              <p className="text-xs text-slate-400 mt-0.5">Deadline is in 4 days. Start now to avoid penalties.</p>
            </div>
            <button className="btn-primary text-xs py-2 px-4 whitespace-nowrap">
              File Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
