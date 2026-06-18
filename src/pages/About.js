import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>About RentEase</h1>
          <p>Connecting tenants and landlords across India since 2024</p>
        </div>
      </div>

      <div className="container section">
        {/* Mission */}
        <div className="grid-2" style={{gap:48, alignItems:'center', marginBottom:60}}>
          <div>
            <p style={{fontSize:'0.85rem', fontWeight:700, color:'var(--accent)', letterSpacing:2, textTransform:'uppercase', marginBottom:10}}>Our Mission</p>
            <h2 style={{fontFamily:'var(--font-display)', fontSize:'2rem', color:'var(--primary)', marginBottom:16, lineHeight:1.3}}>Making Renting Simple, Safe & Transparent</h2>
            <p style={{color:'var(--text-secondary)', lineHeight:1.8, marginBottom:16}}>
              RentEase was founded with one goal: to eliminate the stress and confusion that comes with renting a home in India. We bridge the gap between landlords and tenants with a transparent, efficient, and completely free platform.
            </p>
            <p style={{color:'var(--text-secondary)', lineHeight:1.8}}>
              We believe everyone deserves to find a home that fits their lifestyle and budget — without middlemen, hidden fees, or endless paperwork. Our platform empowers both tenants and landlords to connect directly and make informed decisions.
            </p>
          </div>
          <div style={{background:'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)', borderRadius:20, padding:40, color:'white', textAlign:'center'}}>
            <div style={{fontSize:'3rem', marginBottom:12}}>🏠</div>
            <h3 style={{fontFamily:'var(--font-display)', fontSize:'1.5rem', marginBottom:8}}>RentEase</h3>
            <p style={{color:'rgba(255,255,255,0.8)', fontSize:'0.9rem', lineHeight:1.7}}>
              "Your home is a reflection of you. We make sure you find the right one."
            </p>
            <div style={{marginTop:20, display:'flex', justifyContent:'center', gap:24}}>
              <div style={{textAlign:'center'}}><div style={{fontSize:'1.5rem', fontWeight:700, color:'var(--accent-light)'}}>500+</div><div style={{fontSize:'0.75rem', color:'rgba(255,255,255,0.6)'}}>Tenants</div></div>
              <div style={{textAlign:'center'}}><div style={{fontSize:'1.5rem', fontWeight:700, color:'var(--accent-light)'}}>200+</div><div style={{fontSize:'0.75rem', color:'rgba(255,255,255,0.6)'}}>Landlords</div></div>
              <div style={{textAlign:'center'}}><div style={{fontSize:'1.5rem', fontWeight:700, color:'var(--accent-light)'}}>15+</div><div style={{fontSize:'0.75rem', color:'rgba(255,255,255,0.6)'}}>Cities</div></div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div style={{textAlign:'center', marginBottom:48}}>
          <h2 style={{fontFamily:'var(--font-display)', fontSize:'1.8rem', color:'var(--primary)', marginBottom:8}}>Our Core Values</h2>
          <p style={{color:'var(--text-secondary)'}}>What drives every decision we make</p>
        </div>
        <div className="grid-3" style={{marginBottom:60}}>
          {[
            { icon:'🔒', title:'Trust & Safety', desc:'Every listing is verified. Every user is authenticated. We prioritize the safety of our community above all else.' },
            { icon:'💡', title:'Transparency', desc:'No hidden fees. No commissions. Clear pricing, honest communication, and straightforward processes.' },
            { icon:'⚡', title:'Efficiency', desc:'From search to move-in, we streamline every step so you spend less time searching and more time living.' },
            { icon:'🤝', title:'Community First', desc:'We exist to serve our community of tenants and landlords. Their needs shape every feature we build.' },
            { icon:'📱', title:'Accessibility', desc:'Our platform is fully mobile-responsive so you can find or manage your property from anywhere.' },
            { icon:'🌱', title:'Continuous Growth', desc:'We constantly improve based on feedback to provide the best rental experience possible.' }
          ].map(v => (
            <div key={v.title} className="card" style={{padding:24, textAlign:'center', boxShadow:'none', border:'1px solid var(--border)'}}>
              <div style={{fontSize:'2rem', marginBottom:10}}>{v.icon}</div>
              <h4 style={{marginBottom:8, color:'var(--primary)'}}>{v.title}</h4>
              <p style={{fontSize:'0.875rem', color:'var(--text-secondary)', lineHeight:1.7}}>{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Team */}
        <div style={{textAlign:'center', marginBottom:36}}>
          <h2 style={{fontFamily:'var(--font-display)', fontSize:'1.8rem', color:'var(--primary)', marginBottom:8}}>Meet the Team</h2>
          <p style={{color:'var(--text-secondary)'}}>The people who built RentEase</p>
        </div>
        <div className="grid-3" style={{marginBottom:60}}>
          {[
            { name:'Saanvika', role:'Founder & Lead Developer', init:'S', desc:'Built the entire RentEase platform from scratch. Passionate about solving real-world housing problems through technology.' },
            { name:'Priya Sharma', role:'UI/UX Designer', init:'P', desc:'Designed the intuitive interface that makes RentEase a pleasure to use for both tenants and landlords.' },
            { name:'Anil Reddy', role:'Backend Engineer', init:'A', desc:'Architected the robust data layer that powers RentEase\'s real-time property and booking systems.' }
          ].map(m => (
            <div key={m.name} className="card team-card">
              <div className="team-avatar">{m.init}</div>
              <h4 style={{marginBottom:4, color:'var(--primary)'}}>{m.name}</h4>
              <p style={{fontSize:'0.8rem', color:'var(--accent)', fontWeight:600, marginBottom:10}}>{m.role}</p>
              <p style={{fontSize:'0.875rem', color:'var(--text-secondary)', lineHeight:1.7}}>{m.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{background:'var(--primary)', borderRadius:20, padding:'48px 40px', textAlign:'center', color:'white'}}>
          <h2 style={{fontFamily:'var(--font-display)', fontSize:'1.8rem', marginBottom:12}}>Ready to Find Your Perfect Home?</h2>
          <p style={{color:'rgba(255,255,255,0.8)', marginBottom:24, maxWidth:500, margin:'0 auto 24px'}}>Join thousands of happy tenants and landlords on RentEase today.</p>
          <div style={{display:'flex', gap:12, justifyContent:'center'}}>
            <Link to="/properties" className="btn btn-accent btn-lg">Browse Properties</Link>
            <Link to="/register" className="btn btn-lg" style={{background:'white', color:'var(--primary)', fontWeight:700}}>Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
