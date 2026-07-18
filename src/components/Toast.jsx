import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Toast Component - إشعارات عائمة
 * الأنواع: success, error, warning, info
 */

export const Toast = ({ 
  id, 
  type = 'info', 
  message, 
  title,
  duration = 4000, 
  onClose 
}) => {
  const { isDark } = useTheme();
  
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const toastConfig = {
    success: {
      bg: isDark ? '#064E3B' : '#ECFDF5',
      border: isDark ? '#065F46' : '#D1FAE5',
      text: isDark ? '#A7F3D0' : '#065F46',
      icon: CheckCircle,
      bgDark: isDark ? '#10B981' : '#059669'
    },
    error: {
      bg: isDark ? '#7F1D1D' : '#FEF2F2',
      border: isDark ? '#991B1B' : '#FECACA',
      text: isDark ? '#FECACA' : '#7F1D1D',
      icon: AlertCircle,
      bgDark: isDark ? '#EF4444' : '#DC2626'
    },
    warning: {
      bg: isDark ? '#78350F' : '#FFFBEB',
      border: isDark ? '#92400E' : '#FDE68A',
      text: isDark ? '#FDE68A' : '#92400E',
      icon: AlertCircle,
      bgDark: isDark ? '#F59E0B' : '#D97706'
    },
    info: {
      bg: isDark ? '#1E3A8A' : '#EFF6FF',
      border: isDark ? '#1D4ED8' : '#BFDBFE',
      text: isDark ? '#BFDBFE' : '#0C2340',
      icon: Info,
      bgDark: isDark ? '#3B82F6' : '#3B82F6'
    }
  };

  const config = toastConfig[type] || toastConfig.info;
  const Icon = config.icon;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '2rem',
        background: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: '12px',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        zIndex: 999,
        maxWidth: '400px',
        animation: 'slideUp 0.3s ease-out',
        color: config.text
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <Icon size={24} color={config.bgDark} />
      </div>

      <div style={{ flex: 1 }}>
        {title && (
          <p style={{ margin: '0 0 0.25rem', fontWeight: 700, fontSize: '0.9rem' }}>
            {title}
          </p>
        )}
        <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>
          {message}
        </p>
      </div>

      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          color: config.text,
          opacity: 0.7,
          fontSize: 0
        }}
      >
        <X size={18} />
      </button>
    </div>
  );
};

/**
 * Toast Container - يعرض عدة Toasts
 */
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <>
      {toasts.map((toast, index) => (
        <div key={toast.id} style={{ '--delay': `${index * 0.1}s` }}>
          <Toast
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </>
  );
};

export default Toast;
