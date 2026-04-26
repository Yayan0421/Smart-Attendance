import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';
import User from '../models/User.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.role);
    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: `${user.firstname} ${user.surname}`,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login error', error: error.message });
  }
};

export const logout = (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};
