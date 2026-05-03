export const BRANCHES = [
  { value: 'CSE', label: 'Computer Science & Engineering' },
  { value: 'ECE', label: 'Electronics & Communication' },
  { value: 'EE', label: 'Electrical Engineering' },
  { value: 'Civil', label: 'Civil Engineering' },
  { value: 'Meta', label: 'Metallurgical & Materials' },
  { value: 'Mech', label: 'Mechanical Engineering' },
  { value: 'Chem', label: 'Chemical Engineering' },
];

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

export const SIZE_CHART = [
  { size: 'XS', chest: '34–36', length: '27', bestFor: 'Very slim build' },
  { size: 'S', chest: '36–38', length: '28', bestFor: 'Slim build' },
  { size: 'M', chest: '38–40', length: '29', bestFor: 'Average build' },
  { size: 'L', chest: '40–42', length: '30', bestFor: 'Slightly broad' },
  { size: 'XL', chest: '42–44', length: '31', bestFor: 'Broad build' },
  { size: 'XXL', chest: '44–46', length: '32', bestFor: 'Heavy build' },
  { size: 'XXXL', chest: '46–48', length: '33', bestFor: 'XL heavy build' },
];

export const PAYMENT_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'submitted', label: 'Submitted', color: 'info' },
  { value: 'confirmed', label: 'Confirmed', color: 'success' },
  { value: 'rejected', label: 'Rejected', color: 'danger' },
];

export const getPaymentBadgeClass = (status) => {
  const map = {
    pending: 'badge-warning',
    submitted: 'badge-info',
    confirmed: 'badge-success',
    rejected: 'badge-danger',
  };
  return map[status] || 'badge-neutral';
};
