import React, { useState, useEffect } from 'react';
import { Search, Book, ChevronLeft, Plus, CheckCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';

const categories = [
  { name: 'الشبكات و VPN', count: 12, icon: '🌐' },
  { name: 'أنظمة التشغيل', count: 8, icon: '💻' },
  { name: 'أدوات الهندسة', count: 15, icon: '🔧' },
  { name: 'الموارد البشرية', count: 6, icon: '👥' },
  { name: 'الأمن والخصوصية', count: 9, icon: '🔒' },
  { name: 'خدمات السحابة (Cloud)', count: 11, icon: '☁️' },
];

const KnowledgeBase = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('الشبكات و VPN');
  const [submitLoading, setSubmitLoading] = useState(false);
  const location = useLocation();
  const { success, error } = useToast();

  useEffect(() => {
    fetch('http://localhost:5000/api/articles')
      .then(res => res.json())
      .then(data => {
        setArticles(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [location.search]);

  const handleCreate = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!newTitle.trim()) {
      error('عنوان المقال مطلوب');
      return;
    }

    if (newTitle.trim().length < 5) {
      error('عنوان المقال يجب أن يكون 5 أحرف على الأقل');
      return;
    }

    if (!newContent.trim()) {
      error('محتوى المقال مطلوب');
      return;
    }

    setSubmitLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: newTitle.trim(), 
          category: newCategory,
          content: newContent.trim()
        })
      });

      if (!response.ok) {
        throw new Error('فشل في نشر المقال');
      }

      const newArticle = await response.json();
      
      // أضف المقال الجديد في البداية
      setArticles([newArticle, ...articles]);
      
      // إعادة تعيين النموذج
      setNewTitle('');
      setNewContent('');
      setNewCategory('الشبكات و VPN');
      setShowAddForm(false);
      
      // عرض رسالة نجاح
      success(`تم نشر المقال "${newArticle.title}" بنجاح! ✅`);
      
    } catch (err) {
      console.error('Error:', err);
      error(err.message || 'حدث خطأ أثناء نشر المقال');
    } finally {
      setSubmitLoading(false);
    }
  };

  const filteredArticles = articles.filter(a => {
    const matchSearch = a.title.includes(searchTerm);
    const matchCategory = selectedCategory ? a.category === selectedCategory : true;
    return matchSearch && matchCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="page-header anim-up">
        <div>
          <h1>قاعدة المعرفة</h1>
          <p className="page-sub">المقالات الإرشادية والشروحات التقنية والإدارية</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          <Book size={16} /> إضافة مقال جديد
        </button>
      </div>

      {showAddForm && (
        <div className="card anim-up" style={{ borderRight: '4px solid #2563EB' }}>
          <h3 className="card-title">كتابة مقال جديد</h3>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">عنوان المقال *</label>
              <input 
                className="input" 
                placeholder="مثال: كيفية إعداد المصادقة الثنائية لبريد الشركة" 
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                disabled={submitLoading}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">التصنيف</label>
              <select 
                className="input" 
                value={newCategory} 
                onChange={e => setNewCategory(e.target.value)}
                disabled={submitLoading}
              >
                {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">محتوى المقال *</label>
              <textarea 
                className="input" 
                rows="5" 
                placeholder="اكتب محتوى الشرح أو الدليل التفصيلي هنا..." 
                style={{ resize: 'vertical' }}
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                disabled={submitLoading}
                required
              ></textarea>
              <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.25rem' }}>
                الحد الأدنى: 10 أحرف
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowAddForm(false)}
                disabled={submitLoading}
              >
                إلغاء
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submitLoading}
                style={{ opacity: submitLoading ? 0.7 : 1 }}
              >
                {submitLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="spinner" style={{ width: '14px', height: '14px' }}></div>
                    جاري النشر...
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={16} />
                    نشر المقال
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="card anim-up" style={{ padding: '1rem 1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <Search style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} size={20} />
          <input 
            className="input" 
            type="text" 
            placeholder="ابحث في المقالات والشروحات..." 
            style={{ width: '100%', paddingRight: '3rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem' }}>
        {/* Categories Sidebar */}
        <div className="card anim-up d1" style={{ alignSelf: 'start', padding: '1.25rem' }}>
          <h3 className="card-title" style={{ fontSize: '0.875rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>التصنيفات</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div 
              onClick={() => setSelectedCategory(null)} 
              style={{ padding: '0.625rem 0.75rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', background: !selectedCategory ? '#EFF6FF' : 'transparent', color: !selectedCategory ? '#2563EB' : '#475569', transition: 'all 0.2s' }}
            >
              📋 جميع المقالات
            </div>
            {categories.map(cat => (
              <div 
                key={cat.name} 
                onClick={() => setSelectedCategory(cat.name)} 
                style={{ padding: '0.625rem 0.75rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: selectedCategory === cat.name ? '#EFF6FF' : 'transparent', color: selectedCategory === cat.name ? '#2563EB' : '#475569', transition: 'all 0.2s' }}
              >
                <span>{cat.icon} {cat.name}</span>
                <span className="badge badge-slate" style={{ fontSize: '0.7rem' }}>{cat.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Articles List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {loading ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
              <p style={{ color: '#64748B' }}>جاري تحميل المقالات...</p>
            </div>
          ) : filteredArticles.length > 0 ? (
            filteredArticles.map((article, i) => (
              <div key={article.id} className="card card-hover anim-up" style={{ cursor: 'pointer', padding: '1.25rem', animationDelay: `${i * 0.05}s` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '1rem', margin: '0 0 0.5rem', color: '#0F172A' }}>{article.title}</h3>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#64748B' }}>
                      <span className="badge badge-blue">{article.category}</span>
                      <span>•</span>
                      <span>{article.views} مشاهدة</span>
                      <span>•</span>
                      <span>آخر تحديث: {article.updated}</span>
                    </div>
                  </div>
                  <ChevronLeft size={20} style={{ color: '#94A3B8' }} />
                </div>
              </div>
            ))
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
              لا توجد مقالات تطابق البحث أو التصنيف المختار.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
