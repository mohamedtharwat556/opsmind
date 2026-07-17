const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

// ✅ Load Configuration
const config = require('./config');
const { supabase } = config;

// ✅ Import validators and middleware
const {
  validateEmail,
  validatePassword,
  validateText,
  validateObject
} = require('./validators');

const {
  authenticate,
  authorize,
  sanitizeRequestBody,
  rateLimiter,
  errorHandler,
  requestLogger,
  enhancedCORS,
  securityHeaders
} = require('./middleware');

// ✅ Import Password Hasher
const passwordHasher = require('./password-hasher');

// ✅ Import Email Service (جديد)
const { EmailService, sendEmail } = require('./emailer-enhanced');

const app = express();

// ✅ Middleware Setup
app.use(requestLogger);
app.use(securityHeaders);
app.use(enhancedCORS);
app.use(express.json());
app.use(sanitizeRequestBody);
app.use(rateLimiter(config.RATE_LIMIT_WINDOW, config.RATE_LIMIT_MAX_REQUESTS));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: config.CORS_ORIGIN }
});

const JWT_SECRET = config.JWT_SECRET;
const dbPath = path.join(__dirname, config.DB_PATH);

// Database Template
let db = {
  users: [
    { id: 'u1', name: 'آدم فاروق', email: 'adam@yas.com', role: 'موظف', department: 'العمليات' },
    { id: 'u2', name: 'استاذ ابراهيم', email: 'ibrahim@yas.com', role: 'المدير العام', department: 'الإدارة' },
    { id: 'u3', name: 'محمد ثروت', email: 'tharwat@yas.com', role: 'رئيس قسم الهندسة', department: 'الهندسة' }
  ],
  articles: [
    { id: 1, title: 'كيفية إعداد VPN الداخلي للشركة للعمل عن بُعد', category: 'الشبكات و VPN', views: 342, updated: 'منذ يومين', content: 'دليل شامل...' },
    { id: 2, title: 'دليل استكشاف أخطاء الطابعة المشتركة وحلها', category: 'أنظمة التشغيل', views: 218, updated: 'منذ أسبوع', content: 'دليل تفصيلي...' },
    { id: 3, title: 'طريقة طلب صلاحيات وصول جديدة لـ AWS Console', category: 'خدمات السحابة (Cloud)', views: 156, updated: 'منذ 3 أيام', content: 'خطوات الحصول على الصلاحيات...' }
  ],
  cases: [
    { id: '#405', title: 'الموظف الجديد لم يستلم دعوة GitHub', reporter: 'عبدالله', sop: 'SOP-104', status: 'مفتوح', time: 'منذ ساعتين' },
    { id: '#406', title: 'فشل النشر', reporter: 'محمد', sop: 'SOP-201', status: 'قيد العمل', time: 'منذ 5 ساعات' }
  ],
  sops: [
    {
      id: 'SOP-104',
      title: 'إعداد المهندسين الجدد (Onboarding)',
      version: 'v2.4',
      status: 'فعال',
      owner: 'عمليات الهندسة',
      lastUpdated: '12 أكتوبر 2023',
      priority: 'عالية',
      steps: [
        { title: 'تهيئة البريد الإلكتروني', desc: 'إنشاء حساب Gmail للموظف الجديد' },
        { title: 'دعوة لـ GitHub', desc: 'إرسال دعوة إلى حساب GitHub الخاص بالمهندس الجديد' }
      ]
    }
  ],
  stats: {
    totalUsers: { value: 7, change: '+1 نشط' },
    activeSOPs: { value: 3, change: '+1 جديد' },
    resolvedCases: { value: 14, change: '+3 مكتمل' }
  },
  approvals: [],
  auditLogs: []
};

const saveDb = () => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving to db.json', e);
  }
};

const loadDb = () => {
  if (fs.existsSync(dbPath)) {
    try {
      db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } catch (e) {
      console.error('Error reading db.json, using default', e);
    }
  } else {
    saveDb();
  }
};

loadDb();

// Socket.io
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected'));
});

// --- API ENDPOINTS ---

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Auth
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'البريد الإلكتروني وكلمة المرور مطلوبان',
        code: 'MISSING_FIELDS'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ 
        error: 'صيغة البريد الإلكتروني غير صحيحة',
        code: 'INVALID_EMAIL'
      });
    }

    const user = db.users.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ 
        error: 'البيانات المستخدمة غير صحيحة',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Check password if hashed password exists
    let passwordValid = true;
    if (user.password) {
      passwordValid = await passwordHasher.compare(password, user.password);
    }

    if (!passwordValid) {
      return res.status(401).json({ 
        error: 'البيانات المستخدمة غير صحيحة',
        code: 'INVALID_CREDENTIALS'
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    // Remove password from user object before sending to client
    const { password: _, ...userWithoutPassword } = user;

    res.json({ 
      token, 
      user: userWithoutPassword,
      message: `مرحباً ${user.name}!`
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/me', authenticate, (req, res) => {
  try {
    const user = db.users.find(u => u.id === req.user.id);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cases
app.get('/api/cases', (req, res) => {
  res.json(db.cases);
});

app.post('/api/cases', authenticate, (req, res) => {
  try {
    const { title, sop, reporter } = req.body;

    if (!validateText(title, 5, 200)) {
      return res.status(400).json({ 
        error: 'عنوان المشكلة يجب أن يكون بين 5 و 200 حرف',
        code: 'INVALID_TITLE'
      });
    }

    const newCase = {
      id: '#' + Math.floor(Math.random() * 900 + 410),
      title: title.trim(),
      reporter: reporter || req.user.name,
      sop: sop || 'لا يوجد',
      status: 'مفتوح',
      time: 'الآن'
    };
    
    db.cases.unshift(newCase);
    saveDb();
    
    res.status(201).json(newCase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SOPs
app.get('/api/sops', (req, res) => {
  res.json(db.sops);
});

app.post('/api/sops', authenticate, authorize('المدير العام', 'رئيس قسم الهندسة'), (req, res) => {
  try {
    const { title, owner, steps, priority } = req.body;

    if (!validateText(title, 5, 200)) {
      return res.status(400).json({ 
        error: 'عنوان الإجراء يجب أن يكون بين 5 و 200 حرف',
        code: 'INVALID_TITLE'
      });
    }

    const newSop = {
      id: 'SOP-' + Math.floor(Math.random() * 900 + 100),
      title: title.trim(),
      version: 'v1.0',
      status: 'مسودة',
      owner: owner || 'ادم فاروق',
      lastUpdated: 'الآن',
      priority: priority || 'متوسطة',
      steps: steps || [],
      relatedCases: []
    };
    
    db.sops.push(newSop);
    saveDb();
    
    res.status(201).json(newSop);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dashboard
app.get('/api/dashboard/stats', (req, res) => {
  // تأكد من وجود isPositive field
  const stats = { ...db.stats };
  if (!stats.totalUsers.isPositive) stats.totalUsers.isPositive = true;
  if (!stats.activeSOPs.isPositive) stats.activeSOPs.isPositive = true;
  if (!stats.resolvedCases.isPositive) stats.resolvedCases.isPositive = true;
  if (!stats.avgResponseTime.isPositive) stats.avgResponseTime.isPositive = true;
  res.json({ stats, approvals: db.approvals });
});

// Get all departments (moved later to avoid duplicate)

// Create department
app.post('/api/departments', authenticate, (req, res) => {
  try {
    const { name, head } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'اسم القسم مطلوب' });
    }
    const newDept = {
      name: name.trim(),
      members: 0,
      sops: 0,
      head: head || 'بدون مسؤول',
      color: '#' + Math.floor(Math.random()*16777215).toString(16)
    };
    if (!db.departments) db.departments = [];
    db.departments.push(newDept);
    saveDb();
    res.status(201).json(newDept);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Handle approval actions
app.post('/api/dashboard/approvals/:id/action', authenticate, (req, res) => {
  try {
    const { action } = req.body;
    const approval = db.approvals.find(a => a.id === parseInt(req.params.id));
    
    if (!approval) {
      return res.status(404).json({ error: 'الطلب غير موجود' });
    }
    
    if (action === 'approve') {
      approval.status = 'موافق عليه';
      approval.actionBy = req.user.name;
      approval.actionTime = new Date().toISOString();
    } else if (action === 'reject') {
      approval.status = 'مرفوض';
      approval.actionBy = req.user.name;
      approval.actionTime = new Date().toISOString();
    }
    
    saveDb();
    res.json({ success: true, message: 'تم تحديث الطلب', approval });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Audit Logs
app.get('/api/audit-logs', (req, res) => {
  res.json(db.auditLogs);
});

// ========== ARTICLES ENDPOINTS ==========
// Get all articles
app.get('/api/articles', (req, res) => {
  try {
    res.json(db.articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single article
app.get('/api/articles/:id', (req, res) => {
  try {
    const article = db.articles.find(a => a.id === parseInt(req.params.id));
    if (!article) {
      return res.status(404).json({ error: 'المقال غير موجود' });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new article
app.post('/api/articles', (req, res) => {
  try {
    const { title, category, content } = req.body;

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({ 
        error: 'عنوان المقال مطلوب',
        code: 'MISSING_TITLE'
      });
    }

    if (title.trim().length < 5) {
      return res.status(400).json({ 
        error: 'عنوان المقال يجب أن يكون 5 أحرف على الأقل',
        code: 'INVALID_TITLE'
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ 
        error: 'محتوى المقال مطلوب',
        code: 'MISSING_CONTENT'
      });
    }

    if (content.trim().length < 10) {
      return res.status(400).json({ 
        error: 'محتوى المقال يجب أن يكون 10 أحرف على الأقل',
        code: 'INVALID_CONTENT'
      });
    }

    // Create new article
    const newArticle = {
      id: Math.max(0, ...db.articles.map(a => a.id)) + 1,
      title: title.trim(),
      category: category || 'عام',
      content: content.trim(),
      views: 0,
      updated: 'الآن'
    };

    db.articles.unshift(newArticle);
    saveDb();

    res.status(201).json(newArticle);
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update article
app.put('/api/articles/:id', (req, res) => {
  try {
    const { title, category, content } = req.body;
    const article = db.articles.find(a => a.id === parseInt(req.params.id));

    if (!article) {
      return res.status(404).json({ error: 'المقال غير موجود' });
    }

    if (title) article.title = title.trim();
    if (category) article.category = category;
    if (content) article.content = content.trim();
    article.updated = 'الآن';

    saveDb();
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete article
app.delete('/api/articles/:id', (req, res) => {
  try {
    const index = db.articles.findIndex(a => a.id === parseInt(req.params.id));

    if (index === -1) {
      return res.status(404).json({ error: 'المقال غير موجود' });
    }

    const deleted = db.articles.splice(index, 1);
    saveDb();

    res.json({ message: 'تم حذف المقال', deleted: deleted[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Increment article views
app.post('/api/articles/:id/view', (req, res) => {
  try {
    const article = db.articles.find(a => a.id === parseInt(req.params.id));

    if (!article) {
      return res.status(404).json({ error: 'المقال غير موجود' });
    }

    article.views = (article.views || 0) + 1;
    saveDb();

    res.json({ message: 'تم تسجيل المشاهدة', views: article.views });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ====================================

// ========== USERS ENDPOINTS ==========
// Get all users
app.get('/api/users', (req, res) => {
  try {
    res.json(db.users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single user
app.get('/api/users/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id) || req.params.id;
    const user = db.users.find(u => u.id === userId || u.id === parseInt(req.params.id));
    
    if (!user) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create user
app.post('/api/users', (req, res) => {
  try {
    const { name, email, role, department, status } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'الاسم مطلوب' });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'البريد الإلكتروني مطلوب' });
    }

    // Check if email already exists
    if (db.users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'هذا البريد الإلكتروني موجود بالفعل' });
    }

    const newUser = {
      id: db.users.length + 1,
      name: name.trim(),
      email: email.trim(),
      role: role || 'موظف',
      department: department || 'عام',
      status: status || 'نشط',
      points: 0
    };

    db.users.push(newUser);
    saveDb();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user
app.put('/api/users/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id) || req.params.id;
    const user = db.users.find(u => u.id === userId || u.id === parseInt(req.params.id));

    if (!user) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }

    if (req.body.status) user.status = req.body.status;
    if (req.body.role) user.role = req.body.role;
    if (req.body.points !== undefined) user.points = req.body.points;
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.department) user.department = req.body.department;

    saveDb();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id) || req.params.id;
    const index = db.users.findIndex(u => u.id === userId || u.id === parseInt(req.params.id));

    if (index === -1) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }

    // منع حذف المدير العام
    if (db.users[index].email === 'ibrahim@yas.com') {
      return res.status(403).json({ error: 'لا يمكن حذف المدير العام' });
    }

    const deleted = db.users.splice(index, 1);
    saveDb();

    res.json({ message: 'تم حذف المستخدم', deleted: deleted[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ====================================

// ========== 2FA AUTHENTICATION ENDPOINTS ==========
// تفعيل 2FA
app.post('/api/2fa/setup', authenticate, (req, res) => {
  try {
    const user = db.users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }

    // محاكاة إنشاء secret key
    const secret = 'JBSWY3DPEBLW64TMMQ======';
    const qrCode = `otpauth://totp/OPSMind:${user.email}?secret=${secret}&issuer=OPSMind`;

    res.json({
      success: true,
      qrCode,
      secret,
      backupCodes: [
        '1234-5678-9012',
        '3456-7890-1234',
        '5678-9012-3456',
        '7890-1234-5678',
        '9012-3456-7890'
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// التحقق من OTP
app.post('/api/2fa/verify', authenticate, (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp || otp.length !== 6) {
      return res.status(400).json({ error: 'كود OTP غير صحيح' });
    }

    // محاكاة التحقق
    if (otp === '123456' || /^\d{6}$/.test(otp)) {
      res.json({
        success: true,
        message: 'تم التحقق بنجاح',
        token: 'verified-' + Date.now()
      });
    } else {
      res.status(401).json({ error: 'كود OTP خاطئ' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// تفعيل 2FA للمستخدم
app.post('/api/2fa/enable', authenticate, (req, res) => {
  try {
    const user = db.users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }

    user.twoFactorEnabled = true;
    user.twoFactorSetupDate = new Date().toISOString();

    res.json({
      success: true,
      message: 'تم تفعيل المصادقة الثنائية',
      user: { id: user.id, name: user.name, twoFactorEnabled: true }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// تعطيل 2FA
app.post('/api/2fa/disable', authenticate, (req, res) => {
  try {
    const user = db.users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }

    user.twoFactorEnabled = false;

    res.json({
      success: true,
      message: 'تم تعطيل المصادقة الثنائية',
      user: { id: user.id, name: user.name, twoFactorEnabled: false }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== EMAIL/NOTIFICATIONS ENDPOINTS ==========
// إرسال بريد إعلان
app.post('/api/email/announcement', authenticate, authorize('المدير العام'), async (req, res) => {
  try {
    const { announcementId } = req.body;
    const announcement = (db.announcements || []).find(a => a.id === announcementId);

    if (!announcement) {
      return res.status(404).json({ error: 'الإعلان غير موجود' });
    }

    // إرسال بريد لجميع الموظفين
    const emailsSent = [];
    for (const user of db.users) {
      const emailConfig = EmailService.announcementEmail(user.email, announcement);
      await sendEmail(emailConfig);
      emailsSent.push(user.email);
    }

    res.json({ 
      success: true, 
      message: `تم إرسال البريد لـ ${emailsSent.length} موظف`,
      sentTo: emailsSent 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// إرسال بريد مقالة جديدة
app.post('/api/email/article', authenticate, async (req, res) => {
  try {
    const { articleId } = req.body;
    const article = (db.articles || []).find(a => a.id === articleId);

    if (!article) {
      return res.status(404).json({ error: 'المقالة غير موجودة' });
    }

    const emailConfig = EmailService.articleEmail(req.user.email, article);
    await sendEmail(emailConfig);

    res.json({ success: true, message: 'تم إرسال البريد' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// إرسال بريد مشكلة جديدة للمدير
app.post('/api/email/case-notification', authenticate, async (req, res) => {
  try {
    const { caseId } = req.body;
    const caseData = db.cases.find(c => c.id === caseId);

    if (!caseData) {
      return res.status(404).json({ error: 'المشكلة غير موجودة' });
    }

    // إرسال للمدير المباشر
    const managers = db.users.filter(u => u.role === 'المدير العام' || u.role === 'رئيس قسم الهندسة');
    
    for (const manager of managers) {
      const emailConfig = EmailService.newCaseEmail(manager.email, caseData);
      await sendEmail(emailConfig);
    }

    res.json({ success: true, message: 'تم إبلاغ المديرين' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// إرسال بريد حل مشكلة
app.post('/api/email/case-resolved', authenticate, async (req, res) => {
  try {
    const { caseId, solution } = req.body;
    const caseData = db.cases.find(c => c.id === caseId);

    if (!caseData) {
      return res.status(404).json({ error: 'المشكلة غير موجودة' });
    }

    const reporter = db.users.find(u => u.name === caseData.reporter);
    if (reporter) {
      const emailConfig = EmailService.caseResolvedEmail(reporter.email, caseData, solution);
      await sendEmail(emailConfig);
    }

    res.json({ success: true, message: 'تم إرسال بريد الحل' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// إرسال تقرير يومي
app.post('/api/email/daily-summary', authenticate, authorize('المدير العام'), async (req, res) => {
  try {
    const today = new Date().toDateString();
    const newCases = db.cases.filter(c => new Date(c.createdAt || '').toDateString() === today).length;
    const resolvedCases = db.cases.filter(c => c.status === 'محلول').length;
    const pendingCases = db.cases.filter(c => c.status === 'مفتوح' || c.status === 'قيد العمل').length;

    const summary = { newCases, resolvedCases, pendingCases };

    for (const user of db.users.filter(u => u.role === 'المدير العام')) {
      const emailConfig = EmailService.dailySummaryEmail(user.email, summary);
      await sendEmail(emailConfig);
    }

    res.json({ success: true, message: 'تم إرسال التقرير اليومي', summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// إرسال بريد ترحيب موظف جديد
app.post('/api/email/welcome', authenticate, authorize('المدير العام'), async (req, res) => {
  try {
    const { userId } = req.body;
    const user = db.users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }

    const emailConfig = EmailService.welcomeEmail(user);
    await sendEmail(emailConfig);

    res.json({ success: true, message: 'تم إرسال بريد الترحيب' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// تذكير المشاكل المعلقة
app.post('/api/email/pending-reminder', authenticate, async (req, res) => {
  try {
    const pendingCases = db.cases.filter(c => c.status === 'مفتوح' || c.status === 'قيد العمل');
    
    if (pendingCases.length === 0) {
      return res.json({ success: true, message: 'لا توجد مشاكل معلقة' });
    }

    for (const manager of db.users.filter(u => u.role === 'المدير العام')) {
      const emailConfig = EmailService.pendingCaseReminderEmail(
        manager.email,
        pendingCases.map(c => ({ ...c, daysOpen: Math.floor((Date.now() - (c.createdAt ? new Date(c.createdAt).getTime() : Date.now())) / (1000 * 60 * 60 * 24)) }))
      );
      await sendEmail(emailConfig);
    }

    res.json({ success: true, message: 'تم إرسال التذكيرات' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ====================================
// Get all announcements
app.get('/api/announcements', (req, res) => {
  try {
    const announcements = db.announcements || [];
    res.json(announcements.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Departments Endpoint (جديد)
app.get('/api/departments', (req, res) => {
  try {
    res.json(db.departments || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Settings Endpoints (جديد)
app.get('/api/settings', (req, res) => {
  try {
    res.json(db.settings || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/settings', authenticate, authorize('المدير العام'), (req, res) => {
  try {
    const { companyName, language, timezone, notificationEmail, notifications, minPasswordLength, sessionTimeout } = req.body;

    db.settings = {
      ...db.settings,
      ...(companyName && { companyName }),
      ...(language && { language }),
      ...(timezone && { timezone }),
      ...(notificationEmail && { notificationEmail }),
      ...(notifications && { notifications }),
      ...(minPasswordLength && { minPasswordLength }),
      ...(sessionTimeout && { sessionTimeout })
    };

    saveDb();
    res.json(db.settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search Endpoint (جديد)
app.get('/api/search', (req, res) => {
  try {
    const q = req.query.q?.toLowerCase() || '';
    
    if (!q || q.length < 2) {
      return res.json({ sops: [], articles: [], cases: [] });
    }

    const sops = (db.sops || []).filter(s => 
      s.title?.toLowerCase().includes(q) ||
      s.id?.toLowerCase().includes(q)
    );

    const articles = (db.articles || []).filter(a => 
      a.title?.toLowerCase().includes(q) ||
      a.category?.toLowerCase().includes(q)
    );

    const cases = (db.cases || []).filter(c => 
      c.title?.toLowerCase().includes(q) ||
      c.id?.toLowerCase().includes(q)
    );

    res.json({ sops, articles, cases });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ====================================

// Get all announcements

// Get single announcement
app.get('/api/announcements/:id', (req, res) => {
  try {
    const announcement = (db.announcements || []).find(a => a.id === parseInt(req.params.id));
    if (!announcement) {
      return res.status(404).json({ error: 'الإعلان غير موجود' });
    }
    res.json(announcement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new announcement (Admin only)
app.post('/api/announcements', authenticate, (req, res) => {
  try {
    const { title, content, targetAudience, priority } = req.body;

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({ 
        error: 'عنوان الإعلان مطلوب',
        code: 'MISSING_TITLE'
      });
    }

    if (title.trim().length < 5) {
      return res.status(400).json({ 
        error: 'عنوان الإعلان يجب أن يكون 5 أحرف على الأقل',
        code: 'INVALID_TITLE'
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ 
        error: 'محتوى الإعلان مطلوب',
        code: 'MISSING_CONTENT'
      });
    }

    if (content.trim().length < 10) {
      return res.status(400).json({ 
        error: 'محتوى الإعلان يجب أن يكون 10 أحرف على الأقل',
        code: 'INVALID_CONTENT'
      });
    }

    if (!db.announcements) {
      db.announcements = [];
    }

    // Create new announcement
    const newAnnouncement = {
      id: Math.max(0, ...db.announcements.map(a => a.id || 0)) + 1,
      title: title.trim(),
      content: content.trim(),
      author: req.user.name,
      authorRole: req.user.role,
      timestamp: new Date().toISOString(),
      targetAudience: targetAudience || 'الجميع',
      priority: priority || 'عادية',
      status: 'نشط'
    };

    db.announcements.unshift(newAnnouncement);
    saveDb();

    // Broadcast to all connected clients via Socket.io
    io.emit('new_announcement', newAnnouncement);

    res.status(201).json(newAnnouncement);
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update announcement (Admin only)
app.put('/api/announcements/:id', authenticate, authorize('المدير العام', 'رئيس قسم الهندسة'), (req, res) => {
  try {
    const { title, content, priority, status } = req.body;
    const announcement = (db.announcements || []).find(a => a.id === parseInt(req.params.id));

    if (!announcement) {
      return res.status(404).json({ error: 'الإعلان غير موجود' });
    }

    if (title) announcement.title = title.trim();
    if (content) announcement.content = content.trim();
    if (priority) announcement.priority = priority;
    if (status) announcement.status = status;
    announcement.lastModified = new Date().toISOString();

    saveDb();

    io.emit('announcement_updated', announcement);

    res.json(announcement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete announcement (Admin only)
app.delete('/api/announcements/:id', authenticate, authorize('المدير العام', 'رئيس قسم الهندسة'), (req, res) => {
  try {
    const index = (db.announcements || []).findIndex(a => a.id === parseInt(req.params.id));

    if (index === -1) {
      return res.status(404).json({ error: 'الإعلان غير موجود' });
    }

    const deleted = db.announcements.splice(index, 1);
    saveDb();

    io.emit('announcement_deleted', deleted[0].id);

    res.json({ message: 'تم حذف الإعلان', deleted: deleted[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ====================================

// 404 Not Found Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', message: 'The requested endpoint does not exist' });
});

// Error Handler (must be last)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Backend server running on port ${PORT}`);
  console.log(`🔐 Validation and Security enabled`);
  console.log(`📚 Database loaded`);
});
