import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Home, ClipboardList, Users, Plus, Trash2, Edit3, Check, X, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('properties'); // properties, bookings, users

  // State
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch functions
  const fetchProperties = async () => {
    try {
      const { data } = await api.get('/properties');
      setProperties(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch properties');
    }
  };

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings');
      setBookings(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch bookings');
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/auth/users');
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch users');
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      await Promise.all([fetchProperties(), fetchBookings(), fetchUsers()]);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Actions
  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property? This will remove all associated images.')) {
      return;
    }

    try {
      setActionLoading(true);
      setError('');
      setSuccessMsg('');
      await api.delete(`/properties/${id}`);
      setSuccessMsg('Property deleted successfully!');
      await fetchProperties();
      setActionLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to delete property');
      setActionLoading(false);
    }
  };

  const handleBookingStatus = async (id, status) => {
    try {
      setActionLoading(true);
      setError('');
      setSuccessMsg('');
      await api.put(`/bookings/${id}/status`, { status });
      setSuccessMsg(`Booking successfully ${status}!`);
      await Promise.all([fetchBookings(), fetchProperties()]);
      setActionLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update booking status');
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div class="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div class="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-slate-400 font-medium animate-pulse">Loading administration console...</p>
      </div>
    );
  }

  return (
    <div class="flex-1 bg-slate-950 pb-16">
      {/* Admin Header */}
      <div class="relative py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-900 bg-gradient-to-b from-primary-950/10 to-transparent">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between relative z-10 gap-6">
          <div>
            <h1 class="text-3xl font-extrabold text-white tracking-tight">Admin Console</h1>
            <p class="text-slate-400 text-sm mt-1.5">Manage rentals, property listings, and review booking requests</p>
          </div>
          <div class="flex items-center space-x-2 shrink-0">
            <button
              onClick={loadDashboardData}
              class="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold p-3 rounded-xl border border-slate-800 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw class="h-5 w-5" />
            </button>
            <Link
              to="/admin/add-property"
              class="flex items-center justify-center space-x-1.5 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-bold py-3 px-5 rounded-xl border border-primary-500/20 shadow-md hover:shadow-lg transition-all"
            >
              <Plus class="h-5 w-5" />
              <span>Add Property</span>
            </Link>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Status Alerts */}
        {error && (
          <div class="mb-6 bg-rose-950/40 border border-rose-900/50 rounded-xl p-4 flex items-start space-x-2 text-rose-300 text-sm max-w-2xl">
            <ShieldAlert class="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div class="mb-6 bg-emerald-950/40 border border-emerald-900/50 rounded-xl p-4 flex items-start space-x-2 text-emerald-300 text-sm max-w-2xl">
            <CheckCircle class="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div class="flex border-b border-slate-850 mb-8 space-x-6">
          <button
            onClick={() => setActiveTab('properties')}
            class={`flex items-center space-x-2 py-4 px-2 border-b-2 font-bold text-sm transition-all select-none ${
              activeTab === 'properties'
                ? 'border-primary-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home class="h-4.5 w-4.5" />
            <span>Properties ({properties.length})</span>
          </button>
          
          <button
            onClick={() => setActiveTab('bookings')}
            class={`flex items-center space-x-2 py-4 px-2 border-b-2 font-bold text-sm transition-all select-none ${
              activeTab === 'bookings'
                ? 'border-primary-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ClipboardList class="h-4.5 w-4.5" />
            <span>Booking Requests ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            class={`flex items-center space-x-2 py-4 px-2 border-b-2 font-bold text-sm transition-all select-none ${
              activeTab === 'users'
                ? 'border-primary-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users class="h-4.5 w-4.5" />
            <span>Users Directory ({users.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'properties' && (
          <div>
            {properties.length === 0 ? (
              <div class="glass-panel p-16 text-center rounded-2xl border border-slate-800">
                <p class="text-slate-400 mb-4">No properties listed in the system.</p>
                <Link
                  to="/admin/add-property"
                  class="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl font-bold transition-colors shadow-md"
                >
                  Create First Listing
                </Link>
              </div>
            ) : (
              <div class="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
                <table class="w-full text-left border-collapse text-sm text-slate-300">
                  <thead>
                    <tr class="bg-slate-900 border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <th class="py-4 px-6">Property</th>
                      <th class="py-4 px-6">Location</th>
                      <th class="py-4 px-6">Price</th>
                      <th class="py-4 px-6">Rooms</th>
                      <th class="py-4 px-6">Status</th>
                      <th class="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-850">
                    {properties.map((prop) => {
                      const backendUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
                      const imageUrl = prop.images && prop.images.length > 0 ? `${backendUrl}${prop.images[0]}` : null;

                      return (
                        <tr key={prop._id} class="hover:bg-slate-900/20 transition-colors">
                          <td class="py-4 px-6 font-bold text-white flex items-center space-x-3.5">
                            <div class="w-12 h-10 bg-slate-800 rounded-lg overflow-hidden shrink-0 border border-slate-700">
                              {imageUrl ? (
                                <img src={imageUrl} alt="" class="w-full h-full object-cover" />
                              ) : (
                                <div class="w-full h-full bg-slate-800 flex items-center justify-center text-sm">🏠</div>
                              )}
                            </div>
                            <span class="truncate block max-w-[200px]" title={prop.title}>{prop.title}</span>
                          </td>
                          <td class="py-4 px-6 text-slate-400">{prop.location}</td>
                          <td class="py-4 px-6 font-bold text-slate-200">${prop.price}/mo</td>
                          <td class="py-4 px-6 text-slate-400">{prop.bedrooms} Bed</td>
                          <td class="py-4 px-6">
                            <span
                              class={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                prop.availability
                                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                                  : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                              }`}
                            >
                              {prop.availability ? 'Available' : 'Rented'}
                            </span>
                          </td>
                          <td class="py-4 px-6 text-right">
                            <div class="flex items-center justify-end space-x-2.5">
                              <Link
                                to={`/admin/edit-property/${prop._id}`}
                                class="p-1.5 rounded-lg border border-slate-800 hover:border-primary-500/30 bg-slate-900/60 hover:bg-primary-950/20 text-slate-400 hover:text-primary-400 transition-all"
                                title="Edit Property"
                              >
                                <Edit3 class="h-4.5 w-4.5" />
                              </Link>
                              <button
                                onClick={() => handleDeleteProperty(prop._id)}
                                disabled={actionLoading}
                                class="p-1.5 rounded-lg border border-slate-800 hover:border-rose-500/30 bg-slate-900/60 hover:bg-rose-950/20 text-slate-400 hover:text-rose-400 transition-all disabled:opacity-50"
                                title="Delete Property"
                              >
                                <Trash2 class="h-4.5 w-4.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            {bookings.length === 0 ? (
              <div class="glass-panel p-16 text-center rounded-2xl border border-slate-800">
                <p class="text-slate-400">No booking requests submitted yet.</p>
              </div>
            ) : (
              <div class="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
                <table class="w-full text-left border-collapse text-sm text-slate-300">
                  <thead>
                    <tr class="bg-slate-900 border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <th class="py-4 px-6">Tenant Info</th>
                      <th class="py-4 px-6">Property Requested</th>
                      <th class="py-4 px-6">Monthly Rent</th>
                      <th class="py-4 px-6">Date Applied</th>
                      <th class="py-4 px-6">Status</th>
                      <th class="py-4 px-6 text-right">Approve / Reject</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-850">
                    {bookings.map((booking) => (
                      <tr key={booking._id} class="hover:bg-slate-900/20 transition-colors">
                        <td class="py-4 px-6">
                          <div class="font-bold text-white">{booking.userId?.name || 'Deleted Account'}</div>
                          <div class="text-xs text-slate-400 mt-0.5">{booking.userId?.email}</div>
                          <div class="text-xs text-slate-500">{booking.userId?.phone}</div>
                        </td>
                        <td class="py-4 px-6 font-semibold text-slate-200">
                          {booking.propertyId ? (
                            <Link to={`/properties/${booking.propertyId._id}`} class="hover:text-primary-400 transition-colors">
                              {booking.propertyId.title}
                            </Link>
                          ) : (
                            <span class="text-rose-500 italic">Deleted Property</span>
                          )}
                        </td>
                        <td class="py-4 px-6 font-bold text-slate-300">
                          ${booking.propertyId?.price || '0'}/mo
                        </td>
                        <td class="py-4 px-6 text-slate-400">
                          {new Date(booking.date).toLocaleDateString()}
                        </td>
                        <td class="py-4 px-6">
                          <span
                            class={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              booking.status === 'approved'
                                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                                : booking.status === 'rejected'
                                ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                                : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td class="py-4 px-6 text-right">
                          {booking.status === 'pending' && booking.propertyId ? (
                            <div class="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleBookingStatus(booking._id, 'approved')}
                                disabled={actionLoading}
                                class="p-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg border border-emerald-500/20 hover:scale-[1.05] active:scale-[0.98] transition-all disabled:opacity-50"
                                title="Approve Booking"
                              >
                                <Check class="h-4.5 w-4.5" />
                              </button>
                              <button
                                onClick={() => handleBookingStatus(booking._id, 'rejected')}
                                disabled={actionLoading}
                                class="p-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg border border-rose-500/20 hover:scale-[1.05] active:scale-[0.98] transition-all disabled:opacity-50"
                                title="Reject Booking"
                              >
                                <X class="h-4.5 w-4.5" />
                              </button>
                            </div>
                          ) : (
                            <span class="text-xs text-slate-500 font-medium">No actions</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            {users.length === 0 ? (
              <div class="glass-panel p-16 text-center rounded-2xl border border-slate-800">
                <p class="text-slate-400">No registered users in database.</p>
              </div>
            ) : (
              <div class="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
                <table class="w-full text-left border-collapse text-sm text-slate-300">
                  <thead>
                    <tr class="bg-slate-900 border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <th class="py-4 px-6">User ID</th>
                      <th class="py-4 px-6">Name</th>
                      <th class="py-4 px-6">Email</th>
                      <th class="py-4 px-6">Phone</th>
                      <th class="py-4 px-6">Account Role</th>
                      <th class="py-4 px-6">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-850">
                    {users.map((u) => (
                      <tr key={u._id} class="hover:bg-slate-900/20 transition-colors">
                        <td class="py-4 px-6 font-mono text-slate-500 text-xs">
                          #{u._id}
                        </td>
                        <td class="py-4 px-6 font-bold text-white">{u.name}</td>
                        <td class="py-4 px-6 text-slate-300">{u.email}</td>
                        <td class="py-4 px-6 text-slate-400">{u.phone}</td>
                        <td class="py-4 px-6">
                          <span
                            class={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              u.role === 'admin'
                                ? 'bg-primary-500/10 border border-primary-500/20 text-primary-400'
                                : 'bg-slate-800 border border-slate-700 text-slate-300'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td class="py-4 px-6 text-slate-400">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
