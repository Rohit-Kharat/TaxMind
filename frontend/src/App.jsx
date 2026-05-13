import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut,
  Search,
  Bell,
  User
} from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import DashboardOverview from './components/DashboardOverview';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'chat', icon: MessageSquare, label: 'Tax Assistant' },
    { id: 'documents', icon: FileText, label: 'Documents' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 glass-card m-4 mr-0 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
            TaxMind AI
          </h1>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-red-400 transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search reports, laws, filings..." 
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
            </button>
            <div className="flex items-center space-x-3 pl-4 border-l border-white/10">
              <div className="text-right">
                <p className="text-sm font-semibold">Rohit Kumar</p>
                <p className="text-xs text-slate-400">Pro Member</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center border-2 border-white/10">
                <User size={20} className="text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 p-8 pt-0 overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardOverview />}
          {activeTab === 'chat' && <ChatInterface />}
          {activeTab === 'documents' && <div className="text-center py-20 text-slate-500">Document Management (Coming Soon)</div>}
          {activeTab === 'analytics' && <div className="text-center py-20 text-slate-500">Tax Analytics Dashboard (Coming Soon)</div>}
          {activeTab === 'settings' && <div className="text-center py-20 text-slate-500">Account Settings (Coming Soon)</div>}
        </div>
      </main>
    </div>
  );
}

export default App;
