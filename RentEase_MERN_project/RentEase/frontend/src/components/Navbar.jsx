import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Home, User, LayoutDashboard, LogOut, Menu, X, Building } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <nav class="sticky top-0 z-50 glass-panel border-b border-slate-800 shadow-glass backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" class="flex items-center space-x-2 text-primary-400 font-extrabold text-2xl tracking-tight">
            <Building class="h-8 w-8 text-primary-500 hover:rotate-6 transition-transform duration-300" />
            <span class="bg-gradient-to-r from-primary-400 to-indigo-400 bg-clip-text text-transparent">RentHaven</span>
          </Link>

          {/* Desktop Nav */}
          <div class="hidden md:flex items-center space-x-6">
            <Link to="/" class="flex items-center space-x-1 text-slate-300 hover:text-primary-400 transition-colors font-medium">
              <Home class="h-4 w-4" />
              <span>Browse</span>
            </Link>

            {user ? (
              <>
                {user.role === 'admin' ? (
                  <Link to="/admin" class="flex items-center space-x-1 text-slate-300 hover:text-primary-400 transition-colors font-medium">
                    <LayoutDashboard class="h-4 w-4" />
                    <span>Admin Panel</span>
                  </Link>
                ) : (
                  <Link to="/dashboard" class="flex items-center space-x-1 text-slate-300 hover:text-primary-400 transition-colors font-medium">
                    <LayoutDashboard class="h-4 w-4" />
                    <span>My Bookings</span>
                  </Link>
                )}

                <div class="flex items-center space-x-3 pl-4 border-l border-slate-800">
                  <div class="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
                    <User class="h-4 w-4 text-primary-400" />
                    <span class="text-sm font-semibold text-slate-200">{user.name}</span>
                    <span class="text-[10px] bg-primary-600/80 text-white uppercase px-1.5 py-0.5 rounded-full font-bold">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    class="flex items-center space-x-1 text-rose-400 hover:text-rose-300 transition-colors font-medium bg-rose-950/30 hover:bg-rose-950/60 px-3 py-1.5 rounded-full border border-rose-900/30"
                  >
                    <LogOut class="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div class="flex items-center space-x-4">
                <Link
                  to="/login"
                  class="text-slate-300 hover:text-primary-400 font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  class="bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-semibold px-5 py-2 rounded-full border border-primary-500/30 hover:shadow-lg transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div class="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              class="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-primary-400 hover:bg-slate-800 focus:outline-none transition-colors"
            >
              {isOpen ? <X class="h-6 w-6" /> : <Menu class="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div class="md:hidden glass-panel border-b border-slate-800 bg-slate-950/95 absolute w-full left-0 shadow-lg">
          <div class="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              class="flex items-center space-x-2 px-3 py-2.5 rounded-md text-slate-300 hover:text-primary-400 hover:bg-slate-900 font-medium"
            >
              <Home class="h-5 w-5" />
              <span>Browse Properties</span>
            </Link>

            {user ? (
              <>
                {user.role === 'admin' ? (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    class="flex items-center space-x-2 px-3 py-2.5 rounded-md text-slate-300 hover:text-primary-400 hover:bg-slate-900 font-medium"
                  >
                    <LayoutDashboard class="h-5 w-5" />
                    <span>Admin Panel</span>
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    class="flex items-center space-x-2 px-3 py-2.5 rounded-md text-slate-300 hover:text-primary-400 hover:bg-slate-900 font-medium"
                  >
                    <LayoutDashboard class="h-5 w-5" />
                    <span>My Bookings</span>
                  </Link>
                )}

                <div class="pt-4 pb-2 border-t border-slate-800 mt-4 px-3">
                  <div class="flex items-center space-x-2 mb-3">
                    <User class="h-5 w-5 text-primary-400" />
                    <div>
                      <div class="text-sm font-semibold text-slate-200">{user.name}</div>
                      <div class="text-xs text-slate-400 capitalize">{user.role}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    class="flex items-center space-x-2 w-full text-left px-3 py-2.5 rounded-md text-rose-400 hover:bg-rose-950/30 font-medium"
                  >
                    <LogOut class="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div class="grid grid-cols-2 gap-2 pt-4 px-3 border-t border-slate-800">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  class="flex items-center justify-center py-2.5 rounded-md text-slate-300 hover:bg-slate-900 font-medium text-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  class="flex items-center justify-center bg-primary-600 hover:bg-primary-500 text-white font-semibold py-2.5 rounded-md text-center"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
