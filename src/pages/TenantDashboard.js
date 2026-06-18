import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TenantDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [savedProps, setSavedProps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'tenant') { navigate('/landlord-dashboard'); return; }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    const [bRes, uRes] = await Promise.all([
      fetch(`http://localhost:3001/bookings?tenantId=${user.id}`),
      fetch(`http://localhost:3001/users/${user.id}`)
    ]);
    const bData = await bRes.json();
    const uData = await uRes.json();
    setBookings(bData);

    if (uData.savedProperties?.length > 0) {
      const propRes = await Promise.all(uData.savedProperties.map(id => fetch(`http://localhost:3001/properties/${id}`).then(r => r.json())));
      setSavedProps(propRes.filter(p => p.id));
    }
    setLoading(false);
  };

  const cancelBooking = async (id) => {
    await fetch(`http://localhost:3001/bookings/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' })
    });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
  };

  const removeSaved = async (propId) => {
    const updated = (user.savedProperties || []).filter(id => id !== propId);
    await fetch(`http://localhost:3001/users/${user.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ savedProperties: updated })
    });
    setSavedProps(prev => prev.filter(p => p.id !== propId));
  };

  const statusColor = { pending: 'badge-warning', confirmed: 'badge-success', cancelled: 'badge-danger' };

  if (!user) return null;

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">My Dashboard</h1>
            <p style={{color:'var(--text-secondary)'}}>Welcome back, {user.name}! 👋</p>
          </div>
          <div style={{display:'flex', gap:10}}>
            <Link to="/properties" className="btn btn-primary">🔍 Browse Properties</Link>
            <button onClick={() => { logout(); navigate('/'); }} className="btn btn-outline">Logout</button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-value">{bookings.length}</div>
            <div className="stat-label">Total Bookings</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{bookings.filter(b => b.status === 'confirmed').length}</div>
            <div className="stat-label">Confirmed</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-value">{bookings.filter(b => b.status === 'pending').length}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">❤️</div>
            <div className="stat-value">{savedProps.length}</div>
            <div className="stat-label">Saved Properties</div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="card" style={{padding:24, marginBottom:24}}>
          <h3 style={{marginBottom:16}}>My Profile</h3>
          <div style={{display:'flex', gap:24, flexWrap:'wrap'}}>
            <div style={{display:'flex', alignItems:'center', gap:16}}>
              <div style={{width:64, height:64, borderRadius:'50%', background:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'1.5rem', fontWeight:700}}>{user.name.charAt(0)}</div>
              <div>
                <div style={{fontWeight:700, fontSize:'1.1rem'}}>{user.name}</div>
                <div style={{color:'var(--text-secondary)', fontSize:'0.875rem'}}>📧 {user.email}</div>
                <div style={{color:'var(--text-secondary)', fontSize:'0.875rem'}}>📞 {user.phone}</div>
              </div>
            </div>
            <div style={{marginLeft:'auto', display:'flex', alignItems:'center'}}>
              <span className="badge badge-primary" style={{fontSize:'0.85rem', padding:'6px 14px'}}>🏠 Tenant Account</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab-btn ${tab === 'bookings' ? 'active' : ''}`} onClick={() => setTab('bookings')}>📅 My Bookings ({bookings.length})</button>
          <button className={`tab-btn ${tab === 'saved' ? 'active' : ''}`} onClick={() => setTab('saved')}>❤️ Saved Properties ({savedProps.length})</button>
        </div>

        {loading ? <div className="loading"><div className="spinner"></div></div> : (
          <>
            {tab === 'bookings' && (
              bookings.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📅</div>
                  <h3>No bookings yet</h3>
                  <p>Browse properties and book a visit to get started</p>
                  <Link to="/properties" className="btn btn-primary" style={{marginTop:16}}>Browse Properties</Link>
                </div>
              ) : (
                <div className="table-wrapper card" style={{padding:0}}>
                  <table>
                    <thead>
                      <tr>
                        <th>Property</th>
                        <th>Visit Date</th>
                        <th>Landlord</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(b => (
                        <tr key={b.id}>
                          <td>
                            <Link to={`/properties/${b.propertyId}`} style={{color:'var(--primary-light)', fontWeight:600, textDecoration:'none'}}>
                              View Property #{b.propertyId}
                            </Link>
                            <div style={{fontSize:'0.75rem', color:'var(--text-muted)'}}>Booked: {b.createdAt}</div>
                          </td>
                          <td>{b.visitDate || 'Not specified'}</td>
                          <td style={{fontSize:'0.875rem'}}>{b.tenantEmail}</td>
                          <td><span className={`badge ${statusColor[b.status] || 'badge-primary'}`}>{b.status}</span></td>
                          <td>
                            {b.status === 'pending' && (
                              <button onClick={() => cancelBooking(b.id)} className="btn btn-danger btn-sm">Cancel</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}

            {tab === 'saved' && (
              savedProps.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">❤️</div>
                  <h3>No saved properties</h3>
                  <p>Click the heart icon on any property to save it</p>
                  <Link to="/properties" className="btn btn-primary" style={{marginTop:16}}>Browse Properties</Link>
                </div>
              ) : (
                <div className="grid-3">
                  {savedProps.map(p => (
                    <div key={p.id} className="card">
                      <img src={p.images?.[0]} alt={p.title} style={{width:'100%', height:160, objectFit:'cover'}} onError={e => e.target.src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400'} />
                      <div style={{padding:16}}>
                        <h4 style={{marginBottom:4}}>{p.title}</h4>
                        <p style={{fontSize:'0.8rem', color:'var(--text-secondary)', marginBottom:8}}>📍 {p.location}</p>
                        <div style={{fontWeight:700, color:'var(--accent)', marginBottom:12}}>₹{p.price?.toLocaleString()}/mo</div>
                        <div style={{display:'flex', gap:8}}>
                          <Link to={`/properties/${p.id}`} className="btn btn-primary btn-sm" style={{flex:1, justifyContent:'center'}}>View</Link>
                          <button onClick={() => removeSaved(p.id)} className="btn btn-sm" style={{background:'#fee2e2', color:'#b91c1c'}}>Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TenantDashboard;
