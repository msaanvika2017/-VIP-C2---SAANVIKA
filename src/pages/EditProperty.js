import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertyContext';

const AMENITY_OPTIONS = ['Gym', 'Swimming Pool', 'Parking', 'Security', 'Power Backup', 'WiFi', 'AC', 'Washing Machine', 'Lift', 'Garden', 'Clubhouse', 'Modular Kitchen', 'Terrace', 'Generator', 'Water Supply'];

const EditProperty = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { updateProperty } = useProperties();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'landlord') { navigate('/login'); return; }
    fetch(`http://localhost:3001/properties/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.landlordId !== user.id) { navigate('/landlord-dashboard'); return; }
        setForm({ ...data, images: data.images?.length ? data.images : ['', ''] });
        setLoading(false);
      });
  }, [id, user]);

  const handleAmenity = (a) => setForm(p => ({
    ...p, amenities: p.amenities.includes(a) ? p.amenities.filter(x => x !== a) : [...p.amenities, a]
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const images = form.images.filter(i => i.trim() !== '');
    if (images.length === 0) images.push('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800');
    await updateProperty(parseInt(id), { ...form, price: parseInt(form.price), bedrooms: parseInt(form.bedrooms), bathrooms: parseInt(form.bathrooms), area: parseInt(form.area), images });
    setSaving(false);
    navigate('/landlord-dashboard');
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;
  if (!form) return null;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Edit Property</h1>
          <p>Update your property listing details</p>
        </div>
      </div>
      <div className="container" style={{paddingBottom:60, maxWidth:860}}>
        <form onSubmit={handleSubmit}>
          <div className="card" style={{padding:28, marginBottom:20}}>
            <h3 style={{marginBottom:20}}>Basic Information</h3>
            <div className="form-group">
              <label>Property Title *</label>
              <input className="form-control" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} required />
            </div>
            <div className="grid-2" style={{gap:16}}>
              <div className="form-group">
                <label>Property Type</label>
                <select className="form-control" value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value}))}>
                  <option>Apartment</option><option>Villa</option><option>Studio</option><option>Independent House</option>
                </select>
              </div>
              <div className="form-group">
                <label>Monthly Rent (₹)</label>
                <input type="number" className="form-control" value={form.price} onChange={e => setForm(p => ({...p, price: e.target.value}))} required />
              </div>
            </div>
            <div className="form-group">
              <label>Location</label>
              <input className="form-control" value={form.location} onChange={e => setForm(p => ({...p, location: e.target.value}))} required />
            </div>
            <div className="grid-2" style={{gap:16}}>
              <div className="form-group">
                <label>Bedrooms</label>
                <input type="number" className="form-control" min={1} max={10} value={form.bedrooms} onChange={e => setForm(p => ({...p, bedrooms: e.target.value}))} />
              </div>
              <div className="form-group">
                <label>Bathrooms</label>
                <input type="number" className="form-control" min={1} max={6} value={form.bathrooms} onChange={e => setForm(p => ({...p, bathrooms: e.target.value}))} />
              </div>
            </div>
            <div className="grid-2" style={{gap:16}}>
              <div className="form-group">
                <label>Area (sqft)</label>
                <input type="number" className="form-control" value={form.area} onChange={e => setForm(p => ({...p, area: e.target.value}))} />
              </div>
              <div className="form-group">
                <label>Furnished Status</label>
                <select className="form-control" value={form.furnished} onChange={e => setForm(p => ({...p, furnished: e.target.value}))}>
                  <option>Fully Furnished</option><option>Semi-Furnished</option><option>Unfurnished</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Availability</label>
              <select className="form-control" value={String(form.available)} onChange={e => setForm(p => ({...p, available: e.target.value === 'true'}))}>
                <option value="true">Available</option><option value="false">Not Available</option>
              </select>
            </div>
          </div>
          <div className="card" style={{padding:28, marginBottom:20}}>
            <h3 style={{marginBottom:16}}>Description</h3>
            <textarea className="form-control" rows={5} value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} />
          </div>
          <div className="card" style={{padding:28, marginBottom:20}}>
            <h3 style={{marginBottom:16}}>Amenities</h3>
            <div style={{display:'flex', flexWrap:'wrap', gap:10}}>
              {AMENITY_OPTIONS.map(a => (
                <button key={a} type="button" onClick={() => handleAmenity(a)}
                  style={{padding:'8px 16px', borderRadius:20, border:'2px solid', cursor:'pointer', fontWeight:500, fontSize:'0.85rem', transition:'all 0.2s',
                    borderColor: form.amenities?.includes(a) ? 'var(--primary)' : 'var(--border)',
                    background: form.amenities?.includes(a) ? 'var(--primary)' : 'white',
                    color: form.amenities?.includes(a) ? 'white' : 'var(--text-secondary)'
                  }}>
                  {form.amenities?.includes(a) ? '✓ ' : ''}{a}
                </button>
              ))}
            </div>
          </div>
          <div className="card" style={{padding:28, marginBottom:24}}>
            <h3 style={{marginBottom:16}}>Images</h3>
            {form.images.map((img, i) => (
              <div className="form-group" key={i}>
                <label>Image {i + 1} URL</label>
                <input className="form-control" value={img} onChange={e => setForm(p => ({ ...p, images: p.images.map((im, idx) => idx === i ? e.target.value : im) }))} />
              </div>
            ))}
          </div>
          <div style={{display:'flex', gap:12}}>
            <button type="submit" className="btn btn-accent btn-lg" disabled={saving}>{saving ? 'Saving...' : '💾 Save Changes'}</button>
            <button type="button" onClick={() => navigate('/landlord-dashboard')} className="btn btn-outline btn-lg">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProperty;
