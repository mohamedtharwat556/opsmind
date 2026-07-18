import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * EmptyState Component - عندما لا توجد بيانات
 */

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  actionPath,
  actionCallback 
}) => {
  const navigate = useNavigate();

  const handleAction = () => {
    if (actionCallback) {
      actionCallback();
    } else if (actionPath) {
      navigate(actionPath);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 2rem',
      background: '#F8FAFC',
      borderRadius: '12px',
      border: '1px dashed #CBD5E1',
      textAlign: 'center',
      minHeight: '300px'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: '#EFF6FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem'
      }}>
        {Icon && <Icon size={32} color="#2563EB" />}
      </div>

      <h3 style={{
        fontSize: '1.125rem',
        fontWeight: 700,
        color: '#0F172A',
        margin: '0 0 0.5rem'
      }}>
        {title}
      </h3>

      <p style={{
        fontSize: '0.875rem',
        color: '#64748B',
        margin: '0 0 1.5rem',
        maxWidth: '400px',
        lineHeight: 1.6
      }}>
        {description}
      </p>

      {actionLabel && (
        <button
          onClick={handleAction}
          style={{
            background: '#2563EB',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontFamily: 'inherit'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#1D4ED8';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#2563EB';
            e.currentTarget.style.transform = 'none';
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
