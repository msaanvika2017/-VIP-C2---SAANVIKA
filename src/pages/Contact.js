import React, { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await fetch('http://localhost:3001/contacts', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, date: new Date().toISOString().split('T')[0] })
    });
    setLoading(false);
    setSubmitted(true);
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We're here to help. Reach out for any queries or support.</p>
        </div>
      </div>
      <div className="container section">
        <div className="grid-2" style={{gap:48}}>
          {/* Contact Info */}
          <div>
            <h2 style={{fontFamily:'var(--font-display)', fontSize:'1.8rem', color:'var(--primary)', marginBottom:16}}>Get in Touch</h2>
            <p style={{color:'var(--text-secondary)', lineHeight:1.8, marginBottom:28}}>
              Have a question about a property? Want to list your property? Or just want to say hello? We'd love to hear from you. Our team responds within 24 hours.
            </p>
            {[
              { icon:'📧', label:'Email', val:'xyz@gmail.com', href:'mailto:xyz@gmail.com' },
              { icon:'📞', label:'Phone', val:'+91-9000000000', href:'tel:+919000000000' },
              { icon:'📍', label:'Address', val:'RentEase HQ, HITEC City, Hyderabad, Telangana 500081', href:null },
              { icon:'⏰', label:'Office Hours', val:'Mon–Sat: 9 AM – 6 PM IST', href:null }
            ].map(item => (
              <div key={item.label} style={{display:'flex', gap:16, marginBottom:20, padding:16, background:'var(--bg)', borderRadius:10}}>
                <div style={{fontSize:'1.6rem'}}>{item.icon}</div>
                <div>
                  <div style={{fontWeight:600, fontSize:'0.875rem', color:'var(--text-secondary)', marginBottom:2}}>{item.label}</div>
                  {item.href ? <a href={item.href} style={{color:'var(--primary-light)', fontWeight:600}}>{item.val}</a> : <span>{item.val}</span>}
                </div>
              </div>
            ))}

            <div style={{background:'var(--primary)', borderRadius:12, padding:24, color:'white', marginTop:24}}>
              <h4 style={{marginBottom:8, fontFamily:'var(--font-display)'}}>🏠 List Your Property Free</h4>
              <p style={{fontSize:'0.875rem', color:'rgba(255,255,255,0.8)', lineHeight:1.7}}>Are you a landlord? List your property on RentEase and connect with thousands of verified tenants — completely free of charge.</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card" style={{padding:32}}>
            <h3 style={{marginBottom:20}}>Send us a Message</h3>
            {submitted && <div className="alert alert-success">✅ Message sent successfully! We'll get back to you within 24 hours.</div>}
            <form onSubmit={handleSubmit}>
              <div className="grid-2" style={{gap:14}}>
                <div className="form-group">
                  <label>Your Name *</label>
                  <input className="form-control" placeholder="Full name" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} required />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input className="form-control" placeholder="+91-XXXXXXXXXX" value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} />
                </div>
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input type="email" className="form-control" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} required />
              </div>
              <div className="form-group">
                <label>Subject *</label>
                <select className="form-control" value={form.subject} onChange={e => setForm(p => ({...p, subject: e.target.value}))} required>
                  <option value="">Select a subject</option>
                  <option>General Inquiry</option>
                  <option>Property Listing</option>
                  <option>Tenant Support</option>
                  <option>Technical Issue</option>
                  <option>Partnership</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Message *</label>
                <textarea className="form-control" rows={5} placeholder="Describe your query in detail..." value={form.message} onChange={e => setForm(p => ({...p, message: e.target.value}))} required />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{width:'100%', justifyContent:'center'}} disabled={loading}>
                {loading ? 'Sending...' : '📨 Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
