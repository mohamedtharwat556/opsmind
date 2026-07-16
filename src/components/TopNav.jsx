import React, { useState } from 'react';
import { Bell, Menu, LogOut, Search, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

const TopNav = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <nav className="top-nav">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
        <button className="btn-icon d-lg-none">
          <Menu size={20} color="#64748B" />
        </button>
        
        {/* Global Search */}
        <div className="search-bar" style={{ position: 'relative', maxWidth: '400px', display: 'none' }}>
          <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }} size={18} />
          <input placeholder="ابحث..." style={{ paddingLeft: '2.5rem', paddingRight: '1rem', width: '100%', height: '36px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#F8FAFC', fontFamily: 'inherit', fontSize: '0.875rem' }} />
        </div>
      </div>

      {/* Right Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button 
            className="btn-icon" 
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ position: 'relative' }}
          >
            <Bell size={20} color="#64748B" />
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '20px', height: '20px', borderRadius: '50%', background: '#EF4444', color: 'white', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', width: '380px', background: 'white', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.12)', border: '1px solid #E2E8F0', zIndex: 100, maxHeight: '500px', overflowY: 'auto' }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>الإشعارات</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: '#2563EB', fontWeight: 600 }}>
                    تحديد الكل كمقروء
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {notifications.slice(0, 8).map(n => (
                  <div key={n.id} style={{ padding: '1rem', borderBottom: '1px solid #F1F5F9', background: n.read ? 'white' : '#EFF6FF', cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseEnter={e => { if (!n.read) e.currentTarget.style.background = '#E0ECFF'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = n.read ? 'white' : '#EFF6FF'; }}
                  >
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: n.read ? 'transparent' : '#2563EB', marginTop: '0.5rem', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 0.2rem', fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>{n.title}</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B', lineHeight: 1.4 }}>{n.message}</p>
                        <p style={{ margin: '0.25rem 0 0', fontSize: '0.7rem', color: '#94A3B8' }}>{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {notifications.length > 8 && (
                <div style={{ padding: '0.75rem', textAlign: 'center', borderTop: '1px solid #F1F5F9' }}>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: '#2563EB', fontWeight: 600 }}>عرض جميع الإشعارات</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingRight: '1rem', borderRight: '1px solid #E2E8F0' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: '0 0 0.15rem', fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>{user?.name || 'الموظف'}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B' }}>{user?.role || 'موظف'}</p>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#2563EB', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
            {user?.name?.charAt(0) || 'أ'}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-icon" title="الإعدادات">
            <Settings size={20} color="#64748B" />
          </button>
          <button className="btn-icon" onClick={handleLogout} title="تسجيل الخروج">
            <LogOut size={20} color="#64748B" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
