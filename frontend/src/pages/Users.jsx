import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { Card, Button, Input, Select } from '../components/UIComponents';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { validateStudentNumber } from '../utils/helpers';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [formData, setFormData] = useState({
    surname: '',
    firstname: '',
    middlename: '',
    age: '',
    student_number: '',
    year_level: '1st Year',
    rfid_uid: '',
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, yearFilter]);

  const fetchUsers = async () => {
    try {
      const response = await userService.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter((user) =>
        `${user.firstname} ${user.surname}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (yearFilter) {
      filtered = filtered.filter((user) => user.year_level === yearFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStudentNumber(formData.student_number)) {
      alert('Invalid student number format (use XX-XXXXX)');
      return;
    }

    try {
      if (editId) {
        await userService.update(editId, formData);
      } else {
        await userService.create(formData);
      }
      fetchUsers();
      setShowForm(false);
      setFormData({
        surname: '',
        firstname: '',
        middlename: '',
        age: '',
        student_number: '',
        year_level: '1st Year',
        rfid_uid: '',
      });
      setEditId(null);
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.delete(id);
        fetchUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const handleEdit = (user) => {
    setFormData(user);
    setEditId(user.id);
    setShowForm(true);
  };

  const yearLevels = [
    { value: '1st Year', label: '1st Year' },
    { value: '2nd Year', label: '2nd Year' },
    { value: '3rd Year', label: '3rd Year' },
    { value: '4th Year', label: '4th Year' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white">Users Management</h1>
          <p className="text-gray-400 mt-2">Manage student records and RFID cards</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={20} className="mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-[#001a33] border border-[#0052A2]/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#0052A2]"
            />
          </div>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="bg-[#001a33] border border-[#0052A2]/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#0052A2]"
          >
            <option value="">All Year Levels</option>
            {yearLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Surname"
                value={formData.surname}
                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                required
              />
              <Input
                label="First Name"
                value={formData.firstname}
                onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                required
              />
              <Input
                label="Middle Name"
                value={formData.middlename}
                onChange={(e) => setFormData({ ...formData, middlename: e.target.value })}
              />
              <Input
                label="Age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
              <Input
                label="Student Number (XX-XXXXX)"
                value={formData.student_number}
                onChange={(e) => setFormData({ ...formData, student_number: e.target.value })}
                placeholder="25-00017"
                required
              />
              <Select
                label="Year Level"
                options={yearLevels}
                value={formData.year_level}
                onChange={(e) => setFormData({ ...formData, year_level: e.target.value })}
              />
              <Input
                label="RFID UID"
                value={formData.rfid_uid}
                onChange={(e) => setFormData({ ...formData, rfid_uid: e.target.value })}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editId ? 'Update' : 'Add'} User
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Users Table */}
      <div className="overflow-x-auto">
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#0052A2]/20">
                  <th className="text-left py-4 px-4 font-semibold text-gray-300">Name</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-300">Student #</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-300">Year</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-300">RFID UID</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-[#0052A2]/10 hover:bg-[#0052A2]/5 transition">
                      <td className="py-4 px-4 text-white">
                        {user.firstname} {user.surname}
                      </td>
                      <td className="py-4 px-4 text-gray-400">{user.student_number}</td>
                      <td className="py-4 px-4 text-gray-400">{user.year_level}</td>
                      <td className="py-4 px-4 text-gray-400 text-xs font-mono">{user.rfid_uid || '-'}</td>
                      <td className="py-4 px-4 flex gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 hover:bg-blue-500/10 rounded transition text-blue-400"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 hover:bg-red-500/10 rounded transition text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-gray-400">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Users;
