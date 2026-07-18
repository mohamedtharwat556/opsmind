import React, { useState, useEffect } from 'react';
import { Award, Zap, Book, CheckCircle, TrendingUp, Star, Trophy, Target, Gift, ChevronUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LEADERBOARD = [
  { rank: 1, name: 'استاذ ابراهيم', role: 'المدير العام', points: 1500, initials: 'أ.إ', color: '#2563EB' },
  { rank: 2, name: 'محمد ثروت', role: 'رئيس قسم الهندسة', points: 1250, initials: 'م.ث', color: '#7C3AED' },
  { rank: 3, name: 'عبدالله رضا', role: 'مدير منتج', points: 980, initials: 'ع.ر', color: '#059669' },
  { rank: 4, name: 'خالد هيكل', role: 'محاسب أول', points: 450, initials: 'خ.ه', color: '#D97706' },
  { rank: 5, name: 'ادم فاروق', role: 'مهندس دعم فني', points: 640, initials: 'أ.ف', color: '#2563EB', isCurrentUser: true },
  { rank: 6, name: 'تاح', role: 'مهندس DevOps', points: 320, initials: 'ت', color: '#DC2626' },
  { rank: 7, name: 'احمد ماهر', role: 'مسؤول الموارد البشرية', points: 210, initials: 'أ.م', color: '#64748B' },
].sort((a, b) => b.points - a.points).map((u, i) => ({ ...u, rank: i + 1 }));

const NEXT_REWARDS = [
  { points: 750, reward: 'شارة "مساهم متميز"', icon: '🥈', unlocked: false },
  { points: 1000, reward: 'يوم عمل عن بُعد إضافي', icon: '🏠', unlocked: false },
  { points: 1500, reward: 'شارة "خبير عمليات"', icon: '🏆', unlocked: false },
];

const BADGES_DATA = [
  { title: 'صانع إجراءات', desc: 'نشر 3 إجراءات قياسية', color: '#2563EB', bg: '#EFF6FF', icon: Book, earned: true },
  { title: 'حلال المشاكل', desc: 'حل وتوثيق 10 مشاكل', color: '#059669', bg: '#ECFDF5', icon: CheckCircle, earned: true },
  { title: 'أفضل 10%', desc: 'المحافظة على مركز متقدم', color: '#D97706', bg: '#FFFBEB', icon: TrendingUp, earned: true },
  { title: 'مساهم متميز', desc: 'الوصول لـ 750 نقطة', color: '#7C3AED', bg: '#F5F3FF', icon: Star, earned: false },
  { title: 'خبير عمليات', desc: 'الوصول لـ 1000 نقطة', color: '#DC2626', bg: '#FEF2F2', icon: Trophy, earned: false },
];

const CONTRIBUTIONS = [
  { title: 'اقتراح تعديل: SOP-104 إعداد المهندسين الجدد', desc: 'إضافة ملاحظات بخصوص صلاحيات GitHub على خادم الأمان.', status: 'تمت الموافقة', pts: '+50' },
  { title: 'حل المشكلة #392: تأخير تسليم الأجهزة للعملاء', desc: 'توثيق تأخير شركة الشحن وحل مسار التوصيل البديل.', status: 'مكتمل', pts: '+100' },
  { title: 'إنشاء مقال: دليل استكشاف أخطاء VPN وإعداد البريد', desc: 'مقالة استرشادية لقاعدة المعرفة العامة.', status: 'منشور', pts: '+150' },
];

const GamificationBar = ({ current, max, color = '#2563EB' }) => {
  const pct = Math.min((current / max) * 100, 100);
  return (
    <div style={{ width: '100%', height: 10, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden', position: 'relative' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${color}, ${color}bb)`, borderRadius: 99, transition: 'width 1s ease' }} />
    </div>
  );
};

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [animPts, setAnimPts] = useState(0);

  const currentUser = user?.name === 'آدم فاروق' || user?.name === 'ادم فاروق'
    ? LEADERBOARD.find(u => u.isCurrentUser)
    : LEADERBOARD.find(u => u.name === user?.name) || LEADERBOARD.find(u => u.isCurrentUser);

  const pts = currentUser?.points || 640;
  const nextMilestone = NEXT_REWARDS.find(r => r.points > pts);
  const nextPts = nextMilestone?.points || 2000;

  useEffect(() => {
    let start = 0;
    const step = pts / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= pts) { setAnimPts(pts); clearInterval(timer); }
      else setAnimPts(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [pts]);

  const tabs = [
    { id: 'overview', label: 'نظرة عامة' },
    { id: 'leaderboard', label: 'لوحة المتصدرين' },
    { id: 'badges', label: 'الشارات' },
    { id: 'contributions', label: 'المساهمات' },
  ];

  const userRank = LEADERBOARD.findIndex(u => u.isCurrentUser || u.name === user?.name) + 1 || 5;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="page-header anim-up">
        <div>
          <h1>الملف الشخصي</h1>
          <p className="page-sub">إنجازاتك، نقاطك، والمساهمات الفعّالة</p>
        </div>
        <button className="btn btn-primary">تعديل البيانات</button>
      </div>

      {/* Hero Card */}
      <div className="card anim-up d1" style={{ padding: '2rem', background: 'linear-gradient(135deg, #1E293B 0%, #1D4ED8 100%)', color: 'white', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 800, backdropFilter: 'blur(8px)', border: '2px solid rgba(255,255,255,0.3)' }}>
            {currentUser?.initials || 'أ.ف'}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.4rem', fontWeight: 800 }}>{user?.name || 'آدم فاروق'}</h2>
            <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>{user?.role || 'مهندس دعم فني'}</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(255,255,255,0.15)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', backdropFilter: 'blur(4px)' }}>
                🏆 المرتبة #{userRank} في الشركة
              </span>
              <span style={{ background: 'rgba(255,255,255,0.15)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem' }}>
                ⚡ {animPts} نقطة
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: '0 0 0.5rem', opacity: 0.8, fontSize: '0.8rem' }}>التقدم نحو {nextMilestone?.reward || 'الهدف القادم'}</p>
            <div style={{ width: 180 }}>
              <GamificationBar current={pts} max={nextPts} color="#F59E0B" />
              <p style={{ margin: '0.35rem 0 0', opacity: 0.7, fontSize: '0.75rem' }}>{pts} / {nextPts} نقطة</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', background: '#F8FAFC', padding: '0.375rem', borderRadius: '12px', border: '1px solid #E2E8F0', width: 'fit-content' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ padding: '0.5rem 1.25rem', borderRadius: '9px', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, fontFamily: 'inherit', transition: 'all 0.2s',
              background: activeTab === t.id ? 'white' : 'transparent',
              color: activeTab === t.id ? '#0F172A' : '#64748B',
              boxShadow: activeTab === t.id ? '0 1px 4px rgba(0,0,0,0.1)' : 'none'
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="anim-up">
          {/* Quick stats */}
          {[
            { label: 'المساهمات', value: '12', icon: '📝', color: '#2563EB', bg: '#EFF6FF' },
            { label: 'إجراءات منفّذة', value: '8', icon: '✅', color: '#059669', bg: '#ECFDF5' },
            { label: 'مشاكل محلولة', value: '5', icon: '🔧', color: '#D97706', bg: '#FFFBEB' },
            { label: 'شارات مكتسبة', value: '3', icon: '🏅', color: '#7C3AED', bg: '#F5F3FF' },
          ].map((s, i) => (
            <div key={i} className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 48, height: 48, borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{s.icon}</div>
              <div>
                <p style={{ margin: '0 0 0.2rem', fontSize: '1.75rem', fontWeight: 800, color: s.color }}>{s.value}</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>{s.label}</p>
              </div>
            </div>
          ))}

          {/* Next Rewards */}
          <div className="card" style={{ padding: '1.5rem', gridColumn: '1 / -1' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Gift size={16} /> المكافآت القادمة
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {NEXT_REWARDS.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{r.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem', color: pts >= r.points ? '#059669' : '#0F172A' }}>{r.reward}</p>
                      <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>{Math.min(pts, r.points)} / {r.points}</span>
                    </div>
                    <GamificationBar current={pts} max={r.points} color={pts >= r.points ? '#059669' : '#2563EB'} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="card anim-up" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trophy size={16} color="#D97706" /> لوحة المتصدرين - الشركة
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {LEADERBOARD.map((u, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem',
                borderRadius: '12px', border: u.isCurrentUser ? '2px solid #2563EB' : '1px solid #F1F5F9',
                background: u.isCurrentUser ? '#EFF6FF' : (i === 0 ? '#FFFBEB' : 'transparent'),
                position: 'relative', transition: 'all 0.2s'
              }}>
                {u.isCurrentUser && <span style={{ position: 'absolute', top: '-8px', right: '12px', background: '#2563EB', color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>أنت</span>}
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: u.rank === 1 ? '#F59E0B' : u.rank === 2 ? '#94A3B8' : u.rank === 3 ? '#D97706' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.875rem', color: u.rank <= 3 ? 'white' : '#64748B', flexShrink: 0 }}>
                  {u.rank <= 3 ? ['🥇','🥈','🥉'][u.rank - 1] : u.rank}
                </div>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: u.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>{u.initials}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>{u.name}</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B' }}>{u.role}</p>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Zap size={14} fill="#D97706" color="#D97706" />
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: '#D97706' }}>{u.points.toLocaleString()}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: '#94A3B8', textAlign: 'left' }}>نقطة</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'badges' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.25rem' }} className="anim-up">
          {BADGES_DATA.map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem', opacity: b.earned ? 1 : 0.5, filter: b.earned ? 'none' : 'grayscale(100%)' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: b.bg, border: `2px solid ${b.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={28} color={b.color} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A', margin: '0 0 0.35rem' }}>{b.title}</p>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>{b.desc}</p>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.75rem', borderRadius: '20px', background: b.earned ? '#DCFCE7' : '#F1F5F9', color: b.earned ? '#059669' : '#94A3B8' }}>
                  {b.earned ? '✅ مكتسبة' : '🔒 محظورة'}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'contributions' && (
        <div className="card anim-up" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={16} color="#2563EB" /> سجل المساهمات الأخيرة
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {CONTRIBUTIONS.map((c, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderRadius: '10px', border: '1px solid #F1F5F9', background: '#FAFAFA' }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A', margin: '0 0 0.25rem' }}>{c.title}</p>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0 0 0.5rem' }}>{c.desc}</p>
                  <span className="badge badge-green">{c.status}</span>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#10B981', background: '#DCFCE7', padding: '0.3rem 0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <ChevronUp size={14} /> {c.pts}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
