import React, { useState, useEffect } from 'react';
import { Users, FileText, CheckCircle, Clock, Check, X, TrendingUp, AlertTriangle, Zap, Activity, PlayCircle, Edit3, XCircle, AlertCircle, Send, MessageSquare } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    targetAudience: 'الجميع',
    priority: 'عادية'
  });
  const { showToast } = useToast();

  const fetchDashboardData = () => {
    Promise.all([
      fetch(`${API_URL}/api/dashboard/stats`).then(res => res.json()),
      fetch(`${API_URL}/api/audit-logs`).then(res => res.json()),
      fetch(`${API_URL}/api/announcements`).then(res => res.json())
    ])
      .then(([statsData, logs, announceData]) => {
        setData(statsData);
        setAuditLogs(logs);
        setAnnouncements(announceData || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch data:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();

    if (!announcementForm.title.trim()) {
      showToast('عنوان الإعلان مطلوب', 'error');
      return;
    }

    if (announcementForm.title.trim().length < 5) {
      showToast('عنوان الإعلان يجب أن يكون 5 أحرف على الأقل', 'error');
      return;
    }

    if (!announcementForm.content.trim()) {
      showToast('محتوى الإعلان مطلوب', 'error');
      return;
    }

    if (announcementForm.content.trim().length < 10) {
      showToast('محتوى الإعلان يجب أن يكون 10 أحرف على الأقل', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/announcements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(announcementForm)
      });

      if (!response.ok) {
        const error = await response.json();
        showToast(error.error || 'فشل في إنشاء الإعلان', 'error');
        return;
      }

      const newAnnouncement = await response.json();
      setAnnouncements([newAnnouncement, ...announcements]);
      setAnnouncementForm({ title: '', content: '', targetAudience: 'الجميع', priority: 'عادية' });
      setShowAnnouncementForm(false);
      showToast('تم نشر الإعلان بنجاح! سيراه جميع الموظفين.', 'success');
    } catch (error) {
      console.error('Error creating announcement:', error);
      showToast('حدث خطأ في نشر الإعلان', 'error');
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('هل تريد حذف هذا الإعلان؟')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/announcements/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        showToast('فشل في حذف الإعلان', 'error');
        return;
      }

      setAnnouncements(announcements.filter(a => a.id !== id));
      showToast('تم حذف الإعلان', 'success');
    } catch (error) {
      console.error('Error deleting announcement:', error);
      showToast('حدث خطأ في حذف الإعلان', 'error');
    }
  };

  const handleApprovalAction = (id, action) => {
    fetch(`${API_URL}/api/dashboard/approvals/${id}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    })
      .then(res => res.json())
      .then(() => {
        fetchDashboardData();
      })
      .catch(err => console.error('Failed to handle approval action', err));
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh', flexDirection:'column', gap:'1rem' }}>
      <div className="spinner" />
      <p style={{ color:'#64748B', fontSize:'0.875rem' }}>جاري تحميل البيانات...</p>
    </div>
  );

  if (!data) return (
    <div style={{ textAlign:'center', padding:'4rem', color:'#EF4444' }}>
      <AlertTriangle size={40} style={{ margin:'0 auto 1rem', opacity:0.5 }} />
      <p style={{ fontWeight:600 }}>تعذّر الاتصال بالخادم. تأكد من تشغيل الـ Backend على المنفذ 5000.</p>
    </div>
  );

  const stats = [
    { label:'إجمالي المستخدمين', value:data.stats.totalUsers.value, change:data.stats.totalUsers.change, up:data.stats.totalUsers.isPositive, icon:Users, iconBg:'#EFF6FF', iconColor:'#2563EB' },
    { label:'إجراءات التشغيل الفعالة', value:data.stats.activeSOPs.value, change:data.stats.activeSOPs.change, up:data.stats.activeSOPs.isPositive, icon:FileText, iconBg:'#F5F3FF', iconColor:'#7C3AED' },
    { label:'المشاكل المحلولة', value:data.stats.resolvedCases.value, change:data.stats.resolvedCases.change, up:data.stats.resolvedCases.isPositive, icon:CheckCircle, iconBg:'#F0FDF4', iconColor:'#16A34A' },
    { label:'متوسط وقت الاستجابة', value:data.stats.avgResponseTime.value, change:data.stats.avgResponseTime.change, up:data.stats.avgResponseTime.isPositive, icon:Clock, iconBg:'#FFFBEB', iconColor:'#D97706' },
  ];

  return (
    <>
      <div className="page-header anim-up">
        <div>
          <h1>لوحة التحكم</h1>
          <p className="page-sub">{new Date().toLocaleDateString('ar-EG',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
        </div>
        <button className="btn btn-primary"><TrendingUp size={15} /> إنشاء تقرير</button>
      </div>

      <div className="grid-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className={`card card-hover anim-up d${i+1}`}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
                <p style={{ fontSize:'0.8125rem', fontWeight:600, color:'#64748B' }}>{s.label}</p>
                <div style={{ width:36, height:36, borderRadius:10, background:s.iconBg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon size={17} color={s.iconColor} />
                </div>
              </div>
              <p style={{ fontSize:'2rem', fontWeight:900, color:'#0F172A', lineHeight:1, marginBottom:'0.5rem', letterSpacing:'-0.03em' }}>{s.value}</p>
              <p className={`stat-delta ${s.up?'up':'down'}`}>{s.up?'↑':'↓'} {s.change}</p>
            </div>
          );
        })}
      </div>

      <div className={`card anim-up d5`} style={{ borderRight:'3px solid #2563EB' }}>
        <h3 className="card-title">
          <MessageSquare size={16} color="#2563EB" />
          الإعلانات والبلاغات
          <span className="badge badge-blue" style={{ marginRight:'auto' }}>{announcements.length} إعلان</span>
        </h3>

        {!showAnnouncementForm ? (
          <button 
            className="btn btn-primary" 
            style={{ width:'100%', justifyContent:'center', marginBottom:'1rem' }}
            onClick={() => setShowAnnouncementForm(true)}
          >
            <Send size={14} /> نشر إعلان جديد
          </button>
        ) : (
          <form onSubmit={handleCreateAnnouncement} style={{ padding:'1rem', background:'#F8FAFC', borderRadius:12, marginBottom:'1rem', border:'1px solid #E2E8F0' }}>
            <div style={{ marginBottom:'0.875rem' }}>
              <label style={{ fontSize:'0.8125rem', fontWeight:600, color:'#334155', display:'block', marginBottom:'0.5rem' }}>عنوان الإعلان</label>
              <input
                type="text"
                className="input"
                placeholder="مثال: إجازة العيد أو تحديث النظام..."
                value={announcementForm.title}
                onChange={e => setAnnouncementForm({...announcementForm, title: e.target.value})}
                style={{ width:'100%' }}
              />
            </div>

            <div style={{ marginBottom:'0.875rem' }}>
              <label style={{ fontSize:'0.8125rem', fontWeight:600, color:'#334155', display:'block', marginBottom:'0.5rem' }}>المحتوى</label>
              <textarea
                className="input"
                placeholder="اكتب تفاصيل الإعلان هنا..."
                value={announcementForm.content}
                onChange={e => setAnnouncementForm({...announcementForm, content: e.target.value})}
                style={{ width:'100%', minHeight:'100px', resize:'vertical' }}
              />
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.875rem', marginBottom:'0.875rem' }}>
              <div>
                <label style={{ fontSize:'0.8125rem', fontWeight:600, color:'#334155', display:'block', marginBottom:'0.5rem' }}>الفئة المستهدفة</label>
                <select
                  className="input"
                  value={announcementForm.targetAudience}
                  onChange={e => setAnnouncementForm({...announcementForm, targetAudience: e.target.value})}
                  style={{ width:'100%' }}
                >
                  <option>الجميع</option>
                  <option>الهندسة</option>
                  <option>الدعم الفني</option>
                  <option>الموارد البشرية</option>
                  <option>المالية</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize:'0.8125rem', fontWeight:600, color:'#334155', display:'block', marginBottom:'0.5rem' }}>الأولوية</label>
                <select
                  className="input"
                  value={announcementForm.priority}
                  onChange={e => setAnnouncementForm({...announcementForm, priority: e.target.value})}
                  style={{ width:'100%' }}
                >
                  <option>عادية</option>
                  <option>عالية</option>
                  <option>حرجة</option>
                </select>
              </div>
            </div>

            <div style={{ display:'flex', gap:'0.5rem', justifyContent:'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowAnnouncementForm(false)}
              >
                <X size={14} /> إلغاء
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                <Send size={14} /> نشر الإعلان
              </button>
            </div>
          </form>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:'0.625rem' }}>
          {announcements.length > 0 ? (
            announcements.map(ann => (
              <div key={ann.id} style={{ padding:'1rem', background:'#F8FAFC', borderRadius:10, border:'1px solid #E2E8F0' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'start', marginBottom:'0.5rem' }}>
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:700, fontSize:'0.9rem', color:'#0F172A', margin:'0 0 0.25rem' }}>{ann.title}</p>
                    <p style={{ fontSize:'0.75rem', color:'#64748B' }}>
                      {ann.author} • {new Date(ann.timestamp).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteAnnouncement(ann.id)}
                    style={{ background:'#FEF2F2', color:'#DC2626', border:'none', padding:'0.5rem', borderRadius:6, cursor:'pointer', fontSize:'0.8rem', fontWeight:600 }}
                  >
                    <X size={14} />
                  </button>
                </div>
                <p style={{ fontSize:'0.8125rem', color:'#334155', margin:'0.5rem 0 0' }}>{ann.content}</p>
                <div style={{ display:'flex', gap:'0.5rem', marginTop:'0.5rem' }}>
                  <span className={`badge ${ann.priority === 'عالية' ? 'badge-red' : ann.priority === 'حرجة' ? 'badge-orange' : 'badge-blue'}`} style={{ fontSize:'0.65rem' }}>
                    {ann.priority}
                  </span>
                  <span className="badge badge-slate" style={{ fontSize:'0.65rem' }}>
                    {ann.targetAudience}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p style={{ fontSize: '0.875rem', color: '#64748B', textAlign: 'center', padding: '1rem' }}>لا توجد إعلانات حالياً.</p>
          )}
        </div>
      </div>

      <div className={`card anim-up d5`} style={{ borderRight:'3px solid #F59E0B' }}>
        <h3 className="card-title">
          <AlertTriangle size={16} color="#D97706" />
          الطلبات المعلقة للموافقة
          <span className="badge badge-amber" style={{ marginRight:'auto' }}>{data.approvals.length} طلب</span>
        </h3>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.625rem' }}>
          {data.approvals.length > 0 ? (
            data.approvals.map(a => (
              <div key={a.id} style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'0.875rem 1rem', borderRadius:10, background:'#FFFBEB', border:'1px solid #FDE68A' }}>
                <div className="avatar" style={{ width:36, height:36, fontSize:'0.75rem', background:'#D97706', flexShrink:0 }}>
                  {a.user.charAt(0)}
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontWeight:600, fontSize:'0.875rem', color:'#0F172A', margin:'0 0 0.2rem' }}>{a.user}: <span style={{ fontWeight:500 }}>{a.action}</span></p>
                  <p style={{ fontSize:'0.775rem', color:'#92400E' }}>{a.details} · {a.time}</p>
                </div>
                <div style={{ display:'flex', gap:'0.5rem', flexShrink:0 }}>
                  <button 
                    className="btn btn-success" 
                    style={{ padding:'0.375rem 0.875rem', fontSize:'0.8rem', gap:'0.3rem' }}
                    onClick={() => handleApprovalAction(a.id, 'approve')}
                  >
                    <Check size={14} /> موافقة
                  </button>
                  <button 
                    className="btn btn-danger" 
                    style={{ padding:'0.375rem 0.875rem', fontSize:'0.8rem', gap:'0.3rem' }}
                    onClick={() => handleApprovalAction(a.id, 'reject')}
                  >
                    <X size={14} /> رفض
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ fontSize: '0.875rem', color: '#64748B', textAlign: 'center', padding: '1rem' }}>لا توجد طلبات معلقة حالياً.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
