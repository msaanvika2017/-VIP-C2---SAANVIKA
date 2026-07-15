import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import PropertyCard from '../components/PropertyCard';
import { Search, MapPin, BedDouble, DollarSign, Filter, RefreshCw } from 'lucide-react';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [location, setLocation] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {};
      if (location) params.location = location;
      if (bedrooms) params.bedrooms = bedrooms;
      if (maxPrice) params.maxPrice = maxPrice;
      if (showOnlyAvailable) params.availability = 'true';

      const { data } = await api.get('/properties', { params });
      setProperties(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve properties. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [showOnlyAvailable]); // Re-fetch immediately when checkbox changes

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  const handleResetFilters = () => {
    setLocation('');
    setBedrooms('');
    setMaxPrice('');
    setShowOnlyAvailable(false);
    // Directly call API with empty filters
    api.get('/properties')
      .then(({ data }) => setProperties(data))
      .catch((err) => console.error(err));
  };

  return (
    <div class="flex-1 bg-slate-950 pb-16">
      {/* Hero Section */}
      <div class="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-slate-900/60 bg-gradient-to-b from-primary-950/20 to-transparent">
        {/* Glow Spheres */}
        <div class="absolute top-10 left-10 w-72 h-72 bg-primary-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div class="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div class="max-w-5xl mx-auto text-center relative z-10">
          <span class="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-xs font-bold text-primary-400 tracking-wider uppercase mb-6">
            ✨ Find your perfect home
          </span>
          <h1 class="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-none mb-6">
            Discover a Place You'll <br class="hidden sm:inline" />
            <span class="bg-gradient-to-r from-primary-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">Love to Live</span>
          </h1>
          <p class="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto font-medium">
            Explore premium rental listings with real-time bookings, detailed descriptions, and instant landlord approval requests.
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <form
          onSubmit={handleSearchSubmit}
          class="glass-panel p-5 sm:p-6 rounded-2xl shadow-premium border border-slate-800"
        >
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Location */}
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center">
                <MapPin class="h-3.5 w-3.5 mr-1 text-primary-400" />
                Location
              </label>
              <input
                type="text"
                placeholder="Search city, neighborhood..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                class="glass-input block w-full py-2.5 px-3 text-sm rounded-xl"
              />
            </div>

            {/* Bedrooms */}
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center">
                <BedDouble class="h-3.5 w-3.5 mr-1 text-primary-400" />
                Bedrooms
              </label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                class="glass-input block w-full py-2.5 px-3 text-sm rounded-xl cursor-pointer"
              >
                <option value="">Any Bedrooms</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center">
                <DollarSign class="h-3.5 w-3.5 mr-1 text-primary-400" />
                Max Price (per month)
              </label>
              <input
                type="number"
                placeholder="E.g. 2000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                class="glass-input block w-full py-2.5 px-3 text-sm rounded-xl"
              />
            </div>

            {/* Action buttons */}
            <div class="flex items-end space-x-2">
              <button
                type="submit"
                class="flex-1 flex justify-center items-center space-x-2 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-bold py-2.5 rounded-xl border border-primary-500/20 hover:shadow-lg transition-all"
              >
                <Search class="h-4 w-4" />
                <span>Search</span>
              </button>
              <button
                type="button"
                onClick={handleResetFilters}
                class="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold p-2.5 rounded-xl border border-slate-750 hover:border-slate-600 transition-colors"
                title="Reset Filters"
              >
                <RefreshCw class="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Toggle Checklist */}
          <div class="mt-4 flex items-center justify-between border-t border-slate-800/60 pt-4">
            <label class="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyAvailable}
                onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                class="sr-only peer"
              />
              <div class="relative w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600 peer-checked:after:bg-white peer-checked:after:border-primary-600"></div>
              <span class="ms-3 text-xs font-bold text-slate-400 select-none">Show Available Listings Only</span>
            </label>
            <span class="text-xs text-slate-500 font-medium">
              Found {properties.length} {properties.length === 1 ? 'property' : 'properties'}
            </span>
          </div>
        </form>
      </div>

      {/* Listings Section */}
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {loading ? (
          <div class="flex flex-col items-center justify-center py-20 space-y-4">
            <div class="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <p class="text-slate-500 font-medium animate-pulse">Scanning properties...</p>
          </div>
        ) : error ? (
          <div class="glass-panel p-8 text-center rounded-2xl border border-rose-950/40 text-rose-300 max-w-md mx-auto">
            <p class="font-semibold">{error}</p>
            <button
              onClick={fetchProperties}
              class="mt-4 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-900/50 text-rose-300 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            >
              Try Again
            </button>
          </div>
        ) : properties.length === 0 ? (
          <div class="glass-panel p-16 text-center rounded-2xl border border-slate-800 max-w-xl mx-auto">
            <span class="text-5xl block mb-4">🔍</span>
            <h3 class="text-xl font-bold text-white mb-2">No Properties Found</h3>
            <p class="text-slate-400 text-sm max-w-md mx-auto">
              We couldn't find any listings matching your search criteria. Try modifying your filters or location search.
            </p>
            <button
              onClick={handleResetFilters}
              class="mt-6 bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-colors"
            >
              Clear Search & Filters
            </button>
          </div>
        ) : (
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
