import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { ArrowLeft, Upload, X, ShieldAlert, CheckCircle, Save } from 'lucide-react';

const AddProperty = () => {
  const { id } = useParams(); // URL parameter if editing
  const isEditMode = !!id;
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('1');
  const [availability, setAvailability] = useState(true);
  
  // Image states
  const [newImages, setNewImages] = useState([]); // File objects
  const [newImagePreviews, setNewImagePreviews] = useState([]); // Object URLs
  const [existingImages, setExistingImages] = useState([]); // URL strings from backend

  // Request status
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const fetchPropertyDetails = async () => {
        try {
          setFetchLoading(true);
          const { data } = await api.get(`/properties/${id}`);
          setTitle(data.title);
          setDescription(data.description);
          setLocation(data.location);
          setPrice(data.price);
          setBedrooms(data.bedrooms.toString());
          setAvailability(data.availability);
          setExistingImages(data.images || []);
          setFetchLoading(false);
        } catch (err) {
          console.error(err);
          setError('Failed to fetch property details for editing.');
          setFetchLoading(false);
        }
      };
      fetchPropertyDetails();
    }
  }, [id, isEditMode]);

  // Handle new file selections
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);

    // Create object URLs for previewing
    const previews = files.map((file) => URL.createObjectURL(file));
    setNewImagePreviews((prev) => [...prev, ...previews]);
  };

  // Remove newly selected image from list
  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    // Revoke URL to prevent memory leaks
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove existing image (from backend storage)
  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title || !description || !location || !price) {
      setError('Please fill in all required fields.');
      return;
    }

    if (newImages.length === 0 && existingImages.length === 0) {
      setError('Please upload at least one image of the property.');
      return;
    }

    try {
      setLoading(true);

      // We must submit as FormData for file uploading
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('location', location);
      formData.append('price', price);
      formData.append('bedrooms', bedrooms);
      formData.append('availability', availability);

      // Append new files
      newImages.forEach((image) => {
        formData.append('images', image);
      });

      // Append remaining existing images when in edit mode
      if (isEditMode) {
        formData.append('existingImages', JSON.stringify(existingImages));
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      if (isEditMode) {
        await api.put(`/properties/${id}`, formData, config);
        setSuccess('Property updated successfully! Redirecting...');
      } else {
        await api.post('/properties', formData, config);
        setSuccess('Property listed successfully! Redirecting...');
      }

      // Cleanup previews
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url));

      setTimeout(() => {
        navigate('/admin');
      }, 1500);
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save property listing.');
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div class="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div class="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-slate-400 font-medium animate-pulse">Fetching property data...</p>
      </div>
    );
  }

  const backendUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';

  return (
    <div class="flex-1 bg-slate-950 pb-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <Link
          to="/admin"
          class="inline-flex items-center space-x-1.5 text-sm font-semibold text-slate-400 hover:text-primary-400 transition-colors mb-6 group"
        >
          <ArrowLeft class="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Console</span>
        </Link>

        {/* Title */}
        <h1 class="text-3xl font-extrabold text-white tracking-tight mb-8">
          {isEditMode ? 'Edit Rental Listing' : 'List a New Property'}
        </h1>

        {/* Form panel */}
        <div class="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-premium">
          {error && (
            <div class="mb-6 bg-rose-950/40 border border-rose-900/50 rounded-xl p-4 flex items-start space-x-2 text-rose-300 text-sm">
              <ShieldAlert class="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div class="mb-6 bg-emerald-950/40 border border-emerald-900/50 rounded-xl p-4 flex items-start space-x-2 text-emerald-300 text-sm">
              <CheckCircle class="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div class="md:col-span-2">
                <label htmlFor="title" class="block text-sm font-semibold text-slate-300 mb-1.5">
                  Property Title *
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  placeholder="e.g. Cozy Sunset Apartment in Downtown"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  class="glass-input block w-full px-4 py-2.5 sm:text-sm rounded-xl"
                />
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" class="block text-sm font-semibold text-slate-300 mb-1.5">
                  Monthly Rental Price ($) *
                </label>
                <input
                  id="price"
                  type="number"
                  required
                  placeholder="e.g. 1500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  class="glass-input block w-full px-4 py-2.5 sm:text-sm rounded-xl"
                />
              </div>

              {/* Bedrooms */}
              <div>
                <label htmlFor="bedrooms" class="block text-sm font-semibold text-slate-300 mb-1.5">
                  Number of Bedrooms *
                </label>
                <select
                  id="bedrooms"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  class="glass-input block w-full px-4 py-2.5 sm:text-sm rounded-xl cursor-pointer"
                >
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                </select>
              </div>

              {/* Location */}
              <div class="md:col-span-2">
                <label htmlFor="location" class="block text-sm font-semibold text-slate-300 mb-1.5">
                  Location Address *
                </label>
                <input
                  id="location"
                  type="text"
                  required
                  placeholder="e.g. 742 Evergreen Terrace, Springfield"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  class="glass-input block w-full px-4 py-2.5 sm:text-sm rounded-xl"
                />
              </div>

              {/* Description */}
              <div class="md:col-span-2">
                <label htmlFor="description" class="block text-sm font-semibold text-slate-300 mb-1.5">
                  Property Description *
                </label>
                <textarea
                  id="description"
                  required
                  rows={5}
                  placeholder="Provide detailed information about the space, amenities, transport options, rules..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  class="glass-input block w-full px-4 py-2.5 sm:text-sm rounded-xl resize-none"
                />
              </div>

              {/* Availability Toggle */}
              <div class="md:col-span-2">
                <label class="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={availability}
                    onChange={(e) => setAvailability(e.target.checked)}
                    class="sr-only peer"
                  />
                  <div class="relative w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 peer-checked:after:bg-white peer-checked:after:border-primary-600"></div>
                  <span class="ms-3 text-sm font-semibold text-slate-300 select-none">List as Available for Booking</span>
                </label>
              </div>

              {/* File Upload Component */}
              <div class="md:col-span-2 border-t border-slate-850 pt-6">
                <label class="block text-sm font-semibold text-slate-300 mb-3">
                  Property Images * (Upload at least one image)
                </label>

                {/* File Drop Box */}
                <div class="border-2 border-dashed border-slate-800 hover:border-primary-500/40 rounded-2xl p-6 text-center cursor-pointer hover:bg-slate-900/10 transition-colors relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload class="h-10 w-10 text-slate-500 mx-auto mb-2" />
                  <span class="text-sm font-semibold text-slate-300 block">Click or Drag images to upload</span>
                  <span class="text-xs text-slate-500 block mt-1">Accepts PNG, JPG, JPEG, WEBP (Max 5MB each)</span>
                </div>

                {/* Previews grid */}
                <div class="mt-6 space-y-4">
                  {/* Existing Images (When Editing) */}
                  {existingImages.length > 0 && (
                    <div>
                      <span class="text-xs font-bold uppercase text-slate-500 tracking-wider block mb-2">Active Images</span>
                      <div class="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {existingImages.map((img, index) => (
                          <div key={index} class="relative group h-20 rounded-xl overflow-hidden border border-slate-800">
                            <img src={`${backendUrl}${img}`} alt="" class="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(index)}
                              class="absolute top-1 right-1 bg-slate-950/80 hover:bg-rose-600 text-white rounded-full p-1 border border-slate-800 transition-colors"
                              title="Delete Image"
                            >
                              <X class="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Images */}
                  {newImagePreviews.length > 0 && (
                    <div>
                      <span class="text-xs font-bold uppercase text-slate-500 tracking-wider block mb-2">New Images Uploading</span>
                      <div class="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {newImagePreviews.map((previewUrl, index) => (
                          <div key={index} class="relative group h-20 rounded-xl overflow-hidden border border-slate-800">
                            <img src={previewUrl} alt="" class="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeNewImage(index)}
                              class="absolute top-1 right-1 bg-slate-950/80 hover:bg-rose-600 text-white rounded-full p-1 border border-slate-800 transition-colors"
                              title="Cancel Upload"
                            >
                              <X class="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div class="flex items-center justify-end space-x-4 border-t border-slate-850 pt-6 mt-6">
              <Link
                to="/admin"
                class="px-5 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/40 text-slate-400 hover:text-slate-200 text-sm font-semibold transition-all"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                class="flex items-center space-x-1.5 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-bold py-2.5 px-6 rounded-xl border border-primary-500/20 active:scale-[0.98] shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Save class="h-4.5 w-4.5" />
                    <span>{isEditMode ? 'Save Changes' : 'Publish Listing'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
