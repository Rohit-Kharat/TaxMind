import React, { useState } from 'react';
import { User, Bell, Key, Shield, Smartphone, CreditCard, Save } from 'lucide-react';

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [regime, setRegime] = useState('new');
  
  const sections = [
    { id: 'profile', label: 'Profile & Tax Settings', icon: User },
    { id: 'integrations', label: 'API & Integrations', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Privacy', icon: Shield },
    { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Settings</h2>
        <p className="text-slate-400 mt-1">Manage your account, tax preferences, and integrations.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                  activeSection === section.id
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
                }`}
              >
                <section.icon size={18} />
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 glass-card p-8">
          {activeSection === 'profile' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex items-center gap-6 pb-8 border-b border-white/10">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold border-4 border-slate-800">
                  RK
                </div>
                <div>
                  <h3 className="text-xl font-bold">Rohit Kumar</h3>
                  <p className="text-slate-400 text-sm mt-1">rohit.kumar@example.com</p>
                  <button className="mt-3 text-xs font-semibold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors">
                    Change Avatar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <input type="text" defaultValue="Rohit Kumar" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">PAN Number</label>
                  <input type="text" defaultValue="ABCDE1234F" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors font-mono" />
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/10">
                <div>
                  <h4 className="text-lg font-semibold">Tax Regime Preference</h4>
                  <p className="text-sm text-slate-400 mt-1">Choose which tax regime the AI assistant should use for default calculations.</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setRegime('new')}
                    className={`flex-1 p-4 rounded-xl border transition-all text-left ${regime === 'new' ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      New Regime
                      {regime === 'new' && <div className="w-2 h-2 rounded-full bg-indigo-400"></div>}
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Lower tax rates, minimal deductions (Sec 80C, HRA not applicable). Recommended for most.</p>
                  </button>
                  <button
                    onClick={() => setRegime('old')}
                    className={`flex-1 p-4 rounded-xl border transition-all text-left ${regime === 'old' ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      Old Regime
                      {regime === 'old' && <div className="w-2 h-2 rounded-full bg-indigo-400"></div>}
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Higher rates, but allows claiming all exemptions like 80C, 80D, HRA, Home Loan Interest.</p>
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition-colors">
                  <Save size={18} /> Save Changes
                </button>
              </div>
            </div>
          )}

          {activeSection === 'integrations' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h3 className="text-xl font-bold">API Integrations</h3>
                <p className="text-slate-400 text-sm mt-1">Connect external services to power your TaxMind assistant.</p>
              </div>

              <div className="space-y-4">
                <div className="p-5 border border-white/10 rounded-2xl bg-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                        <Key className="text-emerald-400" size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">OpenAI API Key</h4>
                        <p className="text-xs text-slate-400">Required for the AI assistant functionality</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">Connected</span>
                  </div>
                  <input type="password" value="sk-................................" readOnly className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-500 font-mono" />
                </div>

                <div className="p-5 border border-white/10 rounded-2xl bg-white/5 opacity-75 hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                        <Smartphone className="text-orange-400" size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">GST Portal Integration</h4>
                        <p className="text-xs text-slate-400">Auto-sync GST returns & liabilities</p>
                      </div>
                    </div>
                    <button className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-colors">Connect</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {['notifications', 'security', 'billing'].includes(activeSection) && (
            <div className="flex flex-col items-center justify-center h-64 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <Shield size={24} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
              <p className="text-slate-400 text-sm max-w-md">
                We are actively working on building out the {sections.find(s => s.id === activeSection)?.label} features. Stay tuned!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
