import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  
  const { login, user, error, setError } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Get path redirect after login
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    // If logged in, redirect
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from);
      }
    }
    // Clean up global error
    return () => setError(null);
  }, [user, navigate, from, setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    const result = await login(email, password);
    if (!result.success) {
      setFormError(result.error);
    }
  };

  return (
    <div class="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
      {/* Background gradients */}
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div class="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <h2 class="text-center text-4xl font-extrabold text-white tracking-tight font-sans">
          Welcome back
        </h2>
        <p class="mt-2 text-center text-sm text-slate-400">
          Or{' '}
          <Link to="/register" class="font-semibold text-primary-400 hover:text-primary-300 transition-colors">
            create a new account
          </Link>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <div class="glass-panel py-8 px-6 sm:px-10 rounded-2xl shadow-premium border border-slate-800">
          <form class="space-y-6" onSubmit={handleSubmit}>
            {formError && (
              <div class="bg-rose-950/40 border border-rose-900/50 rounded-xl p-4 flex items-start space-x-2 text-rose-300 text-sm">
                <AlertCircle class="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" class="block text-sm font-semibold text-slate-300">
                Email Address
              </label>
              <div class="mt-1.5 relative rounded-md shadow-sm">
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
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" class="block text-sm font-semibold text-slate-300">
                Password
              </label>
              <div class="mt-1.5 relative rounded-md shadow-sm">
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
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                class="w-full flex justify-center items-center space-x-2 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-xl border border-primary-500/20 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-slate-900"
              >
                <LogIn class="h-5 w-5" />
                <span>Sign In</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
