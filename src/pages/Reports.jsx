import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Download, Users, FileText, CheckCircle, Clock, ArrowUpRight, Loader } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Reports = () => {
  const [cases, setCases] = useState([]);
  const [users, setUsers] = useState([]);
  const [sops, setSops] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/cases`).then(r => r.json()).then(setCases).catch(() => setCases([])),
      fetch(`${API_URL}/api/users`).then(r => r.json()).then(setUsers).catch(() => setUsers([])),
      fetch(`${API_URL}/api/sops`).then(r => r.json()).then(setSops).catch(() => setSops([]))
    ]).finally(() => setLoading(false));
  }, []);

  const openCases = cases.filter(c => c.status === 'مفتوح' || c.status === 'قيد العمل').length;
  const resolvedCases = cases.filter(c => c.status === 'محلول' || c.status === 'مغلق').length;
  const totalCases = cases.length;
  const resolveRate = totalCases > 0 ? Math.round((resolvedCases / totalCases) * 100) : 0;

  const handleDownloadPDF = () => {
    showToast('جاري إنشاء التقرير...', 'info');
    // محاكاة تحميل PDF
    setTimeout(() => {
      showToast('تم تحميل التقرير بنجاح! 📄', 'success');
    }, 1500);
  };

  const summaryCards = [
    { label: 'إجمالي الإجراءات الفعالة', value: sops.filter(s => s.status === 'فعال').length, icon: FileText, color: '#2563EB', bg: '#EFF6FF', change: '+1 جديد' },
    { label: 'مشاكل تم حلها', value: resolvedCases, icon: CheckCircle, color: '#10B981', bg: '#F0FDF4', change: '+3 هذا الأسبوع' },
    { label: 'متوسط وقت الحل', value: '2.4h', icon: Clock, color: '#D97706', bg: '#FFFBEB', change: 'تحسن -15 دقيقة' },
    { label: 'معدل الإنجاز', value: resolveRate + '%', icon: ArrowUpRight, color: '#7C3AED', bg: '#F5F3FF', change: '+4% هذا الشهر' },
  ];

  const deptData = [
    { dept: 'الهندسة',         count: 24, pct: 85, color: '#2563EB' },
    { dept: 'الدعم الفني',    count: 18, pct: 65, color: '#059669' },
    { dept: 'الموارد البشرية', count: 12, pct: 45, color: '#D97706' },
    { dept: 'المالية',         count:  6, pct: 22, color: '#DC2626' },
  ];

  const monthlyData = [
    { month: 'يناير', sops: 8,  cases: 32 },
    { month: 'فبراير', sops: 11, cases: 28 },
    { month: 'مارس',   sops: 15, cases: 45 },
    { month: 'أبريل',  sops: 9,  cases: 38 },
    { month: 'مايو',   sops: 20, cases: 52 },
    { month: 'يونيو',  sops: 13, cases: 48 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="page-header anim-up">
        <div>
          <h1>التقارير والإحصائيات</h1>
          <p className="page-sub">ملخص أداء المنصة، الأقسام، ومعدلات حل المشاكل</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={handleDownloadPDF}
          disabled={loading}
        >
          <Download size={16} /> {loading ? 'جاري التحميل...' : 'تحميل تقرير PDF'}
        </button>
      </div>

      {/* Summary KPIs */}
      <div className="grid-4">
        {summaryCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className={`card card-hover anim-up d${i+1}`}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1rem' }}>
                <p style={{ fontSize:'0.8rem', fontWeight:600, color:'#64748B' }}>{s.label}</p>
                <div style={{ width:36, height:36, borderRadius:10, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={17} color={s.color} />
                </div>
              </div>
              <p style={{ fontSize:'2rem', fontWeight:900, color:'#0F172A', lineHeight:1, marginBottom:'0.5rem', letterSpacing:'-0.03em' }}>{s.value}</p>
              <p style={{ fontSize:'0.75rem', color:'#10B981', fontWeight:600 }}>↑ {s.change}</p>
            </div>
          );
        })}
      </div>

      {/* Resolution Rate highlight */}
      <div className="card anim-up d5" style={{ background:'linear-gradient(135deg, #0F172A, #1E293B)', border:'none' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <h3 style={{ color:'white', fontWeight:800, fontSize:'1.125rem', margin:'0 0 0.5rem' }}>معدل حل المشاكل الإجمالي للمنصة</h3>
            <p style={{ color:'#64748B', fontSize:'0.875rem', margin:0 }}>نسبة المشاكل التي تم توثيقها وإغلاقها بنجاح من إجمالي البلاغات</p>
          </div>
          <div style={{ textAlign:'left' }}>
            <p style={{ fontSize:'3rem', fontWeight:900, color:'#22D3EE', lineHeight:1 }}>{resolveRate}%</p>
          </div>
        </div>
        <div style={{ height:8, background:'#334155', borderRadius:4, marginTop:'1.25rem', overflow:'hidden' }}>
          <div style={{ width: resolveRate + '%', height:'100%', background:'linear-gradient(90deg, #22D3EE, #3B82F6)', borderRadius:4, transition:'width 1s ease' }} />
        </div>
      </div>

      {/* Charts */}
      <div className="grid-2">
        {/* Issues by Dept */}
        <div className="card anim-up d6">
          <h2 className="card-title"><BarChart3 size={18} color="#2563EB" /> المشاكل حسب القسم</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem', marginTop:'1rem' }}>
            {deptData.map(item => (
              <div key={item.dept}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.875rem', marginBottom:'0.4rem' }}>
                  <span style={{ fontWeight:600, color:'#334155' }}>{item.dept}</span>
                  <span style={{ fontWeight:800, color:item.color }}>{item.count} مشكلة</span>
                </div>
                <div style={{ width:'100%', background:'#F1F5F9', height:10, borderRadius:5 }}>
                  <div style={{ width:item.pct+'%', background:item.color, height:10, borderRadius:5, transition:'width 0.8s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Performance */}
        <div className="card anim-up d6">
          <h2 className="card-title"><TrendingUp size={18} color="#059669" /> الأداء الشهري للمنصة</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem', marginTop:'1rem' }}>
            {monthlyData.map((row, i) => (
              <div key={row.month} style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                <span style={{ width:55, fontSize:'0.8rem', color:'#64748B', fontWeight:600, flexShrink:0 }}>{row.month}</span>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', gap:'0.25rem', marginBottom:'0.2rem' }}>
                    <div style={{ height:8, flex: row.sops, background:'#2563EB', borderRadius:4, opacity:0.9 }} />
                    <div style={{ height:8, flex: row.cases - row.sops, background:'#E2E8F0', borderRadius:4 }} />
                  </div>
                </div>
                <div style={{ display:'flex', gap:'0.75rem', flexShrink:0, fontSize:'0.75rem' }}>
                  <span style={{ color:'#2563EB', fontWeight:700 }}>{row.sops} SOP</span>
                  <span style={{ color:'#94A3B8' }}>{row.cases} بلاغ</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:'1rem', marginTop:'1rem', padding:'0.75rem', background:'#F8FAFC', borderRadius:10 }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
              <span style={{ width:10, height:10, borderRadius:2, background:'#2563EB', display:'inline-block' }} />
              <span style={{ fontSize:'0.75rem', color:'#64748B' }}>إجراءات SOPs</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
              <span style={{ width:10, height:10, borderRadius:2, background:'#E2E8F0', display:'inline-block' }} />
              <span style={{ fontSize:'0.75rem', color:'#64748B' }}>البلاغات الإجمالية</span>
            </div>
          </div>
        </div>

        {/* Top Contributors */}
        <div className="card anim-up d6" style={{ gridColumn:'1 / -1' }}>
          <h2 className="card-title"><Users size={18} color="#7C3AED" /> أداء وإنجازات المستخدمين</h2>
          <table style={{ width:'100%', borderCollapse:'collapse', textAlign:'right', marginTop:'0.5rem' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid #F1F5F9' }}>
                {['الموظف', 'القسم', 'الحالة', 'نقاط المساهمة', 'مستوى الأداء'].map(h => (
                  <th key={h} style={{ padding:'0.75rem 1rem', fontSize:'0.8rem', fontWeight:700, color:'#64748B' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => {
                const level = u.points > 1000 ? { label:'ممتاز', color:'#059669', bg:'#ECFDF5' } : u.points > 500 ? { label:'جيد جداً', color:'#D97706', bg:'#FFFBEB' } : { label:'جيد', color:'#64748B', bg:'#F8FAFC' };
                return (
                  <tr key={u.id} style={{ borderBottom:'1px solid #F8FAFC' }}
                    onMouseEnter={e => e.currentTarget.style.background='#F8FAFC'}
                    onMouseLeave={e => e.currentTarget.style.background='white'}
                  >
                    <td style={{ padding:'0.875rem 1rem' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.625rem' }}>
                        <div className="avatar" style={{ width:32, height:32, fontSize:'0.7rem', background:'#2563EB' }}>{u.name.charAt(0)}</div>
                        <span style={{ fontWeight:600, fontSize:'0.875rem', color:'#0F172A' }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding:'0.875rem 1rem', fontSize:'0.85rem', color:'#64748B' }}>{u.department}</td>
                    <td style={{ padding:'0.875rem 1rem' }}>
                      <span className={`badge ${u.status === 'نشط' ? 'badge-green' : 'badge-red'}`}>{u.status}</span>
                    </td>
                    <td style={{ padding:'0.875rem 1rem', fontWeight:800, color:'#D97706', fontSize:'0.9rem' }}>{u.points} ⚡</td>
                    <td style={{ padding:'0.875rem 1rem' }}>
                      <span style={{ fontSize:'0.75rem', fontWeight:700, color:level.color, background:level.bg, padding:'0.2rem 0.6rem', borderRadius:6 }}>{level.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
