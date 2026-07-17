import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, Home, Book, AlertCircle, FileText, User, ChevronDown, Menu, X } from 'lucide-react';

const UserSidebar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'البوابة الرئيسية', path: '/user', exact: true },
    { icon: FileText, label: 'إجراءات التشغيل', path: '/user/sops' },
    { icon: Book, label: 'قاعدة المعرفة', path: '/user/knowledge-base' },
    { icon: AlertCircle, label: 'سجل المشاكل', path: '/user/cases' },
    { icon: FileText, label: 'المستندات', path: '/user/documents' },
    { icon: User, label: 'ملفي الشخصي', path: '/user/profile' },
  ];

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="sidebar-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className="sidebar" style={{ transform: mobileOpen ? 'translateX(0)' : '', zIndex: mobileOpen ? 50 : 'auto' }}>
        {/* Logo */}
        <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid #E2E8F0', marginBottom: '1rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={20} color="white" fill="white" />
            </div>
            <span style={{ fontWeight: 900, fontSize: '1.25rem', color: '#0F172A', letterSpacing: '-0.02em' }}>YAS</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '0 0.625rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {navItems.map((item, i) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            return (
              <Link
                key={i}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1rem',
                  borderRadius: 10,
                  textDecoration: 'none',
                  color: active ? '#2563EB' : '#64748B',
                  background: active ? '#EFF6FF' : 'transparent',
                  fontWeight: active ? 600 : 500,
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  border: active ? '1px solid #BFDBFE' : '1px solid transparent',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.background = '#F8FAFC';
                    e.currentTarget.style.color = '#334155';
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#64748B';
                  }
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '1rem', borderTop: '1px solid #E2E8F0', marginTop: 'auto' }}>
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 10, padding: '0.875rem', textAlign: 'center' }}>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#2563EB' }}>نقاطك</p>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: '#2563EB' }}>640 ⚡</p>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.7rem', color: '#64748B' }}>المرتبة #12</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default UserSidebar;
