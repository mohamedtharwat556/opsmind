import React, { useState } from 'react';
import { Search, Folder, File, Download, Upload, ExternalLink, Filter, Plus, X, FileText, Shield, Server, BookOpen, Receipt } from 'lucide-react';

const categories = [
  { name: 'السياسات العامة', count: 5, icon: '📜' },
  { name: 'أدلة التشغيل والتهيئة', count: 12, icon: '📘' },
  { name: 'نماذج وصيغ العقود', count: 8, icon: '📝' },
  { name: 'الأمن والخصوصية', count: 4, icon: '🔒' },
  { name: 'تقارير الأداء السنوية', count: 3, icon: '📊' },
];

const docContents = {
  1: {
    icon: Shield,
    color: '#DC2626',
    sections: [
      { title: '1. نطاق السياسة', body: 'تسري هذه السياسة على جميع الموظفين والمتعاقدين والأطراف الخارجية التي تتعامل مع بيانات الشركة بأي صورة كانت، سواء إلكترونية أو ورقية.' },
      { title: '2. تصنيف البيانات', body: 'تُصنّف البيانات إلى أربعة مستويات:\n• سرية للغاية: بيانات العملاء المالية وكلمات المرور\n• سرية: التقارير الداخلية والعقود\n• داخلية: المراسلات بين الأقسام\n• عامة: المنشورات والإعلانات الخارجية' },
      { title: '3. الوصول والصلاحيات', body: 'يتم منح صلاحيات الوصول بناءً على مبدأ \"أقل صلاحية مطلوبة\" (Least Privilege). يجب الحصول على موافقة مدير القسم قبل منح أي صلاحية جديدة.' },
      { title: '4. النقل والمشاركة', body: 'يُمنع مشاركة البيانات السرية عبر قنوات غير مشفرة. يجب استخدام بروتوكول TLS 1.3 أو أعلى لنقل البيانات عبر الشبكة.' },
      { title: '5. الإبلاغ عن الحوادث', body: 'في حال اكتشاف أي اختراق أو تسريب للبيانات، يجب إبلاغ فريق الأمن السيبراني خلال ساعة واحدة كحد أقصى عبر البريد security@yas.com أو الخط الساخن 9090.' }
    ]
  },
  2: {
    icon: Server,
    color: '#2563EB',
    sections: [
      { title: '1. المتطلبات الأساسية', body: 'قبل البدء، تأكد من توفر:\n• نظام تشغيل Windows 10/11 أو macOS 12+\n• ذاكرة RAM لا تقل عن 16 GB\n• مساحة تخزين حرة 50 GB على الأقل\n• اتصال بشبكة VPN الداخلية' },
      { title: '2. تثبيت الأدوات', body: 'قم بتثبيت الأدوات التالية بالترتيب:\n1. Git (الإصدار 2.40+)\n2. Node.js (الإصدار 18 LTS)\n3. Docker Desktop\n4. VS Code مع الإضافات الموصى بها' },
      { title: '3. إعداد بيئة التطوير', body: 'استنسخ المستودع الرئيسي:\ngit clone git@github.com:yas-corp/main-app.git\nثم قم بتشغيل:\nnpm install && docker-compose up -d' },
      { title: '4. التحقق من التشغيل', body: 'افتح المتصفح على العنوان http://localhost:3000 وتأكد من ظهور شاشة الدخول. استخدم بيانات الاختبار المتوفرة في ملف .env.example.' }
    ]
  },
  3: {
    icon: Receipt,
    color: '#059669',
    sections: [
      { title: 'بيانات النموذج', body: 'يحتوي هذا النموذج على الحقول التالية:\n• اسم الموظف والرقم الوظيفي\n• القسم والمسمى الوظيفي\n• المبلغ المطلوب (بالريال السعودي)\n• سبب الصرف وتفاصيل البنود' },
      { title: 'خطوات التقديم', body: '1. قم بتعبئة جميع الحقول المطلوبة\n2. أرفق صور الإيصالات والفواتير الأصلية\n3. احصل على توقيع المدير المباشر\n4. سلّم النموذج لقسم المالية' },
      { title: 'ملاحظات هامة', body: '• الحد الأقصى للسلفة الشهرية: 5,000 ريال\n• يجب تسوية السلفة خلال 30 يوماً\n• الإيصالات المقبولة: فواتير ضريبية معتمدة فقط' }
    ]
  },
  4: {
    icon: BookOpen,
    color: '#7C3AED',
    sections: [
      { title: 'الباب الأول: أحكام عامة', body: 'تسري أحكام هذه اللائحة على جميع العاملين بالشركة من تاريخ التعيين وحتى انتهاء الخدمة. يلتزم كل موظف بالاطلاع على هذه اللائحة والعمل بموجبها.' },
      { title: 'الباب الثاني: ساعات العمل', body: '• ساعات العمل الرسمية: 8 ساعات يومياً (من 9:00 ص إلى 5:00 م)\n• يُسمح بالعمل عن بُعد يومين أسبوعياً بعد موافقة المدير المباشر\n• الحد الأقصى للعمل الإضافي: 10 ساعات أسبوعياً' },
      { title: 'الباب الثالث: الإجازات', body: '• إجازة سنوية: 21 يوماً (تزداد إلى 30 يوماً بعد 5 سنوات خدمة)\n• إجازة مرضية: 30 يوماً بأجر كامل\n• إجازة زواج: 5 أيام عمل\n• إجازة أبوة/أمومة: حسب نظام العمل السعودي' },
      { title: 'الباب الرابع: المخالفات والجزاءات', body: 'تُصنّف المخالفات إلى ثلاث درجات:\n• خفيفة: تأخر، غياب بدون إذن (إنذار كتابي)\n• متوسطة: إهمال في العمل (خصم من الراتب)\n• جسيمة: تسريب معلومات سرية (فصل مع حفظ الحقوق)' }
    ]
  },
  5: {
    icon: Server,
    color: '#D97706',
    sections: [
      { title: '1. الوصول لـ AWS Console', body: 'استخدم الرابط التالي للدخول: https://yas-corp.signin.aws.amazon.com/console\nأدخل بيانات حساب SSO الخاص بك واختر الـ Role المناسب (Developer / DevOps / ReadOnly).' },
      { title: '2. إدارة الموارد', body: '• EC2: لا تقم بإنشاء instances أكبر من t3.xlarge بدون موافقة\n• S3: استخدم البادئة yas-prod- أو yas-dev- لتسمية الـ Buckets\n• RDS: جميع قواعد البيانات يجب أن تكون مشفرة بـ AES-256' },
      { title: '3. سياسة التكاليف', body: 'تتم مراجعة تكاليف AWS شهرياً. أي مورد تتجاوز تكلفته $100/شهر يتطلب موافقة مسبقة من مدير الهندسة. قم بوضع Tags مناسبة (Team, Project, Environment) على كل مورد.' },
      { title: '4. الأمان', body: '• يُمنع استخدام Access Keys طويلة الأمد\n• استخدم IAM Roles و Temporary Credentials\n• فعّل MFA على جميع حسابات IAM\n• لا تخزن أي بيانات اعتماد في الكود المصدري' }
    ]
  }
};

const initialDocs = [
  { id: 1, name: 'سياسة حماية البيانات والمعلومات المشتركة.pdf', category: 'الأمن والخصوصية', size: '2.4 MB', type: 'PDF', date: '2024-05-12' },
  { id: 2, name: 'دليل التهيئة والتشغيل لمهندسي الدعم الفني.docx', category: 'أدلة التشغيل والتهيئة', size: '4.8 MB', type: 'DOCX', date: '2024-06-01' },
  { id: 3, name: 'نموذج طلب سلفة وتغطية المصاريف النثرية.xlsx', category: 'نماذج وصيغ العقود', size: '1.2 MB', type: 'XLSX', date: '2024-04-15' },
  { id: 4, name: 'اللائحة الداخلية للعمل والقوانين المنظمة.pdf', category: 'السياسات العامة', size: '1.7 MB', type: 'PDF', date: '2024-01-10' },
  { id: 5, name: 'إرشادات استخدام خادم الشركة السحابي AWS.pdf', category: 'أدلة التشغيل والتهيئة', size: '3.1 MB', type: 'PDF', date: '2024-06-10' },
];

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [docs, setDocs] = useState(initialDocs);
  const [previewDoc, setPreviewDoc] = useState(null);

  const filteredDocs = docs.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? d.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="page-header anim-up">
        <div>
          <h1>مكتبة المستندات</h1>
          <p className="page-sub">المستندات العامة، النماذج، والسياسات الرسمية للشركة</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Upload size={16} /> رفع مستند
          </button>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Plus size={16} /> إنشاء مجلد
          </button>
        </div>
      </div>

      {/* Search Header */}
      <div className="card anim-up" style={{ padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} size={18} />
            <input
              className="input"
              placeholder="ابحث عن مستند بالاسم..."
              style={{ width: '100%', paddingRight: '2.5rem' }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem' }}>
            <Filter size={16} /> تصفية
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Categories Sidebar */}
        <div className="card anim-up d1" style={{ padding: '1.25rem' }}>
          <h3 className="card-title" style={{ fontSize: '0.875rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>المجلدات والتصنيفات</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div
              onClick={() => setSelectedCategory(null)}
              style={{ padding: '0.625rem 0.75rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: !selectedCategory ? '#EFF6FF' : 'transparent', color: !selectedCategory ? '#2563EB' : '#475569', transition: 'all 0.2s' }}
            >
              <span>📁</span>
              <span>جميع المستندات</span>
            </div>
            {categories.map((cat, i) => (
              <div
                key={i}
                onClick={() => setSelectedCategory(cat.name)}
                style={{ padding: '0.625rem 0.75rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: selectedCategory === cat.name ? '#EFF6FF' : 'transparent', color: selectedCategory === cat.name ? '#2563EB' : '#475569', transition: 'all 0.2s' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </div>
                <span className="badge badge-slate" style={{ fontSize: '0.7rem' }}>{cat.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Files Grid/List */}
        <div className="card anim-up d2" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: '0.8rem', color: '#64748B' }}>الاسم</th>
                <th style={{ padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: '0.8rem', color: '#64748B' }}>التصنيف</th>
                <th style={{ padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: '0.8rem', color: '#64748B' }}>الحجم</th>
                <th style={{ padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: '0.8rem', color: '#64748B' }}>تاريخ الرفع</th>
                <th style={{ padding: '0.875rem 1.25rem', fontWeight: 700, fontSize: '0.8rem', color: '#64748B', textAlign: 'left' }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc, i) => (
                <tr key={doc.id} className="animate-fadeIn" style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  onClick={() => setPreviewDoc(doc)}
                >
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', flexShrink: 0 }}>
                        <File size={18} />
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0F172A', margin: 0 }}>{doc.name}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: '#475569' }}>
                    <span className="badge badge-slate">{doc.category}</span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: '#64748B' }}>{doc.size}</td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: '#64748B' }}>{doc.date}</td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'left' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <button className="btn-icon" style={{ color: '#2563EB' }} title="تحميل" onClick={e => e.stopPropagation()}>
                        <Download size={16} />
                      </button>
                      <button className="btn-icon" title="معاينة" onClick={e => { e.stopPropagation(); setPreviewDoc(doc); }}>
                        <ExternalLink size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredDocs.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                    لا توجد مستندات تطابق معايير البحث.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Document Preview Panel */}
      {previewDoc && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setPreviewDoc(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', zIndex: 60, animation: 'fadeIn 0.2s ease' }}
          />
          {/* Panel */}
          <div style={{ position: 'fixed', top: 0, right: 0, width: '520px', height: '100vh', background: 'white', zIndex: 70, boxShadow: '-10px 0 40px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column', animation: 'slideRight 0.3s cubic-bezier(.22,.68,0,1.2) both' }}>
            {/* Panel Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {(() => {
                  const content = docContents[previewDoc.id];
                  const Icon = content?.icon || FileText;
                  const color = content?.color || '#2563EB';
                  return (
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: color + '15', color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={20} />
                    </div>
                  );
                })()}
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0F172A', margin: 0 }}>معاينة المستند</p>
                  <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: 0 }}>{previewDoc.type} · {previewDoc.size}</p>
                </div>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="btn-icon" style={{ width: 36, height: 36, borderRadius: 10, background: '#F1F5F9' }}>
                <X size={18} />
              </button>
            </div>

            {/* Panel Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              {/* Document Title */}
              <div style={{ marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid #F1F5F9' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.5rem', lineHeight: 1.5 }}>{previewDoc.name}</h2>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span className="badge badge-blue">{previewDoc.category}</span>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>آخر تحديث: {previewDoc.date}</span>
                </div>
              </div>

              {/* Document Content */}
              {docContents[previewDoc.id] ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {docContents[previewDoc.id].sections.map((section, i) => (
                    <div key={i} style={{ background: '#F8FAFC', borderRadius: 12, padding: '1.25rem', border: '1px solid #F1F5F9' }}>
                      <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0F172A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: 24, height: 24, borderRadius: 6, background: (docContents[previewDoc.id].color || '#2563EB') + '20', color: docContents[previewDoc.id].color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
                        {section.title}
                      </h3>
                      <p style={{ fontSize: '0.8125rem', color: '#475569', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>{section.body}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94A3B8' }}>
                  <FileText size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                  <p>معاينة هذا المستند غير متاحة حالياً.</p>
                </div>
              )}
            </div>

            {/* Panel Footer */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                <Download size={15} /> تحميل المستند
              </button>
              <button className="btn btn-secondary" onClick={() => setPreviewDoc(null)} style={{ justifyContent: 'center' }}>
                إغلاق
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Documents;
