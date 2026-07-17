# 📦 دليل التثبيت - OPSMind

## المتطلبات الأساسية

- **Node.js** v16 أو أحدث
- **npm** v8 أو أحدث (أو yarn)
- **Git** للتحكم بالإصدارات (اختياري)

## خطوات التثبيت

### 1. استنساخ المشروع

```bash
git clone https://github.com/mohamedtharwat556/opsmind.git
cd opsmind
```

أو قم بتحميل ZIP من GitHub وفك الضغط.

### 2. تثبيت المكتبات الأمامية (Frontend)

```bash
npm install
```

هذا سيثبت جميع المكتبات في `node_modules/`:
- React
- React Router
- Socket.io Client
- Lucide Icons
- إلخ...

### 3. تثبيت المكتبات الخلفية (Backend)

```bash
cd backend
npm install
cd ..
```

هذا سيثبت:
- Express
- Socket.io
- JWT
- إلخ...

### 4. التحقق من التثبيت

```bash
npm run build
```

يجب أن ينتهي بدون أخطاء ✅

## البدء السريع

### النافذة الأولى - تشغيل Backend

```bash
cd backend
npm start
```

يجب أن ترى:
```
✅ Backend server running on port 5000
🔐 Validation and Security enabled
📚 Database loaded
```

### النافذة الثانية - تشغيل Frontend

```bash
npm run dev
```

يجب أن ترى:
```
➜  Local:   http://localhost:5173/
```

### 3. الوصول إلى التطبيق

افتح المتصفح على:
```
http://localhost:5173
```

## بيانات الاختبار

استخدم أحد البيانات التالية للدخول:

**الموظف:**
- البريد: `adam@yas.com`
- كلمة المرور: أي كلمة

**الإدارة:**
- البريد: `ibrahim@yas.com`
- كلمة المرور: أي كلمة

## 🛠 استكشاف الأخطاء

### المشكلة: "Port already in use"

```bash
# لـ Frontend (Port 5173)
lsof -i :5173    # Linux/Mac
netstat -ano | findstr :5173    # Windows

# ثم قتل الـ process
kill -9 PID    # Linux/Mac
taskkill /PID PID /F    # Windows
```

### المشكلة: "Module not found"

```bash
# حذف node_modules و reinstall
rm -rf node_modules package-lock.json
npm install
```

### المشكلة: "CORS error"

تأكد من أن الـ Backend يعمل على `http://localhost:5000`

### المشكلة: "npm ERR! code ENOENT"

```bash
# تأكد من أنك في المجلد الصحيح
cd opsmind
ls package.json    # يجب أن يظهر الملف
```

## 📋 ملفات التكوين الهامة

| الملف | الوصف |
|------|-------|
| `vite.config.js` | إعدادات Vite للبناء |
| `index.html` | ملف HTML الرئيسي |
| `src/main.jsx` | نقطة البداية |
| `backend/server.js` | خادم Express |
| `backend/db.json` | قاعدة البيانات |

## 🔐 الأمان

### قبل الإنتاج تأكد من:

1. **تغيير JWT Secret** في `backend/server.js`
   ```javascript
   const JWT_SECRET = 'your-new-secret-key';
   ```

2. **إضافة .env file**
   ```bash
   # backend/.env
   JWT_SECRET=your-secret
   DB_PATH=./db.json
   PORT=5000
   ```

3. **تفعيل HTTPS** في الإنتاج

4. **تشفير كلمات المرور** باستخدام bcrypt

5. **إضافة Rate Limiting**

## 📦 الأوامر الأخرى

```bash
# بناء للإنتاج
npm run build

# معاينة الإنتاج محلياً
npm run preview

# فحص الأكواد
npm run lint
```

## ✅ التحقق من التثبيت الصحيح

قم بالخطوات التالية للتأكد:

1. ✅ Frontend يعمل على http://localhost:5173
2. ✅ Backend يعمل على http://localhost:5000
3. ✅ يمكنك الدخول بـ adam@yas.com
4. ✅ يمكنك الوصول لـ Dashboard
5. ✅ الأيقونات تظهر صح

إذا نجحت جميع الخطوات - **مبروك! التثبيت كامل!** 🎉

## 📞 المساعدة

اقرأ [README.md](./README.md) للمزيد من المعلومات
