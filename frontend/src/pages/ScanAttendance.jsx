import React, { useState, useEffect } from 'react';
import { attendanceService, eventService } from '../services/api';
import { Card, Button, Select } from '../components/UIComponents';
import { Radio, Volume2, CheckCircle, AlertCircle } from 'lucide-react';
import { formatTime } from '../utils/helpers';

const ScanAttendance = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [rfidInput, setRfidInput] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventService.getAll();
      setEvents(response.data);
      if (response.data.length > 0) {
        setSelectedEvent(response.data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async (e) => {
    e.preventDefault();

    if (!selectedEvent || !rfidInput) {
      alert('Please select an event and scan RFID card');
      return;
    }

    try {
      const response = await attendanceService.scan(rfidInput, selectedEvent);
      setScanResult({
        success: true,
        data: response.data.attendance,
      });
      setRecentScans([response.data.attendance, ...recentScans.slice(0, 4)]);
      setRfidInput('');

      // Play success sound
      new Audio('data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==').play();

      // Clear result after 3 seconds
      setTimeout(() => setScanResult(null), 3000);
    } catch (error) {
      setScanResult({
        success: false,
        message: error.response?.data?.message || 'Scan failed',
      });
      setTimeout(() => setScanResult(null), 3000);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present':
        return 'text-green-400';
      case 'Late':
        return 'text-yellow-400';
      case 'Absent':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Attendance Scanning</h1>
        <p className="text-gray-400 mt-2">Scan student RFID cards to record attendance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scan Input */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <form onSubmit={handleScan} className="space-y-4">
              <div>
                <Select
                  label="Select Event"
                  options={events.map((e) => ({ value: e.id, label: e.name }))}
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">RFID Card</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={rfidInput}
                    onChange={(e) => setRfidInput(e.target.value)}
                    placeholder="Place card near reader..."
                    autoFocus
                    className="flex-1 bg-[#001a33] border border-[#0052A2]/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#0052A2] focus:ring-2 focus:ring-[#0052A2]/20 text-center font-mono"
                  />
                  <Button type="submit">
                    <Radio size={18} />
                  </Button>
                </div>
              </div>
            </form>
          </Card>

          {/* Scan Result */}
          {scanResult && (
            <Card
              className={`${
                scanResult.success
                  ? 'border-green-500/30 bg-green-500/5'
                  : 'border-red-500/30 bg-red-500/5'
              }`}
            >
              <div className="flex items-start gap-4">
                {scanResult.success ? (
                  <>
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="text-green-400" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-2">{scanResult.data.student_name}</h3>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-400">
                          <span className="text-gray-500">Time In:</span>{' '}
                          <span className="text-white font-mono">
                            {formatTime(scanResult.data.time_in)}
                          </span>
                        </p>
                        <p className={`font-semibold ${getStatusColor(scanResult.data.status)}`}>
                          Status: {scanResult.data.status}
                        </p>
                        {scanResult.data.fine > 0 && (
                          <p className="text-yellow-400">Fine: ${scanResult.data.fine.toFixed(2)}</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="text-red-400" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-red-400 mb-2">Scan Failed</h3>
                      <p className="text-red-300 text-sm">{scanResult.message}</p>
                    </div>
                  </>
                )}
              </div>
            </Card>
          )}

          {/* Recent Scans */}
          <Card>
            <h2 className="text-lg font-bold text-white mb-4">Recent Scans</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {recentScans.length > 0 ? (
                recentScans.map((scan, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-[#001a33] rounded-lg">
                    <div>
                      <p className="text-white font-medium">{scan.student_name}</p>
                      <p className="text-xs text-gray-400">{formatTime(scan.time_in)}</p>
                    </div>
                    <span className={`text-sm font-semibold ${getStatusColor(scan.status)}`}>
                      {scan.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">No scans yet</p>
              )}
            </div>
          </Card>
        </div>

        {/* Instructions */}
        <Card>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Radio size={20} />
            Instructions
          </h2>
          <div className="space-y-3 text-sm text-gray-300">
            <div>
              <h4 className="font-semibold text-white mb-1">1. Select Event</h4>
              <p className="text-xs text-gray-400">Choose the event for this attendance session</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">2. Scan Card</h4>
              <p className="text-xs text-gray-400">Place the student's RFID card near the reader</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">3. Review Status</h4>
              <p className="text-xs text-gray-400">Check if attendance was recorded correctly</p>
            </div>
            <div className="mt-6 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
              <p className="text-xs text-blue-300">
                ℹ️ The system automatically detects late arrivals based on event login time
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ScanAttendance;
