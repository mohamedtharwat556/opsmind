const fs = require('fs');
const path = require('path');

const pages = ['Login', 'Dashboard', 'KnowledgeBase', 'SOPs', 'Documents', 'Cases', 'Users', 'Departments', 'Reports', 'Settings', 'Profile'];

pages.forEach(page => {
  fs.writeFileSync(path.join(__dirname, 'src', 'pages', `${page}.jsx`), `
import React from 'react';

const ${page} = () => {
  return (
    <div>
      <div className="page-header">
        <h1>${page.replace(/([A-Z])/g, ' $1').trim()}</h1>
      </div>
      <div className="card">
        <h2 className="card-title">Overview</h2>
        <p className="text-muted">Welcome to the ${page} page.</p>
      </div>
    </div>
  );
};

export default ${page};
`.trim() + '\n');
});

// Specific pages with custom layouts
fs.writeFileSync(path.join(__dirname, 'src', 'pages', 'Login.jsx'), `
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hexagon } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <Hexagon fill="currentColor" size={32} />
            OpsMind
          </div>
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Sign in to your account</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input type="email" className="input" placeholder="name@company.com" required defaultValue="admin@opsmind.io" />
          </div>
          <div className="input-group" style={{ marginBottom: '2rem' }}>
            <label className="input-label">Password</label>
            <input type="password" className="input" placeholder="••••••••" required defaultValue="password" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
`.trim() + '\n');

fs.writeFileSync(path.join(__dirname, 'src', 'pages', 'Dashboard.jsx'), `
import React from 'react';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';

const Dashboard = () => {
  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <button className="btn btn-primary">Create Report</button>
      </div>
      
      <div className="grid grid-cols-4 mb-4">
        <div className="card stat-card">
          <div className="flex items-center gap-2 text-muted">
            <Users size={18} /> Total Users
          </div>
          <div className="stat-value">2,405</div>
          <div className="stat-change positive">+12.5% this month</div>
        </div>
        <div className="card stat-card">
          <div className="flex items-center gap-2 text-muted">
            <FileText size={18} /> Active SOPs
          </div>
          <div className="stat-value">148</div>
          <div className="stat-change positive">+3 new this week</div>
        </div>
        <div className="card stat-card">
          <div className="flex items-center gap-2 text-muted">
            <CheckCircle size={18} /> Resolved Cases
          </div>
          <div className="stat-value">856</div>
          <div className="stat-change negative">-2.4% from last month</div>
        </div>
        <div className="card stat-card">
          <div className="flex items-center gap-2 text-muted">
            <Clock size={18} /> Avg. Response Time
          </div>
          <div className="stat-value">1.2h</div>
          <div className="stat-change positive">-15m improvement</div>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="card">
          <h2 className="card-title">Recent Activity</h2>
          <ul className="flex flex-col gap-4">
            {[1, 2, 3, 4].map(i => (
              <li key={i} className="flex items-center gap-4">
                <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>User</div>
                <div>
                  <p className="text-sm"><strong>John Doe</strong> updated SOP "Onboarding Process"</p>
                  <p className="text-sm text-muted">2 hours ago</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h2 className="card-title">Pending Cases</h2>
          <ul className="flex flex-col gap-4">
            {[1, 2, 3, 4].map(i => (
              <li key={i} className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <p className="text-sm" style={{ fontWeight: 500 }}>Login Issue on Mobile App</p>
                  <p className="text-sm text-muted">Case #402{i} • Reported by IT Support</p>
                </div>
                <button className="btn btn-secondary text-sm">View</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
`.trim() + '\n');


fs.writeFileSync(path.join(__dirname, 'src', 'pages', 'KnowledgeBase.jsx'), `
import React from 'react';
import { Search, Folder, File } from 'lucide-react';

const KnowledgeBase = () => {
  return (
    <div>
      <div className="page-header">
        <h1>Knowledge Base</h1>
        <button className="btn btn-primary">New Article</button>
      </div>
      
      <div className="grid" style={{ gridTemplateColumns: '250px 1fr', alignItems: 'start' }}>
        <div className="card" style={{ padding: '1rem' }}>
          <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>CATEGORIES</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li className="flex items-center gap-2 p-2" style={{ backgroundColor: 'var(--bg-primary)', borderRadius: '0.25rem', fontWeight: 500 }}><Folder size={16} className="text-primary" /> Engineering</li>
            <li className="flex items-center gap-2 p-2"><Folder size={16} className="text-muted" /> Product</li>
            <li className="flex items-center gap-2 p-2"><Folder size={16} className="text-muted" /> Human Resources</li>
            <li className="flex items-center gap-2 p-2"><Folder size={16} className="text-muted" /> Sales Playbooks</li>
            <li className="flex items-center gap-2 p-2"><Folder size={16} className="text-muted" /> IT Support</li>
          </ul>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="topbar-search" style={{ width: '100%', backgroundColor: 'var(--bg-secondary)' }}>
            <Search size={18} className="text-muted" />
            <input type="text" placeholder="Search articles in Engineering..." />
          </div>
          
          <div className="card">
            <ul className="flex flex-col">
              {[1, 2, 3, 4, 5].map(i => (
                <li key={i} className="flex justify-between items-center p-4 hover:bg-slate-50 transition" style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <div className="flex items-center gap-3">
                    <File size={20} className="text-primary" />
                    <div>
                      <p style={{ fontWeight: 500 }}>System Architecture Overview {i}</p>
                      <p className="text-sm text-muted">Last updated 2 days ago by Sarah Jenkins</p>
                    </div>
                  </div>
                  <button className="btn btn-secondary text-sm">Read</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
`.trim() + '\n');


// Create Layout
fs.writeFileSync(path.join(__dirname, 'src', 'components', 'Layout.jsx'), `
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const Layout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <TopNav />
        <main className="page-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
`.trim() + '\n');

// Create Sidebar
fs.writeFileSync(path.join(__dirname, 'src', 'components', 'Sidebar.jsx'), `
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Book, FileText, Folder, Briefcase, Users, Building, FileBarChart, Settings, Hexagon } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/knowledge-base', label: 'Knowledge Base', icon: Book },
  { path: '/sops', label: 'SOPs', icon: FileText },
  { path: '/documents', label: 'Documents', icon: Folder },
  { path: '/cases', label: 'Cases', icon: Briefcase },
  { path: '/users', label: 'Users', icon: Users },
  { path: '/departments', label: 'Departments', icon: Building },
  { path: '/reports', label: 'Reports', icon: FileBarChart },
  { path: '/settings', label: 'Settings', icon: Settings },
];

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="login-logo" style={{ fontSize: '1.25rem', marginBottom: 0 }}>
          <Hexagon fill="currentColor" size={24} />
          OpsMind
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => \`nav-item \${isActive ? 'active' : ''}\`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
`.trim() + '\n');

// Create TopNav
fs.writeFileSync(path.join(__dirname, 'src', 'components', 'TopNav.jsx'), `
import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TopNav = () => {
  const navigate = useNavigate();
  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search size={18} className="text-muted" />
        <input type="text" placeholder="Search knowledge base, SOPs, users..." />
      </div>
      <div className="topbar-actions">
        <button className="icon-btn">
          <Bell size={20} />
        </button>
        <div className="avatar" onClick={() => navigate('/profile')}>
          YD
        </div>
      </div>
    </header>
  );
};

export default TopNav;
`.trim() + '\n');

fs.writeFileSync(path.join(__dirname, 'src', 'App.jsx'), `
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import KnowledgeBase from './pages/KnowledgeBase'
import SOPs from './pages/SOPs'
import Documents from './pages/Documents'
import Cases from './pages/Cases'
import Users from './pages/Users'
import Departments from './pages/Departments'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Profile from './pages/Profile'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="knowledge-base" element={<KnowledgeBase />} />
          <Route path="sops" element={<SOPs />} />
          <Route path="documents" element={<Documents />} />
          <Route path="cases" element={<Cases />} />
          <Route path="users" element={<Users />} />
          <Route path="departments" element={<Departments />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
`.trim() + '\n');

fs.writeFileSync(path.join(__dirname, 'src', 'main.jsx'), `
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`.trim() + '\n');
