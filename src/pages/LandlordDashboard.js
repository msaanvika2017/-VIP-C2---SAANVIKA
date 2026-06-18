import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertyContext';

const LandlordDashboard = () => {
  const { user, logout } = useAuth();
  const { properties, deleteProperty } = useProperties();
  const navigate = useNavigate();
  const [tab, setTab] = useState('listings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const myProperties = properties.filter(p => p.landlordId === user?.id);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'landlord') { navigate('/tenant-dashboard'); return; }
    fetch(`http://localhost:3001/bookings?landlordId=${user.id}`)
      .then(r => r.json())
      .then(data => { setBookings(data); setLoading(false); });
  }, [user]);

  const updateBookingStatus = async (id, status) => {
    await fetch(`http://localhost:3001/bookings/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      await deleteProperty(id);
    }
  };

  const toggleAvailability = async (prop) => {
    await fetch(`http://localhost:3001/properties/${prop.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available: !prop.available })
    });
    window.location.reload();
  };

  const statusColor = { pending: 'badge-warning', confirmed: 'badge-success', cancelled: 'badge-danger' };

  if (!user) return null;

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Landlord Dashboard</h1>
            <p style={{color:'var(--text-secondary)'}}>Manage your properties and bookings, {user.name}! 🔑</p>
          </div>
          <div style={{display:'flex', gap:10}}>
            <Link to="/add-property" className="btn btn-accent">+ Add New Property</Link>
            <button onClick={() => { logout(); navigate('/'); }} className="btn btn-outline">Logout</button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🏠</div>
            <div className="stat-value">{myProperties.length}</div>
            <div className="stat-label">Total Properties</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{myProperties.filter(p => p.available).length}</div>
            <div className="stat-label">Available</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-value">{bookings.length}</div>
            <div className="stat-label">Total Requests</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-value">{bookings.filter(b => b.status === 'pending').length}</div>
            <div className="stat-label">Pending Requests</div>
          </div>
        </div>

        {/* Profile */}
        <div className="card" style={{padding:24, marginBottom:24}}>
          <h3 style={{marginBottom:16}}>My Profile</h3>
          <div style={{display:'flex', alignItems:'center', gap:16}}>
            <div style={{width:64, height:64, borderRadius:'50%', background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'1.5rem', fontWeight:700}}>{user.name.charAt(0)}</div>
            <div>
              <div style={{fontWeight:700, fontSize:'1.1rem'}}>{user.name}</div>
              <div style={{color:'var(--text-secondary)', fontSize:'0.875rem'}}>📧 {user.email}</div>
              <div style={{color:'var(--text-secondary)', fontSize:'0.875rem'}}>📞 {user.phone}</div>
            </div>
            <div style={{marginLeft:'auto'}}>
              <span className="badge badge-accent" style={{fontSize:'0.85rem', padding:'6px 14px'}}>🔑 Landlord Account</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab-btn ${tab === 'listings' ? 'active' : ''}`} onClick={() => setTab('listings')}>🏠 My Listings ({myProperties.length})</button>
          <button className={`tab-btn ${tab === 'bookings' ? 'active' : ''}`} onClick={() => setTab('bookings')}>📅 Booking Requests ({bookings.length})</button>
        </div>

        {loading ? <div className="loading"><div className="spinner"></div></div> : (
          <>
            {tab === 'listings' && (
              myProperties.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🏠</div>
                  <h3>No properties listed yet</h3>
                  <p>Add your first property to start receiving tenant requests</p>
                  <Link to="/add-property" className="btn btn-accent" style={{marginTop:16}}>+ Add Property</Link>
                </div>
              ) : (
                <div className="card" style={{padding:0}}>
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>Property</th>
                          <th>Location</th>
                          <th>Price/Month</th>
                          <th>Type</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myProperties.map(p => (
                          <tr key={p.id}>
                            <td>
                              <div style={{display:'flex', alignItems:'center', gap:10}}>
                                <img src={p.images?.[0]} alt={p.title} style={{width:48, height:36, objectFit:'cover', borderRadius:6}} onError={e => e.target.style.display='none'} />
                                <div>
                                  <div style={{fontWeight:600}}>{p.title}</div>
                                  <div style={{fontSize:'0.75rem', color:'var(--text-muted)'}}>{p.bedrooms}BHK · {p.area} sqft</div>
                                </div>
                              </div>
                            </td>
                            <td style={{fontSize:'0.875rem'}}>{p.location}</td>
                            <td style={{fontWeight:700, color:'var(--accent)'}}>₹{p.price?.toLocaleString()}</td>
                            <td><span className="badge badge-primary">{p.type}</span></td>
                            <td>
                              <button onClick={() => toggleAvailability(p)} className={`badge ${p.available ? 'badge-success' : 'badge-danger'}`} style={{border:'none', cursor:'pointer'}}>
                                {p.available ? '✓ Available' : '✗ Rented'}
                              </button>
                            </td>
                            <td>
                              <div style={{display:'flex', gap:6}}>
                                <Link to={`/properties/${p.id}`} className="btn btn-sm btn-outline">View</Link>
                                <Link to={`/edit-property/${p.id}`} className="btn btn-sm btn-primary">Edit</Link>
                                <button onClick={() => handleDelete(p.id)} className="btn btn-sm btn-danger">Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            )}

            {tab === 'bookings' && (
              bookings.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📅</div>
                  <h3>No booking requests yet</h3>
                  <p>Once tenants request to visit your properties, they'll appear here</p>
                </div>
              ) : (
                <div className="card" style={{padding:0}}>
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>Tenant</th>
                          <th>Property</th>
                          <th>Visit Date</th>
                          <th>Message</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map(b => (
                          <tr key={b.id}>
                            <td>
                              <div style={{fontWeight:600}}>{b.tenantName}</div>
                              <div style={{fontSize:'0.75rem', color:'var(--text-muted)'}}>📧 {b.tenantEmail}</div>
                              <div style={{fontSize:'0.75rem', color:'var(--text-muted)'}}>📞 {b.tenantPhone}</div>
                            </td>
                            <td><Link to={`/properties/${b.propertyId}`} style={{color:'var(--primary-light)', textDecoration:'none', fontWeight:600}}>Property #{b.propertyId}</Link></td>
                            <td>{b.visitDate || '—'}</td>
                            <td style={{fontSize:'0.8rem', maxWidth:160, color:'var(--text-secondary)'}}>{b.message || '—'}</td>
                            <td><span className={`badge ${statusColor[b.status] || 'badge-primary'}`}>{b.status}</span></td>
                            <td>
                              {b.status === 'pending' && (
                                <div style={{display:'flex', gap:6}}>
                                  <button onClick={() => updateBookingStatus(b.id, 'confirmed')} className="btn btn-success btn-sm">✓ Confirm</button>
                                  <button onClick={() => updateBookingStatus(b.id, 'cancelled')} className="btn btn-danger btn-sm">✗ Decline</button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LandlordDashboard;
