import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const AssetForm = ({ assets, setAssets, editingAsset, setEditingAsset }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: '', description: '', manufacturer: '', acquisitiondate: '' });

  useEffect(() => {
    if (editingAsset) {
      setFormData({
        name: editingAsset.name,
        description: editingAsset.description,
        manufacturer: editingAsset.manufacturer,
        acquisitiondate: editingAsset.acquisitiondate,
      });
    } else {
      setFormData({ name: '', description: '', manufacturer: '', acquisitiondate: '' });
    }
  }, [editingAsset]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAsset) {
        const response = await axiosInstance.put(`/api/assets/${editingAsset._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAssets(assets.map((asset) => (asset._id === response.data._id ? response.data : asset)));
      } else {
        const response = await axiosInstance.post('/api/assets', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAssets([...assets, response.data]);
      }
      setEditingAsset(null);
      setFormData({ name: '', description: '', manufacturer: '', acquisitiondate: '' });
    } catch (error) {
      alert('Failed to save asset.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingAsset ? 'Edit Asset' : 'Create Asset'}</h1>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Manufacturer"
        value={formData.manufacturer}
        onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="date"
        value={formData.acquisitiondate}
        onChange={(e) => setFormData({ ...formData, acquisitiondate: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingAsset ? 'Update Asset' : 'Create Asset'}
      </button>
    </form>
  );
};

export default AssetForm;
