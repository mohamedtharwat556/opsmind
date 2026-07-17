import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Minimize2, Maximize2, Loader } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AIAssistant = () => {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'أهلاً بك! 👋 أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        type: 'bot', 
        text: data.text,
        links: data.links
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        type: 'bot', 
        text: 'عذراً، حدث خطأ في الاتصال. حاول لاحقاً.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button 
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          left: '2rem',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #2563EB, #1E40AF)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(37, 99, 235, 0.3)',
          fontSize: 0,
          zIndex: 40,
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(37, 99, 235, 0.4)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.3)';
        }}
      >
        <MessageCircle size={24} fill="white" />
      </button>
    );
  }

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '2rem',
        width: '420px',
        height: minimized ? 'auto' : '600px',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
        animation: 'slideUp 0.3s cubic-bezier(.22,.68,0,1.2)',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '1.25rem',
        background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
        color: 'white',
        borderRadius: '16px 16px 0 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        <div>
          <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: 700 }}>مساعد ذكي 🤖</h3>
          <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.8 }}>هنا لمساعدتك في أي وقت</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => setMinimized(!minimized)}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {minimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button 
            onClick={() => setOpen(false)}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            background: '#F8FAFC',
          }}>
            {messages.map(msg => (
              <div 
                key={msg.id} 
                style={{
                  display: 'flex',
                  justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  animation: 'fadeIn 0.3s ease',
                }}
              >
                <div style={{
                  maxWidth: '85%',
                  background: msg.type === 'user' ? '#2563EB' : 'white',
                  color: msg.type === 'user' ? 'white' : '#0F172A',
                  padding: '0.875rem 1.125rem',
                  borderRadius: msg.type === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  border: msg.type === 'bot' ? '1px solid #E2E8F0' : 'none',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                }}>
                  {msg.text}
                  {msg.links && msg.links.length > 0 && (
                    <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {msg.links.map((link, i) => (
                        <a 
                          key={i} 
                          href={link.path} 
                          style={{
                            display: 'inline-block',
                            fontSize: '0.8rem',
                            padding: '0.4rem 0.75rem',
                            background: msg.type === 'user' ? 'rgba(255,255,255,0.2)' : '#EFF6FF',
                            color: msg.type === 'user' ? 'white' : '#2563EB',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontWeight: 500,
                            border: msg.type === 'user' ? 'none' : '1px solid #BFDBFE',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.opacity = '0.8';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.opacity = '1';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: 'white', border: '1px solid #E2E8F0', padding: '0.875rem 1.125rem', borderRadius: '12px 12px 12px 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Loader size={16} style={{ animation: 'spin 1s linear infinite', color: '#2563EB' }} />
                  <span style={{ fontSize: '0.875rem', color: '#64748B' }}>جاري الرد...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '1.125rem',
            borderTop: '1px solid #E2E8F0',
            background: 'white',
            borderRadius: '0 0 16px 16px',
            display: 'flex',
            gap: '0.75rem',
            flexShrink: 0,
          }}>
            <input 
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey && input.trim()) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="اكتب سؤالك..."
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = '#2563EB'}
              onBlur={e => e.target.style.borderColor = '#E2E8F0'}
              disabled={loading}
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: input.trim() ? '#2563EB' : '#F1F5F9',
                color: input.trim() ? 'white' : '#94A3B8',
                border: 'none',
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                if (input.trim()) {
                  e.currentTarget.style.background = '#1E40AF';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={e => {
                if (input.trim()) {
                  e.currentTarget.style.background = '#2563EB';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              {loading ? <Loader size={18} className="spin" /> : <Send size={18} />}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AIAssistant;
