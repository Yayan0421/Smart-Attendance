export const validateStudentNumber = (studentNumber) => {
  const regex = /^\d{2}-\d{5}$/;
  return regex.test(studentNumber);
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'Present':
      return 'bg-green-500/10 text-green-400 border-green-500/20';
    case 'Late':
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    case 'Absent':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    default:
      return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  }
};

export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const csv = [headers.join(','), ...data.map((row) => headers.map((h) => JSON.stringify(row[h])).join(','))].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
};
