import React, { useState, useEffect } from 'react';
import { eventService } from '../services/api';
import { Card, Button, Input } from '../components/UIComponents';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    login_time: '',
    logout_time: '',
    location: '',
    fine_amount: '',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventService.getAll();
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await eventService.update(editId, formData);
      } else {
        await eventService.create(formData);
      }
      fetchEvents();
      setShowForm(false);
      setFormData({
        name: '',
        date: '',
        login_time: '',
        logout_time: '',
        location: '',
        fine_amount: '',
      });
      setEditId(null);
    } catch (error) {
      console.error('Failed to save event:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await eventService.delete(id);
        fetchEvents();
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  const handleEdit = (event) => {
    setFormData(event);
    setEditId(event.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white">Events Management</h1>
          <p className="text-gray-400 mt-2">Create and manage attendance events</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={20} className="mr-2" />
          Add Event
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Event Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Event Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
              <Input
                label="Login Time"
                type="time"
                value={formData.login_time}
                onChange={(e) => setFormData({ ...formData, login_time: e.target.value })}
                required
              />
              <Input
                label="Logout Time"
                type="time"
                value={formData.logout_time}
                onChange={(e) => setFormData({ ...formData, logout_time: e.target.value })}
                required
              />
              <Input
                label="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
              <Input
                label="Fine Amount ($)"
                type="number"
                step="0.01"
                value={formData.fine_amount}
                onChange={(e) => setFormData({ ...formData, fine_amount: e.target.value })}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editId ? 'Update' : 'Create'} Event
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#0052A2] to-[#02386E] rounded-lg flex items-center justify-center">
                  <Calendar className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{event.name}</h3>
                  <p className="text-xs text-gray-400">{new Date(event.date).toDateString()}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(event)}
                  className="p-2 hover:bg-blue-500/10 rounded transition text-blue-400"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="p-2 hover:bg-red-500/10 rounded transition text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <p className="text-gray-400">
                <span className="text-gray-500">Time:</span> {event.login_time} - {event.logout_time}
              </p>
              <p className="text-gray-400">
                <span className="text-gray-500">Location:</span> {event.location || 'N/A'}
              </p>
              <p className="text-gray-400">
                <span className="text-gray-500">Fine Amount:</span> ${parseFloat(event.fine_amount).toFixed(2)}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {events.length === 0 && !showForm && (
        <Card className="text-center py-12">
          <Calendar className="mx-auto text-gray-500 mb-4" size={48} />
          <p className="text-gray-400">No events found. Create your first event to get started!</p>
        </Card>
      )}
    </div>
  );
};

export default Events;
