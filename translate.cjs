const fs = require('fs');
const path = require('path');

const write = (file, content) => fs.writeFileSync(path.join(__dirname, 'src', file), content.trim() + '\n');

// 1. Sidebar
write('components/Sidebar.jsx', `
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Book, FileText, Folder, Briefcase, Users, Building, FileBarChart, Settings, Hexagon } from 'lucide-react';

const navItems = [
  { path: '/', label: 'لوحة التحكم', icon: LayoutDashboard },
  { path: '/knowledge-base', label: 'قاعدة المعرفة', icon: Book },
  { path: '/sops', label: 'إجراءات التشغيل (SOPs)', icon: FileText },
  { path: '/documents', label: 'المستندات', icon: Folder },
  { path: '/cases', label: 'سجل المشاكل', icon: Briefcase },
  { path: '/users', label: 'المستخدمين', icon: Users },
  { path: '/departments', label: 'الأقسام', icon: Building },
  { path: '/reports', label: 'التقارير', icon: FileBarChart },
  { path: '/settings', label: 'الإعدادات', icon: Settings },
];

const Sidebar = () => {
  return (
    <aside className="sidebar border-l border-slate-800" style={{ borderRight: 'none', borderLeft: '1px solid var(--border-sidebar)' }}>
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
              style={{ paddingLeft: '1.5rem', paddingRight: isActive ? '1.2rem' : '1.5rem', borderLeft: 'none', borderRight: isActive ? '3px solid var(--primary)' : 'none' }}
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
`);

// 2. TopNav
write('components/TopNav.jsx', `
import React from 'react';
import { Search, Bell, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TopNav = () => {
  const navigate = useNavigate();
  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search size={18} className="text-muted" />
        <input type="text" placeholder="ابحث في قاعدة المعرفة، الإجراءات، أو المستخدمين..." />
      </div>
      <div className="topbar-actions">
        <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-sm font-semibold border border-amber-200 cursor-pointer hover:bg-amber-100 transition" onClick={() => navigate('/profile')}>
          <Zap size={14} fill="currentColor" />
          <span>640 نقطة</span>
        </div>
        
        <button className="icon-btn">
          <Bell size={20} />
        </button>
        <div className="avatar" onClick={() => navigate('/profile')}>
          ي.س
        </div>
      </div>
    </header>
  );
};

export default TopNav;
`);

// 3. AIAssistant
write('components/AIAssistant.jsx', `
import React, { useState } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'أهلاً! أنا المساعد الذكي لـ OpsMind. يمكنني البحث في كافة الإجراءات وقاعدة المعرفة وحل المشاكل السابقة. كيف يمكنني مساعدتك اليوم؟' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newMessages = [...messages, { type: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    
    setTimeout(() => {
      setMessages([...newMessages, { 
        type: 'bot', 
        text: "بناءً على **SOP-104 (إعداد المهندسين الجدد)** والمشكلة السابقة **#405**، يجب التأكد من تفعيل خاصية (2FA) على حساب GitHub الخاص بالموظف قبل إرسال الدعوة. هل ترغب في فتح هذا الإجراء؟" 
      }]);
    }, 1500);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition z-50"
        style={{ border: 'none', cursor: 'pointer' }}
      >
        {isOpen ? <X size={24} /> : <Bot size={28} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 left-6 w-80 bg-white rounded-lg shadow-xl border border-slate-200 flex flex-col z-50" style={{ height: '450px' }}>
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center gap-2">
            <Sparkles size={20} />
            <div>
              <h3 className="font-semibold text-sm">المساعد الذكي لـ OpsMind</h3>
              <p className="text-xs text-blue-200">مدعوم بالمعرفة الداخلية للشركة</p>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-slate-50">
            {messages.map((msg, i) => (
              <div key={i} className={\`flex \${msg.type === 'user' ? 'justify-end' : 'justify-start'}\`}>
                <div className={\`max-w-[85%] p-3 rounded-lg text-sm \${msg.type === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'}\`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-white border-t border-slate-200 rounded-b-lg">
            <form onSubmit={handleSend} className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="اسأل عن أي إجراء أو مشكلة..." 
                className="flex-1 p-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500"
              />
              <button type="submit" className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 flex items-center justify-center" style={{ transform: 'rotate(180deg)' }}>
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
`);

// 4. Dashboard with Fetch
write('pages/Dashboard.jsx', `
import React, { useState, useEffect } from 'react';
import { Users, FileText, CheckCircle, Clock, Check, X } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/dashboard/stats')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load dashboard data', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">جاري التحميل...</div>;
  if (!data) return <div className="p-8 text-red-500">حدث خطأ أثناء تحميل البيانات من الخادم.</div>;

  return (
    <div>
      <div className="page-header">
        <h1>لوحة التحكم</h1>
        <button className="btn btn-primary">إنشاء تقرير</button>
      </div>

      <div className="card mb-6" style={{ borderRight: '4px solid #F59E0B' }}>
        <h2 className="card-title text-amber-600 flex items-center gap-2">الطلبات المعلقة ({data.approvals.length})</h2>
        <div className="flex flex-col gap-3">
          {data.approvals.map(approval => (
            <div key={approval.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-md border border-slate-200">
              <div>
                <p className="text-sm font-semibold">{approval.user}: {approval.action}</p>
                <p className="text-xs text-muted">{approval.details} • {approval.time}</p>
              </div>
              <div className="flex gap-2">
                <button className="icon-btn text-green-600 hover:bg-green-50" title="موافقة"><Check size={18} /></button>
                <button className="icon-btn text-red-600 hover:bg-red-50" title="رفض"><X size={18} /></button>
                <button className="btn btn-secondary text-sm py-1">مراجعة</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-4 mb-4">
        <div className="card stat-card">
          <div className="flex items-center gap-2 text-muted">
            <Users size={18} /> إجمالي المستخدمين
          </div>
          <div className="stat-value">{data.stats.totalUsers.value}</div>
          <div className={\`stat-change \${data.stats.totalUsers.isPositive ? 'positive' : 'negative'}\`}>{data.stats.totalUsers.change} هذا الشهر</div>
        </div>
        <div className="card stat-card">
          <div className="flex items-center gap-2 text-muted">
            <FileText size={18} /> إجراءات التشغيل الفعالة
          </div>
          <div className="stat-value">{data.stats.activeSOPs.value}</div>
          <div className={\`stat-change \${data.stats.activeSOPs.isPositive ? 'positive' : 'negative'}\`}>{data.stats.activeSOPs.change} هذا الأسبوع</div>
        </div>
        <div className="card stat-card">
          <div className="flex items-center gap-2 text-muted">
            <CheckCircle size={18} /> المشاكل المحلولة
          </div>
          <div className="stat-value">{data.stats.resolvedCases.value}</div>
          <div className={\`stat-change \${data.stats.resolvedCases.isPositive ? 'positive' : 'negative'}\`}>{data.stats.resolvedCases.change} عن الشهر الماضي</div>
        </div>
        <div className="card stat-card">
          <div className="flex items-center gap-2 text-muted">
            <Clock size={18} /> متوسط سرعة الاستجابة
          </div>
          <div className="stat-value">{data.stats.avgResponseTime.value}</div>
          <div className={\`stat-change \${data.stats.avgResponseTime.isPositive ? 'positive' : 'negative'}\`}>{data.stats.avgResponseTime.change} تحسن</div>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="card">
          <h2 className="card-title">نقاط الضعف في العمليات (SOP Analytics)</h2>
          <p className="text-sm text-muted mb-4">أكثر الإجراءات التي سببت مشاكل هذا الشهر.</p>
          <ul className="flex flex-col gap-4">
            <li className="flex justify-between items-center">
              <div className="flex-1">
                <p className="font-medium text-sm">SOP-104: إعداد المهندسين الجدد</p>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-1">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div className="text-left mr-4" style={{ minWidth: '40px' }}>
                <span className="font-bold text-red-600">24</span>
                <p className="text-xs text-muted">مشكلة</p>
              </div>
            </li>
            <li className="flex justify-between items-center">
              <div className="flex-1">
                <p className="font-medium text-sm">SOP-305: استرداد المصروفات</p>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-1">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div className="text-left mr-4" style={{ minWidth: '40px' }}>
                <span className="font-bold text-amber-600">16</span>
                <p className="text-xs text-muted">مشكلة</p>
              </div>
            </li>
          </ul>
          <button className="btn btn-secondary w-full mt-4 text-sm">عرض الإحصائيات بالكامل</button>
        </div>
        
        <div className="card">
          <h2 className="card-title">أفضل المساهمين في نقل المعرفة</h2>
          <p className="text-sm text-muted mb-4">الموظفين أصحاب أعلى نقاط مساهمة هذا الأسبوع.</p>
          <ul className="flex flex-col gap-4">
            <li className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="avatar bg-amber-500">م.ث</div>
                <div>
                  <p className="text-sm font-semibold">محمد ثروت</p>
                  <p className="text-xs text-muted">الهندسة</p>
                </div>
              </div>
              <div className="flex items-center gap-1 font-bold text-amber-600" dir="ltr">
                <span className="text-xs font-normal">pts</span> 1,250
              </div>
            </li>
            <li className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="avatar bg-blue-500">ع.ر</div>
                <div>
                  <p className="text-sm font-semibold">عبدالله رضا</p>
                  <p className="text-xs text-muted">إدارة المنتج</p>
                </div>
              </div>
              <div className="flex items-center gap-1 font-bold text-blue-600" dir="ltr">
                <span className="text-xs font-normal">pts</span> 980
              </div>
            </li>
            <li className="flex justify-between items-center pb-2">
              <div className="flex items-center gap-3">
                <div className="avatar bg-green-500">أ.ف</div>
                <div>
                  <p className="text-sm font-semibold">أنت (ادم)</p>
                  <p className="text-xs text-muted">الدعم الفني</p>
                </div>
              </div>
              <div className="flex items-center gap-1 font-bold text-green-600" dir="ltr">
                <span className="text-xs font-normal">pts</span> 640
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
`);

// 5. Cases
write('pages/Cases.jsx', `
import React, { useState, useEffect } from 'react';
import { Plus, Filter, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const Cases = () => {
  const [cases, setCases] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', sop: '' });

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = () => {
    fetch('http://localhost:5000/api/cases')
      .then(res => res.json())
      .then(data => setCases(data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(newCase => {
      setCases([newCase, ...cases]);
      setShowForm(false);
      setFormData({ title: '', sop: '' });
    });
  };

  return (
    <div>
      <div className="page-header">
        <h1>سجل المشاكل</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> الإبلاغ عن مشكلة
        </button>
      </div>

      {showForm && (
        <div className="card mb-6" style={{ borderRight: '4px solid var(--primary)' }}>
          <h2 className="card-title">إبلاغ عن مشكلة جديدة</h2>
          <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
            <div className="input-group col-span-2">
              <label className="input-label">عنوان المشكلة</label>
              <input 
                type="text" 
                className="input" 
                placeholder="وصف مختصر للمشكلة" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label">القسم</label>
              <select className="input bg-white">
                <option>الهندسة</option>
                <option>الموارد البشرية</option>
                <option>الدعم الفني</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">إجراء التشغيل المرتبط (اختياري)</label>
              <select 
                className="input bg-white"
                value={formData.sop}
                onChange={e => setFormData({...formData, sop: e.target.value})}
              >
                <option value="">اختر إجراء لتسجيله مع المشكلة...</option>
                <option value="SOP-104">SOP-104: إعداد المهندسين الجدد</option>
                <option value="SOP-201">SOP-201: نشر البرمجيات</option>
              </select>
              <p className="text-xs text-muted mt-1">ربط المشكلة بإجراء يساعد في تحديد نقاط القصور في النظام.</p>
            </div>
            <div className="input-group col-span-2">
              <label className="input-label">التفاصيل</label>
              <textarea className="input" rows="3" placeholder="أضف سياق إضافي..."></textarea>
            </div>
            <div className="col-span-2 flex justify-end gap-2 mt-2">
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>إلغاء</button>
              <button type="submit" className="btn btn-primary">إرسال البلاغ</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            <button className="text-sm font-medium text-primary border-b-2 border-primary pb-1">المشاكل المفتوحة ({cases.length})</button>
            <button className="text-sm font-medium text-muted pb-1">تم حلها</button>
          </div>
          <button className="btn btn-secondary text-sm py-1"><Filter size={14} /> تصفية</button>
        </div>

        <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <th className="pb-2 font-medium">رقم المشكلة</th>
              <th className="pb-2 font-medium">العنوان</th>
              <th className="pb-2 font-medium">المُبلغ</th>
              <th className="pb-2 font-medium">الإجراء المرتبط</th>
              <th className="pb-2 font-medium">الحالة</th>
              <th className="pb-2 font-medium">الوقت</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }} className="hover:bg-slate-50">
                <td className="py-3 text-sm font-medium text-primary">{c.id}</td>
                <td className="py-3 text-sm">{c.title}</td>
                <td className="py-3 text-sm text-muted">{c.reporter}</td>
                <td className="py-3 text-sm">
                  {c.sop !== 'لا يوجد' && c.sop !== '' ? <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">{c.sop}</span> : <span className="text-muted">-</span>}
                </td>
                <td className="py-3 text-sm">
                  <span className={\`flex items-center gap-1 text-xs px-2 py-1 rounded-full w-max \${c.status === 'مفتوح' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}\`}>
                    {c.status === 'مفتوح' ? <AlertCircle size={12} /> : <Clock size={12} />} {c.status}
                  </span>
                </td>
                <td className="py-3 text-sm text-muted">{c.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Cases;
`);

// 6. SOPs
write('pages/SOPs.jsx', `
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit3, Clock, AlertTriangle, FileText, MessageSquare } from 'lucide-react';

const SOPs = () => {
  const [activeTab, setActiveTab] = useState('content');
  const [sops, setSops] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/sops')
      .then(res => res.json())
      .then(data => setSops(data));
  }, []);

  if (!sops) return <div className="p-8">جاري التحميل...</div>;
  const currentSOP = sops[0];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{currentSOP.title}</h1>
          <p className="text-muted mt-2">إجراء تشغيل قياسي • {currentSOP.id} • {currentSOP.version}</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary"><Edit3 size={16} /> اقتراح تعديل</button>
          <button className="btn btn-primary"><Plus size={16} /> إضافة إجراء جديد</button>
        </div>
      </div>
      
      <div className="grid grid-cols-4" style={{ gap: '2rem' }}>
        <div className="col-span-3 flex flex-col gap-6">
          <div className="card">
            <div className="flex gap-4 mb-6" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <button 
                onClick={() => setActiveTab('content')}
                className={\`pb-2 \${activeTab === 'content' ? 'text-primary border-b-2 border-primary' : 'text-muted'}\`}
                style={{ fontWeight: 500, background: 'none', border: 'none', borderBottom: activeTab === 'content' ? '2px solid var(--primary)' : '2px solid transparent' }}
              >
                محتوى الإجراء
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={\`pb-2 \${activeTab === 'history' ? 'text-primary border-b-2 border-primary' : 'text-muted'}\`}
                style={{ fontWeight: 500, background: 'none', border: 'none', borderBottom: activeTab === 'history' ? '2px solid var(--primary)' : '2px solid transparent' }}
              >
                تاريخ الإصدارات
              </button>
            </div>

            {activeTab === 'content' ? (
              <div className="sop-content">
                <div className="mb-6">
                  <h3 className="mb-2">1. تجهيز الأجهزة (Hardware)</h3>
                  <p className="text-muted mb-4">يجب التأكد من استلام الموظف الجديد لأجهزته قبل تاريخ بدء العمل.</p>
                  <ul className="flex flex-col gap-2 list-disc pr-5">
                    <li>تقديم طلب لفريق الـ IT لتجهيز MacBook Pro.</li>
                    <li>طلب الملحقات اللازمة (شاشة، لوحة مفاتيح، ماوس).</li>
                    <li>تأكيد توصيل الأجهزة للمنزل أو لمكتب الموظف.</li>
                  </ul>
                </div>
                <div className="mb-6">
                  <h3 className="mb-2">2. الصلاحيات والوصول</h3>
                  <p className="text-muted mb-4">منح الموظف الصلاحيات اللازمة لأدوات الهندسة والمستودعات البرمجية.</p>
                  <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={18} className="text-amber-500 mt-1" />
                      <div>
                        <strong>ملاحظة هامة:</strong> الوصول لـ GitHub يتطلب تفعيل خاصية المصادقة الثنائية (2FA). لا ترسل الدعوة إلا بعد التأكد من التفعيل.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="history-timeline flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mt-1"></div>
                    <div className="w-px h-full bg-slate-200 my-1"></div>
                  </div>
                  <div className="pb-4">
                    <p className="font-semibold">{currentSOP.version} - إضافة تحذير 2FA</p>
                    <p className="text-sm text-muted">تمت الموافقة بواسطة سارة حسين • منذ يومين</p>
                    <p className="text-sm mt-2">تم إضافة تحذير بخصوص تفعيل 2FA في GitHub بناءً على المشكلة #405.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="card-title flex items-center gap-2"><MessageSquare size={18} /> النقاشات والملاحظات</h2>
            <div className="flex gap-3 mb-4">
              <div className="avatar">أ.م</div>
              <div className="flex-1">
                <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
                  <p className="text-sm font-semibold mb-1">أحمد محمود</p>
                  <p className="text-sm text-muted">أعتقد أنه يجب إضافة خطوة لطلب الوصول إلى AWS. انتظرت 3 أيام للحصول على الصلاحيات.</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <div className="avatar">ي.س</div>
              <div className="flex-1">
                <input type="text" className="input w-full" placeholder="أضف تعليق أو اقترح تعديلاً..." />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1 flex flex-col gap-6">
          <div className="card">
            <h3 className="font-semibold mb-4 text-sm text-slate-500">بيانات الإجراء</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="flex justify-between">
                <span className="text-muted">الحالة:</span>
                <span className="text-green-600 font-medium">{currentSOP.status}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted">المالك:</span>
                <span>{currentSOP.owner}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted">آخر مراجعة:</span>
                <span>{currentSOP.lastReview}</span>
              </li>
            </ul>
          </div>

          <div className="card border-amber-200 bg-amber-50">
            <h3 className="font-semibold mb-4 text-sm text-amber-800 flex items-center gap-2">
              <AlertTriangle size={16} /> المشاكل المرتبطة ({currentSOP.relatedCases.length})
            </h3>
            <p className="text-xs text-amber-700 mb-3">هذا الإجراء تم ربطه بأخطاء حدثت مؤخراً.</p>
            <ul className="flex flex-col gap-2">
              {currentSOP.relatedCases.map(c => (
                <li key={c.id} className="bg-white p-2 rounded border border-amber-200 text-sm">
                  <a href="#" className="font-medium text-primary block">مشكلة {c.id}</a>
                  <span className="text-muted text-xs">{c.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOPs;
`);

// 7. Login
write('pages/Login.jsx', `
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
          <h1 className="login-title">أهلاً بك مجدداً</h1>
          <p className="login-subtitle">قم بتسجيل الدخول لحسابك</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label">البريد الإلكتروني</label>
            <input type="email" className="input" placeholder="name@company.com" required defaultValue="admin@opsmind.io" />
          </div>
          <div className="input-group" style={{ marginBottom: '2rem' }}>
            <label className="input-label">كلمة المرور</label>
            <input type="password" className="input" placeholder="••••••••" required defaultValue="password" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
            تسجيل الدخول
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
`);

// 8. Profile
write('pages/Profile.jsx', `
import React from 'react';
import { Award, Zap, Book, CheckCircle, TrendingUp } from 'lucide-react';

const Profile = () => {
  return (
    <div>
      <div className="page-header">
        <h1>الملف الشخصي</h1>
        <button className="btn btn-primary">تعديل البيانات</button>
      </div>

      <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
        <div className="col-span-1 flex flex-col gap-6">
          <div className="card text-center flex flex-col items-center">
            <div className="avatar mb-4" style={{ width: 80, height: 80, fontSize: '2rem' }}>أ.ف</div>
            <h2 className="text-xl font-bold">ادم فاروق</h2>
            <p className="text-muted text-sm mb-4">مهندس دعم فني</p>
            
            <div className="w-full bg-slate-50 p-4 rounded-md border border-slate-200 flex justify-between items-center">
              <div className="text-right">
                <p className="text-xs text-muted font-semibold">نقاط المساهمة</p>
                <p className="text-2xl font-bold text-amber-600 flex items-center gap-1"><Zap size={20} fill="currentColor" /> 640</p>
              </div>
              <div className="text-left">
                <p className="text-xs text-muted font-semibold">الترتيب</p>
                <p className="text-lg font-bold text-slate-700">#12</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4 text-sm text-slate-500">شاراتي (BADGES)</h3>
            <div className="flex flex-wrap gap-3">
              <div className="flex flex-col items-center text-center w-20">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2 border border-blue-200">
                  <Book size={20} />
                </div>
                <span className="text-xs font-medium">صانع إجراءات</span>
              </div>
              <div className="flex flex-col items-center text-center w-20">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-2 border border-green-200">
                  <CheckCircle size={20} />
                </div>
                <span className="text-xs font-medium">حلال المشاكل</span>
              </div>
              <div className="flex flex-col items-center text-center w-20">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-2 border border-amber-200">
                  <TrendingUp size={20} />
                </div>
                <span className="text-xs font-medium">أفضل 10%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-2 flex flex-col gap-6">
          <div className="card">
            <h2 className="card-title">مساهماتي الأخيرة</h2>
            <ul className="flex flex-col gap-4">
              <li className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <p className="text-sm font-semibold">اقتراح تعديل: SOP-104 إعداد المهندسين الجدد</p>
                  <p className="text-xs text-muted">إضافة ملاحظة بخصوص مصادقة GitHub • تمت الموافقة</p>
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded" dir="ltr">+50 pts</span>
              </li>
              <li className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <p className="text-sm font-semibold">حل المشكلة #392: تأخير تسليم اللابتوب</p>
                  <p className="text-xs text-muted">تم توثيق تأخير المورد • تم الحل</p>
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded" dir="ltr">+100 pts</span>
              </li>
              <li className="flex justify-between items-center pb-3">
                <div>
                  <p className="text-sm font-semibold">إنشاء مقال: دليل استكشاف أخطاء VPN</p>
                  <p className="text-xs text-muted">قاعدة المعرفة • تم النشر</p>
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded" dir="ltr">+150 pts</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
`);

// 9. Generic empty placeholders in Arabic
const emptyPages = [
  { name: 'KnowledgeBase', title: 'قاعدة المعرفة' },
  { name: 'Documents', title: 'مكتبة المستندات' },
  { name: 'Users', title: 'إدارة المستخدمين' },
  { name: 'Departments', title: 'الأقسام' },
  { name: 'Reports', title: 'التقارير' },
  { name: 'Settings', title: 'الإعدادات' },
];

emptyPages.forEach(p => {
  write(\`pages/\${p.name}.jsx\`, \`
import React from 'react';

const \${p.name} = () => {
  return (
    <div>
      <div className="page-header">
        <h1>\${p.title}</h1>
      </div>
      <div className="card">
        <h2 className="card-title">نظرة عامة</h2>
        <p className="text-muted">مرحباً بك في صفحة \${p.title}. (هذه الصفحة قيد التطوير)</p>
      </div>
    </div>
  );
};

export default \${p.name};
\`);
});
