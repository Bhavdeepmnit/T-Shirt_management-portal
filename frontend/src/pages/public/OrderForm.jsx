import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { submitOrder, getFormStatus } from '../../api/student.api';
import { BRANCHES, SIZES, SIZE_CHART } from '../../utils/constants';
import toast from 'react-hot-toast';
import { HiOutlineCheckCircle, HiOutlinePhone, HiOutlineMail, HiOutlineInformationCircle } from 'react-icons/hi';

const OrderFormPage = () => {
  const [formData, setFormData] = useState({
    fullName: '', email: '', studentId: '', branch: '',
    contactNumber: '', whatsappNumber: '', tshirtSize: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [branchAdmin, setBranchAdmin] = useState(null);
  const [formStatus, setFormStatus] = useState({ isFormOpen: true, tshirtPrice: 350, branchPrices: [] });
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [sameAsContact, setSameAsContact] = useState(true);
  const [branchPrice, setBranchPrice] = useState(350);

  useEffect(() => {
    getFormStatus().then(({ data }) => setFormStatus(data)).catch(() => {});
  }, []);

  // Update price when branch changes
  useEffect(() => {
    if (formData.branch && formStatus.branchPrices?.length > 0) {
      const found = formStatus.branchPrices.find(bp => bp.branch === formData.branch);
      setBranchPrice(found ? found.price : (formStatus.tshirtPrice || 350));
    } else {
      setBranchPrice(formStatus.tshirtPrice || 350);
    }
  }, [formData.branch, formStatus]);

  useEffect(() => {
    if (sameAsContact) {
      setFormData(prev => ({ ...prev, whatsappNumber: prev.contactNumber }));
    }
  }, [formData.contactNumber, sameAsContact]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await submitOrder(formData);
      setSubmitted(true);
      setBranchAdmin(data.branchAdmin);
      toast.success('Order submitted successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit order';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Form locked
  if (!formStatus.isFormOpen) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white border-2 border-red-500 rounded-2xl shadow-xl max-w-lg w-full p-8 text-center animate-scale-in">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">🔒</span>
              </div>
              <div className="absolute inset-0 w-20 h-20 bg-red-200 rounded-full animate-ping opacity-30" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-red-700 mb-3">Form Permanently Closed</h1>
          <p className="text-surface-600 mb-4">{formStatus.lockAlertMessage}</p>
          <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium text-sm">← Back to Home</Link>
        </div>
      </div>
    );
  }

  // Success state
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-primary-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 text-center animate-scale-in">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
              <HiOutlineCheckCircle className="w-12 h-12 text-emerald-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-surface-900 mb-3">Order Submitted! 🎉</h1>
          <p className="text-surface-600 mb-6">
            Your T-shirt order has been recorded. Please contact your branch representative to complete payment.
          </p>

          {branchAdmin && (
            <div className="bg-primary-50 rounded-xl p-6 border border-primary-100 text-left mb-6">
              <h3 className="font-bold text-primary-900 mb-3">Your Branch Representative</h3>
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-sm text-surface-700">
                  <span className="font-semibold">👤 {branchAdmin.name}</span>
                </p>
                {branchAdmin.contactNumber && (
                  <p className="flex items-center gap-2 text-sm text-surface-600">
                    <HiOutlinePhone className="w-4 h-4" />
                    <a href={`tel:${branchAdmin.contactNumber}`} className="text-primary-600 hover:underline">
                      {branchAdmin.contactNumber}
                    </a>
                  </p>
                )}
                {branchAdmin.whatsappNumber && (
                  <p className="flex items-center gap-2 text-sm text-surface-600">
                    <span>💬</span>
                    <a href={`https://wa.me/91${branchAdmin.whatsappNumber}`} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">
                      WhatsApp: {branchAdmin.whatsappNumber}
                    </a>
                  </p>
                )}
                {branchAdmin.email && (
                  <p className="flex items-center gap-2 text-sm text-surface-600">
                    <HiOutlineMail className="w-4 h-4" />
                    <a href={`mailto:${branchAdmin.email}`} className="text-primary-600 hover:underline">
                      {branchAdmin.email}
                    </a>
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 mb-6">
            <p className="text-sm text-amber-800">
              <strong>💰 Payment Amount:</strong> ₹{branchPrice}
            </p>
            <p className="text-xs text-amber-600 mt-1">
              Pay directly to your branch representative. Your order will be confirmed once payment is verified.
            </p>
          </div>

          <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-primary-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm mb-4 font-medium">
            ← Back to Home
          </Link>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-3xl shadow-glow">
              👕
            </div>
          </div>
          <h1 className="text-3xl font-bold text-surface-900 mb-2">T-Shirt Order Form</h1>
          <p className="text-surface-500">MNIT Jaipur · Batch 2026 · ₹{branchPrice}</p>
        </div>

        {/* Form Card */}
        <div className="card animate-slide-up" style={{ animationDelay: '150ms' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="input-label">Full Name *</label>
              <input name="fullName" value={formData.fullName} onChange={handleChange}
                placeholder="e.g. Arjun Mehta" className="input-field" required />
            </div>

            {/* Email & Student ID */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Email *</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange}
                  placeholder="2022ucs1234@mnit.ac.in" className="input-field" required />
              </div>
              <div>
                <label className="input-label">Student ID *</label>
                <input name="studentId" value={formData.studentId} onChange={handleChange}
                  placeholder="e.g. 2022UCS1234" className="input-field" required />
              </div>
            </div>

            {/* Branch */}
            <div>
              <label className="input-label">Branch *</label>
              <select name="branch" value={formData.branch} onChange={handleChange}
                className="input-field" required>
                <option value="">Select your branch</option>
                {BRANCHES.map(b => (
                  <option key={b.value} value={b.value}>{b.value} — {b.label}</option>
                ))}
              </select>
            </div>

            {/* Contact Numbers */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Contact Number *</label>
                <input name="contactNumber" value={formData.contactNumber} onChange={handleChange}
                  placeholder="10-digit mobile" pattern="[0-9]{10}" maxLength={10} className="input-field" required />
              </div>
              <div>
                <label className="input-label flex items-center gap-2">
                  WhatsApp Number *
                </label>
                <input name="whatsappNumber" value={formData.whatsappNumber}
                  onChange={handleChange}
                  disabled={sameAsContact}
                  placeholder="10-digit mobile" pattern="[0-9]{10}" maxLength={10} className="input-field disabled:bg-surface-100" required />
                <label className="flex items-center gap-2 mt-2 text-xs text-surface-500 cursor-pointer">
                  <input type="checkbox" checked={sameAsContact} onChange={() => setSameAsContact(!sameAsContact)}
                    className="rounded border-surface-300" />
                  Same as contact number
                </label>
              </div>
            </div>

            {/* T-Shirt Size */}
            <div>
              <label className="input-label flex items-center gap-2">
                T-Shirt Size *
                <button type="button" onClick={() => setShowSizeChart(true)}
                  className="text-primary-600 hover:text-primary-700 flex items-center gap-1">
                  <HiOutlineInformationCircle className="w-4 h-4" />
                  <span className="text-xs">Size Chart</span>
                </button>
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {SIZES.map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, tshirtSize: size }))}
                    className={`py-3 rounded-xl font-bold text-sm border-2 transition-all duration-200 ${
                      formData.tshirtSize === size
                        ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-glow'
                        : 'border-surface-200 hover:border-primary-300 text-surface-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading || !formData.tshirtSize}
              className="btn-primary w-full text-center justify-center mt-6">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                '🎽 Submit Order'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="modal-overlay" onClick={() => setShowSizeChart(false)}>
          <div className="modal-content p-6 max-w-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-surface-900 mb-4">📏 T-Shirt Size Chart</h3>
            <div className="table-container">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-header">Size</th>
                    <th className="table-header">Chest (in)</th>
                    <th className="table-header">Length (in)</th>
                    <th className="table-header">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZE_CHART.map(row => (
                    <tr key={row.size} className="table-row">
                      <td className="table-cell font-bold text-primary-700">{row.size}</td>
                      <td className="table-cell">{row.chest}</td>
                      <td className="table-cell">{row.length}</td>
                      <td className="table-cell text-surface-500">{row.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={() => setShowSizeChart(false)} className="btn-primary w-full mt-4">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderFormPage;
