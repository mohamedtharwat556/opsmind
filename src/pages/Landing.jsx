import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowRight, Users, FileText, CheckCircle, BookOpen, Shield, Zap } from 'lucide-react';

const Landing = () => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: 'إدارة الموظفين',
      description: 'إدارة شاملة لمعلومات الموظفين والصلاحيات بسهولة'
    },
    {
      icon: FileText,
      title: 'إجراءات التشغيل',
      description: 'إنشاء وتحديث وتتبع الإجراءات التشغيل القياسية (SOPs)'
    },
    {
      icon: CheckCircle,
      title: 'تتبع المشاكل',
      description: 'إدارة وتتبع المشاكل التشغيلية وضمان حلها بسرعة'
    },
    {
      icon: BookOpen,
      title: 'قاعدة المعرفة',
      description: 'مكتبة شاملة للمقالات والدلائل الإرشادية'
    },
    {
      icon: Shield,
      title: 'أمان محسن',
      description: 'المصادقة الثنائية وإدارة صلاحيات دقيقة'
    },
    {
      icon: Zap,
      title: 'تقارير وإحصائيات',
      description: 'لوحات تحكم وتقارير مفصلة لقياس الأداء'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark 
        ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)'
        : 'linear-gradient(135deg, #F1F5F9 0%, #FFFFFF 100%)',
      color: isDark ? '#F8FAFC' : '#0F172A',
      direction: 'rtl'
    }}>
      {/* Navigation */}
      <nav style={{
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: '800',
          background: isDark 
            ? 'linear-gradient(135deg, #3B82F6, #8B5CF6)'
            : 'linear-gradient(135deg, #2563EB, #7C3AED)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          OPSMind
        </h1>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: isDark ? '1px solid #334155' : '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '0.5rem',
              cursor: 'pointer',
              color: 'inherit'
            }}
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          <Link
            to="/login"
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              fontWeight: '600',
              textDecoration: 'none',
              color: isDark ? '#94A3B8' : '#475569',
              transition: 'color 0.2s'
            }}
          >
            تسجيل الدخول
          </Link>

          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              fontWeight: '600',
              background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
          >
            ابدأ الآن
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '4rem 2rem 6rem',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '900',
          lineHeight: '1.2',
          marginBottom: '1.5rem',
          background: isDark 
            ? 'linear-gradient(135deg, #FFFFFF, #94A3B8)'
            : 'linear-gradient(135deg, #0F172A, #475569)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          إدارة العمليات المؤسسية<br />بشكل احترافي وبسيط
        </h1>

        <p style={{
          fontSize: '1.25rem',
          color: isDark ? '#94A3B8' : '#64748B',
          maxWidth: '600px',
          margin: '0 auto 2.5rem'
        }}>
          منصة شاملة لإدارة الإجراءات التشغيل، تتبع المشاكل، قاعدة المعرفة، وإدارة الموظفين في مكان واحد
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
          >
            ابدأ الآن <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem 6rem'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: '800',
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          الميزات الرئيسية
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                style={{
                  background: isDark ? '#1E293B' : 'white',
                  border: isDark ? '1px solid #334155' : '1px solid #E2E8F0',
                  borderRadius: '16px',
                  padding: '2rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(124, 58, 237, 0.1))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}>
                  <Icon size={28} color="#2563EB" />
                </div>

                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  marginBottom: '0.75rem'
                }}>
                  {feature.title}
                </h3>

                <p style={{
                  color: isDark ? '#94A3B8' : '#64748B',
                  lineHeight: '1.6'
                }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: isDark ? '1px solid #334155' : '1px solid #E2E8F0',
        padding: '2rem',
        textAlign: 'center',
        color: isDark ? '#64748B' : '#94A3B8'
      }}>
        <p>© 2026 OPSMind. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
};

export default Landing;
