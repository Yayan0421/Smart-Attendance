import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(email, password);
      localStorage.setItem('user', JSON.stringify(response.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000B18] via-[#00172D] to-[#00264D] flex items-center justify-center p-4">
      <div className="w-full max-w-md backdrop-blur-xl bg-[#00264D]/30 border border-[#0052A2]/30 rounded-2xl p-8 shadow-2xl">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-block w-16 h-16 bg-gradient-to-br from-[#0052A2] to-[#02386E] rounded-xl flex items-center justify-center mb-4 shadow-lg">
            <LogIn className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">RFID Attendance System</h1>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={18} />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} autoComplete="on">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#001a33] border border-[#0052A2]/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#0052A2] focus:ring-2 focus:ring-[#0052A2]/20 transition-all"
              placeholder="admin@example.com"
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#001a33] border border-[#0052A2]/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#0052A2] focus:ring-2 focus:ring-[#0052A2]/20 transition-all"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#0052A2] to-[#02386E] hover:from-[#00498D] hover:to-[#00264D] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-[#0052A2]/20"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials Info */}
        <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
          <p className="text-xs text-gray-400 mb-2">Demo Credentials:</p>
          <p className="text-xs text-gray-300 mb-1">📧 Email: admin@example.com</p>
          <p className="text-xs text-gray-300">🔑 Password: password123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
