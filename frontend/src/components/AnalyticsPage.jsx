import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { TrendingDown, TrendingUp, IndianRupee } from 'lucide-react';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
);

const chartOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#94a3b8' } },
    y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#94a3b8' } },
  },
};

const AnalyticsPage = () => {
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];

  const gstData = {
    labels: months,
    datasets: [{
      label: 'GST Paid (₹)',
      data: [42000, 38000, 55000, 48000, 52000, 61000, 45000, 49000],
      backgroundColor: 'rgba(99,102,241,0.6)',
      borderRadius: 6,
    }],
  };

  const taxTrendData = {
    labels: months,
    datasets: [{
      label: 'Tax Liability (₹)',
      data: [18000, 15000, 22000, 19000, 21000, 25000, 17000, 20000],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16,185,129,0.08)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#10b981',
      pointRadius: 4,
    }],
  };

  const deductionData = {
    labels: ['80C (ELSS/PPF)', 'HRA', '80D (Medical)', 'Home Loan', 'Others'],
    datasets: [{
      data: [150000, 96000, 25000, 200000, 30000],
      backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
      borderWidth: 0,
      hoverOffset: 8,
    }],
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Tax Analytics</h2>
        <p className="text-slate-400 mt-1">Visual overview of your tax payments, liabilities, and deductions.</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-3 gap-5">
        {[
          { label: 'Total GST Paid (FY25)', value: '₹3,90,000', icon: IndianRupee, trend: '+8%', up: false },
          { label: 'Total Tax Liability', value: '₹1,57,000', icon: TrendingDown, trend: '-5%', up: true },
          { label: 'Total Deductions Claimed', value: '₹5,01,000', icon: TrendingUp, trend: '+15%', up: true },
        ].map((k, i) => (
          <div key={i} className="glass-card p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20 flex-shrink-0">
              <k.icon size={20} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">{k.label}</p>
              <p className="text-xl font-bold">{k.value}</p>
              <span className={`text-xs font-semibold ${k.up ? 'text-emerald-400' : 'text-red-400'}`}>{k.trend} vs last year</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="text-lg font-bold mb-1">Monthly GST Payments</h3>
          <p className="text-xs text-slate-400 mb-5">GST paid per month (FY 2024-25)</p>
          <div className="h-56">
            <Bar data={gstData} options={chartOpts} />
          </div>
        </div>

        {/* Doughnut */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-1">Deductions Breakdown</h3>
          <p className="text-xs text-slate-400 mb-4">Chapter VI-A deductions</p>
          <div className="h-48">
            <Doughnut
              data={deductionData}
              options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 10, font: { size: 11 } } } } }}
            />
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold mb-1">Tax Liability Trend</h3>
        <p className="text-xs text-slate-400 mb-5">Monthly income tax liability over time</p>
        <div className="h-48">
          <Line data={taxTrendData} options={chartOpts} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
