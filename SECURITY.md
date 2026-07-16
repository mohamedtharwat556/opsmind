# 🔒 OPSMind - Security Guide

## تحذيرات أمان هامة

هذا المشروع قيد التطوير. قبل الإنتاج، يجب تطبيق جميع التوصيات أدناه.

---

## ✅ الميزات الأمنية المطبقة

### 1. **JWT Authentication**
- ✅ Tokens تنتهي بعد 24 ساعة
- ✅ Secret Key مخزن في environment variables
- ✅ Bearer token في HTTP headers

### 2. **CORS Protection**
- ✅ محدود على `FRONTEND_URL` المرخص
- ✅ Credentials محدود

### 3. **Rate Limiting**
- ✅ 100 requests per 15 minutes
- ✅ حماية من DDoS attacks

### 4. **Input Validation**
- ✅ Email validation
- ✅ Password validation (8+ chars, uppercase, lowercase, numbers)
- ✅ Text sanitization
- ✅ SQL injection protection

### 5. **Security Headers**
- ✅ X-Frame-Options
- ✅ X-XSS-Protection
- ✅ X-Content-Type-Options
- ✅ Content-Security-Policy

---

## ⚠️ المشاكل الأمنية الحالية

### 🔴 **CRITICAL**

#### 1. كلمات المرور غير مشفرة
**المشكلة:** Passwords محفوظة كـ plaintext في `db.json`

**الحل:**
```bash
npm install bcryptjs
```

```javascript
const passwordHasher = require('./password-hasher');

// عند الـ Login:
const user = db.users.find(u => u.email === email);
const isValid = await passwordHasher.compare(password, user.passwordHash);

// عند الـ Registration:
const hashedPassword = await passwordHasher.hash(password);
```

---

#### 2. JWT Secret مكشوفة في الـ Code
**المشكلة:** `JWT_SECRET` hardcoded في `server.js`

**الحل:**
```bash
# استخدم .env
cp backend/.env.example backend/.env.local

# حدّث القيمة
JWT_SECRET=your-strong-random-key-here-minimum-32-chars
```

---

#### 3. Socket.io بدون Authentication
**المشكلة:** أي حد يقدر يتصل بـ Socket.io

**الحل:**
```javascript
// في server.js
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Auth required'));
  
  try {
    const user = jwt.verify(token, JWT_SECRET);
    socket.user = user;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});
```

---

#### 4. Database بدون Backup
**المشكلة:** `db.json` ممكن تنحذف أو تنفسد

**الحل:**
- استخدم MongoDB أو PostgreSQL
- أو: أضيف automated backup script

```javascript
const backup = () => {
  const timestamp = new Date().toISOString().slice(0, 10);
  fs.copyFileSync(dbPath, `backups/db-${timestamp}.json`);
};
```

---

### 🟠 **HIGH PRIORITY**

#### 5. Passwords في Logs
**المشكلة:** Passwords ممكن تظهر في error logs

**الحل:**
```javascript
// في requestLogger middleware
if (req.body.password) {
  req.body.password = '***REDACTED***';
}
```

---

#### 6. Token في LocalStorage (XSS Vulnerable)
**المشكلة:** JavaScript يقدر يسرق tokens من localStorage

**الحل - استخدم HttpOnly Cookies:**
```javascript
// Frontend
// بدل localStorage.setItem('token', token);
// أرسل token للـ Backend

// Backend
res.cookie('token', token, {
  httpOnly: true,
  secure: true, // HTTPS only
  sameSite: 'Strict',
  maxAge: 24 * 60 * 60 * 1000
});
```

---

#### 7. HTTPS مش مفروض
**المشكلة:** في Development يمكن HTTP، لكن في Production لازم HTTPS

**الحل:**
```javascript
// في server.js (Production only)
app.use((req, res, next) => {
  if (config.NODE_ENV === 'production' && !req.secure) {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
});
```

---

#### 8. CSRF Protection
**المشكلة:** Form submissions ممكن تتلاعب بيها

**الحل:**
```bash
npm install csurf
```

```javascript
const csrf = require('csurf');
app.use(csrf({ cookie: false }));
```

---

### 🟡 **MEDIUM PRIORITY**

#### 9. No Email Verification
- أضيف email verification token قبل إنشاء account

#### 10. No Account Lockout
- قفل account بعد 5 محاولات فاشلة

#### 11. No Audit Logging
- سجّل كل عملية DELETE أو PUT

#### 12. Secrets في Code
- استخدم HashiCorp Vault أو AWS Secrets Manager

---

## 🚀 **Production Checklist**

### Before Deployment

- [ ] `JWT_SECRET` قوي (32+ chars, random)
- [ ] `FRONTEND_URL` صحيح (مش localhost)
- [ ] `CORS_ORIGIN` صحيح
- [ ] `NODE_ENV = production`
- [ ] HTTPS enforced
- [ ] Passwords hashed (bcryptjs)
- [ ] Email verification enabled
- [ ] Rate limiting increased
- [ ] Logging enabled
- [ ] Database backed up
- [ ] Error monitoring (Sentry)
- [ ] Performance monitoring (Datadog)

### After Deployment

- [ ] SSL certificate valid (check with SSL Labs)
- [ ] Security headers configured (check with Mozilla Observatory)
- [ ] CORS tested
- [ ] Authentication tested
- [ ] Rate limiting tested
- [ ] Logs reviewed daily
- [ ] Backup tested

---

## 🔐 **Environment Variables**

### Development (.env.local)
```env
NODE_ENV=development
PORT=5000
JWT_SECRET=yas-super-secret-key-2026-development
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

### Production (.env - Vercel)
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=<generate-strong-random-key>
FRONTEND_URL=https://opsmind.vercel.app
CORS_ORIGIN=https://opsmind.vercel.app
```

---

## 📊 **Security Audit**

### Tools
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Snyk](https://snyk.io/) - vulnerability scanning
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)

```bash
npm audit
npm audit fix
snyk test
```

---

## 📞 **Reporting Vulnerabilities**

إذا اكتشفت ثغرة أمان:

1. **لا تكشفها علناً** ❌
2. أرسل بريد إلى: security@opsmind.com ✉️
3. شامل التفاصيل والـ POC 📋

---

## 🎓 **Resources**

- [OWASP Security Cheatsheet](https://cheatsheetseries.owasp.org/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/nodejs-express-webapp/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [HTTPS Everywhere](https://https-everywhere.org/)

---

**آخر تحديث:** 16 يوليو 2026

