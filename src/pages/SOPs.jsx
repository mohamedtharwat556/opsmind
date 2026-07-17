import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Clock, AlertTriangle, FileText, CheckCircle, Play, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SOPs = () => {
  const [sops, setSops] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('content');
  const location = useLocation();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  
  // Forms & Modal State
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditSuggest, setShowEditSuggest] = useState(false);
  const [addMode, setAddMode] = useState('manual'); // 'manual' or 'ai'

  // Playbook Simulation State
  const [isRunningPlaybook, setIsRunningPlaybook] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [playbookTimer, setPlaybookTimer] = useState(0);
  const [playbookCompleted, setPlaybookCompleted] = useState(false);

  // New SOP Form Fields (Manual)
  const [newTitle, setNewTitle] = useState('');
  const [newOwner, setNewOwner] = useState('عمليات الهندسة');
  const [newPriority, setNewPriority] = useState('متوسطة');
  const [newSteps, setNewSteps] = useState([{ title: 'خطوة أولى', desc: '' }]);

  // AI Generator Fields
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // Edit Suggestion Field
  const [editDetails, setEditDetails] = useState('');
  const [suggestMessage, setSuggestMessage] = useState('');

  const fetchSOPs = () => {
    fetch(`${API_URL}/api/sops`)
      .then(res => res.json())
      .then(data => {
        setSops(data);
      });
  };

  useEffect(() => {
    fetchSOPs();
  }, []);

  useEffect(() => {
    if (sops) {
      const params = new URLSearchParams(location.search);
      const targetId = params.get('id');
      if (targetId) {
        const index = sops.findIndex(s => s.id === targetId);
        if (index !== -1) {
          setSelectedIndex(index);
        }
      }
    }
  }, [location.search, sops]);

  // Timer for Playbook Simulation
  useEffect(() => {
    let interval;
    if (isRunningPlaybook && !playbookCompleted) {
      interval = setInterval(() => {
        setPlaybookTimer(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunningPlaybook, playbookCompleted]);

  if (!sops) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
      <div className="spinner"></div>
    </div>
  );

  const currentSOP = sops[selectedIndex];

  const handleCreateSOP = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    fetch(`${API_URL}/api/sops`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTitle,
        owner: newOwner,
        priority: newPriority,
        steps: newSteps
      })
    })
      .then(res => res.json())
      .then(() => {
        fetchSOPs();
        setShowAddForm(false);
        setNewTitle('');
        setNewSteps([{ title: 'خطوة أولى', desc: '' }]);
      });
  };

  const handleAiGenerate = (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setAiGenerating(true);

    fetch(`${API_URL}/api/ai/generate-sop`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: aiPrompt })
    })
      .then(res => res.json())
      .then(data => {
        setAiResult(data);
        setAiGenerating(false);
      })
      .catch(() => setAiGenerating(false));
  };

  const handleSaveAiSOP = () => {
    if (!aiResult) return;
    fetch(`${API_URL}/api/sops`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: aiResult.title,
        owner: aiResult.owner,
        priority: aiResult.priority,
        steps: aiResult.steps
      })
    })
      .then(res => res.json())
      .then(() => {
        fetchSOPs();
        setShowAddForm(false);
        setAiResult(null);
        setAiPrompt('');
      });
  };

  const handleSuggestEdit = (e) => {
    e.preventDefault();
    if (!editDetails.trim()) return;

    fetch(`${API_URL}/api/sops/${currentSOP.id}/suggest-edit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: user?.name || 'ادم فاروق',
        details: editDetails
      })
    })
      .then(res => res.json())
      .then(() => {
        setSuggestMessage('تم إرسال الاقتراح بنجاح ووضعه قيد الموافقة! ✓');
        setEditDetails('');
        setTimeout(() => {
          setSuggestMessage('');
          setShowEditSuggest(false);
        }, 2000);
      });
  };

  // Playbook Workflow Execution
  const startPlaybook = () => {
    setIsRunningPlaybook(true);
    setCurrentStepIndex(0);
    setPlaybookTimer(0);
    setPlaybookCompleted(false);
  };

  const nextPlaybookStep = () => {
    if (currentStepIndex < currentSOP.steps.length - 1) {
      setCurrentStepIndex(idx => idx + 1);
    } else {
      setPlaybookCompleted(true);
      // Post log to backend
      fetch(`${API_URL}/api/playbooks/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sopId: currentSOP.id,
          sopTitle: currentSOP.title,
          user: user?.name || 'ادم فاروق',
          duration: `${playbookTimer} ثانية`,
          stepsCompleted: currentSOP.steps.length
        })
      }).then(() => {
        // Trigger gamification notification
        if (addNotification) {
          addNotification({
            type: 'points',
            title: '🎉 إنجاز جديد! نقاط مكتسبة',
            message: `أكملت تنفيذ ${currentSOP.id}: ${currentSOP.title} في ${playbookTimer} ثانية. حصلت على +75 نقطة!`,
          });
        }
      });
    }
  };

  const tabStyle = (tab) => ({
    padding: '0.625rem 1.25rem',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontWeight: 600,
    fontSize: '0.875rem',
    borderBottom: activeTab === tab ? '2px solid #2563EB' : '2px solid transparent',
    color: activeTab === tab ? '#2563EB' : '#64748B',
    transition: 'all 0.2s',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Playbook Mode overlay */}
      {isRunningPlaybook && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContext: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="card anim-up" style={{ width: '100%', maxWidth: '640px', background: 'white', padding: '2.5rem', borderRadius: '16px', position: 'relative' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
              <div>
                <span className="badge badge-blue" style={{ marginBottom: '0.25rem' }}>التشغيل التفاعلي للإجراء (Playbook Mode)</span>
                <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0F172A', margin: 0 }}>{currentSOP.title}</h2>
              </div>
              <div style={{ background: '#FFFBEB', color: '#D97706', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.875rem' }}>
                ⏱️ {playbookTimer} ثانية
              </div>
            </div>

            {/* Stepper progress indicator */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {currentSOP.steps.map((_, idx) => (
                <div 
                  key={idx} 
                  style={{ flex: 1, height: '6px', borderRadius: '3px', background: idx <= currentStepIndex ? '#2563EB' : '#E2E8F0', transition: 'background 0.3s' }} 
                />
              ))}
            </div>

            {!playbookCompleted ? (
              <div>
                <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0', minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.5rem' }}>
                    الخطوة {currentStepIndex + 1} من {currentSOP.steps.length}
                  </span>
                  <h3 style={{ fontWeight: 800, fontSize: '1.125rem', color: '#0F172A', marginBottom: '0.5rem' }}>
                    {currentSOP.steps[currentStepIndex].title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                    {currentSOP.steps[currentStepIndex].desc}
                  </p>

                  {currentSOP.steps[currentStepIndex].warning && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', padding: '0.75rem', background: '#FEF3C7', borderRadius: '8px', fontSize: '0.75rem', color: '#D97706', fontWeight: 700 }}>
                      <AlertTriangle size={14} /> {currentSOP.steps[currentStepIndex].warning}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContext: 'flex-end', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button className="btn btn-secondary" onClick={() => setIsRunningPlaybook(false)}>إلغاء التشغيل</button>
                  <button className="btn btn-primary" onClick={nextPlaybookStep} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {currentStepIndex === currentSOP.steps.length - 1 ? 'إنهاء واعتماد' : 'تأكيد الخطوة التالية'} <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <CheckCircle size={36} />
                </div>
                <h3 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#0F172A', marginBottom: '0.5rem' }}>اكتمل تشغيل الإجراء بنجاح!</h3>
                <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '2rem' }}>
                  تم توثيق تنفيذ الإجراء وحفظ السجلات في الـ System Audit Log للمؤسسة.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                  <button className="btn btn-primary" onClick={() => setIsRunningPlaybook(false)}>حسناً</button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="page-header anim-up">
        <div>
          <h1>إجراءات التشغيل (SOPs)</h1>
          <p className="page-sub">إجراءات العمل المعيارية والتشغيل التفاعلي playbooks</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={() => setShowEditSuggest(!showEditSuggest)}>
            <Edit3 size={15} /> اقتراح تعديل
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus size={15} /> إضافة إجراء جديد
          </button>
        </div>
      </div>

      {/* Suggest Edit Form */}
      {showEditSuggest && (
        <div className="card anim-up" style={{ borderRight: '4px solid #D97706' }}>
          <h3 className="card-title" style={{ color: '#D97706' }}>اقتراح تعديل على إجراء: {currentSOP.id}</h3>
          {suggestMessage ? (
            <p style={{ color: '#059669', fontWeight: 600 }}>{suggestMessage}</p>
          ) : (
            <form onSubmit={handleSuggestEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">تفاصيل المقترح للتحسين *</label>
                <textarea className="input" rows="3" placeholder="اشرح ما ترغب في تعديله وفوائده على سير العمل..." value={editDetails} onChange={e => setEditDetails(e.target.value)} required />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditSuggest(false)}>إلغاء</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#D97706' }}>إرسال المقترح</button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Add SOP Wizard */}
      {showAddForm && (
        <div className="card anim-up" style={{ borderRight: '4px solid #2563EB' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
            <h3 className="card-title" style={{ margin: 0 }}>إنشاء إجراء جديد</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className={`btn ${addMode === 'manual' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }} onClick={() => setAddMode('manual')}>✍️ إدخال يدوي</button>
              <button className={`btn ${addMode === 'ai' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem', background: addMode === 'ai' ? 'linear-gradient(135deg, #7C3AED, #2563EB)' : '' }} onClick={() => setAddMode('ai')}>✨ توليد بالذكاء الاصطناعي</button>
            </div>
          </div>

          {addMode === 'manual' ? (
            <form onSubmit={handleCreateSOP} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">عنوان الإجراء القياسي *</label>
                  <input className="input" placeholder="عنوان الإجراء" value={newTitle} onChange={e => setNewTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">القسم المسؤول</label>
                  <select className="input" value={newOwner} onChange={e => setNewOwner(e.target.value)}>
                    <option value="عمليات الهندسة">عمليات الهندسة</option>
                    <option value="DevOps">DevOps</option>
                    <option value="الحسابات والمالية">الحسابات والمالية</option>
                    <option value="الموارد البشرية">الموارد البشرية</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>خطوات العملية</span>
                  <button type="button" className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => setNewSteps([...newSteps, { title: '', desc: '' }])}>+ إضافة خطوة</button>
                </label>
                {newSteps.map((s, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <input className="input" placeholder={`عنوان الخطوة ${idx+1}`} value={s.title} onChange={e => {
                      const copy = [...newSteps]; copy[idx].title = e.target.value; setNewSteps(copy);
                    }} required />
                    <textarea className="input" rows="2" placeholder="تفاصيل الخطوة..." value={s.desc} onChange={e => {
                      const copy = [...newSteps]; copy[idx].desc = e.target.value; setNewSteps(copy);
                    }} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>إلغاء</button>
                <button type="submit" className="btn btn-primary">حفظ كمسودة</button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <form onSubmit={handleAiGenerate} style={{ display: 'flex', gap: '0.5rem' }}>
                <input className="input" placeholder="اكتب فكرة الإجراء (مثال: خطوات تسليم اللابتوب عند الاستقالة)..." value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} required />
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'linear-gradient(135deg, #7C3AED, #2563EB)' }} disabled={aiGenerating}>
                  <Sparkles size={16} /> {aiGenerating ? 'جاري التوليد...' : 'توليد مسودة'}
                </button>
              </form>

              {aiResult && (
                <div className="animate-fadeIn" style={{ background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: '12px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7C3AED' }}>توليد ذكي (مسودة AI)</span>
                    <span className="badge badge-purple">{aiResult.priority}</span>
                  </div>
                  <h4 style={{ fontWeight: 800, color: '#1F2937', marginBottom: '0.75rem' }}>{aiResult.title}</h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    {aiResult.steps.map((st, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.75rem' }}>
                        <span style={{ fontWeight: 700, color: '#7C3AED' }}>{i + 1}.</span>
                        <div>
                          <p style={{ fontWeight: 700, fontSize: '0.85rem', margin: '0 0 0.15rem' }}>{st.title}</p>
                          <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: 0 }}>{st.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {aiResult.warning && (
                    <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <AlertCircle size={14} /> {aiResult.warning}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button className="btn btn-secondary" onClick={() => setAiResult(null)}>تجاهل</button>
                    <button className="btn btn-primary" style={{ background: '#7C3AED' }} onClick={handleSaveAiSOP}>حفظ مسودة الإجراء</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Sidebar List */}
        <div className="card anim-up d1" style={{ padding: '1rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>الإجراءات المتاحة</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {sops.map((sop, i) => (
              <div
                key={sop.id}
                onClick={() => {
                  setSelectedIndex(i);
                  setActiveTab('content');
                }}
                style={{
                  padding: '0.875rem 1rem', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s',
                  background: selectedIndex === i ? '#EFF6FF' : 'transparent',
                  border: selectedIndex === i ? '1px solid #BFDBFE' : '1px solid transparent',
                }}
                onMouseEnter={e => { if (selectedIndex !== i) e.currentTarget.style.background = '#F8FAFC'; }}
                onMouseLeave={e => { if (selectedIndex !== i) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB' }}>{sop.id}</span>
                  <span className={`badge ${sop.status === 'فعال' ? 'badge-green' : 'badge-amber'}`} style={{ fontSize: '0.65rem' }}>{sop.status}</span>
                </div>
                <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0F172A', margin: '0 0 0.3rem' }}>{sop.title}</p>
                <p style={{ fontSize: '0.72rem', color: '#94A3B8', margin: 0 }}>مراجعة: {sop.lastUpdated}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SOP details and action */}
        <div className="card anim-up d2" style={{ animationDelay: '0.1s' }}>
          <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span className="badge badge-blue">{currentSOP.id}</span>
                <span className={`badge ${currentSOP.status === 'فعال' ? 'badge-green' : 'badge-amber'}`}>{currentSOP.status}</span>
                <span className="badge badge-slate">{currentSOP.version}</span>
              </div>
              <h2 style={{ fontWeight: 800, fontSize: '1.5rem', margin: '0 0 0.75rem', color: '#0F172A' }}>{currentSOP.title}</h2>
              
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                {[
                  { icon: FileText, label: 'القسم المسؤول', val: currentSOP.owner },
                  { icon: Clock, label: 'آخر مراجعة', val: currentSOP.lastUpdated },
                  { icon: AlertTriangle, label: 'الأولوية', val: currentSOP.priority },
                ].map((m, idx) => {
                  const Icon = m.icon;
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: '#64748B' }}>
                      <Icon size={14} color="#94A3B8" /> <span style={{ fontWeight: 600 }}>{m.label}:</span> {m.val}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <button className="btn btn-primary" onClick={startPlaybook} style={{ background: '#059669', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 12px rgba(5,150,105,0.2)' }}>
              <Play size={14} fill="white" /> تشغيل الإجراء تفاعلياً
            </button>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', marginBottom: '1.5rem' }}>
            <button style={tabStyle('content')} onClick={() => setActiveTab('content')}>خطوات التطبيق القياسية</button>
            <button style={tabStyle('cases')} onClick={() => setActiveTab('cases')}>سجل البلاغات المرتبطة</button>
          </div>

          {activeTab === 'content' && (
            <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {currentSOP.steps && currentSOP.steps.map((step, idx) => (
                <div 
                  key={idx} 
                  style={{ display: 'flex', gap: '1rem', padding: '1.25rem', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #F1F5F9', transition: 'all 0.2s', cursor: 'default' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.borderColor = '#F1F5F9'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#2563EB', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.875rem', flexShrink: 0 }}>{idx + 1}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0F172A', margin: '0 0 0.35rem' }}>{step.title}</p>
                    <p style={{ fontSize: '0.875rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>{step.desc}</p>
                    {step.warning && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: '#FEF3C7', borderRadius: '8px', fontSize: '0.75rem', color: '#D97706', fontWeight: 700 }}>
                        <AlertTriangle size={14} /> تنبيه: {step.warning}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'cases' && (
            <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {currentSOP.relatedCases && currentSOP.relatedCases.length > 0 ? (
                currentSOP.relatedCases.map((c, i) => (
                  <div key={i} style={{ padding: '1rem', borderRadius: '10px', background: '#FEF2F2', border: '1px solid #FECACA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#DC2626', margin: '0 0 0.25rem' }}>{c.id}</p>
                      <p style={{ fontSize: '0.875rem', color: '#0F172A', margin: 0, fontWeight: 500 }}>{c.title}</p>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>المُبلغ: {c.reporter}</span>
                  </div>
                ))
              ) : (
                <p style={{ color: '#64748B', textAlign: 'center', padding: '2rem', fontSize: '0.875rem' }}>لا توجد مشاكل معلقة أو بلاغات مرتبطة بهذا الإجراء.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SOPs;
