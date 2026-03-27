import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, CircleDollarSign, Building2, AlertCircle, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface StrengthRule {
  label: string;
  test: (p: string) => boolean;
}

const strengthRules: StrengthRule[] = [
  { label: 'At least 8 characters', test: p => p.length >= 8 },
  { label: 'Contains uppercase letter', test: p => /[A-Z]/.test(p) },
  { label: 'Contains lowercase letter', test: p => /[a-z]/.test(p) },
  { label: 'Contains a number', test: p => /\d/.test(p) },
  { label: 'Contains special character', test: p => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

const getStrength = (password: string) => {
  const passed = strengthRules.filter(r => r.test(password)).length;
  if (passed === 0) return { score: 0, label: '', color: '#e2e8f0' };
  if (passed <= 2) return { score: 1, label: 'Weak', color: '#ef4444' };
  if (passed === 3) return { score: 2, label: 'Fair', color: '#f59e0b' };
  if (passed === 4) return { score: 3, label: 'Good', color: '#6366f1' };
  return { score: 4, label: 'Strong', color: '#22c55e' };
};

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [role, setRole] = useState<UserRole>('entrepreneur');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const strength = getStrength(password);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (strength.score < 2) { setError('Please choose a stronger password'); return; }
    setIsLoading(true);
    try {
      await register(name, email, password, role);
      navigate(role === 'entrepreneur' ? '/dashboard/entrepreneur' : '/dashboard/investor');
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: '8px',
    border: '1px solid #e2e8f0', fontSize: '14px',
    boxSizing: 'border-box', outline: 'none', background: '#fff', color: '#0f172a',
  };
  const labelStyle: React.CSSProperties = { fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' };

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
        <p style={{ color: '#64748b', margin: '6px 0 0', fontSize: '14px' }}>Join the platform to connect with partners</p>
      </div>

      <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', padding: '36px', width: '100%', maxWidth: '460px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: '0 0 24px' }}>Create your account</h2>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={16} color="#dc2626" />
            <span style={{ fontSize: '13px', color: '#dc2626' }}>{error}</span>
          </div>
        )}

        {/* Role selector */}
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>I am registering as a</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {([['entrepreneur', Building2, 'Entrepreneur'] as const, ['investor', CircleDollarSign, 'Investor'] as const]).map(([r, Icon, label]) => (
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

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>

            {/* Full name */}
            <div>
              <label style={labelStyle}>Full name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" style={{ ...inputStyle, paddingLeft: '38px' }} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={{ ...inputStyle, paddingLeft: '38px' }} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ ...inputStyle, paddingLeft: '38px', paddingRight: '40px' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Strength meter */}
              {password.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} style={{ flex: 1, height: '4px', borderRadius: '4px', background: i <= strength.score ? strength.color : '#e2e8f0', transition: 'all 0.3s' }} />
                    ))}
                    {strength.label && (
                      <span style={{ fontSize: '11px', fontWeight: 700, color: strength.color, marginLeft: '8px', whiteSpace: 'nowrap' }}>{strength.label}</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {strengthRules.map(rule => {
                      const passed = rule.test(password);
                      return (
                        <div key={rule.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {passed
                            ? <CheckCircle size={12} color="#22c55e" />
                            : <XCircle size={12} color="#e2e8f0" />}
                          <span style={{ fontSize: '11px', color: passed ? '#16a34a' : '#94a3b8' }}>{rule.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label style={labelStyle}>Confirm password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingLeft: '38px', paddingRight: '40px', borderColor: passwordsMismatch ? '#fca5a5' : passwordsMatch ? '#86efac' : '#e2e8f0' }}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordsMismatch && <p style={{ fontSize: '12px', color: '#dc2626', margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}><XCircle size={12} /> Passwords do not match</p>}
              {passwordsMatch && <p style={{ fontSize: '12px', color: '#16a34a', margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12} /> Passwords match</p>}
            </div>
          </div>

          {/* Terms */}
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#374151', cursor: 'pointer', marginBottom: '20px' }}>
            <input type="checkbox" required checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} style={{ accentColor: '#6366f1', marginTop: '2px', flexShrink: 0 }} />
            <span>I agree to the <a href="#" style={{ color: '#6366f1', fontWeight: 600 }}>Terms of Service</a> and <a href="#" style={{ color: '#6366f1', fontWeight: 600 }}>Privacy Policy</a></span>
          </label>

          <button type="submit" disabled={isLoading || passwordsMismatch} style={{
            width: '100%', padding: '13px', borderRadius: '10px', border: 'none',
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff',
            fontWeight: 700, fontSize: '15px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            opacity: passwordsMismatch ? 0.6 : 1,
          }}>
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: '20px', marginBottom: 0 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};