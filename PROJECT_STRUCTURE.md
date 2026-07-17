# 📁 OPSMind - Project Structure Guide

## شرح البنية الكاملة للمشروع

```
opsmind/
├── 📄 README.md                      # الملف الرئيسي - شرح المشروع
├── 📄 INSTALLATION.md                # خطوات التثبيت
├── 📄 DEPLOYMENT.md                  # خطوات الـ deployment
├── 📄 VERCEL_DEPLOYMENT.md           # دليل Vercel المفصل
├── 📄 SECURITY.md                    # دليل الأمان والحماية
├── 📄 TROUBLESHOOTING.md             # استكشاف الأخطاء
├── 📄 PROJECT_STRUCTURE.md           # هذا الملف
│
├── 📁 src/                           # Frontend - React Code
│   ├── 📄 App.jsx                    # الـ Root component
│   ├── 📄 main.jsx                   # Entry point
│   ├── 📄 index.css                  # Global styles (RTL)
│   │
│   ├── 📁 pages/                     # صفحات التطبيق (21 page)
│   │   ├── Login.jsx                 # صفحة تسجيل الدخول
│   │   ├── Dashboard.jsx             # لوحة التحكم (Admin)
│   │   ├── EmployeePortal.jsx        # البوابة الرئيسية (Employee)
│   │   ├── Users.jsx                 # إدارة الموظفين
│   │   ├── Departments.jsx           # إدارة الأقسام
│   │   ├── Reports.jsx               # التقارير والإحصائيات
│   │   ├── SOPs.jsx                  # إجراءات التشغيل
│   │   ├── KnowledgeBase.jsx         # قاعدة المعرفة
│   │   ├── Cases.jsx                 # تتبع المشاكل
│   │   ├── DocumentsLibrary.jsx      # مكتبة المستندات
│   │   ├── Profile.jsx               # الملف الشخصي
│   │   ├── Settings.jsx              # إعدادات النظام
│   │   └── [8 more pages...]         # صفحات إضافية
│   │
│   ├── 📁 components/                # مكونات React (25 component)
│   │   ├── AdminLayout.jsx           # Layout للـ Admin
│   │   ├── UserLayout.jsx            # Layout للـ Employee
│   │   ├── TopNav.jsx                # شريط التنقل العلوي
│   │   ├── AdminSidebar.jsx          # القائمة الجانبية (Admin)
│   │   ├── UserSidebar.jsx           # القائمة الجانبية (Employee)
│   │   ├── NotificationsBell.jsx     # جرس الإشعارات
│   │   ├── AIAssistant.jsx           # المساعد الذكي
│   │   ├── TwoFactorAuth.jsx         # توثيق ثنائي العامل
│   │   ├── Toast.jsx                 # رسائل Popup
│   │   ├── ErrorBoundary.jsx         # معالج الأخطاء
│   │   └── [15 more components...]   # مكونات إضافية
│   │
│   ├── 📁 contexts/                  # React Context (State Management)
│   │   ├── AuthContext.jsx           # حالة المصادقة
│   │   ├── ThemeContext.jsx          # حالة الثيم (Dark/Light)
│   │   ├── NotificationContext.jsx   # حالة الإشعارات
│   │   └── ToastContext.jsx          # حالة الـ Toast messages
│   │
│   ├── 📁 utils/                     # دوال مساعدة
│   │   ├── apiClient.js              # عميل API (NEW)
│   │   ├── validators.js             # تحقق من البيانات
│   │   ├── formatters.js             # تنسيق النصوص/التواريخ
│   │   ├── cacheManager.js           # إدارة الـ cache
│   │   └── pdfGenerator.js           # توليد PDF
│   │
│   └── 📁 assets/                    # الصور والأيقونات
│       ├── hero.png                  # صورة البطل
│       ├── react.svg                 # شعار React
│       └── vite.svg                  # شعار Vite
│
├── 📁 backend/                       # Backend - Express Server
│   ├── 📄 server.js                  # الخادم الرئيسي
│   ├── 📄 config.js                  # إعدادات البيئة (NEW)
│   ├── 📄 password-hasher.js         # تشفير كلمات المرور (NEW)
│   ├── 📄 health.js                  # فحص صحة الخادم (NEW)
│   ├── 📄 vercel.json                # إعدادات Vercel Backend (NEW)
│   ├── 📄 .env.example               # نموذج متغيرات البيئة (NEW)
│   ├── 📄 .env.local                 # متغيرات البيئة المحلية (NEW)
│   │
│   ├── 📄 middleware.js              # Middleware (Auth, CORS, Security)
│   ├── 📄 validators.js              # التحقق من صحة البيانات
│   ├── 📄 emailer-enhanced.js        # نظام البريد الإلكتروني
│   │
│   ├── 📄 db.json                    # قاعدة البيانات (JSON)
│   ├── 📄 package.json               # التبعيات والـ scripts
│   └── 📁 node_modules/              # المكتبات المثبتة
│
├── 📁 public/                        # ملفات ثابتة
│   ├── favicon.svg                   # أيقونة الـ tab
│   ├── icons.svg                     # مجموعة أيقونات
│   └── manifest.json                 # بيانات PWA
│
├── 📁 .kiro/                         # إعدادات Kiro IDE (اختياري)
│   └── steering/                     # ملفات توجيهية
│
├── 📄 .env.example                   # نموذج متغيرات البيئة Frontend
├── 📄 .env.local                     # متغيرات البيئة المحلية Frontend
├── 📄 .gitignore                     # ملفات مستثناة من Git
├── 📄 vite.config.js                 # إعدادات Vite
├── 📄 vercel.json                    # إعدادات Vercel Frontend
├── 📄 .vercelignore                  # ملفات مستثناة من Vercel
│
├── 📄 package.json                   # التبعيات والـ scripts Frontend
├── 📄 package-lock.json              # قفل الإصدارات
│
└── 📁 node_modules/                  # المكتبات المثبتة Frontend
```

---

## 📊 **الملفات المهمة بالتفصيل**

### 🔵 Frontend Configuration

| الملف | الغرض |
|------|-------|
| `vite.config.js` | إعدادات أداة البناء Vite |
| `.env.example` | نموذج متغيرات البيئة |
| `.env.local` | متغيرات البيئة المحلية (git ignored) |
| `package.json` | التبعيات والـ scripts |
| `.gitignore` | ملفات مستثناة من Git |

### 🔵 Backend Configuration

| الملف | الغرض |
|------|-------|
| `config.js` | قراءة متغيرات البيئة (NEW) |
| `.env.example` | نموذج متغيرات البيئة Backend |
| `.env.local` | متغيرات البيئة المحلية Backend |
| `package.json` | التبعيات والـ scripts |
| `password-hasher.js` | تشفير آمن لكلمات المرور (NEW) |

### 🔵 Documentation

| الملف | الغرض |
|------|-------|
| `README.md` | الملف الرئيسي - شرح شامل |
| `INSTALLATION.md` | خطوات التثبيت والتشغيل |
| `DEPLOYMENT.md` | دليل الـ deployment |
| `VERCEL_DEPLOYMENT.md` | دليل Vercel مفصل (NEW) |
| `SECURITY.md` | دليل الأمان (NEW) |
| `TROUBLESHOOTING.md` | استكشاف الأخطاء (NEW) |
| `PROJECT_STRUCTURE.md` | هذا الملف (NEW) |

---

## 🚀 **أوامر مهمة**

### Frontend
```bash
npm install              # تثبيت المكتبات
npm run dev             # التطوير (Vite)
npm run build           # البناء للإنتاج
npm run preview         # معاينة الإنتاج محلياً
```

### Backend
```bash
cd backend
npm install              # تثبيت المكتبات
npm start               # تشغيل الخادم
npm run dev             # التطوير (إذا موجود)
```

### Git & Deployment
```bash
git add .               # إضافة الملفات
git commit -m "msg"     # كميت التغييرات
git push                # رفع للـ GitHub
vercel                  # نشر على Vercel
vercel logs ...         # عرض الـ logs
```

---

## 🔄 **تدفق البيانات**

```
User (Browser)
    ↓
Frontend (React/Vite)
    ↓
API Client (src/utils/apiClient.js)
    ↓
Backend (Express Server)
    ↓
Database (db.json / MongoDB)
    ↓
Response JSON
    ↓
Frontend Context (Redux-like)
    ↓
UI Update (React Re-render)
```

---

## 🔐 **متغيرات البيئة**

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000
```

### Backend (.env.local)
```env
NODE_ENV=development
PORT=5000
JWT_SECRET=yas-super-secret-key-2026-development
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

---

## 📦 **المكتبات المستخدمة**

### Frontend
- **React 19.2.7** - مكتبة الواجهة
- **React Router 7.18.1** - التوجيه بين الصفحات
- **Lucide React 1.24.0** - 300+ أيقونة
- **Recharts 3.9.2** - رسوم بيانية
- **Socket.io Client 4.8.3** - اتصالات فورية

### Backend
- **Express 5.2.1** - إطار العمل
- **JWT 9.0.3** - المصادقة
- **Socket.io 4.8.3** - اتصالات فورية
- **CORS 2.8.6** - مشاركة الموارد
- **bcryptjs 2.4.3** - تشفير كلمات المرور (NEW)
- **dotenv 17.4.2** - متغيرات البيئة

---

## ✅ **Checklist للمشروع**

- [x] بنية واضحة ومنظمة
- [x] جميع الملفات التوثيقية
- [x] دعم Environment Variables
- [x] إعدادات Vercel
- [x] دليل الأمان
- [x] استكشاف الأخطاء
- [ ] Unit Tests
- [ ] E2E Tests
- [ ] CI/CD Pipeline (GitHub Actions)

---

## 📞 **الملفات التي تم إضافتها حديثاً (NEW)**

1. ✨ `src/utils/apiClient.js` - عميل API موحد
2. ✨ `backend/config.js` - إدارة متغيرات البيئة
3. ✨ `backend/password-hasher.js` - تشفير كلمات المرور
4. ✨ `backend/health.js` - فحص صحة الخادم
5. ✨ `backend/.env.example` و `backend/.env.local`
6. ✨ `backend/vercel.json` - إعدادات Vercel Backend
7. ✨ `.env.example` و `.env.local` - Frontend env
8. ✨ `VERCEL_DEPLOYMENT.md` - دليل Vercel
9. ✨ `SECURITY.md` - دليل الأمان
10. ✨ `TROUBLESHOOTING.md` - استكشاف الأخطاء
11. ✨ `PROJECT_STRUCTURE.md` - هذا الملف

---

**آخر تحديث:** 16 يوليو 2026
