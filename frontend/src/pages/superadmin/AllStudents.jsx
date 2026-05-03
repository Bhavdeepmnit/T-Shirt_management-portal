import { useState, useEffect } from 'react';
import { getAllStudents, updateStudent, deleteStudent } from '../../api/superadmin.api';
import { exportStudents } from '../../api/admin.api';
import { BRANCHES, SIZES, getPaymentBadgeClass } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import SearchInput from '../../components/shared/SearchInput';
import Pagination from '../../components/shared/Pagination';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { useDebounce } from '../../hooks/useDebounce';
import toast from 'react-hot-toast';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineDownload } from 'react-icons/hi';

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [editStudent, setEditStudent] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const debouncedSearch = useDebounce(search, 400);

  const fetchStudents = () => {
    setLoading(true);
    getAllStudents({ page, limit: 15, search: debouncedSearch, branch, paymentStatus })
      .then(({ data }) => { setStudents(data.students); setTotal(data.total); setTotalPages(data.totalPages); })
      .catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchStudents(); }, [page, debouncedSearch, branch, paymentStatus]);

  const handleEditSave = async () => {
    setSaving(true);
    try { await updateStudent(editStudent._id, editForm); toast.success('Updated'); setEditStudent(null); fetchStudents(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await deleteStudent(deleteTarget._id); toast.success('Deleted'); setDeleteTarget(null); fetchStudents(); }
    catch { toast.error('Failed'); }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await exportStudents({ branch: branch || undefined, paymentStatus: paymentStatus || undefined });
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `MNIT_TShirt_${branch || 'ALL'}_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Excel downloaded!');
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Export failed');
    } finally { setExporting(false); }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="page-header">All Students</h1><p className="page-subtitle">{total} total</p></div>
        <button onClick={handleExport} disabled={exporting}
          className="btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto">
          <HiOutlineDownload className="w-5 h-5" />
          {exporting ? 'Downloading...' : 'Export Excel'}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-end">
        <div className="flex-1 min-w-0"><SearchInput value={search} onChange={setSearch} placeholder="Search by name, ID, email..." /></div>
        <div className="flex gap-2">
          <select value={branch} onChange={e => { setBranch(e.target.value); setPage(1); }} className="input-field w-auto text-sm">
            <option value="">All Branches</option>
            {BRANCHES.map(b => <option key={b.value} value={b.value}>{b.value}</option>)}
          </select>
          <select value={paymentStatus} onChange={e => { setPaymentStatus(e.target.value); setPage(1); }} className="input-field w-auto text-sm">
            <option value="">All Status</option>
            <option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block card p-0 overflow-hidden">
            <div className="table-container">
              <table className="w-full">
                <thead><tr>
                  <th className="table-header">Name</th><th className="table-header">ID</th><th className="table-header">Branch</th>
                  <th className="table-header">Size</th><th className="table-header">Payment</th><th className="table-header">Date</th><th className="table-header">Actions</th>
                </tr></thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s._id} className="table-row">
                      <td className="table-cell"><p className="font-semibold">{s.fullName}</p><p className="text-xs text-slate-400">{s.email}</p></td>
                      <td className="table-cell font-mono text-xs">{s.studentId}</td>
                      <td className="table-cell"><span className="badge-info">{s.branch}</span></td>
                      <td className="table-cell font-bold text-indigo-700">{s.tshirtSize}</td>
                      <td className="table-cell"><span className={getPaymentBadgeClass(s.paymentStatus)}>{s.paymentStatus}</span></td>
                      <td className="table-cell text-xs">{formatDate(s.formSubmittedAt)}</td>
                      <td className="table-cell"><div className="flex gap-2">
                        <button onClick={() => { setEditStudent(s); setEditForm({ fullName: s.fullName, tshirtSize: s.tshirtSize, paymentStatus: s.paymentStatus }); }}
                          className="text-indigo-600 hover:text-indigo-800 p-1"><HiOutlinePencil className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteTarget(s)} className="text-red-500 hover:text-red-700 p-1"><HiOutlineTrash className="w-4 h-4" /></button>
                      </div></td>
                    </tr>
                  ))}
                  {students.length === 0 && <tr><td colSpan={7} className="text-center py-12 text-slate-400">No students found</td></tr>}
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
                    <p className="font-semibold text-slate-900 text-sm">{s.fullName}</p>
                    <p className="text-xs text-slate-400">{s.studentId}</p>
                  </div>
                  <span className={getPaymentBadgeClass(s.paymentStatus)}>{s.paymentStatus}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-slate-600 mb-3">
                  <div><span className="text-slate-400">Branch:</span> <span className="badge-info text-[10px] px-1.5 py-0.5">{s.branch}</span></div>
                  <div><span className="text-slate-400">Size:</span> <span className="font-bold text-indigo-700">{s.tshirtSize}</span></div>
                  <div><span className="text-slate-400">Date:</span> {formatDate(s.formSubmittedAt)}</div>
                </div>
                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <button onClick={() => { setEditStudent(s); setEditForm({ fullName: s.fullName, tshirtSize: s.tshirtSize, paymentStatus: s.paymentStatus }); }}
                    className="flex-1 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium hover:bg-indigo-100 flex items-center justify-center gap-1">
                    <HiOutlinePencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => setDeleteTarget(s)}
                    className="py-2 px-4 rounded-lg bg-red-50 text-red-700 text-xs font-medium hover:bg-red-100 flex items-center justify-center gap-1">
                    <HiOutlineTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {students.length === 0 && <div className="text-center py-12 text-slate-400">No students found</div>}
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </>
      )}

      {editStudent && (
        <div className="modal-overlay" onClick={() => setEditStudent(null)}>
          <div className="modal-content p-6 mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Edit: {editStudent.fullName}</h3>
            <div className="space-y-4">
              <div><label className="input-label">Name</label><input value={editForm.fullName||''} onChange={e=>setEditForm(p=>({...p,fullName:e.target.value}))} className="input-field"/></div>
              <div><label className="input-label">Size</label><select value={editForm.tshirtSize||''} onChange={e=>setEditForm(p=>({...p,tshirtSize:e.target.value}))} className="input-field">{SIZES.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
              <div><label className="input-label">Payment</label><select value={editForm.paymentStatus||''} onChange={e=>setEditForm(p=>({...p,paymentStatus:e.target.value}))} className="input-field"><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="rejected">Rejected</option></select></div>
              <div className="flex justify-end gap-3"><button onClick={()=>setEditStudent(null)} className="btn-ghost">Cancel</button><button onClick={handleEditSave} disabled={saving} className="btn-primary">{saving?'Saving...':'Save'}</button></div>
            </div>
          </div>
        </div>
      )}
      <ConfirmationDialog isOpen={!!deleteTarget} onClose={()=>setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete Student" message={`Delete ${deleteTarget?.fullName}?`} confirmText="Delete" danger />
    </div>
  );
};

export default AllStudents;
