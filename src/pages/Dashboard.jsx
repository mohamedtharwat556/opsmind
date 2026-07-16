import React, { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
import { Users, FileText, CheckCircle, Clock, Check, X, TrendingUp, AlertTriangle, Zap, Activity, PlayCircle, Edit3, XCircle, AlertCircle, Send, MessageSquare } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const Dashboard = () => {
  const [data, setData]       = useState(null);
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
      fetch('http://localhost:5000/api/dashboard/stats').then(res => res.json()),
      fetch('http://localhost:5000/api/audit-logs').then(res => res.json()),
      fetch('http://localhost:5000/api/announcements').then(res => res.json())
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
      const response = await fetch('http://localhost:5000/api/announcements', {
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
      const response = await fetch(`http://localhost:5000/api/announcements/${id}`, {
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
    fetch(`http://localhost:5000/api/dashboard/approvals/${id}/action`, {
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
    { label:'إجمالي المستخدمين',       value:data.stats.totalUsers.value,       change:data.stats.totalUsers.change,       up:data.stats.totalUsers.isPositive,       icon:Users,        iconBg:'#EFF6FF', iconColor:'#2563EB' },
    { label:'إجراءات التشغيل الفعالة', value:data.stats.activeSOPs.value,       change:data.stats.activeSOPs.change,       up:data.stats.activeSOPs.isPositive,       icon:FileText,     iconBg:'#F5F3FF', iconColor:'#7C3AED' },
    { label:'المشاكل المحلولة',         value:data.stats.resolvedCases.value,    change:data.stats.resolvedCases.change,    up:data.stats.resolvedCases.isPositive,    icon:CheckCircle,  iconBg:'#F0FDF4', iconColor:'#16A34A' },
    { label:'متوسط وقت الاستجابة',     value:data.stats.avgResponseTime.value,  change:data.stats.avgResponseTime.change,  up:data.stats.avgResponseTime.isPositive,  icon:Clock,        iconBg:'#FFFBEB', iconColor:'#D97706' },
  ];

  const bottlenecks = [
    { name:'SOP-104: إعداد المهندسين الجدد',  count:24, pct:85, color:'#EF4444' },
    { name:'SOP-305: استرداد المصروفات',      count:16, pct:60, color:'#F59E0B' },
    { name:'SOP-201: نشر البرمجيات',          count: 9, pct:35, color:'#3B82F6' },
  ];

  const leaders = [
    { name:'محمد ثروت',   dept:'الهندسة',        pts:'1,250', init:'م.ث', medal:'🥇', bg:'#2563EB' },
    { name:'عبدالله رضا',  dept:'إدارة المنتج',   pts:  '980', init:'ع.ر', medal:'🥈', bg:'#7C3AED' },
    { name:'ادم فاروق',  dept:'الدعم الفني',    pts:  '640', init:'أ.ف', medal:'🥉', bg:'#059669' },
  ];

  return (
    <>
      {/* Header */}
      <div className="page-header anim-up">
        <div>
          <h1>لوحة التحكم</h1>
          <p className="page-sub">{new Date().toLocaleDateString('ar-EG',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
        </div>
        <button className="btn btn-primary"><TrendingUp size={15} /> إنشاء تقرير</button>
      </div>

      {/* Stats Grid */}
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

      {/* Announcements Section */}
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

      {/* Pending Approvals */}
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


// Note: Analytics section commented out - can be uncommented if needed
// Uncomment this code to add the Analytics section back:
/*
      {/* Analytics */}
      <div className="grid-2">
        {/* Bottlenecks */}
        <div className={`card anim-up d6`}>
          <h3 className="card-title">
            <TrendingUp size={16} color="#2563EB" /> نقاط الضعف في العمليات
          </h3>
          <p style={{ fontSize:'0.8125rem', color:'#94A3B8', marginBottom:'1.25rem', marginTop:'-0.5rem' }}>أكثر الإجراءات التي سببت مشاكل هذا الشهر</p>
          <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
            {bottlenecks.map((b, i) => (
              <div key={i}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.5rem' }}>
                  <span style={{ fontWeight:500, fontSize:'0.875rem', color:'#334155' }}>{b.name}</span>
                  <span style={{ fontWeight:800, fontSize:'0.875rem', color:b.color }}>{b.count}</span>
                </div>
                <div style={{ height:8, borderRadius:4, background:'#F1F5F9', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:b.pct+'%', background:b.color, borderRadius:4, transition:'width 1s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className={`card anim-up d6`}>
          <h3 className="card-title">
            <Zap size={16} fill="#F59E0B" color="#F59E0B" /> أفضل المساهمين هذا الأسبوع
          </h3>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            {leaders.map((u, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'0.875rem', padding:'0.875rem 1rem', borderRadius:10, background:'#F8FAFC', border:'1px solid #F1F5F9', transition:'all 0.18s', cursor:'default' }}
                onMouseEnter={e => { e.currentTarget.style.background='white'; e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='#F8FAFC'; e.currentTarget.style.boxShadow='none'; }}
              >
                <span style={{ fontSize:'1.375rem', width:30, textAlign:'center' }}>{u.medal}</span>
                <div className="avatar" style={{ width:38, height:38, fontSize:'0.8rem', background:u.bg }}>{u.init}</div>
                <div style={{ flex:1 }}>
                  <p style={{ fontWeight:700, fontSize:'0.875rem', color:'#0F172A', margin:'0 0 0.15rem' }}>{u.name}</p>
                  <p style={{ fontSize:'0.775rem', color:'#94A3B8' }}>{u.dept}</p>
                </div>
                <span style={{ fontWeight:800, color:'#D97706', fontSize:'0.9rem' }}>{u.pts} <span style={{ fontSize:'0.7rem', fontWeight:500, color:'#94A3B8' }}>pts</span></span>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log Activity Timeline */}
        <div className="card anim-up d6" style={{ gridColumn: '1 / -1' }}>
          <h3 className="card-title">
            <Activity size={18} color="#2563EB" /> سجل النشاط والرقابة على المنصة (System Audit Log)
          </h3>
          <p className="page-sub" style={{ marginBottom: '1.25rem', marginTop: '-0.5rem' }}>رقابة فورية على جميع العمليات والتشغيل لضمان جودة الأداء</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {auditLogs.map((log, i) => {
              let Icon = Activity;
              let iconColor = '#2563EB';
              let bgColor = '#EFF6FF';
              
              if (log.action.includes('تشغيل')) {
                Icon = PlayCircle;
                iconColor = '#8B5CF6';
                bgColor = '#F5F3FF';
              } else if (log.action.includes('مقترح') || log.action.includes('تعديل')) {
                Icon = Edit3;
                iconColor = '#F59E0B';
                bgColor = '#FFFBEB';
                if (log.action.includes('قبول')) {
                  Icon = CheckCircle;
                  iconColor = '#10B981';
                  bgColor = '#ECFDF5';
                } else if (log.action.includes('رفض')) {
                  Icon = XCircle;
                  iconColor = '#EF4444';
                  bgColor = '#FEF2F2';
                }
              } else if (log.action.includes('حل')) {
                Icon = CheckCircle;
                iconColor = '#10B981';
                bgColor = '#ECFDF5';
              }

              return (
                <div key={log.id} style={{ display: 'flex', gap: '1rem', borderBottom: i === auditLogs.length - 1 ? 'none' : '1px solid #F1F5F9', paddingBottom: '1rem', alignItems: 'center' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '10px', background: bgColor, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} />
                  </div>
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0F172A' }}>{log.user}</span>
                      <span style={{ margin: '0 0.5rem', color: '#94A3B8', fontSize: '0.8125rem' }}>قام بـ:</span>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#334155' }}>{log.action}</span>
                      <span style={{ margin: '0 0.5rem', color: '#94A3B8', fontSize: '0.8125rem' }}>لـ</span>
                      <span style={{ fontSize: '0.875rem', color: '#64748B' }}>{log.target}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span className={`badge ${log.status.includes('بنجاح') || log.status.includes('مغلق') ? 'badge-blue' : log.status.includes('رفض') ? 'badge-slate' : 'badge-amber'}`} style={{ fontSize: '0.7rem', fontWeight: 600, background: log.status.includes('رفض') ? '#FEF2F2' : '', color: log.status.includes('رفض') ? '#EF4444' : '' }}>{log.status}</span>
                      <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{log.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
*/
