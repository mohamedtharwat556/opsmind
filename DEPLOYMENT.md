# 🚀 دليل النشر والإطلاق - OPSMind

## خيارات النشر

### الخيار 1: Vercel (سهل جداً)

#### للـ Frontend

1. **اذهب إلى** https://vercel.com
2. **انقر** "New Project"
3. **اختر** repo `mohamedtharwat556/opsmind`
4. **في Settings:**
   - Framework Preset: Vite
   - Root Directory: (ترك فارغ)
5. **اضغط Deploy** ✅

#### للـ Backend

```bash
# تثبيت Vercel CLI
npm i -g vercel

# من مجلد backend
cd backend
vercel
```

**النتيجة:**
```
Frontend: https://opsmind.vercel.app
Backend: https://opsmind-api.vercel.app
```

### الخيار 2: Heroku

#### للـ Backend

```bash
# تثبيت Heroku CLI
brew install heroku

# تسجيل الدخول
heroku login

# إنشاء app
heroku create opsmind-api

# Deploy
git push heroku main

# شاهد الـ logs
heroku logs --tail
```

**النتيجة:**
```
Backend: https://opsmind-api.herokuapp.com
```

### الخيار 3: Render

#### للـ Backend

1. **اذهب إلى** https://render.com
2. **انقر** "New +"
3. **اختر** "Web Service"
4. **اربط** GitHub account
5. **اختر** repo `mohamedtharwat556/opsmind`
6. **في الإعدادات:**
   - Name: `opsmind-api`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Add `NODE_ENV=production`
7. **اضغط Deploy** ✅

**النتيجة:**
```
Backend: https://opsmind-api.onrender.com
```

### الخيار 4: VPS (DigitalOcean / Linode)

#### الخطوات:

1. **إنشاء Droplet:**
   - OS: Ubuntu 22.04
   - Size: $5/month (كافي)

2. **تثبيت Node.js:**
   ```bash
   curl https://deb.nodesource.com/setup_18.x | sudo bash
   sudo apt install nodejs git
   ```

3. **استنساخ المشروع:**
   ```bash
   git clone https://github.com/mohamedtharwat556/opsmind.git
   cd opsmind
   ```

4. **تشغيل Backend:**
   ```bash
   cd backend
   npm install
   npm start &    # Background
   ```

5. **استخدام PM2 (للحفاظ على الـ process):**
   ```bash
   npm install -g pm2
   pm2 start server.js --name "opsmind"
   pm2 startup
   pm2 save
   ```

6. **تثبيت Nginx (Reverse Proxy):**
   ```bash
   sudo apt install nginx
   ```

   **في** `/etc/nginx/sites-available/default`:
   ```nginx
   server {
     listen 80 default_server;
     server_name _;

     location / {
       proxy_pass http://localhost:5000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

   ```bash
   sudo systemctl restart nginx
   ```

7. **SSL باستخدام Let's Encrypt:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot certonly --nginx -d yourdomain.com
   ```

## متغيرات البيئة

### `backend/.env`

```env
# Server
NODE_ENV=production
PORT=5000

# Database
DB_PATH=./db.json

# JWT
JWT_SECRET=your-super-secret-key-change-this

# Email (اختياري)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# CORS
CORS_ORIGIN=https://yourdomain.com
```

### `frontend/.env`

```env
VITE_API_URL=https://your-backend-api.com
VITE_APP_NAME=OPSMind
```

## اختبار الإنتاج

### اختبار محلي

```bash
npm run build
npm run preview
```

### اختبار الـ API

```bash
curl https://your-api.com/health
# يجب أن يرد: {"status":"ok"}
```

### اختبار الـ Login

```bash
curl -X POST https://your-api.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"adam@yas.com","password":"test"}'
```

## عمليات ما بعد النشر

### 1. تفعيل HTTPS

```bash
# Vercel: تلقائي ✅
# Render: تلقائي ✅
# Heroku: مجاني ✅
# VPS: استخدم Let's Encrypt
```

### 2. تكوين Domain

```bash
# في DNS Provider:
A Record: yourdomain.com → IP Address
CNAME: api.yourdomain.com → backend-url
```

### 3. مراقبة الأداء

```bash
# Vercel Analytics: https://vercel.com/analytics
# Render: https://render.com/dashboard
# Heroku: heroku logs --tail
```

### 4. النسخ الاحتياطية

```bash
# شغّل يومياً:
cp backend/db.json backend/db.backup-$(date +%Y%m%d).json

# أو استخدم GitHub:
git add backend/db.json
git commit -m "Backup: $(date)"
git push
```

## استكشاف الأخطاء في الإنتاج

### Backend لا يستجيب

```bash
# تحقق من الـ logs
heroku logs --tail        # Heroku
vercel logs               # Vercel
curl https://your-api.com/health
```

### CORS Error

تأكد من `.env`:
```env
CORS_ORIGIN=https://your-frontend.com
```

### Database لا يحفظ البيانات

استخدم قاعدة بيانات حقيقية:
```javascript
// استبدل db.json بـ MongoDB
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);
```

## مقارنة الخيارات

| الخيار | السهولة | التكلفة | الأداء | التوصية |
|--------|--------|--------|--------|---------|
| Vercel | ⭐⭐⭐⭐⭐ | مجاني | ⭐⭐⭐⭐⭐ | ✅ الأفضل |
| Render | ⭐⭐⭐⭐ | مجاني | ⭐⭐⭐⭐ | ✅ جيد |
| Heroku | ⭐⭐⭐⭐ | مدفوع | ⭐⭐⭐ | هجر |
| VPS | ⭐⭐ | $5/mo | ⭐⭐⭐⭐ | للمتقدمين |

## التوصية النهائية

**للبدء السريع:** استخدم **Vercel** (مجاني، سهل جداً)

```bash
# 1. Frontend
# - اتصل بـ Vercel من GitHub
# - auto-deploy ✅

# 2. Backend
# - Deploy على Render
# - ربط الـ domains
# - Done! 🎉
```

## المراجع

- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [Heroku Docs](https://devcenter.heroku.com)
- [PM2 Docs](https://pm2.keymetrics.io)
