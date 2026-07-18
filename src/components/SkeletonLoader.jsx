import React from 'react';

/**
 * SkeletonLoader Component - انتظار تحميل البيانات
 */

export const SkeletonLoader = ({ count = 3, type = 'row' }) => {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  if (type === 'card') {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1.5rem'
      }}>
        {skeletons.map(i => (
          <div key={i} style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{
              height: '160px',
              background: '#F1F5F9',
              borderRadius: '8px',
              marginBottom: '1rem',
              animation: 'pulse 2s infinite'
            }} />
            <div style={{
              height: '16px',
              background: '#F1F5F9',
              borderRadius: '4px',
              marginBottom: '0.5rem',
              animation: 'pulse 2s infinite',
              width: '80%'
            }} />
            <div style={{
              height: '12px',
              background: '#F1F5F9',
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
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #E2E8F0'
      }}>
        {skeletons.map(i => (
          <div key={i} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '1rem',
            padding: '1rem',
            borderBottom: i !== skeletons.length - 1 ? '1px solid #F1F5F9' : 'none'
          }}>
            {[1, 2, 3, 4, 5].map(j => (
              <div key={j} style={{
                height: '20px',
                background: '#F1F5F9',
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
          background: 'white',
          borderRadius: '8px',
          padding: '1.5rem',
          border: '1px solid #E2E8F0'
        }}>
          <div style={{
            height: '16px',
            background: '#F1F5F9',
            borderRadius: '4px',
            marginBottom: '0.5rem',
            animation: 'pulse 2s infinite',
            width: '40%'
          }} />
          <div style={{
            height: '12px',
            background: '#F1F5F9',
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
