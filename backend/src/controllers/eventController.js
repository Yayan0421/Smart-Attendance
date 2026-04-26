import Event from '../models/Event.js';
import Attendance from '../models/Attendance.js';

export const getEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      order: [['date', 'DESC']],
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { name, date, login_time, logout_time, location, fine_amount } = req.body;

    if (!name || !date || !login_time || !logout_time) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const event = await Event.create({
      name,
      date,
      login_time,
      logout_time,
      location,
      fine_amount,
    });

    res.status(201).json({ message: 'Event created', event });
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.update(updates);
    res.status(200).json({ message: 'Event updated', event });
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.destroy();
    res.status(200).json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event', error: error.message });
  }
};
