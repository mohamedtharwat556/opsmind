/**
 * PDF Export Utilities للـ Reports والـ Data
 * استخدام html2canvas و jsPDF (يمكن إضافتهم لاحقاً)
 * الآن: تصدير إلى HTML جاهز للطباعة
 */

// ✅ HTML to PDF (باستخدام Print API)
export const exportToPDF = (fileName, htmlContent, title = '') => {
  const printWindow = window.open('', '', 'width=900,height=600');
  
  const content = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Cairo', Arial, sans-serif;
          direction: rtl;
          background: white;
          padding: 20px;
        }
        .header {
          border-bottom: 2px solid #2563EB;
          padding-bottom: 15px;
          margin-bottom: 20px;
          text-align: center;
        }
        .header h1 {
          color: #0F172A;
          font-size: 24px;
          margin-bottom: 5px;
        }
        .header p {
          color: #64748B;
          font-size: 12px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th {
          background: #F1F5F9;
          border: 1px solid #E2E8F0;
          padding: 12px;
          text-align: right;
          font-weight: 600;
          color: #0F172A;
        }
        td {
          border: 1px solid #E2E8F0;
          padding: 10px;
          color: #334155;
        }
        tr:nth-child(even) {
          background: #F8FAFC;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #E2E8F0;
          text-align: center;
          color: #94A3B8;
          font-size: 12px;
        }
        .badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }
        .badge-green { background: #ECFDF5; color: #059669; }
        .badge-red { background: #FEF2F2; color: #DC2626; }
        .badge-blue { background: #EFF6FF; color: #2563EB; }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <p>تم الإنشاء: ${new Date().toLocaleString('ar-EG')}</p>
      </div>
      <div class="content">
        ${htmlContent}
      </div>
      <div class="footer">
        <p>© 2026 YAS - منصة العمليات المؤسسية</p>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(content);
  printWindow.document.close();

  setTimeout(() => {
    printWindow.print();
  }, 250);
};

// ✅ Export Report Table to CSV
export const exportToCSV = (fileName, data, headers) => {
  if (!data || data.length === 0) {
    alert('لا توجد بيانات للتصدير');
    return;
  }

  // Prepare CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header.toLowerCase().replace(' ', '_')];
        // Escape values with commas
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value || '';
      }).join(',')
    )
  ].join('\n');

  // Add BOM for proper Arabic encoding
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ✅ Export Report to Excel (JSON format)
export const exportToExcel = (fileName, data, sheetName = 'Sheet1') => {
  if (!data || data.length === 0) {
    alert('لا توجد بيانات للتصدير');
    return;
  }

  // Create Excel XML format
  const headers = Object.keys(data[0]);
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Title>${fileName}</Title>
  <Author>OPSMind</Author>
  <Created>${new Date().toISOString()}</Created>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Bottom" ss:WrapText="1"/>
   <Font ss:FontName="Cairo" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/>
  </Style>
  <Style ss:ID="Header">
   <Interior ss:Color="#2563EB" ss:Pattern="Solid"/>
   <Font ss:FontName="Cairo" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="${sheetName}">
  <Table>
   <Row ss:StyleID="Header">
    ${headers.map(h => `<Cell><Data ss:Type="String">${h}</Data></Cell>`).join('')}
   </Row>
   ${data.map(row => `
    <Row>
     ${headers.map(h => {
       const value = row[h];
       const type = typeof value === 'number' ? 'Number' : 'String';
       return `<Cell><Data ss:Type="${type}">${value}</Data></Cell>`;
     }).join('')}
    </Row>
   `).join('')}
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.xls`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ✅ Generate Report HTML
export const generateReportHTML = (title, data, includeFooter = true) => {
  const tableHTML = `
    <table>
      <thead>
        <tr>
          ${Object.keys(data[0] || {})
            .map(key => `<th>${key}</th>`)
            .join('')}
        </tr>
      </thead>
      <tbody>
        ${data.map(row => `
          <tr>
            ${Object.values(row)
              .map(value => `<td>${value}</td>`)
              .join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  const footer = includeFooter ? `
    <div class="footer">
      <p>عدد الصفوف: ${data.length}</p>
      <p>تاريخ الإنشاء: ${new Date().toLocaleString('ar-EG')}</p>
    </div>
  ` : '';

  return tableHTML + footer;
};

// ✅ Print Page
export const printPage = (elementId, title = 'طباعة') => {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('العنصر المطلوب غير موجود');
    return;
  }

  const printWindow = window.open('', '', 'width=900,height=600');
  const content = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Cairo', Arial, sans-serif;
          direction: rtl;
          background: white;
          padding: 20px;
        }
        @media print {
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      ${element.innerHTML}
    </body>
    </html>
  `;

  printWindow.document.write(content);
  printWindow.document.close();

  setTimeout(() => {
    printWindow.print();
  }, 250);
};

export default {
  exportToPDF,
  exportToCSV,
  exportToExcel,
  generateReportHTML,
  printPage
};
