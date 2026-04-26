import React, { useState, useEffect, useRef } from 'react';
import { userService } from '../services/api';
import api from '../services/api';
import { Card, Button, Input } from '../components/UIComponents';
import { Wifi, Plus } from 'lucide-react';

const RFIDCards = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rfid_uid: '',
    surname: '',
    firstname: '',
    middlename: '',
    age: '',
    student_number: '',
    year_level: '1st Year',
  });
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState(null);
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Poll for pending RFID when scanning
  useEffect(() => {
    if (scanning) {
      pollIntervalRef.current = setInterval(async () => {
        try {
          const response = await api.get('/attendance/pending-rfid');
          if (response.data.received && response.data.uid) {
            setFormData({ ...formData, rfid_uid: response.data.uid });
            setScanning(false);
            setScanError(null);
            clearInterval(pollIntervalRef.current);
          }
        } catch (error) {
          console.error('Error polling for RFID:', error);
        }
      }, 500); // Poll every 500ms

      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      };
    }
  }, [scanning, formData]);

  const fetchUsers = async () => {
    try {
      const response = await userService.getAll();
      setUsers(response.data.filter(u => u.rfid_uid));
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleScan = () => {
    setScanning(true);
    setScanError(null);
  };

  const handleCancelScan = async () => {
    setScanning(false);
    setScanError(null);
    
    // Clear pending RFID on the backend
    try {
      await api.delete('/attendance/pending-rfid');
    } catch (error) {
      console.error('Error clearing pending RFID:', error);
    }
    
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.id) {
        await userService.update(formData.id, formData);
      } else {
        await userService.create(formData);
      }
      
      // Clear pending RFID after successful registration
      try {
        await api.delete('/attendance/pending-rfid');
      } catch (error) {
        console.error('Error clearing pending RFID:', error);
      }

      fetchUsers();
      setShowForm(false);
      setFormData({
        rfid_uid: '',
        surname: '',
        firstname: '',
        middlename: '',
        age: '',
        student_number: '',
        year_level: '1st Year',
      });
    } catch (error) {
      console.error('Failed to register RFID card:', error);
      const errorMessage = error.response?.data?.message || 'Error registering RFID card. Check that student number format is correct (XX-XXXXX)';
      alert(errorMessage);
    }
  };

  const handleCloseForm = async () => {
    // Clear pending RFID when closing form
    if (scanning) {
      await handleCancelScan();
    }
    
    try {
      await api.delete('/attendance/pending-rfid');
    } catch (error) {
      console.error('Error clearing pending RFID:', error);
    }

    setShowForm(false);
    setFormData({
      rfid_uid: '',
      surname: '',
      firstname: '',
      middlename: '',
      age: '',
      student_number: '',
      year_level: '1st Year',
    });
    setScanError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white">RFID Card Registration</h1>
          <p className="text-gray-400 mt-2">Register student RFID cards</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={20} className="mr-2" />
          Register Card
        </Button>
      </div>

      {/* Registration Form */}
      {showForm && (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">RFID Scan</label>
              <div className="flex gap-2">
                <Input
                  label=""
                  value={formData.rfid_uid}
                  readOnly
                  className="text-center font-mono"
                  placeholder={scanning ? 'Waiting for card...' : 'RFID UID will appear here'}
                />
                {!scanning ? (
                  <Button
                    type="button"
                    onClick={handleScan}
                    disabled={scanning}
                    className="self-end"
                  >
                    <Wifi size={16} className="mr-2" />
                    Scan Card
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleCancelScan}
                    variant="secondary"
                    className="self-end"
                  >
                    Cancel
                  </Button>
                )}
              </div>
              {scanning ? (
                <div className="flex items-center gap-2">
                  <div className="animate-pulse w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-xs text-green-400">Waiting for card... Place it near the reader</p>
                </div>
              ) : (
                <p className="text-xs text-gray-500">Click "Scan Card" and place student's card near the reader</p>
              )}
              {scanError && (
                <p className="text-xs text-red-400">{scanError}</p>
              )}
            </div>

            {formData.rfid_uid && (
              <>
                <h3 className="text-lg font-semibold text-white mt-6">Student Information</h3>
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
                  <select
                    value={formData.year_level}
                    onChange={(e) => setFormData({ ...formData, year_level: e.target.value })}
                    className="bg-[#001a33] border border-[#0052A2]/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#0052A2]"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </>
            )}

            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={handleCloseForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={!formData.rfid_uid || !formData.surname || !formData.firstname}>
                Register Card
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Registered Cards */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Registered Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <Card key={user.id}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#0052A2] to-[#02386E] rounded-lg flex items-center justify-center">
                  <Wifi className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {user.firstname} {user.surname}
                  </h3>
                  <p className="text-xs text-gray-400">{user.year_level}</p>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <p className="text-gray-400">
                  <span className="text-gray-500">Student #:</span> {user.student_number}
                </p>
                <p className="text-gray-400 font-mono">
                  <span className="text-gray-500">RFID:</span> {user.rfid_uid}
                </p>
              </div>
            </Card>
          ))}
        </div>
        {users.length === 0 && (
          <Card className="text-center py-12">
            <Wifi className="mx-auto text-gray-500 mb-4" size={48} />
            <p className="text-gray-400">No registered cards found</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RFIDCards;
