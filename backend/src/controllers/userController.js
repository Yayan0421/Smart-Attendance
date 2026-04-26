import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: 'staff' },
      attributes: { exclude: ['password'] },
      order: [['firstname', 'ASC']],
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { surname, firstname, middlename, age, student_number, year_level, rfid_uid, email, password } = req.body;

    if (!surname || !firstname || !student_number) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const user = await User.create({
      surname,
      firstname,
      middlename,
      age,
      student_number,
      year_level,
      rfid_uid,
      email,
      password: hashedPassword,
      role: 'staff',
    });

    res.status(201).json({ message: 'User created', user });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update(updates);
    res.status(200).json({ message: 'User updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};
