import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const TaskForm = ({ tasks, setTasks, editingTask, setEditingTask }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ title: '', manufacturer: '', description: '', SerialNumber: '', acquisitionDate: '' });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        manufacturer: editingTask.manufacturer,
        description: editingTask.description,
        SerialNumber: editingTask.SerialNumber,
        acquisitionDate: editingTask.acquisitionDate,
      });
    } else {
      setFormData({ title: '', manufacturer: '', description: '', SerialNumber: '', acquisitionDate: '' });
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        const response = await axiosInstance.put(`/api/tasks/${editingTask._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTasks(tasks.map((task) => (task._id === response.data._id ? response.data : task)));
      } else {
        const response = await axiosInstance.post('/api/tasks', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTasks([...tasks, response.data]);
      }
      setEditingTask(null);
      setFormData({ title: '', manufacturer: '', description: '', SerialNumber: '', acquisitionDate: '' });
    } catch (error) {
      alert('Failed to save task.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingTask ? 'Asset Details: Edit Asset' : 'Details: Register Asset'}</h1>
      <input
        type="text"
        placeholder="Asset Name"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
        type="text"
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Serial Number"
        value={formData.SerialNumber}
        onChange={(e) => setFormData({ ...formData, SerialNumber: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="date"
        value={formData.deadline}
        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
        {editingTask ? 'Update Asset' : 'Register Asset'}
      </button>
    </form>
  );
};

export default TaskForm;
