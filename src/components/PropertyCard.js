import React from 'react';
import { useNavigate } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();

  return (
    <div className="card property-card" onClick={() => navigate(`/properties/${property.id}`)}>
      <div className="card-img">
        <img src={property.images?.[0]} alt={property.title} onError={e => e.target.src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'} />
        <span className={`badge ${property.available ? 'badge-success' : 'badge-danger'}`}>
          {property.available ? '✓ Available' : '✗ Rented'}
        </span>
        <div className="price-tag">₹{property.price?.toLocaleString()}/mo</div>
      </div>
      <div className="card-body">
        <h3 className="card-title">{property.title}</h3>
        <div className="card-location">
          📍 {property.location}
        </div>
        <div className="card-meta">
          <span>🛏 {property.bedrooms} Bed</span>
          <span>🚿 {property.bathrooms} Bath</span>
          <span>📐 {property.area} sqft</span>
          <span>🪑 {property.furnished}</span>
        </div>
        <div className="card-footer">
          <span className="badge badge-primary">{property.type}</span>
          <div className="rating">
            ⭐ {property.rating?.toFixed(1) || 'New'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
