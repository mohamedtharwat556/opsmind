import React, { useState, useEffect } from 'react';
import { Building, Users, FileText, ChevronLeft, Plus, X } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', head: '' });
  const { showToast } = useToast();

  const fetchDepartments = () => {
    fetch(`${API_URL}/api/departments`)
      .then(res => res.json())
      .then(data => {
        setDepartments(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching departments:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showToast('اسم القسم مطلوب', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/departments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || 'فشل إضافة القسم', 'error');
        return;
      }

      const newDept = await res.json();
      setDepartments([...departments, newDept]);
      setFormData({ name: '', head: '' });
      setShowForm(false);
      showToast('تم إضافة القسم بنجاح', 'success');
    } catch (error) {
      console.error('Error adding department:', error);
      showToast('حدث خطأ في إضافة القسم', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="page-header anim-up">
        <div>
          <h1>الأقسام والمجموعات</h1>
          <p className="page-sub">الهيكل التنظيمي ومعدلات توثيق المعرفة بكل قسم</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={16} /> {showForm ? 'إلغاء' : 'إضافة قسم جديد'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ background: '#F8FAFC', borderRight: '3px solid #3B82F6' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>إضافة قسم جديد</h3>
          <form onSubmit={handleAddDepartment} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: '#334155' }}>
                اسم القسم
              </label>
              <input
                type="text"
                className="input"
                placeholder="مثال: الهندسة"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: '#334155' }}>
                رئيس القسم
              </label>
              <input
                type="text"
                className="input"
                placeholder="مثال: محمد أحمد"
                value={formData.head}
                onChange={e => setFormData({ ...formData, head: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ gridColumn: '1 / -1' }}>
              إضافة القسم
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh', flexDirection: 'column', gap: '1rem' }}>
          <div className="spinner"></div>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>جاري تحميل البيانات للأقسام...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {departments.length > 0 ? (
            departments.map((dept, i) => (
              <div 
                key={dept.name} 
                className="card card-hover anim-up" 
                style={{ cursor: 'pointer', padding: '1.5rem', animationDelay: `${i * 0.05}s` }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: (dept.color || '#3B82F6') + '15', color: dept.color || '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building size={24} />
                  </div>
                  <ChevronLeft size={20} style={{ color: 'var(--text-muted)' }} />
                </div>
                <h3 style={{ fontWeight: 800, fontSize: '1.125rem', margin: '0 0 0.25rem', color: '#0F172A' }}>{dept.name}</h3>
                <p style={{ fontSize: '0.8125rem', color: '#64748B', marginBottom: '1.25rem' }}>رئيس القسم: {dept.head}</p>
                <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#475569', fontWeight: 500 }}>
                    <Users size={14} color="#94A3B8" /> {dept.members || 0} موظف
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#475569', fontWeight: 500 }}>
                    <FileText size={14} color="#94A3B8" /> {dept.sops || 0} إجراء موثق
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#64748B' }}>
              <Building size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p>لا توجد أقسام حالياً. أضف قسماً جديداً لبدء الاستخدام.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Departments;
