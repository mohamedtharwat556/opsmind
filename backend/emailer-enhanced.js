/**
 * Enhanced Email System - OPSMind
 * يدعم 8 قوالب بريد مختلفة
 */

// استخدام console بدل nodemailer للـ mock (محاكاة)
// في الإنتاج: npm install nodemailer

class EmailService {
  // قالب إعلان جديد
  static announcementEmail(userEmail, announcement) {
    return {
      to: userEmail,
      subject: `📢 إعلان جديد: ${announcement.title}`,
      html: `
        <div style="direction: rtl; font-family: Arial; background: #f5f5f5; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 20px;">
            <h2 style="color: #2563EB; margin-top: 0;">${announcement.title}</h2>
            <p style="color: #64748B; font-size: 14px;">من: <strong>${announcement.author}</strong></p>
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p style="color: #334155; line-height: 1.6;">${announcement.content}</p>
            </div>
            <p style="color: #64748B; font-size: 12px;">
              الأولوية: <span style="background: ${getPriorityColor(announcement.priority)}; color: white; padding: 2px 8px; border-radius: 4px;">
                ${announcement.priority}
              </span>
            </p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
            <a href="http://localhost:5173/user/announcements" style="background: #2563EB; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block;">
              عرض الإعلان كاملاً
            </a>
          </div>
        </div>
      `
    };
  }

  // قالب مقالة جديدة
  static articleEmail(userEmail, article) {
    return {
      to: userEmail,
      subject: `📚 مقالة جديدة: ${article.title}`,
      html: `
        <div style="direction: rtl; font-family: Arial; background: #f5f5f5; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 20px;">
            <h2 style="color: #059669; margin-top: 0;">${article.title}</h2>
            <p style="color: #64748B; font-size: 14px;">الفئة: <strong>${article.category}</strong></p>
            <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p style="color: #334155; line-height: 1.6;">${article.content?.substring(0, 200)}...</p>
            </div>
            <a href="http://localhost:5173/user/knowledge-base" style="background: #059669; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block;">
              اقرأ المقالة الكاملة
            </a>
          </div>
        </div>
      `
    };
  }

  // قالب مشكلة جديدة
  static newCaseEmail(managerEmail, caseData) {
    return {
      to: managerEmail,
      subject: `⚠️ مشكلة جديدة: ${caseData.title}`,
      html: `
        <div style="direction: rtl; font-family: Arial; background: #f5f5f5; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 20px;">
            <h2 style="color: #DC2626; margin-top: 0;">مشكلة جديدة مُبلغ عنها</h2>
            <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p><strong>العنوان:</strong> ${caseData.title}</p>
              <p><strong>المُبلغ:</strong> ${caseData.reporter}</p>
              <p><strong>الحالة:</strong> <span style="background: #DC2626; color: white; padding: 2px 8px; border-radius: 4px;">مفتوح</span></p>
              <p><strong>الـ SOP:</strong> ${caseData.sop || 'لا يوجد'}</p>
            </div>
            <a href="http://localhost:5173/admin/cases/${caseData.id}" style="background: #DC2626; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block;">
              عرض المشكلة
            </a>
          </div>
        </div>
      `
    };
  }

  // قالب حل مشكلة
  static caseResolvedEmail(userEmail, caseData, solution) {
    return {
      to: userEmail,
      subject: `✅ تم حل مشكلتك: ${caseData.title}`,
      html: `
        <div style="direction: rtl; font-family: Arial; background: #f5f5f5; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 20px;">
            <h2 style="color: #10B981; margin-top: 0;">تم حل مشكلتك! 🎉</h2>
            <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p><strong>المشكلة:</strong> ${caseData.title}</p>
              <p><strong>الحل:</strong> ${solution}</p>
            </div>
            <p style="color: #64748B;">شكراً على الإبلاغ عن هذه المشكلة. نحن نسعى لتحسين الخدمة بناءً على ملاحظاتكم.</p>
            <a href="http://localhost:5173/user/cases/${caseData.id}" style="background: #10B981; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block;">
              عرض التفاصيل
            </a>
          </div>
        </div>
      `
    };
  }

  // قالب مشكلة معلقة (تذكير)
  static pendingCaseReminderEmail(userEmail, pendingCases) {
    return {
      to: userEmail,
      subject: `📋 تذكير: لديك ${pendingCases.length} مشاكل معلقة`,
      html: `
        <div style="direction: rtl; font-family: Arial; background: #f5f5f5; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 20px;">
            <h2 style="color: #F59E0B; margin-top: 0;">تذكير: مشاكل معلقة</h2>
            <p>لديك ${pendingCases.length} مشاكل قيد المتابعة:</p>
            <ul style="background: #fffbeb; padding: 15px; border-radius: 8px; list-style: none;">
              ${pendingCases.map(c => `<li style="padding: 8px 0; border-bottom: 1px solid #fde68a;">
                <strong>${c.title}</strong><br/>
                <span style="color: #92400E; font-size: 12px;">منذ: ${c.daysOpen} أيام</span>
              </li>`).join('')}
            </ul>
            <a href="http://localhost:5173/user/cases" style="background: #F59E0B; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block; margin-top: 15px;">
              عرض جميع المشاكل
            </a>
          </div>
        </div>
      `
    };
  }

  // قالب ترحيب موظف جديد
  static welcomeEmail(employee) {
    return {
      to: employee.email,
      subject: `🎉 مرحباً ${employee.name}! في منصة OPSMind`,
      html: `
        <div style="direction: rtl; font-family: Arial; background: #f5f5f5; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 20px;">
            <h2 style="color: #2563EB; margin-top: 0;">مرحباً بك في OPSMind! 👋</h2>
            <p style="font-size: 16px; color: #334155;">مرحباً ${employee.name}،</p>
            <p style="color: #64748B;">نحن سعداء بانضمامك إلى فريقنا. منصة OPSMind ستساعدك على:</p>
            <ul style="color: #475569;">
              <li>📖 الوصول إلى قاعدة المعرفة الشاملة</li>
              <li>📝 الإبلاغ عن المشاكل بسهولة</li>
              <li>📚 تصفح إجراءات التشغيل الموثقة</li>
              <li>📊 متابعة إنجازاتك والنقاط</li>
            </ul>
            <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>بيانات حسابك:</strong></p>
              <p>البريد: ${employee.email}</p>
              <p>القسم: ${employee.department}</p>
              <p>الدور: ${employee.role}</p>
            </div>
            <a href="http://localhost:5173/" style="background: #2563EB; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block;">
              الدخول إلى المنصة
            </a>
          </div>
        </div>
      `
    };
  }

  // قالب تقرير يومي
  static dailySummaryEmail(userEmail, summary) {
    return {
      to: userEmail,
      subject: `📊 الملخص اليومي - ${new Date().toLocaleDateString('ar-EG')}`,
      html: `
        <div style="direction: rtl; font-family: Arial; background: #f5f5f5; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 20px;">
            <h2 style="color: #2563EB; margin-top: 0;">الملخص اليومي</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 15px 0;">
              <div style="background: #ecfdf5; padding: 15px; border-radius: 8px;">
                <p style="margin: 0; color: #10B981; font-weight: bold; font-size: 24px;">${summary.newCases}</p>
                <p style="margin: 5px 0 0; color: #064e3b; font-size: 12px;">مشاكل جديدة</p>
              </div>
              <div style="background: #fef2f2; padding: 15px; border-radius: 8px;">
                <p style="margin: 0; color: #DC2626; font-weight: bold; font-size: 24px;">${summary.resolvedCases}</p>
                <p style="margin: 5px 0 0; color: #7f1d1d; font-size: 12px;">مشاكل تم حلها</p>
              </div>
            </div>
            <p style="color: #64748B; margin-top: 15px;">إجمالي المشاكل المعلقة: <strong>${summary.pendingCases}</strong></p>
            <a href="http://localhost:5173/admin/dashboard" style="background: #2563EB; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block; margin-top: 15px;">
              عرض التفاصيل الكاملة
            </a>
          </div>
        </div>
      `
    };
  }

  // قالب تغيير الصلاحيات
  static permissionChangeEmail(userEmail, changes) {
    return {
      to: userEmail,
      subject: `🔐 تم تغيير صلاحياتك`,
      html: `
        <div style="direction: rtl; font-family: Arial; background: #f5f5f5; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 20px;">
            <h2 style="color: #7C3AED; margin-top: 0;">تنبيه أمان: تم تغيير صلاحياتك</h2>
            <div style="background: #f5f3ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p><strong>التغييرات:</strong></p>
              <ul>
                <li>الدور السابق: ${changes.oldRole}</li>
                <li>الدور الجديد: ${changes.newRole}</li>
                <li>وقت التغيير: ${changes.timestamp}</li>
              </ul>
            </div>
            <p style="color: #64748B; font-size: 12px;">إذا لم تكن أنت من قام بهذا التغيير، يرجى التواصل مع الإدارة فوراً.</p>
          </div>
        </div>
      `
    };
  }
}

// دالة مساعدة للألوان
function getPriorityColor(priority) {
  const colors = {
    'عالية': '#DC2626',
    'حرجة': '#991B1B',
    'عادية': '#2563EB'
  };
  return colors[priority] || '#2563EB';
}

// دالة Mock لـ Production
async function sendEmail(emailConfig) {
  console.log('\n📧 [EMAIL SENT]');
  console.log('To:', emailConfig.to);
  console.log('Subject:', emailConfig.subject);
  console.log('---');
  console.log('HTML Preview: Email would be sent with template above');
  console.log('---\n');
  
  // في الإنتاج: استخدم nodemailer
  /*
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  
  return await transporter.sendMail(emailConfig);
  */
  
  return { success: true, messageId: `<mock-${Date.now()}@yas.com>` };
}

module.exports = { EmailService, sendEmail };
