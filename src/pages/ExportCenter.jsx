import React, { useState } from 'react';
import './ExportCenter.css';

export default function ExportCenter() {
  const [exportType, setExportType] = useState('all');
  const [dateRange, setDateRange] = useState('month');
  const [includeAttachments, setIncludeAttachments] = useState(false);
  const [exporting, setExporting] = useState(false);

  const mockData = {
    cases: [
      { id: '#405', title: 'الموظف الجديد لم يستلم دعوة GitHub', status: 'محلول', created: '2024-01-19' },
      { id: '#406', title: 'فشل النشر في مرحلة البناء', status: 'محلول', created: '2024-01-18' },
      { id: '#407', title: 'لا يمكن الوصول للـ VPN الداخلي', status: 'مفتوح', created: '2024-01-17' }
    ],
    reports: [
      { month: 'يناير 2024', cases: 45, resolved: 28, avgTime: '2.4h' },
      { month: 'ديسمبر 2023', cases: 38, resolved: 24, avgTime: '2.8h' }
    ],
    analytics: [
      { week: 'أسبوع 1', cases: 12, resolved: 8 },
      { week: 'أسبوع 2', cases: 15, resolved: 10 }
    ]
  };

  const handleExportCSV = () => {
    setExporting(true);
    setTimeout(() => {
      const data = exportType === 'all' ? mockData.cases : mockData[exportType] || mockData.cases;
      const csv = convertToCSV(data);
      downloadFile(csv, `opsmind-export-${exportType}.csv`, 'text/csv');
      setExporting(false);
    }, 1500);
  };

  const handleExportPDF = () => {
    setExporting(true);
    setTimeout(() => {
      const data = exportType === 'all' ? mockData.cases : mockData[exportType] || mockData.cases;
      const html = convertToPDF(data, exportType);
      downloadFile(html, `opsmind-export-${exportType}.pdf`, 'application/pdf');
      setExporting(false);
    }, 1500);
  };

  const handleExportJSON = () => {
    setExporting(true);
    setTimeout(() => {
      const data = exportType === 'all' ? mockData : mockData[exportType];
      downloadFile(JSON.stringify(data, null, 2), `opsmind-export-${exportType}.json`, 'application/json');
      setExporting(false);
    }, 1500);
  };

  const handleExportExcel = () => {
    alert('ميزة Excel متوفرة قريباً - يمكنك استخدام CSV الآن');
  };

  return (
    <div className="export-center">
      <h1>مركز التصدير 📥</h1>

      <div className="export-container">
        {/* Export Options */}
        <div className="export-options">
          <h2>اختر نوع البيانات</h2>
          <div className="options-grid">
            <div className={`option-card ${exportType === 'cases' ? 'active' : ''}`} onClick={() => setExportType('cases')}>
              <span className="option-icon">📋</span>
              <h3>المشاكل</h3>
              <p>{mockData.cases.length} مشكلة</p>
            </div>
            <div className={`option-card ${exportType === 'reports' ? 'active' : ''}`} onClick={() => setExportType('reports')}>
              <span className="option-icon">📊</span>
              <h3>التقارير</h3>
              <p>{mockData.reports.length} تقرير</p>
            </div>
            <div className={`option-card ${exportType === 'analytics' ? 'active' : ''}`} onClick={() => setExportType('analytics')}>
              <span className="option-icon">📈</span>
              <h3>التحليلات</h3>
              <p>{mockData.analytics.length} بيان</p>
            </div>
            <div className={`option-card ${exportType === 'all' ? 'active' : ''}`} onClick={() => setExportType('all')}>
              <span className="option-icon">🗂️</span>
              <h3>كل البيانات</h3>
              <p>حزمة شاملة</p>
            </div>
          </div>
        </div>

        {/* Export Settings */}
        <div className="export-settings">
          <h2>إعدادات التصدير</h2>
          
          <div className="setting-group">
            <label>الفترة الزمنية:</label>
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="week">الأسبوع الماضي</option>
              <option value="month">الشهر الماضي</option>
              <option value="quarter">الربع الماضي</option>
              <option value="year">السنة الماضية</option>
              <option value="all">جميع البيانات</option>
            </select>
          </div>

          <div className="setting-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={includeAttachments}
                onChange={(e) => setIncludeAttachments(e.target.checked)}
              />
              <span>تضمين المرفقات</span>
            </label>
          </div>

          <div className="export-formats">
            <h3>اختر صيغة التصدير:</h3>
            <div className="formats-grid">
              <button
                className="format-btn csv"
                onClick={handleExportCSV}
                disabled={exporting}
              >
                <span className="format-icon">📄</span>
                <span className="format-name">CSV</span>
                <span className="format-desc">جداول بيانات</span>
              </button>
              
              <button
                className="format-btn pdf"
                onClick={handleExportPDF}
                disabled={exporting}
              >
                <span className="format-icon">📋</span>
                <span className="format-name">PDF</span>
                <span className="format-desc">تقرير احترافي</span>
              </button>
              
              <button
                className="format-btn json"
                onClick={handleExportJSON}
                disabled={exporting}
              >
                <span className="format-icon">⚙️</span>
                <span className="format-name">JSON</span>
                <span className="format-desc">للمطورين</span>
              </button>
              
              <button
                className="format-btn excel"
                onClick={handleExportExcel}
                disabled={exporting}
              >
                <span className="format-icon">📊</span>
                <span className="format-name">Excel</span>
                <span className="format-desc">قريباً</span>
              </button>
            </div>
          </div>
        </div>

        {/* Export Templates */}
        <div className="export-templates">
          <h2>قوالب سريعة</h2>
          <div className="templates-grid">
            <div className="template-card">
              <h4>تقرير مشاكل شهري</h4>
              <p>تقرير كامل للمشاكل المحلولة والمفتوحة</p>
              <button className="template-btn">📥 استخدم القالب</button>
            </div>
            <div className="template-card">
              <h4>إحصائيات الأداء</h4>
              <p>مؤشرات الأداء الرئيسية والاتجاهات</p>
              <button className="template-btn">📥 استخدم القالب</button>
            </div>
            <div className="template-card">
              <h4>نسخة احتياطية شاملة</h4>
              <p>جميع البيانات بصيغة JSON</p>
              <button className="template-btn">📥 استخدم القالب</button>
            </div>
          </div>
        </div>

        {/* Export History */}
        <div className="export-history">
          <h2>سجل التصديرات</h2>
          <div className="history-list">
            <div className="history-item">
              <span className="item-time">🕐 منذ ساعة</span>
              <span className="item-file">opsmind-cases-2024-01-20.csv</span>
              <span className="item-size">245 KB</span>
              <button className="download-btn">📥</button>
            </div>
            <div className="history-item">
              <span className="item-time">🕐 منذ يومين</span>
              <span className="item-file">opsmind-report-January.pdf</span>
              <span className="item-size">1.2 MB</span>
              <button className="download-btn">📥</button>
            </div>
            <div className="history-item">
              <span className="item-time">🕐 منذ أسبوع</span>
              <span className="item-file">opsmind-backup-2024-01-13.json</span>
              <span className="item-size">856 KB</span>
              <button className="download-btn">📥</button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {exporting && (
        <div className="export-loading">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>جاري تحضير الملف...</p>
          </div>
        </div>
      )}
    </div>
  );
}

function convertToCSV(data) {
  if (!data || data.length === 0) return '';

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

function convertToPDF(data, type) {
  let html = `
    <html dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>تقرير ${type}</title>
      <style>
        body { font-family: Arial; direction: rtl; margin: 20px; }
        h1 { color: #2563EB; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #2563EB; color: white; padding: 10px; text-align: right; }
        td { padding: 10px; border-bottom: 1px solid #ddd; text-align: right; }
        tr:nth-child(even) { background: #f5f5f5; }
      </style>
    </head>
    <body>
      <h1>تقرير OPSMind - ${type}</h1>
      <p>تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}</p>
      <table>
        <thead>
          <tr>
  `;

  if (Array.isArray(data) && data.length > 0) {
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
