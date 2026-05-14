import React, { useState } from 'react';
import {
  LayoutDashboard, MessageSquare, FileText, BarChart3,
  Settings, LogOut, Search, Bell, User, ChevronRight
} from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import DashboardOverview from './components/DashboardOverview';
import DocumentsPage from './components/DocumentsPage';
import AnalyticsPage from './components/AnalyticsPage';
import SettingsPage from './components/SettingsPage';

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'chat', icon: MessageSquare, label: 'Tax Assistant' },
  { id: 'documents', icon: FileText, label: 'Documents' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const pageTitle = menuItems.find(m => m.id === activeTab)?.label || 'Dashboard';

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', gap: '16px', padding: '16px', background: 'var(--bg-dark)' }}>
      {/* Sidebar */}
      <aside style={{ width: '240px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}
        className="glass-card">
        {/* Logo */}
        <div style={{ padding: '24px 24px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #10b981)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', fontWeight: 'bold', flexShrink: 0
            }}>₹</div>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: '700', background: 'linear-gradient(to right, #818cf8, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                TaxMind
              </h1>
              <p style={{ fontSize: '10px', color: '#64748b', marginTop: '-2px' }}>AI Tax Assistant</p>
            </div>
          </div>
        </div>

        <div style={{ padding: '0 12px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569', marginBottom: '8px', fontWeight: '600' }}>
          Navigation
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {menuItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 14px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                  background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                  color: active ? '#818cf8' : '#94a3b8',
                  borderLeft: active ? '2px solid #6366f1' : '2px solid transparent',
                  transition: 'all 0.15s ease',
                  textAlign: 'left', fontSize: '14px', fontWeight: active ? '600' : '400',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#f1f5f9'; }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; } }}
              >
                <item.icon size={18} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {active && <ChevronRight size={14} />}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <User size={16} className="text-white" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#f1f5f9' }}>Rohit Kumar</p>
              <p style={{ fontSize: '11px', color: '#64748b' }}>Pro Plan</p>
            </div>
            <button
              title="Logout"
              style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={e => e.currentTarget.style.color = '#475569'}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Header */}
        <header style={{
          height: '64px', flexShrink: 0, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: '16px', padding: '0 4px'
        }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#f8fafc' }}>{pageTitle}</h2>
            <p style={{ fontSize: '12px', color: '#64748b' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search..."
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px', padding: '8px 12px 8px 36px', fontSize: '13px',
                  color: '#f1f5f9', outline: 'none', width: '220px',
                }}
              />
            </div>
            {/* Bell */}
            <button style={{ position: 'relative', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', cursor: 'pointer', color: '#94a3b8' }}>
              <Bell size={18} />
              <span style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', border: '2px solid #0f172a' }}></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
          {activeTab === 'dashboard' && <DashboardOverview />}
          {activeTab === 'chat' && (
            <div style={{ height: 'calc(100vh - 128px)' }}>
              <ChatInterface />
            </div>
          )}
          {activeTab === 'documents' && <DocumentsPage />}
          {activeTab === 'analytics' && <AnalyticsPage />}
          {activeTab === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}

export default App;
