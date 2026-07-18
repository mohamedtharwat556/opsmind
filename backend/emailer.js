/**
 * Email Utilities للـ Backend
 * استخدام Nodemailer (يمكن إضافته لاحقاً)
 * الآن: Templates جاهزة للاستخدام
 */

// Email Templates
const emailTemplates = {
  // ✅ Template: New Case Notification
  newCaseNotification: (caseData) => ({
    subject: `بلاغ جديد: ${caseData.id}`,
    html: `
      <div style="font-family: 'Cairo', Arial; direction: rtl; color: #0F172A; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563EB, #1E40AF); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">🔔 بلاغ جديد</h1>
        </div>
        <div style="background: white; padding: 20px; border: 1px solid #E2E8F0;">
          <p><strong>رقم البلاغ:</strong> ${caseData.id}</p>
          <p><strong>العنوان:</strong> ${caseData.title}</p>
          <p><strong>المُبلغ:</strong> ${caseData.reporter}</p>
          <p><strong>الحالة:</strong> <span style="background: #FEF2F2; color: #DC2626; padding: 4px 8px; border-radius: 4px;">${caseData.status}</span></p>
          ${caseData.sop ? `<p><strong>الإجراء المرتبط:</strong> ${caseData.sop}</p>` : ''}
          <p><strong>الوقت:</strong> ${new Date().toLocaleString('ar-EG')}</p>
        </div>
        <div style="background: #F8FAFC; padding: 15px; border: 1px solid #E2E8F0; border-top: none; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #64748B;">
          <p>© 2026 YAS - منصة العمليات المؤسسية</p>
        </div>
      </div>
    `
  }),

  // ✅ Template: SOP Created
  sopCreated: (sopData) => ({
    subject: `إجراء جديد: ${sopData.id}`,
    html: `
      <div style="font-family: 'Cairo', Arial; direction: rtl; color: #0F172A; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #059669, #047857); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">📋 إجراء تشغيل جديد</h1>
        </div>
        <div style="background: white; padding: 20px; border: 1px solid #E2E8F0;">
          <p><strong>رقم الإجراء:</strong> ${sopData.id}</p>
          <p><strong>العنوان:</strong> ${sopData.title}</p>
          <p><strong>الإصدار:</strong> ${sopData.version}</p>
          <p><strong>الحالة:</strong> <span style="background: #ECFDF5; color: #059669; padding: 4px 8px; border-radius: 4px;">${sopData.status}</span></p>
          <p><strong>الأولوية:</strong> ${sopData.priority}</p>
          <p><strong>عدد الخطوات:</strong> ${sopData.steps?.length || 0}</p>
        </div>
        <div style="background: #F8FAFC; padding: 15px; border: 1px solid #E2E8F0; border-top: none; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #64748B;">
          <p>© 2026 YAS - منصة العمليات المؤسسية</p>
        </div>
      </div>
    `
  }),

  // ✅ Template: Daily Summary
  dailySummary: (data) => ({
    subject: `📊 ملخص اليوم - ${new Date().toLocaleDateString('ar-EG')}`,
    html: `
      <div style="font-family: 'Cairo', Arial; direction: rtl; color: #0F172A; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #7C3AED, #6D28D9); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">📊 ملخص اليوم</h1>
          <p style="margin: 10px 0 0; font-size: 14px; opacity: 0.9;">${new Date().toLocaleDateString('ar-EG')}</p>
        </div>
        <div style="background: white; padding: 20px; border: 1px solid #E2E8F0;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div style="background: #EFF6FF; padding: 15px; border-radius: 8px; text-align: center;">
              <p style="color: #64748B; margin: 0 0 10px; font-size: 12px;">بلاغات جديدة</p>
              <p style="color: #2563EB; margin: 0; font-size: 24px; font-weight: 800;">${data.newCases || 0}</p>
            </div>
            <div style="background: #ECFDF5; padding: 15px; border-radius: 8px; text-align: center;">
              <p style="color: #64748B; margin: 0 0 10px; font-size: 12px;">مشاكل محلولة</p>
              <p style="color: #059669; margin: 0; font-size: 24px; font-weight: 800;">${data.resolvedCases || 0}</p>
            </div>
          </div>
          ${data.topIssues ? `
            <div style="margin-top: 20px;">
              <h3 style="color: #0F172A; font-size: 14px; margin: 0 0 10px;">أهم المشاكل:</h3>
              <ul style="margin: 0; padding-right: 20px; color: #475569; font-size: 14px;">
                ${data.topIssues.map(issue => `<li>${issue}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
        <div style="background: #F8FAFC; padding: 15px; border: 1px solid #E2E8F0; border-top: none; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #64748B;">
          <p>© 2026 YAS - منصة العمليات المؤسسية</p>
        </div>
      </div>
    `
  }),

  // ✅ Template: User Welcome
  welcomeEmail: (userName) => ({
    subject: 'مرحباً بك في منصة YAS',
    html: `
      <div style="font-family: 'Cairo', Arial; direction: rtl; color: #0F172A; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563EB, #1E40AF); color: white; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🎉 مرحباً بك</h1>
          <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">${userName}</p>
        </div>
        <div style="background: white; padding: 30px; border: 1px solid #E2E8F0;">
          <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6;">
            مرحباً بك في <strong>منصة YAS</strong> - منصة العمليات المؤسسية المتكاملة!
          </p>
          <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6;">
            يمكنك الآن:
          </p>
          <ul style="margin: 0 0 20px; padding-right: 20px; color: #475569; font-size: 14px;">
            <li>📋 الوصول إلى جميع إجراءات التشغيل</li>
            <li>📖 البحث في قاعدة المعرفة الشاملة</li>
            <li>🐛 الإبلاغ عن المشاكل والمتابعة</li>
            <li>🤖 استخدام المساعد الذكي للإجابة على أسئلتك</li>
          </ul>
          <p style="margin: 0; font-size: 14px;">
            <a href="http://localhost:5173/user" style="display: inline-block; background: #2563EB; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 600;">
              بدء الاستخدام
            </a>
          </p>
        </div>
        <div style="background: #F8FAFC; padding: 15px; border: 1px solid #E2E8F0; border-top: none; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #64748B;">
          <p>© 2026 YAS - منصة العمليات المؤسسية</p>
        </div>
      </div>
    `
  })
};

// ✅ Email Service Class (Ready for Nodemailer)
class EmailService {
  constructor(config = {}) {
    this.config = config;
    // في المستقبل سيتم استخدام Nodemailer:
    // this.transporter = nodemailer.createTransport(config);
  }

  /**
   * Send Email
   * @param {string} to - Recipient email
   * @param {string} subject - Email subject
   * @param {string} html - Email HTML content
   * @returns {Promise}
   */
  async send(to, subject, html) {
    try {
      // في المستقبل:
      // await this.transporter.sendMail({ to, subject, html, from: this.config.from });
      
      // الآن: Log فقط
      console.log(`📧 Email would be sent to: ${to}`);
      console.log(`Subject: ${subject}`);
      
      return {
        success: true,
        message: `تم إرسال البريد إلى ${to}`,
        to,
        subject
      };
    } catch (error) {
      console.error('Email error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Send from template
   */
  async sendFromTemplate(to, templateName, data) {
    const template = emailTemplates[templateName];
    
    if (!template) {
      throw new Error(`Template "${templateName}" not found`);
    }

    const { subject, html } = template(data);
    return this.send(to, subject, html);
  }

  /**
   * Send bulk emails
   */
  async sendBulk(recipients, subject, html) {
    const results = await Promise.all(
      recipients.map(to => this.send(to, subject, html))
    );
    
    return {
      total: recipients.length,
      sent: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
  }
}

// Export
const emailService = new EmailService();

module.exports = {
  emailTemplates,
  EmailService,
  emailService
};
