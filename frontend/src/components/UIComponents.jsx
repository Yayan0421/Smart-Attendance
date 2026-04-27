import React from 'react';

export const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => {
  const colorClasses = {
    blue: 'from-[#0052A2] to-[#02386E]',
    green: 'from-green-600 to-green-500',
    yellow: 'from-yellow-600 to-yellow-500',
    red: 'from-red-600 to-red-500',
  };

  return (
    <div className="bg-[#00264D] border border-[#0052A2]/20 rounded-xl p-6 hover:border-[#0052A2]/40 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-[#0052A2]/10">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-2">{subtitle}</p>}
        </div>
        <div className={`bg-gradient-to-br ${colorClasses[color]} p-3 rounded-lg`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </div>
  );
};

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-[#00264D] border border-[#0052A2]/20 rounded-xl p-6 hover:border-[#0052A2]/40 transition-all duration-200 shadow-lg ${className}`}>
      {children}
    </div>
  );
};

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-[#0052A2] to-[#02386E] hover:from-[#00498D] hover:to-[#00264D] text-white',
    secondary: 'bg-[#00264D] hover:bg-[#02386E] text-[#0052A2] border border-[#0052A2]/30',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
  };

  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input = ({ label, error, className = '', autoComplete, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>}
      <input
        className={`w-full bg-[#001a33] border border-[#0052A2]/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#0052A2] focus:ring-1 focus:ring-[#0052A2]/50 transition-all ${className} ${
          error ? 'border-red-500' : ''
        }`}
        autoComplete={autoComplete}
        {...props}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
};

export const Select = ({ label, error, options, className = '', ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>}
      <select
        className={`w-full bg-[#001a33] border border-[#0052A2]/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#0052A2] focus:ring-1 focus:ring-[#0052A2]/50 transition-all ${className} ${
          error ? 'border-red-500' : ''
        }`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default { StatCard, Card, Button, Input, Select };
