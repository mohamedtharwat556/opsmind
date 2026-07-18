import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}) => {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn btn-secondary"
        style={{
          padding: '0.5rem 0.875rem',
          opacity: currentPage === 1 ? 0.5 : 1,
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
        }}
      >
        <ChevronRight size={18} />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className="btn"
          style={{
            padding: '0.5rem 0.875rem',
            background: currentPage === page ? '#2563EB' : 'transparent',
            color: currentPage === page ? 'white' : '#64748B',
            border: `1px solid ${currentPage === page ? '#2563EB' : '#E2E8F0'}`,
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: currentPage === page ? 700 : 500,
            transition: 'all 0.2s',
          }}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn btn-secondary"
        style={{
          padding: '0.5rem 0.875rem',
          opacity: currentPage === totalPages ? 0.5 : 1,
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
        }}
      >
        <ChevronLeft size={18} />
      </button>

      <span style={{ fontSize: '0.875rem', color: '#64748B', marginRight: 'auto' }}>
        عرض {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} من {totalItems}
      </span>
    </div>
  );
};

export default Pagination;
