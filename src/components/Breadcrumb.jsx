import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

/**
 * Breadcrumb Component - مسار الملاحة
 */

export const Breadcrumb = ({ items = [] }) => {
  const navigate = useNavigate();

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '1rem 0',
      fontSize: '0.875rem'
    }}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              color: '#CBD5E1',
              margin: '0 0.25rem'
            }}>
              <ChevronLeft size={16} />
            </div>
          )}
          
          {item.path ? (
            <button
              onClick={() => navigate(item.path)}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563EB',
                cursor: 'pointer',
                fontSize: 'inherit',
                fontFamily: 'inherit',
                textDecoration: 'none',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#EFF6FF';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'none';
              }}
            >
              {item.label}
            </button>
          ) : (
            <span style={{
              color: '#64748B',
              padding: '0.25rem 0.5rem'
            }}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
