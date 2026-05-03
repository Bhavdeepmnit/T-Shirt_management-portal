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
  const [exporting, setExporting] = useState(false);
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
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to confirm payment'); }
    finally { setProcessing(false); }
  };

  const handleReject = async () => {
    if (reason.length < 5) {
      toast.error('Reason must be at least 5 characters');
      return;
    }
    setProcessing(true);
    try {
      await rejectPayment(rejectTarget._id, { reason });
      toast.success('Payment rejected');
      setRejectTarget(null);
      setReason('');
      fetchStudents();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to reject payment'); }
    finally { setProcessing(false); }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await exportStudents({ paymentStatus: statusFilter || undefined });
      // Create blob from response
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `MNIT_TShirt_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Excel downloaded!');
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-header">Branch Students</h1>
          <p className="page-subtitle">{total} students</p>
        </div>
        <button onClick={handleExport} disabled={exporting}
          className="btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto">
          <HiOutlineDownload className="w-5 h-5" />
          {exporting ? 'Downloading...' : 'Export Excel'}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-end">
        <div className="flex-1 min-w-0">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by name, ID, email..." />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['', 'pending', 'confirmed', 'rejected'].map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                statusFilter === s
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block card p-0 overflow-hidden">
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
                      <td className="table-cell"><p className="font-semibold">{s.fullName}</p><p className="text-xs text-slate-400">{s.email}</p></td>
                      <td className="table-cell font-mono text-xs">{s.studentId}</td>
                      <td className="table-cell font-bold text-indigo-700">{s.tshirtSize}</td>
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
                  {students.length === 0 && <tr><td colSpan={6} className="text-center py-12 text-slate-400">No students found</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="px-4 pb-2"><Pagination page={page} totalPages={totalPages} onPageChange={setPage} /></div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {students.map(s => (
              <div key={s._id} className="card p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-slate-900">{s.fullName}</p>
                    <p className="text-xs text-slate-400">{s.studentId}</p>
                  </div>
                  <span className={getPaymentBadgeClass(s.paymentStatus)}>{s.paymentStatus}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-3">
                  <div><span className="text-slate-400">Size:</span> <span className="font-bold text-indigo-700">{s.tshirtSize}</span></div>
                  <div><span className="text-slate-400">Phone:</span> {s.contactNumber}</div>
                  <div className="col-span-2"><span className="text-slate-400">Email:</span> {s.email}</div>
                </div>
                {s.paymentStatus === 'pending' && (
                  <div className="flex gap-2 pt-2 border-t border-slate-100">
                    <button onClick={() => { setConfirmTarget(s); setAmount('350'); }}
                      className="flex-1 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1">
                      <HiOutlineCheckCircle className="w-4 h-4" /> Confirm
                    </button>
                    <button onClick={() => { setRejectTarget(s); setReason(''); }}
                      className="flex-1 py-2 rounded-lg bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-1">
                      <HiOutlineXCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
                {s.paymentStatus === 'confirmed' && (
                  <p className="text-xs text-emerald-600 pt-2 border-t border-slate-100">✓ Paid {formatCurrency(s.paymentAmount)}</p>
                )}
              </div>
            ))}
            {students.length === 0 && <div className="text-center py-12 text-slate-400">No students found</div>}
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </>
      )}

      {/* Confirm Payment Modal */}
      {confirmTarget && (
        <div className="modal-overlay" onClick={() => setConfirmTarget(null)}>
          <div className="modal-content p-6 mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-2">Confirm Payment</h3>
            <p className="text-sm text-slate-500 mb-4">Student: <strong>{confirmTarget.fullName}</strong> ({confirmTarget.studentId})</p>
            <div><label className="input-label">Amount (₹)</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="input-field" min={1} />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setConfirmTarget(null)} className="btn-ghost">Cancel</button>
              <button onClick={handleConfirm} disabled={processing || !amount} className="btn-primary bg-emerald-600 hover:bg-emerald-700">
                {processing ? 'Processing...' : '✓ Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectTarget && (
        <div className="modal-overlay" onClick={() => setRejectTarget(null)}>
          <div className="modal-content p-6 mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-2 text-red-700">Reject Payment</h3>
            <p className="text-sm text-slate-500 mb-4">Student: <strong>{rejectTarget.fullName}</strong></p>
            <div>
              <label className="input-label">Reason * <span className="text-xs text-slate-400 font-normal">(min 5 characters)</span></label>
              <textarea value={reason} onChange={e => setReason(e.target.value)} className="input-field" rows={3}
                placeholder="e.g. Payment screenshot unclear, amount mismatch..." />
              {reason.length > 0 && reason.length < 5 && (
                <p className="text-xs text-red-500 mt-1">Reason must be at least 5 characters</p>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setRejectTarget(null)} className="btn-ghost">Cancel</button>
              <button onClick={handleReject} disabled={reason.length < 5 || processing} className="btn-danger">
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
