import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';
import PropertyCard from '../components/PropertyCard';

const Home = () => {
  const { properties, loading } = useProperties();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchPrice, setSearchPrice] = useState('');

  const featured = properties.filter(p => p.available).slice(0, 6);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('location', search);
    if (searchType) params.set('type', searchType);
    if (searchPrice) params.set('maxPrice', searchPrice);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-eyebrow">🏠 India's Trusted Rental Platform</p>
          <h1>Find Your <em>Perfect Home</em><br />Without the Hassle</h1>
          <p>Browse thousands of verified rental properties. Connect with landlords directly, book visits, and move in — all on RentEase.</p>

          <form onSubmit={handleSearch}>
            <div className="search-bar">
              <input
                type="text" placeholder="🔍  Search by city or area (e.g. Banjara Hills, Hyderabad)"
                value={search} onChange={e => setSearch(e.target.value)}
                style={{flex:2}}
              />
              <select value={searchType} onChange={e => setSearchType(e.target.value)}>
                <option value="">All Property Types</option>
                <option>Apartment</option>
                <option>Villa</option>
                <option>Studio</option>
                <option>Independent House</option>
              </select>
              <select value={searchPrice} onChange={e => setSearchPrice(e.target.value)}>
                <option value="">Any Budget</option>
                <option value="10000">Under ₹10,000</option>
                <option value="20000">Under ₹20,000</option>
                <option value="40000">Under ₹40,000</option>
                <option value="100000">Under ₹1,00,000</option>
              </select>
              <button type="submit" className="btn btn-accent btn-lg">Search</button>
            </div>
          </form>

          <div className="hero-stats">
            <div className="stat-item"><div className="stat-num">{properties.length}+</div><div className="stat-label">Properties Listed</div></div>
            <div className="stat-item"><div className="stat-num">500+</div><div className="stat-label">Happy Tenants</div></div>
            <div className="stat-item"><div className="stat-num">200+</div><div className="stat-label">Verified Landlords</div></div>
            <div className="stat-item"><div className="stat-num">15+</div><div className="stat-label">Cities Covered</div></div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section" style={{background:'white'}}>
        <div className="container">
          <h2 className="section-title" style={{textAlign:'center'}}>How RentEase Works</h2>
          <p className="section-sub" style={{textAlign:'center'}}>Find and rent your ideal home in 3 simple steps</p>
          <div className="grid-3">
            {[
              { icon:'🔍', step:'01', title:'Search Properties', desc:'Browse our extensive listings. Filter by location, budget, type, and amenities to find your ideal match.' },
              { icon:'📅', step:'02', title:'Book a Visit', desc:'Schedule a property visit directly through the platform. Get instant confirmation from landlords.' },
              { icon:'🏡', step:'03', title:'Move In', desc:'Finalize rental terms, sign digitally, and get your keys. Our team supports you throughout.' }
            ].map(item => (
              <div key={item.step} className="card" style={{padding:'32px 24px', textAlign:'center', boxShadow:'none', border:'1px solid var(--border)'}}>
                <div style={{fontSize:'2.5rem', marginBottom:12}}>{item.icon}</div>
                <div style={{fontSize:'0.75rem', fontWeight:700, color:'var(--accent)', letterSpacing:2, marginBottom:6}}>{item.step}</div>
                <h3 style={{fontSize:'1.1rem', marginBottom:8}}>{item.title}</h3>
                <p style={{color:'var(--text-secondary)', fontSize:'0.875rem', lineHeight:1.7}}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="section">
        <div className="container">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
            <h2 className="section-title">Featured Properties</h2>
            <Link to="/properties" className="btn btn-outline">View All →</Link>
          </div>
          <p className="section-sub">Handpicked properties available for immediate rental</p>
          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : (
            <div className="grid-3">
              {featured.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA Sections */}
      <section className="section" style={{background:'var(--primary)', color:'white'}}>
        <div className="container">
          <div className="grid-2">
            <div style={{padding:'32px', background:'rgba(255,255,255,0.08)', borderRadius:16}}>
              <div style={{fontSize:'2.5rem', marginBottom:12}}>🏠</div>
              <h3 style={{fontFamily:'var(--font-display)', fontSize:'1.4rem', marginBottom:8}}>Looking for a Home?</h3>
              <p style={{color:'rgba(255,255,255,0.75)', marginBottom:20, fontSize:'0.9rem'}}>
                Create a free account to save properties, book visits, and contact landlords directly.
              </p>
              <Link to="/register" className="btn btn-accent">Register as Tenant</Link>
            </div>
            <div style={{padding:'32px', background:'rgba(255,255,255,0.08)', borderRadius:16}}>
              <div style={{fontSize:'2.5rem', marginBottom:12}}>🔑</div>
              <h3 style={{fontFamily:'var(--font-display)', fontSize:'1.4rem', marginBottom:8}}>Own a Property?</h3>
              <p style={{color:'rgba(255,255,255,0.75)', marginBottom:20, fontSize:'0.9rem'}}>
                List your property for free and connect with thousands of verified tenants looking for a home.
              </p>
              <Link to="/register" className="btn" style={{background:'white', color:'var(--primary)', fontWeight:700}}>List Your Property</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section" style={{background:'white'}}>
        <div className="container">
          <h2 className="section-title" style={{textAlign:'center'}}>Why Choose RentEase?</h2>
          <p className="section-sub" style={{textAlign:'center'}}>We make renting simple, safe, and transparent</p>
          <div className="grid-3" style={{gap:20}}>
            {[
              { icon:'✅', title:'Verified Listings', desc:'Every property is reviewed and verified before listing to ensure accuracy.' },
              { icon:'🔒', title:'Secure Platform', desc:'Your personal data and communications are always protected.' },
              { icon:'⚡', title:'Instant Connect', desc:'Message landlords directly without middlemen or hidden fees.' },
              { icon:'📱', title:'Mobile Friendly', desc:'Fully responsive — search for homes from any device, anywhere.' },
              { icon:'💬', title:'24/7 Support', desc:'Our support team is available round the clock to assist you.' },
              { icon:'📄', title:'Zero Commission', desc:'We charge no brokerage. Deal directly between tenant and landlord.' }
            ].map(f => (
              <div key={f.title} style={{display:'flex', gap:14, padding:'16px 0'}}>
                <div style={{fontSize:'1.8rem', flexShrink:0}}>{f.icon}</div>
                <div>
                  <h4 style={{fontWeight:600, marginBottom:4}}>{f.title}</h4>
                  <p style={{color:'var(--text-secondary)', fontSize:'0.875rem', lineHeight:1.6}}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
