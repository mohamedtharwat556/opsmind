import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutDashboard, Book, FileText, Briefcase, Users, Settings, Hexagon } from 'lucide-react';

const employeeNavItems = [
  { path: '/', label: 'الرئيسية', icon: Home },
  { path: '/knowledge-base', label: 'قاعدة المعرفة', icon: Book },
  { path: '/sops', label: 'إجراءات التشغيل', icon: FileText },
  { path: '/cases', label: 'الإبلاغ عن مشكلة', icon: Briefcase },
];

const adminNavItems = [
  { path: '/admin', label: 'لوحة تحكم الإدارة', icon: LayoutDashboard },
  { path: '/users', label: 'إدارة المستخدمين', icon: Users },
  { path: '/settings', label: 'الإعدادات', icon: Settings },
];

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="login-logo" style={{ fontSize: '1.5rem', marginBottom: 0, fontWeight: 800 }}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
            <Hexagon fill="currentColor" size={24} />
          </div>
          OpsMind
        </div>
      </div>
      <nav className="sidebar-nav">
        <div className="px-6 mb-2 mt-4 text-xs font-bold text-slate-400 uppercase tracking-wider">مساحة الموظف</div>
        {employeeNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <div className="px-6 mb-2 mt-8 text-xs font-bold text-slate-400 uppercase tracking-wider">الإدارة (مؤقت للعرض)</div>
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      
      {/* Mini Profile Switch in Sidebar */}
      <div className="p-4 border-t border-slate-200/50 m-2 rounded-xl bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="avatar w-10 h-10">أ.ف</div>
          <div>
            <p className="text-sm font-bold text-slate-800">ادم فاروق</p>
            <p className="text-xs text-slate-500">مهندس دعم فني</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
