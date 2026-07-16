import React, { useState, useEffect } from 'react';
import { Search, FileText, AlertCircle, BookOpen, Zap, ArrowLeft, Clock, Play, ChevronRight, TrendingUp, Star, X, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const quickActions = [
  { icon: FileText,    label: 'إجراءات التشغيل',   desc: 'تصفح الخطوات القياسية الموثقة',      path:'/user/sops',           color:'#2563EB', bg:'#EFF6FF' },
  { icon: AlertCircle, label: 'الإبلاغ عن مشكلة',  desc: 'سجّل مشكلة لتوثيقها وحلها',         path:'/user/cases',          color:'#DC2626', bg:'#FEF2F2' },
  { icon: BookOpen,    label: 'قاعدة المعرفة',      desc: 'مقالات، شروحات، وأدلة الاستخدام',   path:'/user/knowledge-base', color:'#059669', bg:'#F0FDF4' },
];

const EmployeePortal = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [sops, setSops] = useState([]);
  const [articles, setArticles] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/sops').then(r => r.json()).then(setSops).catch(() => {});
    fetch('http://localhost:5000/api/articles').then(r => r.json()).then(setArticles).catch(() => {});
    fetch('http://localhost:5000/api/announcements').then(r => r.json()).then(setAnnouncements).catch(() => {});
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults(null); return; }
    const t = setTimeout(() => {
      fetch(`http://localhost:5000/api/search?q=${searchQuery}`)
        .then(r => r.json()).then(setSearchResults).catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const totalResults = searchResults ? (searchResults.sops?.length || 0) + (searchResults.articles?.length || 0) + (searchResults.cases?.length || 0) : 0;

  const handleDismissAnnouncement = (id) => {
    setDismissedAnnouncements([...dismissedAnnouncements, id]);
  };

  const activeAnnouncements = announcements.filter(a => !dismissedAnnouncements.includes(a.id) && a.status === 'نشط');

  return (
    <>
      {/* Active Announcements Banner */}
      {activeAnnouncements.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          {activeAnnouncements.map(ann => (
            <div key={ann.id} 
              style={{ 
                background: ann.priority === 'حرجة' ? 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)' : 
                           ann.priority === 'عالية' ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' :
                           'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
                borderRadius: 14,
                padding: '1.25rem',
                marginBottom: '1rem',
                border: ann.priority === 'حرجة' ? '2px solid #FCA5A5' :
                        ann.priority === 'عالية' ? '2px solid #FCD34D' :
                        '2px solid #93C5FD',
                position: 'relative',
                animation: 'slideIn 0.3s ease'
              }}
              className="anim-up"
            >
              <div style={{ display: 'flex', alignItems: 'start', gap: '1rem', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <MessageSquare size={18} color={ann.priority === 'حرجة' ? '#DC2626' : ann.priority === 'عالية' ? '#D97706' : '#2563EB'} />
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 700, 
                      background: ann.priority === 'حرجة' ? '#DC2626' : ann.priority === 'عالية' ? '#D97706' : '#2563EB',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: 6
                    }}>
                      {ann.priority === 'حرجة' ? '⚠️ إعلان حرج' : ann.priority === 'عالية' ? '📢 إعلان مهم' : '📬 إعلان'}
                    </span>
                  </div>
                  <p style={{ 
                    fontWeight: 800, 
                    fontSize: '1rem', 
                    color: ann.priority === 'حرجة' ? '#7F1D1D' : ann.priority === 'عالية' ? '#78350F' : '#1E40AF',
                    margin: '0 0 0.5rem',
                    lineHeight: 1.4
                  }}>
                    {ann.title}
                  </p>
                  <p style={{ 
                    fontSize: '0.875rem',
                    color: ann.priority === 'حرجة' ? '#991B1B' : ann.priority === 'عالية' ? '#92400E' : '#1E3A8A',
                    margin: '0 0 0.5rem',
                    lineHeight: 1.5
                  }}>
                    {ann.content}
                  </p>
                  <p style={{ 
                    fontSize: '0.75rem',
                    color: ann.priority === 'حرجة' ? '#DC2626' : ann.priority === 'عالية' ? '#D97706' : '#2563EB',
                    fontWeight: 600
                  }}>
                    من: <strong>{ann.author}</strong> • {new Date(ann.timestamp).toLocaleDateString('ar-EG')}
                  </p>
                </div>
                <button
                  onClick={() => handleDismissAnnouncement(ann.id)}
                  style={{
                    background: 'rgba(0,0,0,0.1)',
                    border: 'none',
                    borderRadius: 6,
                    padding: '0.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: ann.priority === 'حرجة' ? '#DC2626' : ann.priority === 'عالية' ? '#D97706' : '#2563EB',
                    flexShrink: 0
                  }}
                  title="إغلاق الإعلان"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="anim-up" style={{ background:'linear-gradient(135deg, #1E40AF 0%, #0F172A 100%)', borderRadius:20, padding:'3rem 2.5rem', textAlign:'center', position:'relative', overflow:'hidden' }}>
        {/* Decorative blobs */}
        <div style={{ position:'absolute', width:300, height:300, borderRadius:'50%', background:'rgba(96,165,250,0.08)', top:-100, right:-80, pointerEvents:'none' }} />
        <div style={{ position:'absolute', width:200, height:200, borderRadius:'50%', background:'rgba(139,92,246,0.07)', bottom:-50, left:-50, pointerEvents:'none' }} />
        
        <p style={{ fontSize:'0.8125rem', fontWeight:700, color:'#60A5FA', background:'rgba(96,165,250,0.12)', display:'inline-flex', alignItems:'center', gap:'0.4rem', padding:'0.3rem 1rem', borderRadius:20, marginBottom:'1.25rem', border:'1px solid rgba(96,165,250,0.2)' }}>
          <Star size={12} fill="#60A5FA" /> منصة YAS للعمليات المؤسسية
        </p>
        <h1 style={{ fontSize:'2.5rem', fontWeight:900, color:'white', marginBottom:'0.75rem', letterSpacing:'-0.03em', lineHeight:1.2 }}>
          كيف يمكننا<br /><span style={{ color:'#60A5FA' }}>مساعدتك اليوم؟</span>
        </h1>
        <p style={{ color:'#94A3B8', fontSize:'1rem', marginBottom:'2.5rem' }}>
          ابحث في قاعدة المعرفة، إجراءات التشغيل، والمشاكل المحلولة.
        </p>
        <div style={{ maxWidth:600, margin:'0 auto', position:'relative' }}>
          <Search style={{ position:'absolute', right:'1.25rem', top:'50%', transform:'translateY(-50%)', color:'#64748B', pointerEvents:'none' }} size={20} />
          <input
            className="input"
            placeholder="مثال: كيفية إعداد GitHub أو استرجاع كلمة مرور VPN..."
            style={{ padding:'1rem 3.5rem 1rem 1.25rem', borderRadius:14, fontSize:'1rem', border:'2px solid transparent', boxShadow:'0 8px 30px rgba(0,0,0,0.25)', background:'white', textAlign:'right' }}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchResults && (
            <div style={{ position:'absolute', top:'110%', right:0, left:0, background:'white', borderRadius:14, boxShadow:'0 20px 40px rgba(0,0,0,0.15)', border:'1px solid #E2E8F0', zIndex:50, overflow:'hidden', textAlign:'right' }}>
              {totalResults === 0 ? (
                <p style={{ padding:'1.25rem', color:'#64748B', fontSize:'0.875rem' }}>لا توجد نتائج مطابقة.</p>
              ) : (
                <>
                  {searchResults.sops?.map(s => (
                    <div key={s.id} onClick={() => { navigate('/user/sops'); setSearchQuery(''); }} style={{ padding:'0.875rem 1.25rem', cursor:'pointer', borderBottom:'1px solid #F1F5F9', display:'flex', alignItems:'center', gap:'0.75rem' }}
                      onMouseEnter={e => e.currentTarget.style.background='#F8FAFC'}
                      onMouseLeave={e => e.currentTarget.style.background='white'}
                    >
                      <span style={{ fontSize:'0.7rem', fontWeight:700, background:'#EFF6FF', color:'#2563EB', padding:'0.15rem 0.5rem', borderRadius:6 }}>SOP</span>
                      <span style={{ fontSize:'0.875rem', color:'#0F172A', fontWeight:600 }}>{s.id}: {s.title}</span>
                    </div>
                  ))}
                  {searchResults.articles?.map(a => (
                    <div key={a.id} onClick={() => { navigate('/user/knowledge-base'); setSearchQuery(''); }} style={{ padding:'0.875rem 1.25rem', cursor:'pointer', borderBottom:'1px solid #F1F5F9', display:'flex', alignItems:'center', gap:'0.75rem' }}
                      onMouseEnter={e => e.currentTarget.style.background='#F8FAFC'}
                      onMouseLeave={e => e.currentTarget.style.background='white'}
                    >
                      <span style={{ fontSize:'0.7rem', fontWeight:700, background:'#F0FDF4', color:'#059669', padding:'0.15rem 0.5rem', borderRadius:6 }}>مقال</span>
                      <span style={{ fontSize:'0.875rem', color:'#0F172A' }}>{a.title}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid-3">
        {quickActions.map((c, i) => {
          const Icon = c.icon;
          return (
            <button key={i} className={`card card-hover anim-up d${i+1}`} onClick={() => navigate(c.path)}
              style={{ cursor:'pointer', textAlign:'center', padding:'2rem 1.5rem', border:'2px solid transparent', background:'white', width:'100%', transition:'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = c.color+'40'; e.currentTarget.style.transform='translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='transparent'; e.currentTarget.style.transform='none'; }}
            >
              <div style={{ width:64, height:64, borderRadius:16, background:c.bg, color:c.color, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.25rem', transition:'transform 0.2s' }}>
                <Icon size={30} />
              </div>
              <p style={{ fontWeight:800, fontSize:'1rem', color:'#0F172A', marginBottom:'0.4rem' }}>{c.label}</p>
              <p style={{ color:'#64748B', fontSize:'0.8125rem', lineHeight:1.55 }}>{c.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Bottom Row */}
      <div className="grid-2">
        {/* Recent SOPs with Play button */}
        <div className="card anim-up d4">
          <h3 className="card-title"><Clock size={16} color="#64748B" /> آخر الإجراءات المحدّثة</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.625rem' }}>
            {sops.slice(0,3).map((sop, i) => (
              <div key={sop.id} style={{ display:'flex', alignItems:'center', gap:'0.875rem', padding:'0.875rem', borderRadius:10, border:'1px solid #F1F5F9', background:'#FAFAFA', cursor:'pointer', transition:'all 0.18s' }}
                onMouseEnter={e => { e.currentTarget.style.background='white'; e.currentTarget.style.borderColor='#E2E8F0'; e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='#FAFAFA'; e.currentTarget.style.borderColor='#F1F5F9'; e.currentTarget.style.boxShadow='none'; }}
                onClick={() => navigate('/user/sops')}
              >
                <div style={{ width:36, height:36, borderRadius:10, background:'#EFF6FF', color:'#2563EB', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <FileText size={18} />
                </div>
                <div style={{ flex:1, textAlign:'right' }}>
                  <span className="badge badge-blue" style={{ fontSize:'0.65rem', marginBottom:'0.25rem' }}>{sop.id}</span>
                  <p style={{ fontWeight:600, fontSize:'0.875rem', color:'#0F172A', margin:'0' }}>{sop.title}</p>
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.25rem' }}>
                  <span className={`badge ${sop.status === 'فعال' ? 'badge-green' : 'badge-amber'}`} style={{ fontSize:'0.65rem' }}>{sop.status}</span>
                  <ChevronRight size={14} color="#CBD5E1" />
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-secondary" style={{ width:'100%', marginTop:'0.875rem', justifyContent:'center' }} onClick={() => navigate('/user/sops')}>
            عرض جميع الإجراءات
          </button>
        </div>

        {/* Stats / Gamification — fetched from articles count as proxy */}
        <div className="card anim-up d5" style={{ background:'#0F172A', border:'none', color:'white' }}>
          <h3 className="card-title" style={{ color:'white' }}>
            <Zap size={16} fill="#F59E0B" color="#F59E0B" /> ملخص إنجازاتك
          </h3>

          <div style={{ display:'flex', gap:'1rem', marginBottom:'1.5rem' }}>
            <div style={{ flex:1, background:'#1E293B', borderRadius:12, padding:'1rem' }}>
              <p style={{ fontSize:'0.75rem', color:'#64748B', marginBottom:'0.5rem' }}>نقاط المساهمة</p>
              <p style={{ fontSize:'2.25rem', fontWeight:900, color:'#FBBF24', letterSpacing:'-0.03em', lineHeight:1 }}>640</p>
            </div>
            <div style={{ flex:1, background:'#1E293B', borderRadius:12, padding:'1rem' }}>
              <p style={{ fontSize:'0.75rem', color:'#64748B', marginBottom:'0.5rem' }}>ترتيبك</p>
              <p style={{ fontSize:'2.25rem', fontWeight:900, color:'white', lineHeight:1 }}>#12</p>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.75rem', marginBottom:'1.25rem' }}>
            {[['14','مشكلة محلولة'],['3','SOPs مقترحة'],[sops.length.toString(),'إجراء متاح']].map(([val,label],i) => (
              <div key={i} style={{ background:'#1E293B', borderRadius:10, padding:'0.75rem', textAlign:'center' }}>
                <p style={{ fontSize:'1.375rem', fontWeight:800, color:'white', lineHeight:1, marginBottom:'0.3rem' }}>{val}</p>
                <p style={{ fontSize:'0.7rem', color:'#64748B' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Progress bar toward next level */}
          <div style={{ background:'#1E293B', borderRadius:10, padding:'0.875rem', marginBottom:'1rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.5rem' }}>
              <span style={{ fontSize:'0.75rem', color:'#94A3B8', fontWeight:600 }}>التقدم نحو المستوى التالي</span>
              <span style={{ fontSize:'0.75rem', color:'#FBBF24', fontWeight:700 }}>640 / 1000 pts</span>
            </div>
            <div style={{ height:8, background:'#334155', borderRadius:4, overflow:'hidden' }}>
              <div style={{ width:'64%', height:'100%', background:'linear-gradient(90deg, #FBBF24, #F97316)', borderRadius:4 }} />
            </div>
          </div>

          <button className="btn" style={{ width:'100%', justifyContent:'center', background:'#1E293B', color:'#94A3B8', border:'none', fontSize:'0.8125rem' }}
            onClick={() => navigate('/user/profile')}
          >
            عرض ملف الإنجازات الكامل
          </button>
        </div>
      </div>

      {/* Top Articles */}
      {articles.length > 0 && (
        <div className="card anim-up">
          <h3 className="card-title"><TrendingUp size={16} color="#2563EB" /> المقالات الأكثر قراءة في قاعدة المعرفة</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.875rem', marginTop:'0.5rem' }}>
            {articles.slice(0,3).map(a => (
              <div key={a.id} onClick={() => navigate('/user/knowledge-base')}
                style={{ padding:'1.25rem', borderRadius:12, border:'1px solid #F1F5F9', background:'#FAFAFA', cursor:'pointer', transition:'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background='white'; e.currentTarget.style.boxShadow='0 4px 14px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor='#E2E8F0'; }}
                onMouseLeave={e => { e.currentTarget.style.background='#FAFAFA'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor='#F1F5F9'; }}
              >
                <span className="badge badge-blue" style={{ fontSize:'0.65rem', marginBottom:'0.5rem', display:'inline-block' }}>{a.category}</span>
                <p style={{ fontWeight:700, fontSize:'0.875rem', color:'#0F172A', marginBottom:'0.5rem', lineHeight:1.4 }}>{a.title}</p>
                <p style={{ fontSize:'0.75rem', color:'#94A3B8' }}>{a.views} مشاهدة · {a.updated}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeePortal;
