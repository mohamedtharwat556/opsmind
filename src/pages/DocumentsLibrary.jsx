import React, { useState } from 'react';
import { Search, Folder, File, Download, Upload, Plus, X, FileText, Trash2, FolderPlus } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const DocumentsLibrary = () => {
  const [documents, setDocuments] = useState([
    { id: 1, name: 'سياسة حماية البيانات', type: 'PDF', size: '2.4 MB', date: '2024-05-12', folder: 'الأمن' },
    { id: 2, name: 'دليل التهيئة', type: 'DOCX', size: '4.8 MB', date: '2024-06-01', folder: 'الأدلة' },
    { id: 3, name: 'نموذج السلفة', type: 'XLSX', size: '1.2 MB', date: '2024-04-15', folder: 'النماذج' },
  ]);

  const [folders, setFolders] = useState([
    { id: 1, name: 'الأمن والخصوصية', itemCount: 4 },
    { id: 2, name: 'أدلة التشغيل', itemCount: 12 },
    { id: 3, name: 'النماذج', itemCount: 8 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const { success, error } = useToast();

  // Handle Upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      error('اختر ملف للرفع');
      return;
    }

    setUploadLoading(true);

    try {
      // محاكاة تأخير الرفع
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newDoc = {
        id: documents.length + 1,
        name: uploadFile.name,
        type: uploadFile.name.split('.').pop().toUpperCase(),
        size: (uploadFile.size / (1024 * 1024)).toFixed(1) + ' MB',
        date: new Date().toISOString().split('T')[0],
        folder: selectedFolder || 'عام'
      };

      setDocuments([newDoc, ...documents]);
      success(`تم رفع ${uploadFile.name} بنجاح! ✅`);
      setUploadFile(null);
      setShowUploadModal(false);
    } catch (err) {
      error('فشل الرفع، حاول مرة أخرى');
    } finally {
      setUploadLoading(false);
    }
  };

  // Handle Create Folder
  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) {
      error('أدخل اسم المجلد');
      return;
    }

    try {
      const newFolder = {
        id: folders.length + 1,
        name: newFolderName.trim(),
        itemCount: 0
      };

      setFolders([newFolder, ...folders]);
      success(`تم إنشاء مجلد "${newFolderName}" بنجاح! ✅`);
      setNewFolderName('');
      setShowFolderModal(false);
    } catch (err) {
      error('فشل في إنشاء المجلد');
    }
  };

  // Handle Delete Document
  const handleDeleteDoc = (docId, docName) => {
    if (!window.confirm(`هل متأكد من حذف "${docName}"؟`)) return;

    try {
      setDocuments(documents.filter(d => d.id !== docId));
      success(`تم حذف "${docName}" بنجاح 🗑️`);
    } catch (err) {
      error('فشل الحذف');
    }
  };

  // Handle Delete Folder
  const handleDeleteFolder = (folderId, folderName) => {
    if (!window.confirm(`هل متأكد من حذف مجلد "${folderName}"؟`)) return;

    try {
      setFolders(folders.filter(f => f.id !== folderId));
      success(`تم حذف المجلد "${folderName}" بنجاح 🗑️`);
    } catch (err) {
      error('فشل الحذف');
    }
  };

  const filteredDocs = documents.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!selectedFolder || d.folder === selectedFolder)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="page-header anim-up">
        <div>
          <h1>مكتبة المستندات 📚</h1>
          <p className="page-sub">رفع وإدارة المستندات والملفات المشتركة</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowUploadModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Upload size={16} /> رفع ملف
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowFolderModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <FolderPlus size={16} /> مجلد جديد
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="card anim-up" style={{ padding: '1rem' }}>
        <div style={{ position: 'relative' }}>
          <Search style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} size={18} />
          <input 
            className="input" 
            placeholder="ابحث في المستندات..."
            style={{ width: '100%', paddingRight: '2.5rem' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '1.5rem' }}>
        {/* Folders Sidebar */}
        <div className="card anim-up" style={{ padding: '1.25rem', height: 'fit-content' }}>
          <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '1rem' }}>المجلدات</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div 
              onClick={() => setSelectedFolder(null)}
              style={{
                padding: '0.75rem',
                borderRadius: '8px',
                cursor: 'pointer',
                background: !selectedFolder ? '#EFF6FF' : 'transparent',
                color: !selectedFolder ? '#2563EB' : '#475569',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: !selectedFolder ? 600 : 500,
                fontSize: '0.875rem'
              }}
            >
              <Folder size={16} />
              جميع الملفات
            </div>
            {folders.map(folder => (
              <div 
                key={folder.id}
                onClick={() => setSelectedFolder(folder.name)}
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: selectedFolder === folder.name ? '#EFF6FF' : 'transparent',
                  color: selectedFolder === folder.name ? '#2563EB' : '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontWeight: selectedFolder === folder.name ? 600 : 500,
                  fontSize: '0.875rem',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Folder size={16} />
                  <span>{folder.name}</span>
                </div>
                <button 
                  onClick={e => {
                    e.stopPropagation();
                    handleDeleteFolder(folder.id, folder.name);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#DC2626',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="حذف المجلد"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div className="card anim-up" style={{ padding: '1.5rem' }}>
          {filteredDocs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredDocs.map((doc, i) => (
                <div key={doc.id} className="card" style={{
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#F8FAFC';
                    e.currentTarget.style.transform = 'translateX(-4px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: '8px',
                      background: '#EFF6FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#2563EB'
                    }}>
                      <File size={20} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0F172A', margin: 0 }}>{doc.name}</p>
                      <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>{doc.type} • {doc.size} • {doc.date}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button className="btn-icon" style={{ color: '#2563EB' }} title="تحميل">
                      <Download size={16} />
                    </button>
                    <button 
                      className="btn-icon" 
                      style={{ color: '#DC2626' }}
                      onClick={e => {
                        e.stopPropagation();
                        handleDeleteDoc(doc.id, doc.name);
                      }}
                      title="حذف"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
              <FileText size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p>لا توجد ملفات تطابق البحث</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}
          onClick={() => setShowUploadModal(false)}
        >
          <div 
            className="card"
            onClick={e => e.stopPropagation()}
            style={{ 
              maxWidth: '500px', 
              width: '90%',
              padding: '2rem',
              borderRight: '4px solid #2563EB'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>رفع ملف جديد</h2>
              <button onClick={() => setShowUploadModal(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                border: '2px dashed #CBD5E1',
                borderRadius: '12px',
                padding: '2rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
                onDragOver={e => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = '#2563EB';
                  e.currentTarget.style.background = '#EFF6FF';
                }}
                onDragLeave={e => {
                  e.currentTarget.style.borderColor = '#CBD5E1';
                  e.currentTarget.style.background = 'transparent';
                }}
                onDrop={e => {
                  e.preventDefault();
                  setUploadFile(e.dataTransfer.files[0]);
                }}
                onClick={() => document.getElementById('file-input').click()}
              >
                <Upload size={32} style={{ margin: '0 auto 0.5rem', color: '#2563EB' }} />
                <p style={{ fontWeight: 600, color: '#0F172A', marginBottom: '0.25rem' }}>اسحب الملف هنا أو انقر</p>
                <p style={{ fontSize: '0.875rem', color: '#64748B' }}>الملفات المدعومة: PDF, DOCX, XLSX, TXT</p>
                <input 
                  id="file-input"
                  type="file" 
                  hidden 
                  onChange={e => setUploadFile(e.target.files[0])}
                  accept=".pdf,.docx,.xlsx,.txt"
                />
              </div>

              {uploadFile && (
                <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{uploadFile.name}</span>
                  <button type="button" onClick={() => setUploadFile(null)} className="btn-icon" style={{ color: '#DC2626' }}>
                    <X size={16} />
                  </button>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowUploadModal(false)}>
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary" disabled={uploadLoading}>
                  {uploadLoading ? 'جاري الرفع...' : 'رفع الملف'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Folder Modal */}
      {showFolderModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}
          onClick={() => setShowFolderModal(false)}
        >
          <div 
            className="card"
            onClick={e => e.stopPropagation()}
            style={{ 
              maxWidth: '400px', 
              width: '90%',
              padding: '2rem',
              borderRight: '4px solid #2563EB'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>إنشاء مجلد جديد</h2>
              <button onClick={() => setShowFolderModal(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateFolder} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">اسم المجلد *</label>
                <input 
                  className="input" 
                  placeholder="مثال: المشاريع الجديدة"
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowFolderModal(false)}>
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary">
                  إنشاء المجلد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsLibrary;
