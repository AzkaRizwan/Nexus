import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, CircleDollarSign, Building2, LogIn, AlertCircle, Shield, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

type Step = 'credentials' | '2fa';

export const LoginPage: React.FC = () => {
  const [step, setStep] = useState<Step>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('entrepreneur');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState<string | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    // Simulate checking credentials then go to 2FA step
    setTimeout(() => {
      setIsLoading(false);
      setStep('2fa');
    }, 900);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async () => {
    const code = otp.join('');
    if (code.length < 6) { setOtpError('Please enter all 6 digits'); return; }
    setOtpError(null);
    setIsLoading(true);
    try {
      await login(email, password, role);
      navigate(role === 'entrepreneur' ? '/dashboard/entrepreneur' : '/dashboard/investor');
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
      setStep('credentials');
    }
  };

  const fillDemoCredentials = (userRole: UserRole) => {
    setEmail(userRole === 'entrepreneur' ? 'sarah@techwave.io' : 'michael@vcinnovate.com');
    setPassword('password123');
    setRole(userRole);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: '8px',
    border: '1px solid #e2e8f0', fontSize: '14px',
    boxSizing: 'border-box', outline: 'none', background: '#fff',
    color: '#0f172a',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Inter, sans-serif' }}>

      {/* Logo */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" />
            <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" />
          </svg>
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Business Nexus</h1>
        <p style={{ color: '#64748b', margin: '6px 0 0', fontSize: '14px' }}>Connect with investors and entrepreneurs</p>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        {['Credentials', '2FA Verification'].map((s, i) => (
          <React.Fragment key={s}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700,
                background: (step === 'credentials' && i === 0) || (step === '2fa' && i <= 1) ? '#6366f1' : '#e2e8f0',
                color: (step === 'credentials' && i === 0) || (step === '2fa' && i <= 1) ? '#fff' : '#94a3b8',
              }}>{i + 1}</div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: (step === 'credentials' && i === 0) || (step === '2fa') ? '#6366f1' : '#94a3b8' }}>{s}</span>
            </div>
            {i === 0 && <ChevronRight size={14} color="#94a3b8" />}
          </React.Fragment>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', padding: '36px', width: '100%', maxWidth: '440px' }}>

        {/* ── STEP 1: CREDENTIALS ── */}
        {step === 'credentials' && (
          <>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: '0 0 24px' }}>Sign in to your account</h2>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={16} color="#dc2626" />
                <span style={{ fontSize: '13px', color: '#dc2626' }}>{error}</span>
              </div>
            )}

            {/* Role selector */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>I am a</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {([['entrepreneur', Building2, 'Entrepreneur'], ['investor', CircleDollarSign, 'Investor']] as const).map(([r, Icon, label]) => (
                  <button key={r} type="button" onClick={() => setRole(r)} style={{
                    padding: '12px', borderRadius: '10px', border: `2px solid ${role === r ? '#6366f1' : '#e2e8f0'}`,
                    background: role === r ? '#f5f3ff' : '#f8fafc', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    color: role === r ? '#6366f1' : '#64748b', fontWeight: 600, fontSize: '14px', transition: 'all 0.2s',
                  }}>
                    <Icon size={16} />{label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCredentialsSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Email address</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={{ ...inputStyle, paddingLeft: '38px' }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ ...inputStyle, paddingRight: '40px' }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#374151', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ accentColor: '#6366f1' }} /> Remember me
                </label>
                <Link to="/forgot-password" style={{ fontSize: '13px', color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>Forgot password?</Link>
              </div>

              <button type="submit" disabled={isLoading} style={{
                width: '100%', padding: '13px', borderRadius: '10px', border: 'none',
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff',
                fontWeight: 700, fontSize: '15px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}>
                {isLoading ? 'Verifying...' : <><LogIn size={16} /> Continue to 2FA</>}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0 16px' }}>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Demo Accounts</span>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              {([['entrepreneur', Building2, 'Entrepreneur Demo'] as const, ['investor', CircleDollarSign, 'Investor Demo'] as const]).map(([r, Icon, label]) => (
                <button key={r} onClick={() => fillDemoCredentials(r)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#374151', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <Icon size={14} />{label}
                </button>
              ))}
            </div>

            <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', margin: 0 }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link>
            </p>
          </>
        )}

        {/* ── STEP 2: 2FA OTP ── */}
        {step === '2fa' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Shield size={28} color="#6366f1" />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>Two-Factor Authentication</h2>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                A 6-digit code was sent to<br />
                <strong style={{ color: '#0f172a' }}>{email}</strong>
              </p>
            </div>

            {otpError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={16} color="#dc2626" />
                <span style={{ fontSize: '13px', color: '#dc2626' }}>{otpError}</span>
              </div>
            )}

            {/* OTP input boxes */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '28px' }}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  style={{
                    width: '48px', height: '56px', textAlign: 'center', fontSize: '22px', fontWeight: 700,
                    borderRadius: '10px', border: `2px solid ${digit ? '#6366f1' : '#e2e8f0'}`,
                    background: digit ? '#f5f3ff' : '#f8fafc', outline: 'none', color: '#0f172a',
                    transition: 'all 0.15s',
                  }}
                />
              ))}
            </div>

            {/* Demo hint */}
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>Demo hint: enter any 6 digits to continue</span>
            </div>

            <button onClick={handleOtpSubmit} disabled={isLoading} style={{
              width: '100%', padding: '13px', borderRadius: '10px', border: 'none',
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff',
              fontWeight: 700, fontSize: '15px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
              {isLoading ? 'Signing in...' : <><Shield size={16} /> Verify & Sign In</>}
            </button>

            <button onClick={() => { setStep('credentials'); setOtp(['', '', '', '', '', '']); }} style={{ width: '100%', marginTop: '12px', padding: '11px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
              ← Back
            </button>

            <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: '16px' }}>
              Didn't receive a code?{' '}
              <button style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: 600, fontSize: '13px', cursor: 'pointer', padding: 0 }}>Resend</button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};