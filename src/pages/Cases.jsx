import React, { useState, useEffect } from 'react';
import { Plus, Filter, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

const Cases = () => {
  const [cases, setCases] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('open'); // 'open' or 'resolved'
  
  const [formData, setFormData] = useState({ title: '', sop: '', details: '', department: 'الدعم الفني' });

  const fetchCases = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/cases')
      .then(res => res.json())
      .then(data => { 
        setCases(data); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    fetch('http://localhost:5000/api/cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: formData.title,
        sop: formData.sop || 'لا يوجد',
        reporter: 'ادم فاروق'
      })
    })
      .then(res => res.json())
      .then(() => {
        fetchCases();
        setShowForm(false);
        setFormData({ title: '', sop: '', details: '', department: 'الدعم الفني' });
      });
  };

  const handleResolve = (id) => {
    // Replace '#' with encoded character if needed, but here it's safe to pass direct or via URI encoding
    const encodedId = encodeURIComponent(id);
    fetch(`http://localhost:5000/api/cases/${encodedId}/resolve`, {
      method: 'PUT'
    })
      .then(res => res.json())
      .then(() => {
        fetchCases();
      });
  };

  const filteredCases = cases.filter(c => {
    if (activeTab === 'open') {
      return c.status === 'مفتوح' || c.status === 'قيد العمل';
    } else {
      return c.status === 'محلول';
    }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="page-header anim-up">
        <div>
          <h1>سجل المشاكل والبلاغات</h1>
          <p className="page-sub">توثيق المشاكل التشغيلية اليومية وربطها بإجراءات الـ SOPs لتحديثها</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> الإبلاغ عن مشكلة
        </button>
      </div>

      {showForm && (
        <div className="card anim-up" style={{ borderRight: '4px solid #2563EB' }}>
          <h2 className="card-title">إبلاغ عن مشكلة جديدة</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">عنوان المشكلة *</label>
              <input className="input" placeholder="وصف مختصر وواضح للمشكلة" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
            </div>
            <div className="input-group">
              <label className="form-label">القسم المختص</label>
              <select className="input" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
                <option value="الدعم الفني">الدعم الفني</option>
                <option value="الهندسة">الهندسة</option>
                <option value="الموارد البشرية">الموارد البشرية</option>
                <option value="المالية">المالية</option>
              </select>
            </div>
            <div className="input-group">
              <label className="form-label">إجراء التشغيل المرتبط (SOP)</label>
              <select className="input" value={formData.sop} onChange={e => setFormData({ ...formData, sop: e.target.value })}>
                <option value="">اختر إجراء...</option>
                <option value="SOP-104">SOP-104: إعداد المهندسين الجدد</option>
                <option value="SOP-201">SOP-201: نشر البرمجيات</option>
                <option value="SOP-305">SOP-305: استرداد المصروفات</option>
              </select>
            </div>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">تفاصيل المشكلة والخطوات المطلوبة لحلها</label>
              <textarea className="input" rows="3" placeholder="أضف سياق المشكلة والبيانات المتوفرة للحل..." value={formData.details} onChange={e => setFormData({ ...formData, details: e.target.value })} style={{ resize: 'vertical' }}></textarea>
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>إلغاء</button>
              <button type="submit" className="btn btn-primary">إرسال البلاغ</button>
            </div>
          </form>
        </div>
      )}

      <div className="card anim-up" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', padding: '1rem 1.5rem', borderBottom: '1px solid #E2E8F0', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <button 
              onClick={() => setActiveTab('open')}
              style={{ background: 'none', border: 'none', borderBottom: activeTab === 'open' ? '2px solid #2563EB' : '2px solid transparent', color: activeTab === 'open' ? '#2563EB' : '#64748B', fontWeight: activeTab === 'open' ? 700 : 500, fontSize: '0.875rem', paddingBottom: '0.5rem', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              المشاكل المفتوحة ({cases.filter(c => c.status !== 'محلول').length})
            </button>
            <button 
              onClick={() => setActiveTab('resolved')}
              style={{ background: 'none', border: 'none', borderBottom: activeTab === 'resolved' ? '2px solid #2563EB' : '2px solid transparent', color: activeTab === 'resolved' ? '#2563EB' : '#64748B', fontWeight: activeTab === 'resolved' ? 700 : 500, fontSize: '0.875rem', paddingBottom: '0.5rem', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              تم حلها ({cases.filter(c => c.status === 'محلول').length})
            </button>
          </div>
          <button className="btn btn-secondary" style={{ padding: '0.375rem 0.875rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Filter size={14} /> تصفية المشاكل
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
            <p>جاري تحميل قائمة المشاكل...</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '0.875rem 1.5rem', fontWeight: 600, fontSize: '0.8rem', color: '#64748B' }}>رقم المشكلة</th>
                <th style={{ padding: '0.875rem 1.5rem', fontWeight: 600, fontSize: '0.8rem', color: '#64748B' }}>العنوان</th>
                <th style={{ padding: '0.875rem 1.5rem', fontWeight: 600, fontSize: '0.8rem', color: '#64748B' }}>المُبلغ</th>
                <th style={{ padding: '0.875rem 1.5rem', fontWeight: 600, fontSize: '0.8rem', color: '#64748B' }}>الإجراء المرتبط</th>
                <th style={{ padding: '0.875rem 1.5rem', fontWeight: 600, fontSize: '0.8rem', color: '#64748B' }}>الحالة</th>
                <th style={{ padding: '0.875rem 1.5rem', fontWeight: 600, fontSize: '0.8rem', color: '#64748B' }}>الوقت</th>
                <th style={{ padding: '0.875rem 1.5rem', fontWeight: 600, fontSize: '0.8rem', color: '#64748B', textAlign: 'left' }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((c, i) => (
                <tr key={i} className="animate-fadeIn" style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s', animationDelay: `${i * 0.05}s` }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}
                >
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 700, fontSize: '0.875rem', color: '#2563EB' }}>{c.id}</td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 500, color: '#0F172A', maxWidth: '280px' }}>{c.title}</td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748B' }}>{c.reporter}</td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                    {c.sop && c.sop !== 'لا يوجد' ? (
                      <span style={{ background: '#EFF6FF', color: '#2563EB', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>{c.sop}</span>
                    ) : <span style={{ color: '#94A3B8' }}>—</span>}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.75rem', borderRadius: '20px', ...(c.status === 'مفتوح' ? { background: '#FEF2F2', color: '#DC2626' } : c.status === 'قيد العمل' ? { background: '#FFFBEB', color: '#D97706' } : { background: '#ECFDF5', color: '#059669' }) }}>
                      <AlertCircle size={12} /> {c.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.8rem', color: '#64748B' }}>{c.time}</td>
                  <td style={{ padding: '1rem', textAlign: 'left' }}>
                    {c.status !== 'محلول' ? (
                      <button 
                        className="btn btn-success" 
                        style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', gap: '0.25rem' }}
                        onClick={() => handleResolve(c.id)}
                      >
                        <CheckCircle2 size={13} /> تم الحل
                      </button>
                    ) : (
                      <span style={{ color: '#10B981', fontSize: '0.8rem', fontWeight: 600 }}>إغلاق مكتمل ✓</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredCases.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                    لا توجد مشاكل معروضة حالياً.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Cases;
