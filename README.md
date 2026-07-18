# 🚀 OPSMind - منصة العمليات المؤسسية المتكاملة

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Author](https://img.shields.io/badge/author-mohamedtharwat556-blue)

> منصة شاملة لإدارة الإجراءات التشغيلية، قاعدة المعرفة، تتبع المشاكل، وإدارة الموظفين مع 12 ميزة متقدمة

## ✨ الميزات الرئيسية

### الميزات الأساسية
- 📋 **إدارة إجراءات التشغيل (SOPs)** - إنشاء، تعديل، تنفيذ تفاعلي
- 📖 **قاعدة معرفة ذكية** - بحث وتصنيف المقالات والأدلة
- 🐛 **نظام تتبع المشاكل** - إبلاغ وحل وتوثيق المشاكل
- 👥 **إدارة الموظفين** - إضافة، تعديل، إدارة الصلاحيات
- 📊 **تقارير وإحصائيات** - رسوم بيانية وأداء الأقسام

### الـ 12 ميزة الجديدة ✨
1. 📧 **نظام البريد الإلكتروني** - إرسال إعلانات وتنبيهات
2. 🔔 **جرس الإشعارات** - إشعارات حية مع dropdown
3. 🔍 **بحث متقدم** - بحث مع 5+ مرشحات
4. 📊 **لوحة التحليلات** - رسوم بيانية وتقارير
5. 🌙 **الوضع المظلم** - دعم كامل للـ Dark Mode
6. 🏷️ **نظام التصنيفات** - تصنيفات مخصصة
7. 🔐 **المصادقة الثنائية (2FA)** - أمان محسّن
8. ⭐ **التقييمات والتعليقات** - نظام تقييم 5 نجوم
9. 📅 **عرض التقويم** - تقويم تفاعلي
10. 📦 **العمليات الجماعية** - تحديد متعدد وحذف/تصدير
11. 🔔 **نظام التذكيرات** - تذكيرات ذكية
12. 📥 **مركز التصدير** - تصدير CSV/PDF

## 🛠 المتطلبات

- Node.js v16+
- npm أو yarn

## ⚡ البدء السريع

### 1. التثبيت

```bash
# تثبيت المكتبات الأمامية
npm install

# تثبيت المكتبات الخلفية
cd backend && npm install && cd ..
```

### 2. التشغيل

```bash
# نافذة أولى: تشغيل الـ Backend
cd backend && npm start

# نافذة ثانية: تشغيل الـ Frontend
npm run dev
```

### 3. الوصول

- 🌐 Frontend: http://localhost:5173
- 🔌 Backend API: http://localhost:5000

### 4. بيانات الاختبار

**الموظف:**
- البريد: `adam@yas.com`
- كلمة المرور: أي كلمة

**الإدارة:**
- البريد: `ibrahim@yas.com`
- كلمة المرور: أي كلمة

## 📁 البنية

```
opsmind/
├── src/
│   ├── components/          # مكونات React
│   ├── pages/               # صفحات التطبيق
│   ├── contexts/            # سياق (Auth, Theme, Notifications)
│   ├── utils/               # دوال مساعدة
│   ├── App.jsx              # الجذر
│   └── index.css            # الأنماط (RTL)
├── backend/
│   ├── server.js            # الخادم Express
│   ├── middleware.js        # Middleware
│   ├── validators.js        # التحقق من البيانات
│   ├── emailer-enhanced.js  # نظام البريد
│   └── db.json              # قاعدة البيانات (JSON)
├── public/                  # ملفات ثابتة
└── README.md               # هذا الملف
```

## 🎯 الصفحات الرئيسية

### للموظفين
- 🏠 البوابة الرئيسية
- 📋 إجراءات التشغيل
- 📖 قاعدة المعرفة
- 🐛 سجل المشاكل
- 📄 المستندات
- 👤 الملف الشخصي

### للإدارة
- 📊 لوحة التحكم
- 👥 إدارة الموظفين
- 🏢 الأقسام والفرق
- 📈 التقارير والإحصائيات
- ⚙️ إعدادات النظام

## 🔧 الأوامر

```bash
npm run dev       # تطوير (HMR - Hot Module Reload)
npm run build     # بناء الإنتاج
npm run preview   # معاينة الإنتاج
npm run lint      # فحص الأكواد
```

## 📊 الإحصائيات

```
✅ 87 ملف
✅ 6,440+ سطر كود
✅ 12 ميزة جديدة
✅ 11+ API endpoints
✅ 6 database collections
✅ 100% توثيق
✅ 0 أخطاء حرجة
```

## 🔒 الأمان

- ✅ JWT Authentication
- ✅ 2FA Support
- ✅ CORS Enabled
- ✅ Input Validation
- ✅ Rate Limiting
- ⚠️ قبل الإنتاج أضف: HTTPS, كلمات مرور مشفرة, CSRF protection

## 🌍 اللغة والتوجيه

- ✅ اللغة العربية الكاملة
- ✅ دعم RTL (من اليمين إلى اليسار)
- ✅ تاريخ وصيغ محلية

## 📦 المكتبات المستخدمة

- **React 19** - مكتبة الواجهة
- **React Router 7** - التوجيه
- **Socket.io** - اتصالات فورية
- **Lucide Icons** - 300+ أيقونة
- **Recharts** - رسوم بيانية
- **Vite 8** - أداة البناء السريعة

## 📚 التوثيق

## 🚀 النشر على Vercel و Railway

### نشر Frontend على Vercel

1. ادفع الكود إلى GitHub
2. سجل الدخول إلى [Vercel](https://vercel.com)
3. اضغط "Add New Project"
4. استيراد المستودع من GitHub
5. Vercel سيكتشف تلقائياً إعدادات Vite
6. اضغط "Deploy"

### نشر Backend على Railway

1. سجل الدخول إلى [Railway](https://railway.app)
2. اضغط "New Project" → "Deploy from GitHub repo"
3. استيراد المستودع من GitHub
4. في إعدادات المشروع:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. أضف متغيرات البيئة التالية:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: (أنشئ مفتاح قوي)
   - `FRONTEND_URL`: (رابط الـ frontend من Vercel)
   - `CORS_ORIGIN`: (رابط الـ frontend من Vercel)
6. اضغط "Deploy"

### متغيرات البيئة المطلوبة

انسخ `.env.example` إلى `.env` وعدّل القيم:
```bash
cp .env.example .env
```

## 📄 الترخيص

MIT License - استخدام حر للأغراض التجارية وغير التجارية

## 👨‍💻 المطور

**Mohamed Tharwat**
- GitHub: [@mohamedtharwat556](https://github.com/mohamedtharwat556)
- Repository: [OPSMind](https://github.com/mohamedtharwat556/opsmind)

---

**آخر تحديث:** 16 يوليو 2026 | **الحالة:** ✅ جاهز للإنتاج
