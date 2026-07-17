import React, { useState } from 'react';
import './BulkOperations.css';

export default function BulkOperations({ items = [], onBulkAction, itemType = 'cases' }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [showActions, setShowActions] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
      setSelectAll(false);
    } else {
      setSelectedItems(items.map((_, i) => i));
      setSelectAll(true);
    }
  };

  const handleSelectItem = (index) => {
    const updated = selectedItems.includes(index)
      ? selectedItems.filter(i => i !== index)
      : [...selectedItems, index];
    
    setSelectedItems(updated);
    setSelectAll(updated.length === items.length);
    setShowActions(updated.length > 0);
  };

  const handleBulkAction = (action) => {
    const selectedData = selectedItems.map(i => items[i]);
    onBulkAction && onBulkAction(action, selectedData);
    setSelectedItems([]);
    setSelectAll(false);
    setShowActions(false);
  };

  const exportToCSV = () => {
    const selectedData = selectedItems.map(i => items[i]);
    const csv = convertToCSV(selectedData);
    downloadFile(csv, `${itemType}-export.csv`, 'text/csv');
  };

  const exportToPDF = () => {
    const selectedData = selectedItems.map(i => items[i]);
    const html = convertToPDF(selectedData, itemType);
    downloadFile(html, `${itemType}-export.pdf`, 'application/pdf');
    alert('تم تحضير الملف. يرجى تأكيد التحميل في المتصفح.');
  };

  return (
    <div className="bulk-operations">
      {/* Selection Toolbar */}
      <div className="selection-toolbar">
        <div className="selection-info">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
            title="تحديد الكل"
          />
          <span className="count">
            {selectedItems.length > 0 && `تم تحديد ${selectedItems.length} عنصر`}
          </span>
        </div>

        {showActions && (
          <div className="bulk-actions">
            <button
              className="action-btn"
              onClick={() => handleBulkAction('delete')}
              title="حذف المختار"
            >
              🗑️ حذف
            </button>
            <button
              className="action-btn"
              onClick={() => handleBulkAction('archive')}
              title="أرشفة"
            >
              📦 أرشفة
            </button>
            <button
              className="action-btn"
              onClick={() => handleBulkAction('assign')}
              title="إسناد إلى"
            >
              👤 إسناد
            </button>
            <button
              className="action-btn export"
              onClick={exportToCSV}
              title="تصدير CSV"
            >
              📄 CSV
            </button>
            <button
              className="action-btn export"
              onClick={exportToPDF}
              title="تصدير PDF"
            >
              📋 PDF
            </button>
            <button
              className="action-btn clear"
              onClick={() => {
                setSelectedItems([]);
                setSelectAll(false);
                setShowActions(false);
              }}
              title="إلغاء التحديد"
            >
              ✕ إلغاء
            </button>
          </div>
        )}
      </div>

      {/* Items List */}
      <div className="bulk-items-list">
        {items.map((item, index) => (
          <div key={index} className="bulk-item">
            <input
              type="checkbox"
              checked={selectedItems.includes(index)}
              onChange={() => handleSelectItem(index)}
            />
            <div className="item-content">
              {item.title && <h4>{item.title}</h4>}
              {item.id && <p className="item-id">{item.id}</p>}
              {item.status && (
                <span className={`status ${item.status.toLowerCase()}`}>
                  {item.status}
                </span>
              )}
              {item.reporter && <p className="item-meta">من: {item.reporter}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function convertToCSV(data) {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        const stringValue = String(value || '');
        return `"${stringValue.replace(/"/g, '""')}"`;
      }).join(',')
    )
  ];

  return csv.join('\n');
}

function convertToPDF(data, itemType) {
  let html = `
    <html dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>تقرير ${itemType}</title>
      <style>
        body { font-family: Arial; direction: rtl; }
        h1 { text-align: center; color: #2563EB; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; text-align: right; border: 1px solid #ddd; }
        th { background: #2563EB; color: white; }
        tr:nth-child(even) { background: #f5f5f5; }
      </style>
    </head>
    <body>
      <h1>تقرير ${itemType}</h1>
      <p>تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}</p>
      <table>
        <thead>
          <tr>
  `;

  if (data.length > 0) {
    const headers = Object.keys(data[0]);
    headers.forEach(header => {
      html += `<th>${header}</th>`;
    });
    html += `</tr></thead><tbody>`;

    data.forEach(row => {
      html += '<tr>';
      Object.keys(row).forEach(key => {
        html += `<td>${row[key] || ''}</td>`;
      });
      html += '</tr>';
    });
  }

  html += `
        </tbody>
      </table>
    </body>
    </html>
  `;

  return html;
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
