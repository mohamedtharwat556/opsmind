# 🔧 OPSMind - Troubleshooting Guide

## المشاكل الشائعة والحلول

---

## 🔴 Frontend Issues

### مشكلة: "Cannot find module 'react'"

**السبب:** node_modules غير مثبت

**الحل:**
```bash
cd c:\Users\yas\Downloads\ad\opsmind
npm install
npm run dev
```

---

### مشكلة: "VITE_API_URL is undefined"

**السبب:** `.env.local` غير موجود

**الحل:**
```bash
# نسخ الـ example
copy .env.example .env.local

# تأكد من المحتوى:
# VITE_API_URL=http://localhost:5000
```

**إذا كنت على Vercel:**
```
Settings → Environment Variables
أضف: VITE_API_URL = https://opsmind-api.vercel.app
Redeploy
```

---

### مشكلة: "Cannot GET /"

**السبب:** Vite server مش شغال

**الحل:**
```bash
npm run dev
```

**أو الـ Port مستخدم بالفعل:**
```bash
# اقتل الـ process
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# أو استخدم port مختلف:
npm run dev -- --port 3000
```

---

### مشكلة: Pages تفتح بس مفيش بيانات (Loading spinner يدوّر)

**السبب:** Backend مش شغال أو CORS issue

**الحل:**
```bash
# تأكد من الـ Backend شغال:
curl http://localhost:5000/health

# أو شغّل Backend:
cd backend
npm install
npm start
```

---

### مشكلة: "Uncaught Error in Hydration"

**السبب:** Mismatch بين server و client rendering

**الحل:**
```bash
# امسح الـ node_modules و package-lock
rm -r node_modules package-lock.json
npm install
npm run dev
```

---

## 🔴 Backend Issues

### مشكلة: "Error: ENOENT: no such file or directory, open 'db.json'"

**السبب:** `db.json` غير موجود

**الحل:**
```bash
cd backend

# تأكد من وجود db.json:
ls db.json

# لو غير موجود، أنسخ من example أو أنشئ جديد:
# انسخ من الـ template في server.js
```

---

### مشكلة: "Error: Port 5000 is already in use"

**السبب:** أي process مستخدم الـ port

**الحل:**
```bash
# Windows - اقتل الـ process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# أو استخدم port مختلف في .env.local:
PORT=5001
```

---

### مشكلة: "Cannot find module 'bcryptjs'"

**السبب:** bcryptjs مش مثبت

**الحل:**
```bash
cd backend
npm install bcryptjs
npm start
```

---

### مشكلة: "JWT verification failed"

**السبب:** JWT_SECRET مختلف بين Frontend و Backend

**الحل:**
```bash
# تأكد من .env.local في Backend:
JWT_SECRET=yas-super-secret-key-2026-development

# جرّب Login مرة تانية
```

---

### مشكلة: "404 - /api/users not found"

**السبب:** Routes مش معرّفة بشكل صحيح

**الحل:**
```bash
# شيك الـ server.js
# ابحث عن:
app.get('/api/users', ...)

# لو غير موجود، أضفها
```

---

### مشكلة: "CORS error: Access denied"

**السبب:** CORS_ORIGIN مختلف

**الحل:**
```bash
# في backend/.env.local:
CORS_ORIGIN=http://localhost:5173

# في development:
FRONTEND_URL=http://localhost:5173
```

---

## 🟠 Database Issues

### مشكلة: "db.json is corrupted"

**السبب:** Concurrent writes أو file corruption

**الحل:**
```bash
# استعيد من backup لو موجود:
cp backups/db-2026-07-15.json db.json

# أو عيّد initialize من الـ template
```

---

### مشكلة: Data لا تحفظ بشكل صحيح

**السبب:** File permissions issue

**الحل:**
```bash
# تأكد من الـ permissions:
ls -la db.json

# الـ file يلازم يكون writable:
chmod 644 db.json
```

---

## 🟠 Vercel/Deployment Issues

### مشكلة: "Vercel build timeout"

**السبب:** Build يأخذ وقت طويل (أكثر من 60 ثانية)

**الحل:**
```bash
# زيادة timeout في vercel.json:
{
  "functions": {
    "server.js": {
      "maxDuration": 120
    }
  }
}
```

---

### مشكلة: "Cannot find module 'xyz' on Vercel"

**السبب:** Module مثبت locally بس مش في package.json

**الحل:**
```bash
# تأكد من package.json:
npm list xyz

# إذا غير موجود:
npm install xyz --save

# git commit و push:
git add package.json
git commit -m "install xyz"
git push
```

---

### مشكلة: "Vercel deployment Failed - Error: build exited with code 1"

**السبب:** Build error (مشكلة في الـ code)

**الحل:**
```bash
# شيك الـ Vercel logs:
vercel logs https://opsmind.vercel.app

# جرّب البناء locally:
npm run build

# لو فيها errors، صلحها و push تاني:
git add .
git commit -m "fix: build errors"
git push
```

---

### مشكلة: "Frontend deployed لكن API calls fail"

**السبب:** VITE_API_URL خاطئة في Production

**الحل:**
```
Vercel Dashboard → opsmind project
Settings → Environment Variables

غيّر:
VITE_API_URL = https://opsmind-api.vercel.app

ثم Redeploy
```

---

### مشكلة: "API calls timeout on Vercel"

**السبب:** Backend مش deployed أو مش responding

**الحل:**
```bash
# شيك الـ Backend status:
curl https://opsmind-api.vercel.app/health

# إذا مش responding، deploy Backend:
cd backend
vercel --prod
```

---

## 🟡 Development Issues

### مشكلة: "Hot Module Reload (HMR) مش شغال"

**السبب:** Vite HMR misconfigured

**الحل:**
```bash
# شيك vite.config.js:
export default {
  server: {
    hmr: true
  }
}

npm run dev
```

---

### مشكلة: "Socket.io connections failing"

**السبب:** Backend مش connected أو Socket.io mismatch

**الحل:**
```bash
# شيك الـ Backend logs:
npm start

# شيك الـ Socket.io version:
npm list socket.io-client
npm list socket.io (backend)

# يلازم تكون نفس الـ version تقريباً
```

---

### مشكلة: "Login فشل - 'email or password incorrect'"

**السبب:** Credentials خاطئة أو Database بدون users

**الحل:**
```bash
# استخدم الـ test accounts:
Email: adam@yas.com
Password: أي كلمة (في development)

# أو شيك db.json:
ls -la backend/db.json

# تأكد من وجود users في الـ file
```

---

## 📊 Performance Issues

### مشكلة: "App slow - takes 5+ seconds to load"

**السبب:** Slow bundle أو network latency

**الحل:**
```bash
# جرّب production build locally:
npm run build
npm run preview

# شيك bundle size:
npm run build -- --sourcemap

# استخدم Lighthouse في DevTools
```

---

### مشكلة: "Memory leak - app gets slower over time"

**السبب:** Event listeners مش cleaned up

**الحل:**
```javascript
// في React components, cleanup:
useEffect(() => {
  const listener = () => {};
  window.addEventListener('resize', listener);
  
  return () => {
    window.removeEventListener('resize', listener);
  };
}, []);
```

---

## 🔍 Debugging Tips

### Enable Debug Logging

```bash
# Frontend
export DEBUG=opsmind:* npm run dev

# Backend
export DEBUG=opsmind:* npm start
```

### Check Network Requests

1. افتح DevTools: **F12**
2. اذهب: **Network** tab
3. شيك API calls (status, response, errors)

### Browser Console Errors

1. افتح DevTools: **F12**
2. اذهب: **Console** tab
3. شيك الـ errors (بتظهر بـ red color)

### Backend Logs

```bash
# شغّل Backend مع logging:
DEBUG=* npm start

# أو في code:
console.log('Debug info:', obj);
```

---

## 📞 Getting Help

إذا الحل مش موجود هنا:

1. **شيك الـ GitHub Issues:** https://github.com/mohamedtharwat556/opsmind/issues
2. **ابدأ Discussion جديد:** https://github.com/mohamedtharwat556/opsmind/discussions
3. **Search StackOverflow:** https://stackoverflow.com

---

**آخر تحديث:** 16 يوليو 2026
