import React, { useState } from 'react';
import './TwoFactorAuth.css';

export default function TwoFactorAuth() {
  const [step, setStep] = useState('setup'); // setup, verify, backup, confirm
  const [otpCode, setOtpCode] = useState('');
  const [qrCode] = useState('QR_CODE_PLACEHOLDER');
  const [backupCodes] = useState([
    '1234-5678-9012',
    '3456-7890-1234',
    '5678-9012-3456',
    '7890-1234-5678',
    '9012-3456-7890'
  ]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);

  const handleSetupClick = () => {
    setStep('verify');
  };

  const handleVerifyOTP = () => {
    setVerificationLoading(true);
    setTimeout(() => {
      if (otpCode.length === 6) {
        setStep('backup');
      } else {
        alert('أدخل كود OTP صحيح (6 أرقام)');
      }
      setVerificationLoading(false);
    }, 1500);
  };

  const handleConfirmBackup = () => {
    setStep('confirm');
  };

  const handleFinish = () => {
    setIsEnabled(true);
    setStep('setup');
    setOtpCode('');
    alert('تم تفعيل المصادقة الثنائية بنجاح! ✅');
  };

  const downloadBackupCodes = () => {
    const content = `رموز النسخ الاحتياطية - 2FA
============================
${backupCodes.join('\n')}

تاريخ الإنشاء: ${new Date().toLocaleString('ar-EG')}
احفظ هذه الرموز في مكان آمن. يمكنك استخدام كل رمز مرة واحدة فقط إذا فقدت وصول التطبيق.`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '2fa-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="two-factor-auth">
      <h2>المصادقة الثنائية 🔐</h2>

      {isEnabled ? (
        <div className="status-enabled">
          <div className="status-icon">✅</div>
          <h3>المصادقة الثنائية مُفعّلة</h3>
          <p>حسابك محمي بمصادقة ثنائية قوية</p>
          <button className="btn-danger" onClick={() => {
            setIsEnabled(false);
            alert('تم تعطيل المصادقة الثنائية');
          }}>
            تعطيل 2FA
          </button>
        </div>
      ) : (
        <>
          {step === 'setup' && (
            <div className="setup-step">
              <div className="step-icon">1️⃣</div>
              <h3>إعداد المصادقة الثنائية</h3>
              <p>احم حسابك بطبقة أمان إضافية</p>
              <div className="setup-benefits">
                <div className="benefit">
                  <span className="benefit-icon">🔒</span>
                  <h4>أمان أقوى</h4>
                  <p>تقليل مخاطر الوصول غير المصرح</p>
                </div>
                <div className="benefit">
                  <span className="benefit-icon">📱</span>
                  <h4>تطبيق الهاتف</h4>
                  <p>استخدم تطبيق المصادقة على هاتفك</p>
                </div>
                <div className="benefit">
                  <span className="benefit-icon">🔑</span>
                  <h4>رموز احتياطية</h4>
                  <p>رموز للوصول في حالات الطوارئ</p>
                </div>
              </div>
              <button className="btn-primary" onClick={handleSetupClick}>
                البدء في الإعداد
              </button>
            </div>
          )}

          {step === 'verify' && (
            <div className="verify-step">
              <div className="step-icon">2️⃣</div>
              <h3>مسح رمز QR</h3>
              
              <div className="qr-section">
                <div className="qr-code-placeholder">
                  📱 {qrCode}
                </div>
                <p className="qr-instruction">
                  استخدم تطبيق المصادقة (Google Authenticator, Microsoft Authenticator, إلخ)
                </p>
              </div>

              <div className="otp-input-section">
                <label>أدخل الكود من التطبيق:</label>
                <div className="otp-input-group">
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <input
                      key={i}
                      type="text"
                      maxLength="1"
                      placeholder="0"
                      value={otpCode[i] || ''}
                      onChange={(e) => {
                        const newCode = otpCode.split('');
                        newCode[i] = e.target.value.replace(/[^0-9]/g, '');
                        setOtpCode(newCode.join(''));
                        
                        // التركيز على الخانة التالية
                        if (e.target.value && i < 5) {
                          e.target.nextSibling?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !otpCode[i] && i > 0) {
                          e.target.previousSibling?.focus();
                        }
                      }}
                      className="otp-digit"
                    />
                  ))}
                </div>
              </div>

              <button
                className="btn-primary"
                onClick={handleVerifyOTP}
                disabled={verificationLoading || otpCode.length !== 6}
              >
                {verificationLoading ? 'جاري التحقق...' : 'التحقق'}
              </button>
            </div>
          )}

          {step === 'backup' && (
            <div className="backup-step">
              <div className="step-icon">3️⃣</div>
              <h3>حفظ رموز النسخ الاحتياطية</h3>
              <p>احفظ هذه الرموز في مكان آمن. قد تحتاجها لاحقاً.</p>

              <div className="backup-codes-box">
                <div className="backup-warning">
                  ⚠️ احفظ هذه الرموز في مكان آمن جداً
                </div>
                <div className="backup-codes-list">
                  {backupCodes.map((code, idx) => (
                    <div key={idx} className="backup-code">
                      <span className="code-number">{idx + 1}</span>
                      <span className="code-value">{code}</span>
                      <button
                        className="copy-btn"
                        onClick={() => {
                          navigator.clipboard.writeText(code);
                          alert('تم النسخ');
                        }}
                      >
                        📋
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="backup-actions">
                <button className="btn-secondary" onClick={downloadBackupCodes}>
                  💾 تحميل الرموز
                </button>
                <button className="btn-primary" onClick={handleConfirmBackup}>
                  تم الحفظ
                </button>
              </div>
            </div>
          )}

          {step === 'confirm' && (
            <div className="confirm-step">
              <div className="step-icon">✨</div>
              <h3>تم الانتهاء!</h3>
              <p>حسابك الآن محمي بالمصادقة الثنائية</p>

              <div className="confirm-summary">
                <div className="summary-item">
                  <span className="item-icon">✅</span>
                  <span>تطبيق المصادقة متصل</span>
                </div>
                <div className="summary-item">
                  <span className="item-icon">✅</span>
                  <span>تم حفظ رموز النسخة الاحتياطية</span>
                </div>
                <div className="summary-item">
                  <span className="item-icon">✅</span>
                  <span>المصادقة الثنائية فعّالة</span>
                </div>
              </div>

              <button className="btn-primary" onClick={handleFinish}>
                إنهاء الإعداد
              </button>
            </div>
          )}
        </>
      )}

      {/* Active Sessions */}
      {isEnabled && (
        <div className="active-sessions">
          <h4>الأجهزة المفعّلة</h4>
          <div className="session-list">
            <div className="session-item">
              <span className="session-device">💻 Windows - Chrome</span>
              <span className="session-date">آخر نشاط: الآن</span>
              <button className="btn-ghost">تسجيل الخروج</button>
            </div>
            <div className="session-item">
              <span className="session-device">📱 iPhone - Safari</span>
              <span className="session-date">آخر نشاط: منذ ساعة</span>
              <button className="btn-ghost">تسجيل الخروج</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
