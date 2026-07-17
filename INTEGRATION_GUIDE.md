# 🔧 دليل الدمج والتكامل

## خطوات تفعيل الميزات الجديدة

### أولاً: تحديث `App.jsx`

```jsx
import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          {/* باقي التطبيق */}
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
```

---

### ثانياً: تحديث `TopNav.jsx`

```jsx
import NotificationsBell from './NotificationsBell';
import { useTheme } from '../contexts/ThemeContext';

export default function TopNav() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="top-nav">
      {/* محتوى TopNav السابق */}
      
      {/* إضافة الجرس */}
      <NotificationsBell />
      
      {/* زر تبديل المود المظلم */}
      <button onClick={toggleTheme}>
        {isDark ? '☀️' : '🌙'}
      </button>
    </nav>
  );
}
```

---

### ثالثاً: تحديث الـ Routes

```jsx
// أضف هذه الصفحات إلى routing

import AdvancedSearch from './pages/AdvancedSearch';
import DashboardAnalytics from './pages/DashboardAnalytics';
import CalendarView from './pages/CalendarView';
import ExportCenter from './pages/ExportCenter';

const routes = [
  // الصفحات السابقة...
  
  // الصفحات الجديدة
  { path: '/search', component: AdvancedSearch },
  { path: '/analytics', component: DashboardAnalytics },
  { path: '/calendar', component: CalendarView },
  { path: '/export', component: ExportCenter },
];
```

---

### رابعاً: إضافة الكومبوننت في الصفحات

#### في صفحة Cases:
```jsx
import BulkOperations from '../components/BulkOperations';
import TaggingSystem from '../components/TaggingSystem';
import RatingComments from '../components/RatingComments';

function CasesPage() {
  const [cases, setCases] = useState([...]);
  const [selectedTags, setSelectedTags] = useState([]);

  return (
    <div>
      <TaggingSystem onTagsChange={setSelectedTags} />
      <BulkOperations items={cases} onBulkAction={handleBulkAction} />
      <RatingComments targetId="case-123" targetType="case" />
    </div>
  );
}
```

#### في صفحة Profile/Settings:
```jsx
import TwoFactorAuth from '../components/TwoFactorAuth';
import RemindersManager from '../components/RemindersManager';

function SettingsPage() {
  return (
    <div>
      <TwoFactorAuth />
      <RemindersManager />
    </div>
  );
}
```

---

## 🎯 استخدام الـ Context APIs

### استخدام NotificationContext:

```jsx
import { useNotifications } from '../contexts/NotificationContext';

function MyComponent() {
  const {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    getUnreadCount
  } = useNotifications();

  const handleSuccess = () => {
    addNotification({
      title: 'نجاح!',
      message: 'تم حفظ البيانات',
      type: 'success',
      read: false
    });
  };

  return (
    <div>
      <button onClick={handleSuccess}>إضافة إشعار</button>
      <p>عدد الإشعارات غير المقروءة: {getUnreadCount()}</p>
    </div>
  );
}
```

### استخدام ThemeContext:

```jsx
import { useTheme } from '../contexts/ThemeContext';

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      {isDark ? 'وضع فاتح' : 'وضع مظلم'}
    </button>
  );
}
```

---

## 📡 استخدام الـ API Endpoints

### إرسال إشعارات عبر البريد:

```javascript
// إرسال إعلان
fetch('/api/email/announcement', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ announcementId: 1 })
})
.then(res => res.json())
.then(data => console.log(data));
```

### تفعيل 2FA:

```javascript
// الخطوة 1: الحصول على QR Code
const setupResponse = await fetch('/api/2fa/setup', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer token' }
});

// الخطوة 2: التحقق من OTP
const verifyResponse = await fetch('/api/2fa/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ otp: '123456' })
});

// الخطوة 3: تفعيل 2FA
const enableResponse = await fetch('/api/2fa/enable', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer token' }
});
```

---

## 🎨 تخصيص الألوان والأنماط

### في `index.css`:

```css
:root {
  /* الألوان الرئيسية */
  --primary: #2563EB;
  --success: #10B981;
  --error: #DC2626;
  --warning: #F59E0B;
  
  /* الأسطح */
  --surface: #FFFFFF;
  --surface-secondary: #F8FAFC;
  
  /* النصوص */
  --text-primary: #0F172A;
  --text-secondary: #475569;
}

/* Dark Mode */
.dark-mode {
  --surface: #1E293B;
  --surface-secondary: #0F172A;
  --text-primary: #F1F5F9;
  --text-secondary: #94A3B8;
}
```

---

## 📦 المتطلبات والمكتبات

### المكتبات المستخدمة:
- React 18+
- React Router (للتنقل)
- Context API (لإدارة الحالة)

### لا توجد مكتبات خارجية إضافية مطلوبة ✅

---

## 🧪 اختبار الميزات

### اختبار Dark Mode:
```javascript
// في المتصفح console
localStorage.setItem('theme', 'dark');
window.location.reload();
```

### اختبار Notifications:
```javascript
// محاكاة إشعار
const mockNotification = {
  id: 1,
  title: 'تجربة',
  message: 'هذا إشعار اختبار',
  type: 'info',
  read: false,
  timestamp: new Date()
};
```

### اختبار Email API:
```bash
# اختبار endpoint البريد
curl -X POST http://localhost:5000/api/email/announcement \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "announcementId": 1
  }'
```

---

## 📱 استجابة الشاشات

جميع المكونات تدعم شاشات:
- 📱 **Mobile** (320px+)
- 📱 **Tablet** (768px+)
- 🖥️ **Desktop** (1024px+)
- 🖥️ **Large** (1200px+)

---

## 🔄 تحديث Database

### إضافة مستخدم جديد مع 2FA:

```javascript
{
  "id": 9,
  "name": "أحمد محمود",
  "email": "ahmad@example.com",
  "role": "موظف",
  "department": "الهندسة",
  "status": "نشط",
  "points": 0,
  "twoFactorEnabled": true,
  "twoFactorSetupDate": "2024-01-20T10:00:00Z"
}
```

### إضافة إشعار:

```javascript
{
  "id": 1,
  "userId": 1,
  "type": "new_case",
  "title": "تم إبلاغ عن مشكلة جديدة",
  "message": "تم استلام مشكلتك #407 بنجاح",
  "read": false,
  "createdAt": "2024-01-20T10:30:00Z",
  "actionUrl": "/user/cases/407"
}
```

---

## 🚀 الخطوات التالية

### 1. تفعيل في الإنتاج:

```javascript
// استبدل mock email بـ nodemailer
npm install nodemailer

// في emailer-enhanced.js:
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

### 2. تأمين الـ 2FA:

```javascript
// استخدام مكتبة speakeasy
npm install speakeasy qrcode

// توليد secret حقيقي
const secret = speakeasy.generateSecret({ 
  name: 'OPSMind',
  issuer: 'OPSMind'
});
```

### 3. إضافة معالجة الأخطاء:

```javascript
try {
  // العملية
} catch (error) {
  addNotification({
    title: 'خطأ',
    message: error.message,
    type: 'error'
  });
}
```

---

## 📊 Monitoring والتتبع

### تتبع الإشعارات:
```javascript
// تسجيل الإشعارات
const trackNotification = (notification) => {
  console.log(`[${notification.type}] ${notification.title}`);
  // أرسل إلى analytics service
};
```

### تتبع 2FA:
```javascript
// تسجيل محاولات الدخول
const log2FAAttempt = (userId, success) => {
  console.log(`2FA attempt for user ${userId}: ${success}`);
};
```

---

## 💡 النصائح والحيل

1. **استخدم Loading States**: أضف spinner عند تصدير البيانات
2. **Debounce البحث**: تجنب استدعاءات API الكثيرة
3. **Cache الإشعارات**: احفظها في localStorage للأداء
4. **Optimize Images**: اضغط الصور في PDF
5. **Batch Requests**: اجمع العمليات الجماعية

---

## 🐛 استكشاف الأخطاء

### المشكلة: Dark Mode لا يحفظ التفضيل
**الحل:**
```javascript
// تأكد من localStorage
localStorage.setItem('theme', 'dark');
console.log(localStorage.getItem('theme'));
```

### المشكلة: الإشعارات لا تظهر
**الحل:**
```javascript
// تحقق من Context توفره
import { useNotifications } from './contexts/NotificationContext';
// يجب أن يكون التطبيق ملفوفاً بـ NotificationProvider
```

### المشكلة: API لا يستجيب
**الحل:**
```javascript
// تحقق من URL والـ Headers
// تحقق من Authorization Token
// راجع console للأخطاء
```

---

**تم! الآن المشروع جاهز للاستخدام الكامل 🎉**
