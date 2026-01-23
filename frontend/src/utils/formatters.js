// Format currency to Indonesian Rupiah
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

// Format date to Indonesian format
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Format date to short format
export const formatDateShort = (date) => {
  return new Date(date).toLocaleDateString('id-ID');
};

// Format datetime
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get status label
export const getStatusLabel = (status) => {
  const labels = {
    'menunggu_proses': 'Menunggu Proses',
    'sebagian_terproses': 'Sebagian Terproses',
    'terproses': 'Terproses'
  };
  return labels[status] || status;
};

// Get status color class
export const getStatusColorClass = (status) => {
  const colors = {
    'menunggu_proses': 'status-menunggu',
    'sebagian_terproses': 'status-sebagian',
    'terproses': 'status-terproses'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};
