import { useState, useEffect } from 'react';
import { getBranchStudents, confirmPayment, rejectPayment, exportStudents } from '../../api/admin.api';
import { getPaymentBadgeClass } from '../../utils/constants';
import { formatDate, formatCurrency } from '../../utils/formatters';
import SearchInput from '../../components/shared/SearchInput';
import Pagination from '../../components/shared/Pagination';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { useDebounce } from '../../hooks/useDebounce';
import toast from 'react-hot-toast';
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineDownload } from 'react-icons/hi';

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [amount, setAmount] = useState('350');
  const [reason, setReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const debouncedSearch = useDebounce(search, 400);

  const fetchStudents = () => {
    setLoading(true);
    getBranchStudents({ page, limit: 15, search: debouncedSearch, paymentStatus: statusFilter })
      .then(({ data }) => { setStudents(data.students); setTotal(data.total); setTotalPages(data.totalPages); })
      .catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchStudents(); }, [page, debouncedSearch, statusFilter]);

  const handleConfirm = async () => {
    setProcessing(true);
    try {
      await confirmPayment(confirmTarget._id, { paymentAmount: Number(amount) });
      toast.success(`Payment confirmed for ${confirmTarget.fullName}`);
      setConfirmTarget(null);
      fetchStudents();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setProcessing(false); }
  };

  const handleReject = async () => {
    setProcessing(true);
    try {
      await rejectPayment(rejectTarget._id, { reason });
      toast.success('Payment rejected');
      setRejectTarget(null);
      fetchStudents();
    } catch (err) { toast.error('Failed'); }
    finally { setProcessing(false); }
  };

  const handleExport = async () => {
    try {
      const { data } = await exportStudents({ paymentStatus: statusFilter || undefined });
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `MNIT_TShirt_Export_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Excel exported!');
    } catch { toast.error('Export failed'); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><h1 className="page-header">Branch Students</h1><p className="page-subtitle">{total} students</p></div>
        <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
          <HiOutlineDownload className="w-5 h-5" /> Export Excel
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]"><SearchInput value={search} onChange={setSearch} placeholder="Search..." /></div>
        <div className="flex gap-2">
          {['', 'pending', 'confirmed', 'rejected'].map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === s ? 'bg-primary-600 text-white shadow' : 'bg-white text-surface-600 border border-surface-200 hover:bg-surface-50'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="card p-0 overflow-hidden">
          <div className="table-container">
            <table className="w-full">
              <thead><tr>
                <th className="table-header">Name</th><th className="table-header">ID</th>
                <th className="table-header">Size</th><th className="table-header">Contact</th>
                <th className="table-header">Payment</th><th className="table-header">Actions</th>
              </tr></thead>
              <tbody>
                {students.map(s => (
                  <tr key={s._id} className="table-row">
                    <td className="table-cell"><p className="font-semibold">{s.fullName}</p><p className="text-xs text-surface-400">{s.email}</p></td>
                    <td className="table-cell font-mono text-xs">{s.studentId}</td>
                    <td className="table-cell font-bold text-primary-700">{s.tshirtSize}</td>
                    <td className="table-cell text-xs">{s.contactNumber}</td>
                    <td className="table-cell"><span className={getPaymentBadgeClass(s.paymentStatus)}>{s.paymentStatus}</span></td>
                    <td className="table-cell">
                      {s.paymentStatus === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => { setConfirmTarget(s); setAmount('350'); }} className="text-emerald-600 hover:text-emerald-800 p-1" title="Confirm">
                            <HiOutlineCheckCircle className="w-5 h-5" />
                          </button>
                          <button onClick={() => { setRejectTarget(s); setReason(''); }} className="text-red-500 hover:text-red-700 p-1" title="Reject">
                            <HiOutlineXCircle className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                      {s.paymentStatus === 'confirmed' && <span className="text-xs text-emerald-600">✓ {formatCurrency(s.paymentAmount)}</span>}
                    </td>
                  </tr>
                ))}
                {students.length === 0 && <tr><td colSpan={6} className="text-center py-12 text-surface-400">No students</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="px-4 pb-2"><Pagination page={page} totalPages={totalPages} onPageChange={setPage} /></div>
        </div>
      )}

      {/* Confirm Payment Modal */}
      {confirmTarget && (
        <div className="modal-overlay" onClick={() => setConfirmTarget(null)}>
          <div className="modal-content p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-2">Confirm Payment</h3>
            <p className="text-sm text-surface-500 mb-4">Student: <strong>{confirmTarget.fullName}</strong> ({confirmTarget.studentId})</p>
            <div><label className="input-label">Amount (₹)</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="input-field" min={1} />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setConfirmTarget(null)} className="btn-ghost">Cancel</button>
              <button onClick={handleConfirm} disabled={processing} className="btn-primary bg-emerald-600 hover:bg-emerald-700">
                {processing ? 'Processing...' : '✓ Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectTarget && (
        <div className="modal-overlay" onClick={() => setRejectTarget(null)}>
          <div className="modal-content p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-2 text-red-700">Reject Payment</h3>
            <p className="text-sm text-surface-500 mb-4">Student: <strong>{rejectTarget.fullName}</strong></p>
            <div><label className="input-label">Reason *</label>
              <textarea value={reason} onChange={e => setReason(e.target.value)} className="input-field" rows={3} placeholder="Reason for rejection..." />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setRejectTarget(null)} className="btn-ghost">Cancel</button>
              <button onClick={handleReject} disabled={!reason || processing} className="btn-danger">
                {processing ? 'Processing...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsList;
