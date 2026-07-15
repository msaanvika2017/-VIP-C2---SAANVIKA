import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Shield, Clock, CheckCircle, XCircle, Phone, Mail, Building, MapPin, ExternalLink } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUserBookings = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data } = await api.get(`/bookings/user/${user._id}`);
      setBookings(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch bookings');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBookings();
  }, [user]);

  if (loading) {
    return (
      <div class="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div class="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-slate-400 font-medium animate-pulse">Retrieving your rental history...</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span class="inline-flex items-center space-x-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
            <CheckCircle class="h-3.5 w-3.5" />
            <span>Approved</span>
          </span>
        );
      case 'rejected':
        return (
          <span class="inline-flex items-center space-x-1.5 bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
            <XCircle class="h-3.5 w-3.5" />
            <span>Rejected</span>
          </span>
        );
      default:
        return (
          <span class="inline-flex items-center space-x-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
            <Clock class="h-3.5 w-3.5" />
            <span>Pending Review</span>
          </span>
        );
    }
  };

  return (
    <div class="flex-1 bg-slate-950 pb-16">
      {/* Dashboard Header */}
      <div class="relative py-12 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-slate-900 bg-gradient-to-b from-primary-950/10 to-transparent">
        <div class="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-primary-600/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between relative z-10 gap-4">
          <div>
            <h1 class="text-3xl font-extrabold text-white tracking-tight">Tenant Portal</h1>
            <p class="text-slate-400 text-sm mt-1.5">Manage and track your home rental applications</p>
          </div>
          <div class="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center space-x-3.5 backdrop-blur-md max-w-xs">
            <div class="h-10 w-10 rounded-xl bg-primary-600/10 border border-primary-500/20 flex items-center justify-center">
              <Shield class="h-5 w-5 text-primary-400" />
            </div>
            <div>
              <div class="text-xs text-slate-500 font-bold uppercase">Account Type</div>
              <div class="text-sm font-bold text-white uppercase">{user?.role} Account</div>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {error ? (
          <div class="glass-panel p-6 rounded-2xl border border-rose-950/40 text-rose-300 max-w-md mx-auto text-center">
            <p class="font-semibold">{error}</p>
            <button
              onClick={fetchUserBookings}
              class="mt-4 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-900/50 text-rose-300 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            >
              Try Again
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div class="glass-panel p-16 text-center rounded-2xl border border-slate-800 max-w-xl mx-auto shadow-md">
            <span class="text-5xl block mb-4">🏠</span>
            <h3 class="text-xl font-bold text-white mb-2">No Bookings Found</h3>
            <p class="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
              You haven't requested any property bookings yet. Browse our current active listings and find your dream home.
            </p>
            <Link
              to="/"
              class="inline-flex items-center space-x-1.5 mt-6 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md"
            >
              <Building class="h-4.5 w-4.5" />
              <span>Browse Properties</span>
            </Link>
          </div>
        ) : (
          <div class="space-y-6">
            <h2 class="text-xl font-extrabold text-white">Your Requests ({bookings.length})</h2>
            
            <div class="grid grid-cols-1 gap-6">
              {bookings.map((booking) => {
                const prop = booking.propertyId;
                if (!prop) return null; // Safe guard if property deleted

                const backendUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
                const hasImages = prop.images && prop.images.length > 0;
                const propImageUrl = hasImages ? `${backendUrl}${prop.images[0]}` : null;

                return (
                  <div
                    key={booking._id}
                    class="glass-panel rounded-2xl border border-slate-800/80 p-5 sm:p-6 shadow-glass hover:border-slate-700/60 transition-all flex flex-col md:flex-row gap-6"
                  >
                    {/* Property Mini Image */}
                    <div class="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-slate-850">
                      {propImageUrl ? (
                        <img src={propImageUrl} alt={prop.title} class="w-full h-full object-cover" />
                      ) : (
                        <div class="w-full h-full bg-gradient-to-br from-primary-950/40 to-indigo-950/20 flex items-center justify-center">
                          <span class="text-3xl">🏠</span>
                        </div>
                      )}
                    </div>

                    {/* Booking Details */}
                    <div class="flex-1 flex flex-col justify-between">
                      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div>
                          <div class="flex items-center space-x-2">
                            <h3 class="text-lg font-bold text-white leading-tight">
                              {prop.title}
                            </h3>
                            <Link to={`/properties/${prop._id}`} class="text-slate-500 hover:text-primary-400 transition-colors">
                              <ExternalLink class="h-4 w-4" />
                            </Link>
                          </div>
                          
                          <div class="flex items-center text-slate-400 text-xs mt-1.5">
                            <MapPin class="h-3.5 w-3.5 text-primary-500 shrink-0 mr-1" />
                            <span>{prop.location}</span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div class="shrink-0">
                          {getStatusBadge(booking.status)}
                        </div>
                      </div>

                      {/* Summary stats */}
                      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-850/60 text-slate-400 text-xs">
                        <div>
                          <span class="block text-slate-500 font-bold uppercase tracking-wider text-[9px] mb-0.5">Rent Cost</span>
                          <span class="text-sm font-bold text-slate-200">${prop.price}/mo</span>
                        </div>

                        <div>
                          <span class="block text-slate-500 font-bold uppercase tracking-wider text-[9px] mb-0.5">Bedrooms</span>
                          <span class="text-sm font-bold text-slate-200">{prop.bedrooms} Bed</span>
                        </div>

                        <div>
                          <span class="block text-slate-500 font-bold uppercase tracking-wider text-[9px] mb-0.5">Applied On</span>
                          <span class="text-sm font-bold text-slate-200">{new Date(booking.date).toLocaleDateString()}</span>
                        </div>

                        <div>
                          <span class="block text-slate-500 font-bold uppercase tracking-wider text-[9px] mb-0.5">Booking Ref</span>
                          <span class="text-sm font-semibold text-slate-300 uppercase truncate block max-w-[90px]" title={booking._id}>
                            #{booking._id.substring(booking._id.length - 8)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Landlord Contact Info Panel (Shows if Approved) */}
                    {booking.status === 'approved' && (
                      <div class="w-full md:w-64 bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-4 shrink-0 flex flex-col justify-center">
                        <h4 class="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3 flex items-center">
                          <CheckCircle class="h-3.5 w-3.5 mr-1" />
                          Host Contact Details
                        </h4>
                        <div class="space-y-2.5 text-xs text-slate-300">
                          <div class="flex items-center space-x-2">
                            <span class="text-slate-500 font-medium">Contact:</span>
                            <span class="font-bold text-slate-200">{booking.userId?.name || 'Agent'}</span>
                          </div>
                          <div class="flex items-center space-x-2 break-all">
                            <Mail class="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                            <span>{booking.userId?.email || 'landlord@renthaven.com'}</span>
                          </div>
                          <div class="flex items-center space-x-2">
                            <Phone class="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                            <span>{booking.userId?.phone || '+1 (555) 091-2356'}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
