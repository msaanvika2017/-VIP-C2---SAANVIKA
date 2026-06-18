import React, { createContext, useContext, useState, useEffect } from 'react';

const PropertyContext = createContext();
export const useProperties = () => useContext(PropertyContext);

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    setLoading(true);
    const res = await fetch('http://localhost:3001/properties');
    const data = await res.json();
    setProperties(data);
    setLoading(false);
  };

  useEffect(() => { fetchProperties(); }, []);

  const addProperty = async (data) => {
    const res = await fetch('http://localhost:3001/properties', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, postedDate: new Date().toISOString().split('T')[0], rating: 0 })
    });
    const newProp = await res.json();
    setProperties(prev => [...prev, newProp]);
    return newProp;
  };

  const updateProperty = async (id, data) => {
    const res = await fetch(`http://localhost:3001/properties/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const updated = await res.json();
    setProperties(prev => prev.map(p => p.id === id ? updated : p));
    return updated;
  };

  const deleteProperty = async (id) => {
    await fetch(`http://localhost:3001/properties/${id}`, { method: 'DELETE' });
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  return (
    <PropertyContext.Provider value={{ properties, loading, fetchProperties, addProperty, updateProperty, deleteProperty }}>
      {children}
    </PropertyContext.Provider>
  );
};
