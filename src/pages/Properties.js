import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';
import PropertyCard from '../components/PropertyCard';

const Properties = () => {
  const { properties, loading } = useProperties();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: '',
    furnished: '',
    available: ''
  });
  const [sort, setSort] = useState('newest');

  const handleFilter = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));

  const filtered = properties
    .filter(p => {
      if (filters.location && !p.location.toLowerCase().includes(filters.location.toLowerCase()) &&
          !p.title.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.type && p.type !== filters.type) return false;
      if (filters.maxPrice && p.price > parseInt(filters.maxPrice)) return false;
      if (filters.bedrooms && p.bedrooms !== parseInt(filters.bedrooms)) return false;
      if (filters.furnished && p.furnished !== filters.furnished) return false;
      if (filters.available === 'true' && !p.available) return false;
      if (filters.available === 'false' && p.available) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      return new Date(b.postedDate) - new Date(a.postedDate);
    });

  const clearFilters = () => setFilters({ location:'', type:'', maxPrice:'', bedrooms:'', furnished:'', available:'' });

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Browse Properties</h1>
          <p>Discover {properties.length}+ rental properties across India</p>
        </div>
      </div>
      <div className="container" style={{paddingBottom:60}}>
        {/* Filters */}
        <div className="filters-bar">
          <div className="filter-group" style={{flex:2}}>
            <label>Search</label>
            <input className="form-control" placeholder="Location or property name..." value={filters.location} onChange={e => handleFilter('location', e.target.value)} />
          </div>
          <div className="filter-group">
            <label>Type</label>
            <select className="form-control" value={filters.type} onChange={e => handleFilter('type', e.target.value)}>
              <option value="">All Types</option>
              <option>Apartment</option><option>Villa</option><option>Studio</option><option>Independent House</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Max Rent</label>
            <select className="form-control" value={filters.maxPrice} onChange={e => handleFilter('maxPrice', e.target.value)}>
              <option value="">Any Budget</option>
              <option value="10000">₹10,000</option><option value="20000">₹20,000</option>
              <option value="40000">₹40,000</option><option value="60000">₹60,000</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Bedrooms</label>
            <select className="form-control" value={filters.bedrooms} onChange={e => handleFilter('bedrooms', e.target.value)}>
              <option value="">Any</option>
              <option value="1">1 BHK</option><option value="2">2 BHK</option><option value="3">3 BHK</option><option value="4">4+ BHK</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Furnished</label>
            <select className="form-control" value={filters.furnished} onChange={e => handleFilter('furnished', e.target.value)}>
              <option value="">Any</option>
              <option>Fully Furnished</option><option>Semi-Furnished</option><option>Unfurnished</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Status</label>
            <select className="form-control" value={filters.available} onChange={e => handleFilter('available', e.target.value)}>
              <option value="">All</option><option value="true">Available</option><option value="false">Rented</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Sort By</label>
            <select className="form-control" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
          <button className="btn btn-outline btn-sm" onClick={clearFilters} style={{alignSelf:'flex-end', marginBottom:1}}>Clear</button>
        </div>

        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
          <p style={{color:'var(--text-secondary)', fontSize:'0.875rem'}}>
            Showing <strong>{filtered.length}</strong> of {properties.length} properties
          </p>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner"></div></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏘️</div>
            <h3>No properties found</h3>
            <p>Try adjusting your filters to see more results</p>
            <button className="btn btn-primary" onClick={clearFilters} style={{marginTop:16}}>Clear Filters</button>
          </div>
        ) : (
          <div className="grid-3">
            {filtered.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;
