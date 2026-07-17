import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, UserPlus, Search, Shield, ShieldAlert, Edit2, CheckCircle2, XCircle, Power, Upload, Download, Trash2 } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const { showToast } = useToast();
  
  // Add User Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('موظف');
  const [department, setDepartment] = useState('الدعم الفني');

  const fetchUsers = () => {
    setLoading(true);
    fetch(`${API_URL}/api/users`)
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      showToast('الاسم الكامل مطلوب', 'error');
      return;
    }

    if (!email.trim()) {
      showToast('البريد الإلكتروني مطلوب', 'error');
      return;
    }

    setSubmitLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), role, department, status: 'نشط' })
      });

      if (!response.ok) throw new Error('فشل في إضافة المستخدم');

      const newUser = await response.json();
      
      showToast(`تمت إضافة ${name} بنجاح! ✅`, 'success');
      fetchUsers();
      setName('');
      setEmail('');
      setRole('موظف');
      setDepartment('الدعم الفني');
      setShowAddForm(false);
    } catch (err) {
      showToast(err.message || 'حدث خطأ', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus, userName) => {
    const nextStatus = currentStatus === 'نشط' ? 'غير نشط' : 'نشط';
    
    try {
      const response = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });

      if (!response.ok) throw new Error('فشل في تحديث الحالة');

      await response.json();
      
      if (nextStatus === 'نشط') {
        showToast(`تم تنشيط حساب ${userName} ✅`, 'success');
      } else {
        showToast(`تم تعطيل حساب ${userName} ⛔`, 'success');
      }
      
      fetchUsers();
    } catch (err) {
      showToast('فشل في تحديث حالة المستخدم', 'error');
    }
  };

  const changeRole = async (id, currentRole, userName) => {
    const nextRole = currentRole === 'موظف' ? 'مدير' : 'موظف';
    
    try {
      const response = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: nextRole })
      });

      if (!response.ok) throw new Error('فشل في تحديث الدور');

      await response.json();
      
      if (nextRole === 'مدير') {
        showToast(`تمت ترقية ${userName} لمدير ⬆️`, 'success');
      } else {
        showToast(`تم تنزيل ${userName} لموظف ⬇️`, 'success');
      }
      
      fetchUsers();
    } catch (err) {
      showToast('فشل في تحديث دور المستخدم', 'error');
    }
  };

  const deleteUser = async (id, userName) => {
    if (!window.confirm(`هل متأكد من حذف ${userName}؟`)) return;

    try {
      const response = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('فشل في حذف المستخدم');

      showToast(`تم حذف ${userName} نهائياً 🗑️`, 'success');
      fetchUsers();
    } catch (err) {
      showToast('فشل في حذف المستخدم', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="page-header anim-up">
        <div>
          <h1>إدارة المستخدمين</h1>
          <p className="page-sub">إدارة حسابات الموظفين والصلاحيات والأدوار</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          <UserPlus size={16} /> إضافة مستخدم جديد
        </button>
      </div>

      {showAddForm && (
        <div className="card anim-up" style={{ borderRight: '4px solid #2563EB' }}>
          <h3 className="card-title">✅ إضافة موظف جديد للمنصة</h3>
          <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">الاسم الكامل *</label>
              <input 
                className="input" 
                placeholder="مثال: يوسف أحمد" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                disabled={submitLoading}
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">البريد الإلكتروني *</label>
              <input 
                className="input" 
                type="email" 
                placeholder="yousef@yas.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                disabled={submitLoading}
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">الدور الوظيفي</label>
              <select 
                className="input" 
                value={role} 
                onChange={e => setRole(e.target.value)}
                disabled={submitLoading}
              >
                <option value="موظف">موظف (User)</option>
                <option value="مدير">مدير (Admin)</option>
                <option value="رئيس قسم">رئيس قسم</option>
                <option value="المدير العام">المدير العام</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">القسم</label>
              <select 
                className="input" 
                value={department} 
                onChange={e => setDepartment(e.target.value)}
                disabled={submitLoading}
              >
                <option value="الدعم الفني">الدعم الفني</option>
                <option value="الهندسة">الهندسة</option>
                <option value="إدارة المنتج">إدارة المنتج</option>
                <option value="الموارد البشرية">الموارد البشرية</option>
                <option value="المالية">المالية</option>
                <option value="الإدارة">الإدارة</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowAddForm(false)}
                disabled={submitLoading}
              >
                إلغاء
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submitLoading}
              >
                {submitLoading ? 'جاري الإضافة...' : 'إضافة للمنصة'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <div className="card anim-up" style={{ textAlign: 'center', padding: '1.25rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: 600 }}>إجمالي المستخدمين</p>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginTop: '0.25rem' }}>{users.length}</p>
        </div>
        <div className="card anim-up d1" style={{ textAlign: 'center', padding: '1.25rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: 600 }}>المستخدمين النشطين</p>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981', marginTop: '0.25rem' }}>{users.filter(u => u.status === 'نشط').length}</p>
        </div>
        <div className="card anim-up d2" style={{ textAlign: 'center', padding: '1.25rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: 600 }}>المديرين والمشرفين</p>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: '#2563EB', marginTop: '0.25rem' }}>{users.filter(u => u.role === 'مدير').length}</p>
        </div>
      </div>

      {/* Search Header */}
      <div className="card anim-up" style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} size={18} />
            <input 
              className="input" 
              placeholder="ابحث عن مستخدم بالاسم أو البريد الإلكتروني..." 
              style={{ width: '100%', paddingRight: '2.5rem' }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="table-wrap anim-up d3">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
            <p>جاري تحميل قائمة الموظفين...</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: '0.8rem', color: '#64748B' }}>الاسم</th>
                <th style={{ padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: '0.8rem', color: '#64748B' }}>الدور</th>
                <th style={{ padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: '0.8rem', color: '#64748B' }}>القسم</th>
                <th style={{ padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: '0.8rem', color: '#64748B' }}>الحالة</th>
                <th style={{ padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: '0.8rem', color: '#64748B' }}>نقاط</th>
                <th style={{ padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: '0.8rem', color: '#64748B', textAlign: 'left' }}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter(u => 
                  u.name.includes(searchTerm) || 
                  u.email.includes(searchTerm) ||
                  u.department.includes(searchTerm)
                )
                .map((user, i) => (
                  <tr key={user.id} className="animate-fadeIn" style={{ animationDelay: `${i * 0.05}s`, borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div 
                          className="avatar" 
                          style={{ 
                            width: 34, 
                            height: 34, 
                            fontSize: '0.75rem',
                            background: user.status === 'نشط' ? '#2563EB' : '#94A3B8',
                            opacity: user.status === 'نشط' ? 1 : 0.5
                          }}
                        >
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0F172A', margin: 0, opacity: user.status === 'نشط' ? 1 : 0.6 }}>{user.name}</p>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0 }}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', fontWeight: 500 }}>
                      <span className={`badge ${user.role === 'المدير العام' || user.role === 'مدير' ? 'badge-blue' : user.role === 'رئيس قسم' ? 'badge-purple' : 'badge-slate'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', color: '#64748B' }}>{user.department}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        {user.status === 'نشط' ? (
                          <>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }}></div>
                            <span className="badge badge-green">{user.status}</span>
                          </>
                        ) : (
                          <>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }}></div>
                            <span className="badge badge-red">{user.status}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>
                      {user.points || 0} ⚡
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'left' }}>
                      <div style={{ display: 'inline-flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                        <button 
                          className={`btn ${user.status === 'نشط' ? 'btn-danger' : 'btn-success'}`}
                          style={{ padding: '0.35rem 0.7rem', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                          onClick={() => toggleStatus(user.id, user.status, user.name)}
                          title={user.status === 'نشط' ? 'تعطيل الحساب' : 'تنشيط الحساب'}
                        >
                          <Power size={12} />
                          {user.status === 'نشط' ? 'تعطيل' : 'تنشيط'}
                        </button>
                        <button 
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.7rem', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                          onClick={() => changeRole(user.id, user.role, user.name)}
                          title={user.role === 'موظف' ? 'ترقية لمدير' : 'تنزيل لموظف'}
                        >
                          <Upload size={12} />
                          {user.role === 'موظف' ? 'ترقية' : 'تنزيل'}
                        </button>
                        {user.email !== 'ibrahim@yas.com' && (
                          <button 
                            className="btn btn-danger"
                            style={{ padding: '0.35rem 0.7rem', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                            onClick={() => deleteUser(user.id, user.name)}
                            title="حذف المستخدم"
                          >
                            <Trash2 size={12} />
                            حذف
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
