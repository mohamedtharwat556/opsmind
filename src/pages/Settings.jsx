import React, { useState, useEffect } from 'react';
import { Globe, Bell, Lock, AlertCircle, Check } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNotificationChange = (key, checked) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: checked
      }
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setMessage('جاري حفظ الإعدادات...');
    fetch('http://localhost:5000/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    })
      .then(res => res.json())
      .then(updated => {
        setSettings(updated);
        setMessage('تم حفظ جميع الإعدادات بنجاح! ✓');
        setTimeout(() => setMessage(''), 3000);
      })
      .catch(() => {
        setMessage('فشل تحديث الإعدادات. حاول مرة أخرى.');
      });
  };

  if (loading || !settings) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
      <div className="spinner"></div>
    </div>
  );

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="page-header anim-up">
        <div>
          <h1>إعدادات النظام</h1>
          <p className="page-sub">إعداد اللغة، التوقيت، الأمان وتفضيلات إشعارات البريد</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {message && <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#059669' }}>{message}</span>}
          <button type="submit" className="btn btn-primary">حفظ التغييرات</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* General */}
        <div className="card anim-up d1">
          <h2 className="card-title"><Globe size={18} color="#2563EB" /> الإعدادات العامة للمؤسسة</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1rem' }}>
            <div className="form-group">
              <label className="form-label">اسم الشركة</label>
              <input className="input" value={settings.companyName} onChange={e => handleChange('companyName', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">لغة النظام الافتراضية</label>
              <select className="input" value={settings.language} onChange={e => handleChange('language', e.target.value)}>
                <option value="العربية">العربية</option>
                <option value="English">English</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">المنطقة الزمنية</label>
              <select className="input" value={settings.timezone} onChange={e => handleChange('timezone', e.target.value)}>
                <option value="القاهرة (GMT+2)">القاهرة (GMT+2)</option>
                <option value="الرياض (GMT+3)">الرياض (GMT+3)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">البريد الإلكتروني للتقارير</label>
              <input className="input" type="email" value={settings.notificationEmail} onChange={e => handleChange('notificationEmail', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card anim-up d2">
          <h2 className="card-title"><Bell size={18} color="#7C3AED" /> إدارة تفضيلات التنبيهات</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
            {[
              { key: 'newCase', label: 'إشعار عند إضافة مشكلة جديدة في السجل' },
              { key: 'sopEdit', label: 'إشعار عند تقديم اقتراح تعديل على إجراءات التشغيل' },
              { key: 'dailySummary', label: 'إرسال ملخص يومي إلكتروني لكافة المعاملات' },
              { key: 'permissionsChange', label: 'تنبيه فوري عند تغيير صلاحيات أحد المستخدمين' },
            ].map((item) => (
              <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>{item.label}</span>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={settings.notifications[item.key]} 
                    onChange={e => handleNotificationChange(item.key, e.target.checked)} 
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="card anim-up d3">
          <h2 className="card-title"><Lock size={18} color="#DC2626" /> معايير الأمان وجلسات العمل</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1rem' }}>
            <div className="form-group">
              <label className="form-label">الحد الأدنى لطول كلمة المرور للموظف</label>
              <input className="input" type="number" value={settings.minPasswordLength} onChange={e => handleChange('minPasswordLength', parseInt(e.target.value))} />
            </div>
            <div className="form-group">
              <label className="form-label">فترة انتهاء الجلسة الافتراضية للوحة التحكم (بالدقائق)</label>
              <input className="input" type="number" value={settings.sessionTimeout} onChange={e => handleChange('sessionTimeout', parseInt(e.target.value))} />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Settings;
