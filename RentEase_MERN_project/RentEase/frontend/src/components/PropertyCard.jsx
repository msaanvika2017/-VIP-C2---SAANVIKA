import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, BedDouble, ChevronRight } from 'lucide-react';

const PropertyCard = ({ property }) => {
  const { _id, title, price, location, bedrooms, availability, images } = property;

  // Use the backend base URL for images or fall back to gradient
  const backendUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
  const imageUrl = images && images.length > 0 ? `${backendUrl}${images[0]}` : null;

  return (
    <div class="glow-card group bg-slate-900/60 rounded-2xl border border-slate-800/80 overflow-hidden shadow-glass hover:shadow-glass-hover transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Property Image / Fallback */}
      <div class="relative h-48 w-full overflow-hidden bg-slate-800">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.parentNode.classList.add('gradient-fallback');
            }}
          />
        ) : (
          <div class="h-full w-full bg-gradient-to-br from-primary-600/30 to-indigo-950/40 flex items-center justify-center">
            <span class="text-4xl">🏠</span>
          </div>
        )}
        
        {/* Availability Badge */}
        <div class="absolute top-4 right-4">
          <span
            class={`text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md ${
              availability
                ? 'bg-emerald-500/90 text-white'
                : 'bg-rose-500/90 text-white'
            }`}
          >
            {availability ? 'Available' : 'Rented'}
          </span>
        </div>

        {/* Price Tag */}
        <div class="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md border border-slate-800 px-3 py-1 rounded-lg text-sm font-bold text-slate-100">
          <span class="text-primary-400 font-extrabold text-base">${price}</span>
          <span class="text-slate-400 font-normal text-xs">/mo</span>
        </div>
      </div>

      {/* Details */}
      <div class="p-5 flex flex-col flex-1">
        <h3 class="text-lg font-bold text-white group-hover:text-primary-400 transition-colors line-clamp-1">
          {title}
        </h3>

        {/* Location */}
        <div class="flex items-center text-slate-400 text-xs mt-2.5">
          <MapPin class="h-3.5 w-3.5 text-primary-500 shrink-0 mr-1" />
          <span class="line-clamp-1">{location}</span>
        </div>

        {/* Info badges */}
        <div class="flex items-center space-x-4 mt-4 pt-4 border-t border-slate-800/60 text-slate-300">
          <div class="flex items-center text-xs">
            <BedDouble class="h-4 w-4 text-slate-500 mr-1.5" />
            <span>{bedrooms} {bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
          </div>
        </div>

        {/* View Details Action */}
        <div class="mt-6">
          <Link
            to={`/properties/${_id}`}
            class="flex items-center justify-center space-x-1.5 w-full bg-slate-800 hover:bg-primary-600 hover:text-white text-slate-200 text-sm font-bold py-2.5 px-4 rounded-xl border border-slate-700/80 hover:border-primary-500/30 transition-all duration-300"
          >
            <span>View Details</span>
            <ChevronRight class="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
