import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      navigate(result.user.role === 'landlord' ? '/landlord-dashboard' : '/tenant-dashboard');
    } else {
      setError(result.error);
    }
  };

  const fillDemo = (role) => {
    if (role === 'tenant') setForm({ email: 'tenant@demo.com', password: 'tenant123' });
    else setForm({ email: 'landlord@demo.com', password: 'landlord123' });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <div style={{fontSize:'2.5rem', marginBottom:8}}>🏠</div>
          <h2>Welcome Back</h2>
          <p>Sign in to your RentEase account</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" className="form-control" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" placeholder="Enter your password" value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'100%', justifyContent:'center', padding:'12px'}} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider">or use demo accounts</div>
        <div style={{display:'flex', gap:8}}>
          <button onClick={() => fillDemo('tenant')} className="btn btn-outline btn-sm" style={{flex:1, justifyContent:'center'}}>🏠 Tenant Demo</button>
          <button onClick={() => fillDemo('landlord')} className="btn btn-outline btn-sm" style={{flex:1, justifyContent:'center'}}>🔑 Landlord Demo</button>
        </div>

        <p style={{textAlign:'center', marginTop:20, fontSize:'0.875rem', color:'var(--text-secondary)'}}>
          Don't have an account? <Link to="/register" style={{color:'var(--primary-light)', fontWeight:600}}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
