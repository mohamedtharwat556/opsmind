import React, { useState } from 'react';
import TaggingSystem from '../components/TaggingSystem';
import BulkOperations from '../components/BulkOperations';
import './AdvancedSearch.css';

export default function AdvancedSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    department: 'all',
    dateRange: 'all',
    type: 'all'
  });

  const [selectedTags, setSelectedTags] = useState([]);
  const [searchResults, setSearchResults] = useState([
    {
      id: '#405',
      title: 'الموظف الجديد لم يستلم دعوة GitHub',
      type: 'case',
      status: 'محلول',
      reporter: 'عبدالله ر.',
      sop: 'SOP-104',
      created: '2024-01-19',
      priority: 'عالية'
    },
    {
      id: '#406',
      title: 'فشل النشر (Deployment) في مرحلة البناء',
      type: 'case',
      status: 'محلول',
      reporter: 'محمد ث.',
      sop: 'SOP-201',
      created: '2024-01-18',
      priority: 'حرجة'
    },
    {
      id: '#407',
      title: 'لا يمكن الوصول للـ VPN الداخلي',
      type: 'case',
      status: 'مفتوح',
      reporter: 'تاح',
      sop: 'لا يوجد',
      created: '2024-01-17',
      priority: 'عالية'
    }
  ]);

  const handleSearch = () => {
    // محاكاة البحث
    console.log('البحث عن:', { searchQuery, filters, selectedTags });
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };

  const handleBulkAction = (action, items) => {
    console.log(`تطبيق إجراء: ${action} على`, items);
    alert(`تم تطبيق "${action}" على ${items.length} عنصر`);
  };

  return (
    <div className="advanced-search">
      <h1>بحث متقدم 🔍</h1>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="ابحث عن مشاكل، مقالات، أو إجراءات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="search-input"
          />
          <button className="search-btn" onClick={handleSearch}>
            🔍 بحث
          </button>
        </div>

        {/* Quick Filters */}
        <div className="quick-filters">
          <label>
            <span>الحالة:</span>
            <select value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
              <option value="all">الكل</option>
              <option value="مفتوح">مفتوح</option>
              <option value="قيد العمل">قيد العمل</option>
              <option value="محلول">محلول</option>
            </select>
          </label>

          <label>
            <span>الأولوية:</span>
            <select value={filters.priority} onChange={(e) => handleFilterChange('priority', e.target.value)}>
              <option value="all">الكل</option>
              <option value="عالية">عالية</option>
              <option value="متوسطة">متوسطة</option>
              <option value="منخفضة">منخفضة</option>
            </select>
          </label>

          <label>
            <span>النوع:</span>
            <select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
              <option value="all">الكل</option>
              <option value="مشكلة">مشكلة</option>
              <option value="مقالة">مقالة</option>
              <option value="إعلان">إعلان</option>
            </select>
          </label>

          <label>
            <span>الفترة الزمنية:</span>
            <select value={filters.dateRange} onChange={(e) => handleFilterChange('dateRange', e.target.value)}>
              <option value="all">الكل</option>
              <option value="today">اليوم</option>
              <option value="week">هذا الأسبوع</option>
              <option value="month">هذا الشهر</option>
            </select>
          </label>
        </div>
      </div>

      {/* Tagging System */}
      <TaggingSystem tags={selectedTags} onTagsChange={setSelectedTags} />

      {/* Results Section */}
      <div className="results-section">
        <h2>نتائج البحث ({searchResults.length})</h2>

        {/* Bulk Operations */}
        <BulkOperations
          items={searchResults}
          onBulkAction={handleBulkAction}
          itemType="search_results"
        />

        {/* Results List */}
        <div className="results-list">
          {searchResults.length === 0 ? (
            <div className="no-results">
              <span className="no-results-icon">🔎</span>
              <p>لم يتم العثور على نتائج</p>
              <small>حاول تغيير معايير البحث أو المرشحات</small>
            </div>
          ) : (
            searchResults.map(result => (
              <div key={result.id} className="result-card">
                <div className="result-header">
                  <h3>{result.title}</h3>
                  <span className={`result-type ${result.type}`}>{result.type}</span>
                </div>
                <div className="result-meta">
                  <span className={`status ${result.status.toLowerCase()}`}>{result.status}</span>
                  <span className={`priority ${getPriorityClass(result.priority)}`}>
                    {result.priority}
                  </span>
                  <span className="reporter">من: {result.reporter}</span>
                  <span className="created">{result.created}</span>
                </div>
                {result.sop && result.sop !== 'لا يوجد' && (
                  <p className="result-sop">📋 SOP: {result.sop}</p>
                )}
                <div className="result-actions">
                  <button className="action-link">عرض التفاصيل →</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function getPriorityClass(priority) {
  const classes = {
    'عالية': 'high',
    'حرجة': 'critical',
    'متوسطة': 'medium',
    'منخفضة': 'low'
  };
  return classes[priority] || 'medium';
}
