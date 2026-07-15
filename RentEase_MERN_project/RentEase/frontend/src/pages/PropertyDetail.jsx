import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { MapPin, BedDouble, Calendar, ArrowLeft, Phone, Mail, User, ShieldAlert, CheckCircle, AlertCircle } from 'lucide-react';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null); // 'success', 'error', null
  const [bookingMessage, setBookingMessage] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/properties/${id}`);
        setProperty(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Property not found');
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleBookProperty = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/properties/${id}` } } });
      return;
    }

    try {
      setBookingLoading(true);
      setBookingStatus(null);
      setBookingMessage('');
      
      const { data } = await api.post('/bookings', { propertyId: id });
      
      setBookingStatus('success');
      setBookingMessage('Your booking request has been submitted successfully! The landlord will review it.');
      setBookingLoading(false);
    } catch (err) {
      console.error(err);
      setBookingStatus('error');
      setBookingMessage(err.response?.data?.message || 'Failed to submit booking request. You may already have an active request.');
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div class="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div class="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-slate-400 font-medium animate-pulse">Loading property details...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div class="flex-1 max-w-lg mx-auto px-4 py-20 text-center">
        <div class="glass-panel p-8 rounded-2xl border border-rose-950/40 text-rose-300">
          <ShieldAlert class="h-12 w-12 text-rose-400 mx-auto mb-4" />
          <h3 class="text-xl font-bold text-white mb-2">Error Loading Property</h3>
          <p class="text-sm text-slate-400 mb-6">{error || 'The requested property could not be found.'}</p>
          <Link
            to="/"
            class="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-5 rounded-xl border border-slate-700 transition-colors"
          >
            <ArrowLeft class="h-4 w-4" />
            <span>Back to Listings</span>
          </Link>
        </div>
      </div>
    );
  }

  const backendUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
  const hasImages = property.images && property.images.length > 0;

  return (
    <div class="flex-1 bg-slate-950 pb-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <Link
          to="/"
          class="inline-flex items-center space-x-1.5 text-sm font-semibold text-slate-400 hover:text-primary-400 transition-colors mb-6 group"
        >
          <ArrowLeft class="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Browse</span>
        </Link>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Gallery + Description (2 Columns) */}
          <div class="lg:col-span-2 space-y-6">
            {/* Gallery Grid */}
            <div class="space-y-3">
              <div class="relative h-[300px] sm:h-[450px] w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-lg">
                {hasImages ? (
                  <img
                    src={`${backendUrl}${property.images[activeImage]}`}
                    alt={property.title}
                    class="h-full w-full object-cover transition-all duration-300"
                  />
                ) : (
                  <div class="h-full w-full bg-gradient-to-br from-primary-950/30 to-indigo-950/20 flex items-center justify-center">
                    <span class="text-7xl">🏠</span>
                  </div>
                )}
                
                {/* Availability Tag */}
                <div class="absolute top-4 right-4">
                  <span
                    class={`text-xs font-extrabold tracking-wider uppercase px-3 py-1.5 rounded-full shadow-md ${
                      property.availability
                        ? 'bg-emerald-500 text-white'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    {property.availability ? 'Available Now' : 'Currently Rented'}
                  </span>
                </div>
              </div>

              {/* Thumbnails */}
              {hasImages && property.images.length > 1 && (
                <div class="flex items-center space-x-3 overflow-x-auto pb-1">
                  {property.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      class={`relative w-20 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        activeImage === index
                          ? 'border-primary-500 scale-95 shadow-md'
                          : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={`${backendUrl}${img}`} alt="" class="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Overview */}
            <div class="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6 shadow-md">
              <div>
                <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  {property.title}
                </h1>
                <div class="flex items-center text-slate-400 text-sm mt-3">
                  <MapPin class="h-4 w-4 text-primary-500 shrink-0 mr-1.5" />
                  <span>{property.location}</span>
                </div>
              </div>

              {/* Specs Grid */}
              <div class="grid grid-cols-2 gap-4 py-5 border-t border-b border-slate-850">
                <div class="flex items-center space-x-3">
                  <div class="bg-primary-950/30 p-2.5 rounded-xl border border-primary-900/40">
                    <BedDouble class="h-5 w-5 text-primary-400" />
                  </div>
                  <div>
                    <div class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Bedrooms</div>
                    <div class="text-base font-bold text-white">{property.bedrooms} {property.bedrooms === 1 ? 'Room' : 'Rooms'}</div>
                  </div>
                </div>

                <div class="flex items-center space-x-3">
                  <div class="bg-primary-950/30 p-2.5 rounded-xl border border-primary-900/40">
                    <Calendar class="h-5 w-5 text-primary-400" />
                  </div>
                  <div>
                    <div class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Date Added</div>
                    <div class="text-base font-bold text-white">{new Date(property.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div class="space-y-3">
                <h3 class="text-lg font-bold text-white">About this home</h3>
                <p class="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>
            </div>
          </div>

          {/* Sidebar - Price + Booking Widget (1 Column) */}
          <div class="space-y-6">
            {/* Booking Card */}
            <div class="glass-panel p-6 rounded-2xl border border-slate-800 shadow-premium sticky top-24">
              <div class="mb-5 pb-5 border-b border-slate-850">
                <span class="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Monthly Rent</span>
                <div class="flex items-baseline mt-1.5">
                  <span class="text-3xl font-extrabold text-white">${property.price}</span>
                  <span class="text-slate-400 text-sm ml-1.5">/ month</span>
                </div>
              </div>

              {bookingStatus && (
                <div
                  class={`p-4 rounded-xl flex items-start space-x-2 text-sm mb-5 ${
                    bookingStatus === 'success'
                      ? 'bg-emerald-950/30 border border-emerald-900/40 text-emerald-300'
                      : 'bg-rose-950/30 border border-rose-900/40 text-rose-300'
                  }`}
                >
                  {bookingStatus === 'success' ? (
                    <CheckCircle class="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle class="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <span>{bookingMessage}</span>
                </div>
              )}

              {/* Action Buttons based on logged in status & roles */}
              <div class="space-y-3">
                {user && user.role === 'admin' ? (
                  <Link
                    to={`/admin`} // Or an Edit page if we implement direct edit routing
                    class="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 px-4 rounded-xl border border-slate-700 transition-colors shadow-md"
                  >
                    <span>Manage via Admin Panel</span>
                  </Link>
                ) : (
                  <button
                    onClick={handleBookProperty}
                    disabled={!property.availability || bookingLoading || bookingStatus === 'success'}
                    class={`w-full flex items-center justify-center space-x-2 font-bold py-3.5 px-4 rounded-xl transition-all shadow-md focus:outline-none ${
                      !property.availability
                        ? 'bg-slate-800 text-slate-500 border border-slate-850 cursor-not-allowed'
                        : bookingStatus === 'success'
                        ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-800/30 cursor-not-allowed'
                        : 'bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white border border-primary-500/20 active:scale-[0.99] hover:shadow-lg'
                    }`}
                  >
                    {bookingLoading ? (
                      <span class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <span>
                        {!property.availability
                          ? 'Fully Booked'
                          : bookingStatus === 'success'
                          ? 'Request Submitted'
                          : user
                          ? 'Book This Property'
                          : 'Sign In to Request Booking'}
                      </span>
                    )}
                  </button>
                )}
                
                {property.availability && (
                  <p class="text-[10px] text-center text-slate-500 font-medium">
                    * Booking requests are free and subject to host approval.
                  </p>
                )}
              </div>

              {/* Host Info */}
              <div class="mt-8 pt-6 border-t border-slate-850">
                <h4 class="text-sm font-bold text-slate-300 mb-4">Listing Agent Details</h4>
                <div class="space-y-3.5 text-sm">
                  <div class="flex items-center space-x-3 text-slate-400">
                    <User class="h-4.5 w-4.5 text-primary-500 shrink-0" />
                    <span class="font-semibold text-slate-200">{property.addedBy?.name || 'Manager'}</span>
                  </div>
                  {user && (
                    <>
                      <div class="flex items-center space-x-3 text-slate-400">
                        <Mail class="h-4.5 w-4.5 text-primary-500 shrink-0" />
                        <span class="break-all">{property.addedBy?.email || 'support@renthaven.com'}</span>
                      </div>
                      <div class="flex items-center space-x-3 text-slate-400">
                        <Phone class="h-4.5 w-4.5 text-primary-500 shrink-0" />
                        <span>{property.addedBy?.phone || '+1 (555) 012-3456'}</span>
                      </div>
                    </>
                  )}
                  {!user && (
                    <p class="text-xs text-slate-500 italic">
                      Sign in to view contact details.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
