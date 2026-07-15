import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, Phone, UserPlus, AlertCircle, Shield, Key } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('tenant'); // tenant or admin
  const [formError, setFormError] = useState('');

  const { register, user, error, setError } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
    return () => setError(null);
  }, [user, navigate, setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name || !email || !password || !phone) {
      setFormError('All fields are required.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    const result = await register(name, email, password, phone, role);
    if (!result.success) {
      setFormError(result.error);
    }
  };

  return (
    <div class="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
      {/* Background gradients */}
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div class="sm:mx-auto sm:w-full sm:max-w-lg z-10">
        <h2 class="text-center text-4xl font-extrabold text-white tracking-tight font-sans">
          Create an account
        </h2>
        <p class="mt-2 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" class="font-semibold text-primary-400 hover:text-primary-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-lg z-10 px-4 sm:px-0">
        <div class="glass-panel py-8 px-6 sm:px-10 rounded-2xl shadow-premium border border-slate-800">
          <form class="space-y-5" onSubmit={handleSubmit}>
            {formError && (
              <div class="bg-rose-950/40 border border-rose-900/50 rounded-xl p-4 flex items-start space-x-2 text-rose-300 text-sm">
                <AlertCircle class="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            {/* Role Selection Switch */}
            <div>
              <label class="block text-sm font-semibold text-slate-300 mb-2">
                I want to join as a:
              </label>
              <div class="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('tenant')}
                  class={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all ${
                    role === 'tenant'
                      ? 'bg-primary-950/30 border-primary-500/80 text-white shadow-md'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <User class={`h-6 w-6 mb-1 ${role === 'tenant' ? 'text-primary-400' : 'text-slate-500'}`} />
                  <span class="font-semibold text-sm">Tenant</span>
                  <span class="text-[10px] text-slate-400 mt-0.5">Rent properties</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  class={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all ${
                    role === 'admin'
                      ? 'bg-primary-950/30 border-primary-500/80 text-white shadow-md'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Shield class={`h-6 w-6 mb-1 ${role === 'admin' ? 'text-primary-400' : 'text-slate-500'}`} />
                  <span class="font-semibold text-sm">Admin</span>
                  <span class="text-[10px] text-slate-400 mt-0.5">List & manage properties</span>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="name" class="block text-sm font-semibold text-slate-300">
                Full Name
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User class="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  class="glass-input block w-full pl-10 pr-3 py-2.5 sm:text-sm rounded-xl"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" class="block text-sm font-semibold text-slate-300">
                Email Address
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail class="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  class="glass-input block w-full pl-10 pr-3 py-2.5 sm:text-sm rounded-xl"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" class="block text-sm font-semibold text-slate-300">
                Phone Number
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone class="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="phone"
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  class="glass-input block w-full pl-10 pr-3 py-2.5 sm:text-sm rounded-xl"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" class="block text-sm font-semibold text-slate-300">
                Password
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock class="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  class="glass-input block w-full pl-10 pr-3 py-2.5 sm:text-sm rounded-xl"
                  placeholder="At least 6 characters"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                class="w-full flex justify-center items-center space-x-2 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-xl border border-primary-500/20 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-slate-900"
              >
                <UserPlus class="h-5 w-5" />
                <span>Register</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
