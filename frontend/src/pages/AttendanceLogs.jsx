import React, { useState, useEffect } from 'react';
import { attendanceService } from '../services/api';
import { Card, Button } from '../components/UIComponents';
import { FileText, Download, Filter } from 'lucide-react';
import { formatTime, formatDate, getStatusColor, exportToCSV } from '../utils/helpers';

const AttendanceLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, yearFilter, eventFilter, dateFilter]);

  const fetchLogs = async () => {
    try {
      const response = await attendanceService.getLogs({});
      setLogs(response.data);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = logs;

    if (yearFilter) {
      filtered = filtered.filter((log) => log.User?.year_level === yearFilter);
    }

    if (eventFilter) {
      filtered = filtered.filter((log) => log.event_id === eventFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter(
        (log) =>
          new Date(log.time_in).toDateString() ===
          new Date(dateFilter).toDateString()
      );
    }

    setFilteredLogs(filtered);
  };

  const handleExport = () => {
    const data = filteredLogs.map((log) => ({
      'Student Name': `${log.User?.firstname || ''} ${log.User?.surname || ''}`,
      'Student Number': log.User?.student_number,
      'Year Level': log.User?.year_level,
      'Event': log.Event?.name,
      'Time In': formatTime(log.time_in),
      'Status': log.status,
      'Fine': `$${log.fine.toFixed(2)}`,
    }));

    exportToCSV(data, `attendance_${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Group logs by year level
  const groupedByYear = {
    '1st Year': filteredLogs.filter((log) => log.User?.year_level === '1st Year'),
    '2nd Year': filteredLogs.filter((log) => log.User?.year_level === '2nd Year'),
    '3rd Year': filteredLogs.filter((log) => log.User?.year_level === '3rd Year'),
    '4th Year': filteredLogs.filter((log) => log.User?.year_level === '4th Year'),
  };

  const yearLevels = Object.entries(groupedByYear).filter(([_, logs]) => logs.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white">Attendance Logs</h1>
          <p className="text-gray-400 mt-2">View and manage attendance records</p>
        </div>
        <Button onClick={handleExport} disabled={filteredLogs.length === 0}>
          <Download size={18} className="mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-gray-400" />
          <h3 className="font-semibold text-white">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="bg-[#001a33] border border-[#0052A2]/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#0052A2]"
          >
            <option value="">All Year Levels</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-[#001a33] border border-[#0052A2]/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#0052A2]"
          />

          <button
            onClick={() => {
              setYearFilter('');
              setDateFilter('');
              setEventFilter('');
            }}
            className="bg-[#0052A2]/10 hover:bg-[#0052A2]/20 border border-[#0052A2]/30 rounded-lg px-4 py-2 text-gray-300 transition"
          >
            Clear Filters
          </button>
        </div>
      </Card>

      {/* Logs by Year Level */}
      {yearLevels.length > 0 ? (
        yearLevels.map(([yearLevel, yearLogs]) => (
          <div key={yearLevel} className="space-y-4">
            <h2 className="text-xl font-bold text-white">{yearLevel}</h2>
            <div className="overflow-x-auto">
              <Card>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#0052A2]/20">
                      <th className="text-left py-3 px-4 font-semibold text-gray-300">
                        Student Name
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-300">
                        Student #
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-300">
                        Event
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-300">
                        Time In
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-300">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-300">
                        Fine
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="border-b border-[#0052A2]/10 hover:bg-[#0052A2]/5 transition"
                      >
                        <td className="py-3 px-4 text-white">
                          {log.User?.firstname} {log.User?.surname}
                        </td>
                        <td className="py-3 px-4 text-gray-400">
                          {log.User?.student_number}
                        </td>
                        <td className="py-3 px-4 text-gray-400">
                          {log.Event?.name}
                        </td>
                        <td className="py-3 px-4 text-gray-400">
                          {formatTime(log.time_in)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                              log.status
                            )}`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-white font-semibold">
                          ${parseFloat(log.fine).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          </div>
        ))
      ) : (
        <Card className="text-center py-12">
          <FileText className="mx-auto text-gray-500 mb-4" size={48} />
          <p className="text-gray-400">No attendance logs found</p>
        </Card>
      )}
    </div>
  );
};

export default AttendanceLogs;
