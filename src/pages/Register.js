import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', role: 'tenant' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    const result = await register({ name: form.name, email: form.email, phone: form.phone, password: form.password, role: form.role });
    setLoading(false);
    if (result.success) {
      navigate(result.user.role === 'landlord' ? '/landlord-dashboard' : '/tenant-dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{maxWidth:500}}>
        <div className="auth-logo">
          <div style={{fontSize:'2.5rem', marginBottom:8}}>🏠</div>
          <h2>Create Account</h2>
          <p>Join RentEase — it's free!</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Role Toggle */}
        <div style={{display:'flex', background:'var(--bg)', borderRadius:10, padding:4, marginBottom:24}}>
          {['tenant', 'landlord'].map(r => (
            <button key={r} type="button"
              onClick={() => setForm(p => ({...p, role: r}))}
              style={{flex:1, padding:'10px', border:'none', borderRadius:8, cursor:'pointer', fontWeight:600, fontSize:'0.875rem', transition:'all 0.2s',
                background: form.role === r ? 'var(--primary)' : 'transparent',
                color: form.role === r ? 'white' : 'var(--text-secondary)'
              }}>
              {r === 'tenant' ? '🏠 I\'m a Tenant' : '🔑 I\'m a Landlord'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid-2" style={{gap:12}}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" className="form-control" placeholder="Your full name" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" className="form-control" placeholder="+91-9999999999" value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} required />
            </div>
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" className="form-control" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} required />
          </div>
          <div className="grid-2" style={{gap:12}}>
            <div className="form-group">
              <label>Password</label>
              <input type="password" className="form-control" placeholder="Min 6 characters" value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} required />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" className="form-control" placeholder="Repeat password" value={form.confirmPassword} onChange={e => setForm(p => ({...p, confirmPassword: e.target.value}))} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'100%', justifyContent:'center', padding:'12px', marginTop:4}} disabled={loading}>
            {loading ? 'Creating account...' : `Create ${form.role === 'landlord' ? 'Landlord' : 'Tenant'} Account`}
          </button>
        </form>

        <p style={{textAlign:'center', marginTop:20, fontSize:'0.875rem', color:'var(--text-secondary)'}}>
          Already have an account? <Link to="/login" style={{color:'var(--primary-light)', fontWeight:600}}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
