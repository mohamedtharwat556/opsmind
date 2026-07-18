import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * SkeletonLoader Component - انتظار تحميل البيانات
 */

export const SkeletonLoader = ({ count = 3, type = 'row' }) => {
  const { isDark } = useTheme();
  const skeletons = Array.from({ length: count }, (_, i) => i);

  const cardBg = isDark ? '#1E293B' : 'white';
  const borderColor = isDark ? '#334155' : '#E2E8F0';
  const skeletonBg = isDark ? '#334155' : '#F1F5F9';

  if (type === 'card') {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1.5rem'
      }}>
        {skeletons.map(i => (
          <div key={i} style={{
            background: cardBg,
            borderRadius: '12px',
            padding: '1.5rem',
            border: `1px solid ${borderColor}`
          }}>
            <div style={{
              height: '160px',
              background: skeletonBg,
              borderRadius: '8px',
              marginBottom: '1rem',
              animation: 'pulse 2s infinite'
            }} />
            <div style={{
              height: '16px',
              background: skeletonBg,
              borderRadius: '4px',
              marginBottom: '0.5rem',
              animation: 'pulse 2s infinite',
              width: '80%'
            }} />
            <div style={{
              height: '12px',
              background: skeletonBg,
              borderRadius: '4px',
              animation: 'pulse 2s infinite',
              width: '60%'
            }} />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div style={{
        background: cardBg,
        borderRadius: '12px',
        overflow: 'hidden',
        border: `1px solid ${borderColor}`
      }}>
        {skeletons.map(i => (
          <div key={i} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '1rem',
            padding: '1rem',
            borderBottom: i !== skeletons.length - 1 ? `1px solid ${isDark ? '#334155' : '#F1F5F9'}` : 'none'
          }}>
            {[1, 2, 3, 4, 5].map(j => (
              <div key={j} style={{
                height: '20px',
                background: skeletonBg,
                borderRadius: '4px',
                animation: 'pulse 2s infinite'
              }} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Default row type
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {skeletons.map(i => (
        <div key={i} style={{
          background: cardBg,
          borderRadius: '8px',
          padding: '1.5rem',
          border: `1px solid ${borderColor}`
        }}>
          <div style={{
            height: '16px',
            background: skeletonBg,
            borderRadius: '4px',
            marginBottom: '0.5rem',
            animation: 'pulse 2s infinite',
            width: '40%'
          }} />
          <div style={{
            height: '12px',
            background: skeletonBg,
            borderRadius: '4px',
            animation: 'pulse 2s infinite',
            width: '70%'
          }} />
        </div>
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default SkeletonLoader;
