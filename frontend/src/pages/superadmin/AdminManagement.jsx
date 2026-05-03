import { useState, useEffect } from 'react';
import { getAdmins, createAdmin, updateAdmin, deleteAdmin } from '../../api/superadmin.api';
import { BRANCHES } from '../../utils/constants';
import ConfirmationDialog from '../../components/shared/ConfirmationDialog';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', branch: '', contactNumber: '', whatsappNumber: '' });
  const [saving, setSaving] = useState(false);

  const fetchAdmins = () => {
    getAdmins().then(({ data }) => setAdmins(data.admins)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchAdmins(); }, []);

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', branch: '', contactNumber: '', whatsappNumber: '' });
    setEditingAdmin(null);
    setShowForm(false);
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({ name: admin.name, email: admin.email, password: '', branch: admin.branch, contactNumber: admin.contactNumber || '', whatsappNumber: admin.whatsappNumber || '' });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingAdmin) {
        const updates = { ...formData };
        if (!updates.password) delete updates.password;
        delete updates.email; delete updates.branch;
        await updateAdmin(editingAdmin._id, updates);
        toast.success('Admin updated');
      } else {
        await createAdmin(formData);
        toast.success('Admin created');
      }
      resetForm();
      fetchAdmins();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await deleteAdmin(deleteTarget._id);
      toast.success('Admin deleted');
      setDeleteTarget(null);
      fetchAdmins();
    } catch (err) { toast.error('Delete failed'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Manage Admins</h1>
          <p className="page-subtitle">Branch POC accounts ({admins.length} admins)</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary flex items-center gap-2">
          <HiOutlinePlus className="w-5 h-5" /> Add Admin
        </button>
      </div>

      {/* Admins Table */}
      <div className="card p-0 overflow-hidden">
        <div className="table-container">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Name</th>
                <th className="table-header">Email</th>
                <th className="table-header">Branch</th>
                <th className="table-header">Contact</th>
                <th className="table-header">Students</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr key={admin._id} className="table-row">
                  <td className="table-cell font-semibold">{admin.name}</td>
                  <td className="table-cell text-surface-500">{admin.email}</td>
                  <td className="table-cell"><span className="badge-info">{admin.branch}</span></td>
                  <td className="table-cell text-xs">{admin.contactNumber || '-'}</td>
                  <td className="table-cell font-semibold">{admin.studentsCount || 0}</td>
                  <td className="table-cell">
                    <span className={admin.isActive ? 'badge-success' : 'badge-danger'}>
                      {admin.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(admin)} className="text-primary-600 hover:text-primary-800 p-1" title="Edit">
                        <HiOutlinePencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteTarget(admin)} className="text-red-500 hover:text-red-700 p-1" title="Delete">
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">{editingAdmin ? 'Edit Admin' : 'Create New Admin'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="input-label">Name *</label>
                <input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="input-field" required />
              </div>
              {!editingAdmin && (
                <>
                  <div>
                    <label className="input-label">Email *</label>
                    <input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      className="input-field" required />
                  </div>
                  <div>
                    <label className="input-label">Branch *</label>
                    <select value={formData.branch} onChange={e => setFormData(p => ({ ...p, branch: e.target.value }))}
                      className="input-field" required>
                      <option value="">Select branch</option>
                      {BRANCHES.map(b => <option key={b.value} value={b.value}>{b.value} — {b.label}</option>)}
                    </select>
                  </div>
                </>
              )}
              <div>
                <label className="input-label">{editingAdmin ? 'New Password (leave blank to keep)' : 'Password *'}</label>
                <input type="password" value={formData.password} onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                  className="input-field" required={!editingAdmin} minLength={6} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Contact Number *</label>
                  <input value={formData.contactNumber} onChange={e => setFormData(p => ({ ...p, contactNumber: e.target.value }))}
                    className="input-field" pattern="[0-9]{10}" maxLength={10} required />
                </div>
                <div>
                  <label className="input-label">WhatsApp Number *</label>
                  <input value={formData.whatsappNumber} onChange={e => setFormData(p => ({ ...p, whatsappNumber: e.target.value }))}
                    className="input-field" pattern="[0-9]{10}" maxLength={10} required />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={resetForm} className="btn-ghost">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? 'Saving...' : editingAdmin ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Admin"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        confirmText="Delete"
        danger
      />
    </div>
  );
};

export default AdminManagement;
