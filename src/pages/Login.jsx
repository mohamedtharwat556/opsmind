import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Zap, Users, ShieldCheck, CheckCircle, BarChart3, Book, Loader, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { validateEmail, validateTextField } from '../utils/validation';

const features = [
  { icon: Book,       label: 'قاعدة المعرفة الموحدة',     color: '#3B82F6' },
  { icon: CheckCircle,label: 'إجراءات التشغيل المعيارية',   color: '#10B981' },
  { icon: BarChart3,  label: 'تحليلات شاملة',    color: '#8B5CF6' },
  { icon: Users,      label: 'إدارة الموارد البشرية',        color: '#F59E0B' },
];

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const from = location.state?.from?.pathname || '/user';

  const handleLogin = async (email, roleType) => {
    setValidationErrors({});
    setError(null);

    // ✅ Validation
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      showToast(emailValidation.error, 'error');
      setValidationErrors({ email: emailValidation.error });
      return;
    }

    const passwordValidation = validateTextField('password', 1);
    if (!passwordValidation.valid && !email) {
      showToast(passwordValidation.error, 'error');
      setValidationErrors({ password: passwordValidation.error });
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, roleType === 'user' ? 'password123' : 'admin123');
      showToast('تم تسجيل الدخول بنجاح!', 'success');
      if (roleType === 'admin' && (user.role === 'المدير العام' || user.role === 'رئيس قسم الهندسة')) {
        navigate('/admin');
      } else {
        navigate(from === '/admin' ? '/user' : from);
      }
    } catch (err) {
      const errorMsg = err.message || 'فشل تسجيل الدخول';
      showToast(errorMsg, 'error');
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      {/* Left Branding Panel */}
      <div className="login-left">
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.625rem', marginBottom:'3.5rem' }}>
            <div style={{ width:40, height:40, borderRadius:10, background:'#2563EB', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Zap size={22} color="white" fill="white" />
            </div>
            <span style={{ fontWeight:900, fontSize:'1.5rem', color:'white', letterSpacing:'-0.02em' }}>YAS</span>
          </div>

          <h1 style={{ fontSize:'2.75rem', fontWeight:900, color:'white', lineHeight:1.15, marginBottom:'1.25rem', letterSpacing:'-0.03em' }}>
            منصة العمليات<br />
            <span style={{ color:'#60A5FA' }}>والمعرفة الموحدة</span>
          </h1>
          <p style={{ color:'#94A3B8', fontSize:'1.0625rem', lineHeight:1.7, maxWidth:420, marginBottom:'3rem' }}>
            نظام متكامل لإدارة الإجراءات، توثيق المشاكل، ونقل الخبرات داخل الشركة بشكل ذكي وسلس.
          </p>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.875rem' }}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'0.75rem', background:'rgba(255,255,255,0.05)', borderRadius:12, padding:'0.875rem 1rem', border:'1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ width:34, height:34, borderRadius:8, background:f.color+'25', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon size={17} color={f.color} />
                  </div>
                  <span style={{ fontSize:'0.875rem', fontWeight:600, color:'#CBD5E1' }}>{f.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <p style={{ position:'relative', zIndex:1, fontSize:'0.8rem', color:'#475569' }}>
          © 2024 YAS · جميع الحقوق محفوظة
        </p>
      </div>

      {/* Right Login Panel */}
      <div className="login-right">
        <div className="login-box">
          <div style={{ marginBottom:'2.5rem' }}>
            <h2 style={{ fontSize:'1.625rem', fontWeight:800, color:'#0F172A', marginBottom:'0.5rem', letterSpacing:'-0.02em' }}>
              مرحباً بك 👋
            </h2>
            <p style={{ color:'#64748B', fontSize:'0.9375rem' }}>اختر طريقة الدخول للمنصة</p>
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <AlertCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <div style={{ display:'flex', flexDirection:'column', gap:'0.875rem' }}>
            {/* Employee */}
            <button
              onClick={() => handleLogin('adam@yas.com', 'user')}
              disabled={loading}
              style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'1.125rem 1.25rem', borderRadius:14, border:'2px solid #E2E8F0', background:'white', textAlign:'right', width:'100%', transition:'all 0.2s', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
              onMouseEnter={e => { if(!loading) { e.currentTarget.style.borderColor='#3B82F6'; e.currentTarget.style.background='#EFF6FF'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 25px rgba(37,99,235,0.12)'; } }}
              onMouseLeave={e => { if(!loading) { e.currentTarget.style.borderColor='#E2E8F0'; e.currentTarget.style.background='white'; e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; } }}
            >
              <div style={{ width:48, height:48, borderRadius:12, background:'#EFF6FF', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {loading ? <Loader size={24} color="#2563EB" className="spin" /> : <Users size={24} color="#2563EB" />}
              </div>
              <div>
                <p style={{ fontWeight:700, fontSize:'1rem', color:'#0F172A', margin:'0 0 0.2rem' }}>دخول الموظف</p>
                <p style={{ fontSize:'0.8125rem', color:'#64748B', margin:0 }}>الوصول للبوابة الرئيسية والإجراءات</p>
              </div>
            </button>

            {/* Admin */}
            <button
              onClick={() => handleLogin('ibrahim@yas.com', 'admin')}
              disabled={loading}
              style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'1.125rem 1.25rem', borderRadius:14, border:'2px solid #E2E8F0', background:'white', textAlign:'right', width:'100%', transition:'all 0.2s', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
              onMouseEnter={e => { if(!loading) { e.currentTarget.style.borderColor='#0F172A'; e.currentTarget.style.background='#F8FAFC'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 25px rgba(15,23,42,0.1)'; } }}
              onMouseLeave={e => { if(!loading) { e.currentTarget.style.borderColor='#E2E8F0'; e.currentTarget.style.background='white'; e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; } }}
            >
              <div style={{ width:48, height:48, borderRadius:12, background:'#0F172A', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {loading ? <Loader size={24} color="#3B82F6" className="spin" /> : <ShieldCheck size={24} color="#3B82F6" />}
              </div>
              <div>
                <p style={{ fontWeight:700, fontSize:'1rem', color:'#0F172A', margin:'0 0 0.2rem' }}>دخول الإدارة</p>
                <p style={{ fontSize:'0.8125rem', color:'#64748B', margin:0 }}>لوحة التحكم والإحصائيات والتقارير</p>
              </div>
            </button>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Login;
