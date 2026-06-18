import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertyContext';

const AMENITY_OPTIONS = ['Gym', 'Swimming Pool', 'Parking', 'Security', 'Power Backup', 'WiFi', 'AC', 'Washing Machine', 'Lift', 'Garden', 'Clubhouse', 'Modular Kitchen', 'Terrace', 'Generator', 'Water Supply'];

const AddProperty = () => {
  const { user } = useAuth();
  const { addProperty } = useProperties();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', type: 'Apartment', price: '', location: '', bedrooms: 1, bathrooms: 1,
    area: '', furnished: 'Semi-Furnished', available: true, description: '',
    amenities: [], images: ['', '']
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user || user.role !== 'landlord') {
    navigate('/login'); return null;
  }

  const handleAmenity = (a) => setForm(p => ({
    ...p, amenities: p.amenities.includes(a) ? p.amenities.filter(x => x !== a) : [...p.amenities, a]
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.location || !form.description) { setError('Please fill all required fields'); return; }
    setLoading(true);
    const images = form.images.filter(i => i.trim() !== '');
    if (images.length === 0) images.push('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800');
    await addProperty({
      ...form, price: parseInt(form.price), bedrooms: parseInt(form.bedrooms),
      bathrooms: parseInt(form.bathrooms), area: parseInt(form.area),
      images, landlordId: user.id, landlordName: user.name, landlordPhone: user.phone
    });
    setLoading(false);
    navigate('/landlord-dashboard');
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>List a New Property</h1>
          <p>Fill in the details below to publish your property listing</p>
        </div>
      </div>
      <div className="container" style={{paddingBottom:60, maxWidth:860}}>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className="card" style={{padding:28, marginBottom:20}}>
            <h3 style={{marginBottom:20}}>Basic Information</h3>
            <div className="form-group">
              <label>Property Title *</label>
              <input className="form-control" placeholder="e.g. Modern 2BHK Apartment in Banjara Hills" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} required />
            </div>
            <div className="grid-2" style={{gap:16}}>
              <div className="form-group">
                <label>Property Type *</label>
                <select className="form-control" value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value}))}>
                  <option>Apartment</option><option>Villa</option><option>Studio</option><option>Independent House</option>
                </select>
              </div>
              <div className="form-group">
                <label>Monthly Rent (₹) *</label>
                <input type="number" className="form-control" placeholder="e.g. 15000" value={form.price} onChange={e => setForm(p => ({...p, price: e.target.value}))} required />
              </div>
            </div>
            <div className="form-group">
              <label>Location / Address *</label>
              <input className="form-control" placeholder="e.g. Banjara Hills, Hyderabad" value={form.location} onChange={e => setForm(p => ({...p, location: e.target.value}))} required />
            </div>
            <div className="grid-2" style={{gap:16}}>
              {[['bedrooms','Bedrooms',1,10],['bathrooms','Bathrooms',1,6],['area','Area (sqft)','',''],].slice(0,2).map(([k,l,mn,mx]) => (
                <div className="form-group" key={k}>
                  <label>{l} *</label>
                  <input type="number" className="form-control" min={mn} max={mx} value={form[k]} onChange={e => setForm(p => ({...p, [k]: e.target.value}))} required />
                </div>
              ))}
            </div>
            <div className="grid-2" style={{gap:16}}>
              <div className="form-group">
                <label>Area (sqft) *</label>
                <input type="number" className="form-control" placeholder="e.g. 1200" value={form.area} onChange={e => setForm(p => ({...p, area: e.target.value}))} required />
              </div>
              <div className="form-group">
                <label>Furnished Status *</label>
                <select className="form-control" value={form.furnished} onChange={e => setForm(p => ({...p, furnished: e.target.value}))}>
                  <option>Fully Furnished</option><option>Semi-Furnished</option><option>Unfurnished</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Availability</label>
              <select className="form-control" value={form.available} onChange={e => setForm(p => ({...p, available: e.target.value === 'true'}))}>
                <option value="true">Available for Rent</option>
                <option value="false">Currently Rented / Not Available</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="card" style={{padding:28, marginBottom:20}}>
            <h3 style={{marginBottom:20}}>Description</h3>
            <div className="form-group">
              <label>Property Description *</label>
              <textarea className="form-control" rows={5} placeholder="Describe the property, its features, nearby landmarks, transport connections, etc." value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} required />
            </div>
          </div>

          {/* Amenities */}
          <div className="card" style={{padding:28, marginBottom:20}}>
            <h3 style={{marginBottom:20}}>Amenities</h3>
            <div style={{display:'flex', flexWrap:'wrap', gap:10}}>
              {AMENITY_OPTIONS.map(a => (
                <button key={a} type="button" onClick={() => handleAmenity(a)}
                  style={{padding:'8px 16px', borderRadius:20, border:'2px solid', cursor:'pointer', fontWeight:500, fontSize:'0.85rem', transition:'all 0.2s',
                    borderColor: form.amenities.includes(a) ? 'var(--primary)' : 'var(--border)',
                    background: form.amenities.includes(a) ? 'var(--primary)' : 'white',
                    color: form.amenities.includes(a) ? 'white' : 'var(--text-secondary)'
                  }}>
                  {form.amenities.includes(a) ? '✓ ' : ''}{a}
                </button>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="card" style={{padding:28, marginBottom:24}}>
            <h3 style={{marginBottom:8}}>Property Images</h3>
            <p style={{color:'var(--text-secondary)', fontSize:'0.875rem', marginBottom:16}}>Add image URLs (from Unsplash, Google Drive, etc.)</p>
            {form.images.map((img, i) => (
              <div className="form-group" key={i}>
                <label>Image {i + 1} URL {i === 0 ? '(Main)' : '(Optional)'}</label>
                <input className="form-control" placeholder="https://images.unsplash.com/..." value={img} onChange={e => setForm(p => ({ ...p, images: p.images.map((im, idx) => idx === i ? e.target.value : im) }))} />
              </div>
            ))}
          </div>

          <div style={{display:'flex', gap:12}}>
            <button type="submit" className="btn btn-accent btn-lg" disabled={loading}>{loading ? 'Publishing...' : '🚀 Publish Property'}</button>
            <button type="button" onClick={() => navigate('/landlord-dashboard')} className="btn btn-outline btn-lg">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
