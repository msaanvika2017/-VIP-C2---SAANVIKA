import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PropertyDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingForm, setBookingForm] = useState({ visitDate: '', message: '' });
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [bookingStatus, setBookingStatus] = useState('');
  const [reviewStatus, setReviewStatus] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:3001/properties/${id}`).then(r => r.json()),
      fetch(`http://localhost:3001/reviews?propertyId=${id}`).then(r => r.json())
    ]).then(([prop, revs]) => {
      setProperty(prop);
      setReviews(revs);
      setLoading(false);
      if (user) setIsSaved(user.savedProperties?.includes(parseInt(id)));
    }).catch(() => setLoading(false));
  }, [id, user]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    await fetch('http://localhost:3001/bookings', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        propertyId: parseInt(id), tenantId: user.id, tenantName: user.name,
        tenantEmail: user.email, tenantPhone: user.phone,
        landlordId: property.landlordId, status: 'pending',
        visitDate: bookingForm.visitDate, message: bookingForm.message,
        createdAt: new Date().toISOString().split('T')[0]
      })
    });
    setBookingStatus('success');
    setBookingForm({ visitDate: '', message: '' });
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    await fetch('http://localhost:3001/reviews', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        propertyId: parseInt(id), userId: user.id, userName: user.name,
        rating: reviewForm.rating, comment: reviewForm.comment,
        date: new Date().toISOString().split('T')[0]
      })
    });
    const res = await fetch(`http://localhost:3001/reviews?propertyId=${id}`);
    setReviews(await res.json());
    setReviewStatus('success');
    setReviewForm({ rating: 5, comment: '' });
  };

  const toggleSave = async () => {
    if (!user) { navigate('/login'); return; }
    const saved = user.savedProperties || [];
    const pid = parseInt(id);
    const updated = isSaved ? saved.filter(i => i !== pid) : [...saved, pid];
    await fetch(`http://localhost:3001/users/${user.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ savedProperties: updated })
    });
    setIsSaved(!isSaved);
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;
  if (!property) return <div className="container" style={{padding:'60px 20px', textAlign:'center'}}><h2>Property not found</h2></div>;

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 'No reviews';

  return (
    <div className="property-detail">
      <div className="container">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm" style={{marginBottom:16}}>← Back</button>

        {/* Gallery */}
        <div className="property-gallery">
          <img src={property.images?.[0]} alt={property.title} onError={e => e.target.src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'} />
          {property.images?.[1] && <img src={property.images[1]} alt={property.title} onError={e => e.target.style.display='none'} />}
        </div>

        {/* Main Info */}
        <div className="property-main-info">
          <div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8}}>
              <div>
                <span className="badge badge-primary" style={{marginRight:8}}>{property.type}</span>
                <span className={`badge ${property.available ? 'badge-success' : 'badge-danger'}`}>
                  {property.available ? '✓ Available' : '✗ Currently Rented'}
                </span>
              </div>
              <button onClick={toggleSave} className="btn btn-sm" style={{background: isSaved ? '#fff7ed' : 'var(--bg)', color: isSaved ? 'var(--accent)' : 'var(--text-secondary)', border:'1px solid var(--border)'}}>
                {isSaved ? '❤️ Saved' : '🤍 Save'}
              </button>
            </div>
            <h1 style={{fontFamily:'var(--font-display)', fontSize:'2rem', color:'var(--primary)', marginBottom:6}}>{property.title}</h1>
            <p style={{color:'var(--text-secondary)', fontSize:'1rem', marginBottom:16}}>📍 {property.location}</p>
            <div style={{fontSize:'1.8rem', fontWeight:700, color:'var(--accent)', marginBottom:16}}>
              ₹{property.price?.toLocaleString()}<span style={{fontSize:'1rem', color:'var(--text-secondary)', fontWeight:400}}>/month</span>
            </div>

            {/* Specs */}
            <div className="property-specs">
              <div className="spec-item">🛏 {property.bedrooms} Bedrooms</div>
              <div className="spec-item">🚿 {property.bathrooms} Bathrooms</div>
              <div className="spec-item">📐 {property.area} sqft</div>
              <div className="spec-item">🪑 {property.furnished}</div>
            </div>

            <h3 style={{marginBottom:10, marginTop:20}}>Description</h3>
            <p style={{color:'var(--text-secondary)', lineHeight:1.8}}>{property.description}</p>

            <h3 style={{marginBottom:10, marginTop:20}}>Amenities</h3>
            <div className="amenities-list">
              {property.amenities?.map(a => <span key={a} className="amenity-tag">✓ {a}</span>)}
            </div>

            {/* Reviews Section */}
            <div style={{marginTop:32}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
                <h3>Reviews & Ratings</h3>
                <span style={{display:'flex', alignItems:'center', gap:6, color:'var(--warning)', fontWeight:700}}>
                  ⭐ {avgRating} ({reviews.length} reviews)
                </span>
              </div>
              {reviews.map(r => (
                <div key={r.id} style={{background:'var(--bg)', borderRadius:10, padding:16, marginBottom:12}}>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
                    <strong>{r.userName}</strong>
                    <span style={{color:'var(--warning)'}}>{'⭐'.repeat(r.rating)}</span>
                  </div>
                  <p style={{fontSize:'0.875rem', color:'var(--text-secondary)'}}>{r.comment}</p>
                  <p style={{fontSize:'0.75rem', color:'var(--text-muted)', marginTop:6}}>{r.date}</p>
                </div>
              ))}
              {user && user.role === 'tenant' && (
                <form onSubmit={handleReview} style={{background:'var(--bg)', borderRadius:10, padding:16, marginTop:16}}>
                  <h4 style={{marginBottom:12}}>Write a Review</h4>
                  {reviewStatus === 'success' && <div className="alert alert-success">Review submitted! Thank you.</div>}
                  <div className="form-group">
                    <label>Rating</label>
                    <select className="form-control" value={reviewForm.rating} onChange={e => setReviewForm(p => ({...p, rating: parseInt(e.target.value)}))}>
                      {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r>1?'s':''}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Comment</label>
                    <textarea className="form-control" rows={3} placeholder="Share your experience..." value={reviewForm.comment} onChange={e => setReviewForm(p => ({...p, comment: e.target.value}))} required />
                  </div>
                  <button type="submit" className="btn btn-primary btn-sm">Submit Review</button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="contact-card">
              <h3 style={{marginBottom:16}}>Contact Landlord</h3>
              <div style={{display:'flex', alignItems:'center', gap:12, padding:14, background:'var(--bg)', borderRadius:10, marginBottom:16}}>
                <div style={{width:48, height:48, background:'var(--primary)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:'1.1rem', fontFamily:'var(--font-display)'}}>
                  {property.landlordName?.charAt(0)}
                </div>
                <div>
                  <div style={{fontWeight:600}}>{property.landlordName}</div>
                  <div style={{fontSize:'0.8rem', color:'var(--text-secondary)'}}>Property Owner</div>
                </div>
              </div>
              <a href={`tel:${property.landlordPhone}`} className="btn btn-outline" style={{width:'100%', justifyContent:'center', marginBottom:10}}>
                📞 {property.landlordPhone}
              </a>

              {property.available && (
                <form onSubmit={handleBooking} style={{marginTop:16}}>
                  <h4 style={{marginBottom:12}}>Book a Visit</h4>
                  {bookingStatus === 'success' && <div className="alert alert-success">Visit request sent! Landlord will confirm shortly.</div>}
                  <div className="form-group">
                    <label>Preferred Visit Date</label>
                    <input type="date" className="form-control" value={bookingForm.visitDate} onChange={e => setBookingForm(p => ({...p, visitDate: e.target.value}))} required min={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div className="form-group">
                    <label>Message (optional)</label>
                    <textarea className="form-control" rows={3} placeholder="Tell the landlord about yourself..." value={bookingForm.message} onChange={e => setBookingForm(p => ({...p, message: e.target.value}))} />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{width:'100%', justifyContent:'center'}}>
                    {user ? '📅 Request Visit' : '🔐 Login to Book'}
                  </button>
                </form>
              )}

              <div style={{background:'var(--bg)', borderRadius:10, padding:14, marginTop:16, fontSize:'0.8rem', color:'var(--text-secondary)'}}>
                <div style={{marginBottom:6}}>📅 Posted: {property.postedDate}</div>
                <div>⭐ Rating: {property.rating?.toFixed(1) || 'No ratings yet'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
