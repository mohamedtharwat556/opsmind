import React, { useState } from 'react';
import './TaggingSystem.css';

export default function TaggingSystem({ tags = [], onTagsChange }) {
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTag, setCustomTag] = useState('');
  const [allTags] = useState([
    { id: 'tag-1', name: 'عاجل', color: '#DC2626', icon: '🔴' },
    { id: 'tag-2', name: 'متابعة', color: '#F59E0B', icon: '🟠' },
    { id: 'tag-3', name: 'مكتمل', color: '#10B981', icon: '✅' },
    { id: 'tag-4', name: 'معطل', color: '#8B5CF6', icon: '⚙️' },
    { id: 'tag-5', name: 'قابل لإعادة الاستخدام', color: '#3B82F6', icon: '♻️' }
  ]);

  const toggleTag = (tag) => {
    const updated = selectedTags.some(t => t.id === tag.id)
      ? selectedTags.filter(t => t.id !== tag.id)
      : [...selectedTags, tag];
    
    setSelectedTags(updated);
    onTagsChange && onTagsChange(updated);
  };

  const addCustomTag = () => {
    if (customTag.trim()) {
      const newTag = {
        id: `custom-${Date.now()}`,
        name: customTag,
        color: generateRandomColor(),
        icon: '🏷️',
        isCustom: true
      };
      const updated = [...selectedTags, newTag];
      setSelectedTags(updated);
      onTagsChange && onTagsChange(updated);
      setCustomTag('');
    }
  };

  const removeTag = (tagId) => {
    const updated = selectedTags.filter(t => t.id !== tagId);
    setSelectedTags(updated);
    onTagsChange && onTagsChange(updated);
  };

  return (
    <div className="tagging-system">
      <div className="tags-selector">
        <h4>تصنيفات مقترحة</h4>
        <div className="tags-grid">
          {allTags.map(tag => (
            <button
              key={tag.id}
              className={`tag-btn ${selectedTags.some(t => t.id === tag.id) ? 'active' : ''}`}
              onClick={() => toggleTag(tag)}
              style={{
                borderColor: tag.color,
                backgroundColor: selectedTags.some(t => t.id === tag.id) ? tag.color : 'transparent',
                color: selectedTags.some(t => t.id === tag.id) ? 'white' : tag.color
              }}
            >
              <span>{tag.icon}</span>
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      <div className="custom-tag">
        <h4>إضافة تصنيف مخصص</h4>
        <div className="custom-tag-input">
          <input
            type="text"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCustomTag()}
            placeholder="اكتب تصنيفاً جديداً..."
          />
          <button onClick={addCustomTag}>إضافة</button>
        </div>
      </div>

      {selectedTags.length > 0 && (
        <div className="selected-tags">
          <h4>التصنيفات المختارة ({selectedTags.length})</h4>
          <div className="tags-list">
            {selectedTags.map(tag => (
              <div
                key={tag.id}
                className="tag-chip"
                style={{ backgroundColor: tag.color }}
              >
                <span>{tag.icon}</span>
                {tag.name}
                <button
                  className="remove-tag"
                  onClick={() => removeTag(tag.id)}
                  title="إزالة"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function generateRandomColor() {
  const colors = ['#EC4899', '#06B6D4', '#F97316', '#8B5CF6', '#EF4444', '#F59E0B'];
  return colors[Math.floor(Math.random() * colors.length)];
}
