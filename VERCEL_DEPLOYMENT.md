# 🚀 OPSMind - Vercel Deployment Guide

## 📋 الخطوات

### 1️⃣ **الإعدادات المبدئية**

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login
```

---

## 🌐 **Frontend Deployment** (React/Vite)

### الخطوة 1: بدء الـ Deployment

```bash
cd c:\Users\yas\Downloads\ad\opsmind
vercel
```

### الخطوة 2: الإجابة على الأسئلة

```
? Set up and deploy "C:\Users\yas\Downloads\ad\opsmind"? [Y/n] y
? Which scope do you want to deploy to? mohamedtharwat556
? Link to existing project? [y/N] n
? What's your project's name? opsmind
? In which directory is your code located? ./
? Want to modify these settings? [y/N] n
```

### الخطوة 3: البيئة الإنتاجية

في Vercel Dashboard:
1. اذهب: https://vercel.com/dashboard
2. اختر مشروع: `opsmind`
3. اذهب: **Settings** → **Environment Variables**
4. أضف:
   ```
   VITE_API_URL = https://opsmind-api.vercel.app
   ```

### الخطوة 4: Deploy

```bash
vercel --prod
```

**النتيجة:**
```
✅ Production: https://opsmind.vercel.app
```

---

## 🔌 **Backend Deployment** (Express API)

### الخطوة 1: إنشاء مجلد منفصل للـ Backend

```bash
# إذا كان Backend منفصل تماماً
cd backend
vercel
```

### الخطوة 2: الإجابة على الأسئلة

```
? Set up and deploy "C:\Users\yas\Downloads\ad\opsmind\backend"? [Y/n] y
? Which scope do you want to deploy to? mohamedtharwat556
? Link to existing project? [y/N] n
? What's your project's name? opsmind-api
? In which directory is your code located? ./
? Want to modify these settings? [y/N] n
```

### الخطوة 3: البيئة الإنتاجية

في Vercel Dashboard:
1. اذهب: https://vercel.com/dashboard
2. اختر مشروع: `opsmind-api`
3. اذهب: **Settings** → **Environment Variables**
4. أضف:
   ```
   NODE_ENV = production
   PORT = 5000
   JWT_SECRET = your-production-secret-key-here-change-this
   FRONTEND_URL = https://opsmind.vercel.app
   CORS_ORIGIN = https://opsmind.vercel.app
   ```

⚠️ **تنويه:**غيّر `JWT_SECRET` إلى قيمة قوية في الإنتاج!

### الخطوة 4: Deploy

```bash
vercel --prod
```

**النتيجة:**
```
✅ Production: https://opsmind-api.vercel.app
```

---

## 🔗 **ربط Frontend مع Backend**

بعد deployment، حدث الـ Frontend environment variables:

### Vercel Dashboard - opsmind Project

1. **Settings** → **Environment Variables**
2. غيّر:
   ```
   VITE_API_URL = https://opsmind-api.vercel.app
   ```
3. **Redeploy**:
   ```bash
   cd c:\Users\yas\Downloads\ad\opsmind
   vercel --prod
   ```

---

## 📊 **التحقق من Deployment**

### Frontend
```bash
curl https://opsmind.vercel.app
```

### Backend
```bash
curl https://opsmind-api.vercel.app/health
```

---

## 🛠 **استكشاف الأخطاء**

### Build يفشل

```bash
# شيك البناء محلياً
npm run build

# شيك Vercel logs
vercel logs https://opsmind.vercel.app
```

### API Calls تفشل

1. تحقق من CORS:
   ```javascript
   // backend/middleware.js
   const allowedOrigins = [process.env.FRONTEND_URL];
   ```

2. تحقق من JWT Secret:
   ```
   Dashboard → Settings → Environment Variables
   ```

### Timeout

زيادة timeout في `backend/vercel.json`:
```json
{
  "functions": {
    "server.js": {
      "maxDuration": 60
    }
  }
}
```

---

## 📁 **Monorepo Structure (اختياري)**

لو أردت deployment موحد:

```
opsmind/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vercel.json
├── backend/
│   ├── server.js
│   ├── package.json
│   └── vercel.json
└── vercel.json (root)
```

**Root vercel.json:**
```json
{
  "version": 2,
  "projects": [
    {
      "name": "opsmind-frontend",
      "path": "frontend"
    },
    {
      "name": "opsmind-backend",
      "path": "backend"
    }
  ]
}
```

---

## ✅ **Checklist للإنتاج**

- [ ] JWT_SECRET محدث وقوي
- [ ] CORS_ORIGIN صحيح
- [ ] VITE_API_URL محدث في Frontend
- [ ] Database محدثة (db.json أو MongoDB)
- [ ] Emails configured (Nodemailer)
- [ ] Logging enabled
- [ ] SSL/HTTPS enforced
- [ ] Redeploy Frontend بعد تحديث Backend

---

## 📞 **الأوامر السريعة**

```bash
# عرض الـ Projects
vercel list

# عرض الـ Logs
vercel logs opsmind

# إلغاء الـ Deployment
vercel remove opsmind

# Redeploy
vercel --prod

# شيك Status
vercel status
```

---

**آخر تحديث:** 16 يوليو 2026
