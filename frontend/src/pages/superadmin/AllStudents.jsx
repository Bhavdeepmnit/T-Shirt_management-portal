import { useState, useEffect } from 'react';
import { getAllStudents, updateStudent, deleteStudent } from '../../api/superadmin.api';
import { BRANCHES, SIZES, getPaymentBadgeClass } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import SearchInput from '../../components/shared/SearchInput';
import Pagination from '../../components/shared/Pagination';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { useDebounce } from '../../hooks/useDebounce';
import toast from 'react-hot-toast';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';

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

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="page-header">All Students</h1><p className="page-subtitle">{total} total</p></div>
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]"><SearchInput value={search} onChange={setSearch} placeholder="Search..." /></div>
        <select value={branch} onChange={e => { setBranch(e.target.value); setPage(1); }} className="input-field w-auto">
          <option value="">All Branches</option>
          {BRANCHES.map(b => <option key={b.value} value={b.value}>{b.value}</option>)}
        </select>
        <select value={paymentStatus} onChange={e => { setPaymentStatus(e.target.value); setPage(1); }} className="input-field w-auto">
          <option value="">All Status</option>
          <option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="rejected">Rejected</option>
        </select>
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className="card p-0 overflow-hidden">
          <div className="table-container">
            <table className="w-full">
              <thead><tr>
                <th className="table-header">Name</th><th className="table-header">ID</th><th className="table-header">Branch</th>
                <th className="table-header">Size</th><th className="table-header">Payment</th><th className="table-header">Date</th><th className="table-header">Actions</th>
              </tr></thead>
              <tbody>
                {students.map(s => (
                  <tr key={s._id} className="table-row">
                    <td className="table-cell"><p className="font-semibold">{s.fullName}</p><p className="text-xs text-surface-400">{s.email}</p></td>
                    <td className="table-cell font-mono text-xs">{s.studentId}</td>
                    <td className="table-cell"><span className="badge-info">{s.branch}</span></td>
                    <td className="table-cell font-bold text-primary-700">{s.tshirtSize}</td>
                    <td className="table-cell"><span className={getPaymentBadgeClass(s.paymentStatus)}>{s.paymentStatus}</span></td>
                    <td className="table-cell text-xs">{formatDate(s.formSubmittedAt)}</td>
                    <td className="table-cell"><div className="flex gap-2">
                      <button onClick={() => { setEditStudent(s); setEditForm({ fullName: s.fullName, tshirtSize: s.tshirtSize, paymentStatus: s.paymentStatus }); }}
                        className="text-primary-600 hover:text-primary-800 p-1"><HiOutlinePencil className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteTarget(s)} className="text-red-500 hover:text-red-700 p-1"><HiOutlineTrash className="w-4 h-4" /></button>
                    </div></td>
                  </tr>
                ))}
                {students.length === 0 && <tr><td colSpan={7} className="text-center py-12 text-surface-400">No students found</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="px-4 pb-2"><Pagination page={page} totalPages={totalPages} onPageChange={setPage} /></div>
        </div>
      )}
      {editStudent && (
        <div className="modal-overlay" onClick={() => setEditStudent(null)}>
          <div className="modal-content p-6" onClick={e => e.stopPropagation()}>
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
