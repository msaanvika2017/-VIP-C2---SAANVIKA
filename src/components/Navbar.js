import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          🏠 Rent<span>Ease</span>
        </Link>
        <div className="navbar-nav">
          <Link to="/" className={isActive('/')}>Home</Link>
          <Link to="/properties" className={isActive('/properties')}>Properties</Link>
          <Link to="/about" className={isActive('/about')}>About</Link>
          <Link to="/contact" className={isActive('/contact')}>Contact</Link>
          {!user ? (
            <>
              <Link to="/login" className="btn btn-outline nav-link" style={{marginLeft:8, border:'1.5px solid rgba(255,255,255,0.5)', color:'white', padding:'6px 16px'}}>Login</Link>
              <Link to="/register" className="btn btn-accent btn-sm" style={{marginLeft:4}}>Register</Link>
            </>
          ) : (
            <div className="navbar-user">
              <Link
                to={user.role === 'landlord' ? '/landlord-dashboard' : '/tenant-dashboard'}
                style={{textDecoration:'none', display:'flex', alignItems:'center', gap:8, color:'white'}}
              >
                <div className="user-avatar">{user.name.charAt(0)}</div>
                <span style={{fontSize:'0.85rem', fontWeight:500}}>{user.name.split(' ')[0]}</span>
              </Link>
              {user.role === 'landlord' && (
                <Link to="/add-property" className="btn btn-accent btn-sm">+ List Property</Link>
              )}
              <button onClick={handleLogout} className="btn btn-sm" style={{background:'rgba(255,255,255,0.15)', color:'white', marginLeft:4}}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
