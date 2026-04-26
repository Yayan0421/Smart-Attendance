import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card, Button, Input } from '../components/UIComponents';
import { User, Mail, Shield, Lock, Camera } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [photoPreview, setPhotoPreview] = useState(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // TODO: Call API to update profile
    alert('Profile updated successfully');
    setEditMode(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-white">My Profile</h1>
        <p className="text-gray-400 mt-2">Manage your account settings</p>
      </div>

      {/* Profile Card */}
      <Card>
        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 bg-gradient-to-br from-[#0052A2] to-[#02386E] rounded-full flex items-center justify-center border-4 border-[#0052A2]/20 overflow-hidden">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="text-white" size={48} />
              )}
            </div>
            {editMode && (
              <label className="flex items-center gap-2 px-4 py-2 bg-[#0052A2]/10 hover:bg-[#0052A2]/20 border border-[#0052A2]/30 rounded-lg cursor-pointer transition">
                <Camera size={18} className="text-[#0052A2]" />
                <span className="text-sm text-white">Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  hidden
                />
              </label>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <User size={20} /> Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    disabled={!editMode}
                    className="w-full bg-[#001a33] border border-[#0052A2]/30 rounded-lg px-4 py-2 text-white disabled:opacity-50 focus:outline-none focus:border-[#0052A2]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <Mail size={18} /> Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={!editMode}
                    className="w-full bg-[#001a33] border border-[#0052A2]/30 rounded-lg px-4 py-2 text-white disabled:opacity-50 focus:outline-none focus:border-[#0052A2]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Shield size={18} /> Role
                </label>
                <input
                  type="text"
                  value={formData.role}
                  disabled
                  className="w-full bg-[#001a33] border border-[#0052A2]/30 rounded-lg px-4 py-2 text-white disabled:opacity-50 focus:outline-none focus:border-[#0052A2]"
                />
              </div>
            </div>

            {/* Password Section */}
            {editMode && (
              <div className="space-y-4 pt-6 border-t border-[#0052A2]/20">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Lock size={20} /> Change Password
                </h3>

                <Input
                  label="Current Password"
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, currentPassword: e.target.value })
                  }
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="New Password"
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, newPassword: e.target.value })
                    }
                  />
                  <Input
                    label="Confirm Password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end pt-4">
              {editMode ? (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </>
              ) : (
                <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
              )}
            </div>
          </form>
        </div>
      </Card>

      {/* Account Information */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Account Details</h3>
        <div className="space-y-3 text-sm">
          <p className="text-gray-400">
            <span className="text-gray-500">Account Type:</span>{' '}
            <span className="text-white capitalize">{user?.role}</span>
          </p>
          <p className="text-gray-400">
            <span className="text-gray-500">Member Since:</span>{' '}
            <span className="text-white">January 2024</span>
          </p>
          <p className="text-gray-400">
            <span className="text-gray-500">Last Login:</span>{' '}
            <span className="text-white">Today at 10:30 AM</span>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
