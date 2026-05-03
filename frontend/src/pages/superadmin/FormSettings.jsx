import { useState, useEffect } from 'react';
import { getFormSettings, updateFormSettings, lockForm } from '../../api/superadmin.api';
import { formatDateTime, formatCurrency } from '../../utils/formatters';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import toast from 'react-hot-toast';

const FormSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState('');
  const [deadline, setDeadline] = useState('');
  const [saving, setSaving] = useState(false);
  const [showLockConfirm, setShowLockConfirm] = useState(false);
  const [lockReason, setLockReason] = useState('');
  const [locking, setLocking] = useState(false);

  useEffect(() => {
    getFormSettings().then(({ data }) => {
      setSettings(data.settings);
      setPrice(data.settings.tshirtPrice || 350);
      setDeadline(data.settings.registrationDeadline ? new Date(data.settings.registrationDeadline).toISOString().slice(0, 16) : '');
    }).finally(() => setLoading(false));
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const updates = { tshirtPrice: Number(price) };
      if (deadline) updates.registrationDeadline = new Date(deadline).toISOString();
      await updateFormSettings(updates);
      toast.success('Settings saved');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleLock = async () => {
    setLocking(true);
    try {
      await lockForm({ lockReason, lockAlertMessage: `Form closed: ${lockReason}` });
      toast.success('Form locked permanently');
      setSettings(prev => ({ ...prev, isFormOpen: false, lockedAt: new Date() }));
      setShowLockConfirm(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Lock failed'); }
    finally { setLocking(false); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div><h1 className="page-header">Form Settings</h1><p className="page-subtitle">Configure T-shirt pricing and form status</p></div>

      {/* Price & Deadline */}
      <div className="card">
        <h3 className="font-bold text-surface-900 mb-4">📋 Order Configuration</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="input-label">T-Shirt Price (₹)</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="input-field" min={1} />
          </div>
          <div>
            <label className="input-label">Registration Deadline</label>
            <input type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)} className="input-field" />
          </div>
        </div>
        <button onClick={handleSaveSettings} disabled={saving} className="btn-primary mt-4">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Form Lock */}
      <div className={`rounded-2xl p-6 border-2 ${settings?.isFormOpen ? 'bg-red-50 border-red-400' : 'bg-surface-100 border-surface-300'}`}>
        {!settings?.isFormOpen ? (
          <div>
            <p className="text-surface-600 font-semibold">✅ Form is LOCKED</p>
            <p className="text-sm text-surface-400 mt-1">Locked at: {formatDateTime(settings.lockedAt)}</p>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-bold text-red-700 mb-2">⚠️ Danger Zone</h3>
            <p className="text-sm text-red-600 mb-4">Permanently lock the form. This cannot be undone.</p>
            {!showLockConfirm ? (
              <button onClick={() => setShowLockConfirm(true)} className="btn-danger">🔒 Permanently Close Form</button>
            ) : (
              <div className="space-y-3">
                <textarea value={lockReason} onChange={e => setLockReason(e.target.value)}
                  placeholder="Reason (e.g., 'Deadline reached')" className="input-field border-red-300" rows={3} />
                <div className="flex gap-3">
                  <button onClick={handleLock} disabled={!lockReason || locking} className="btn-danger">
                    {locking ? 'Locking...' : '⚠️ CONFIRM LOCK'}
                  </button>
                  <button onClick={() => setShowLockConfirm(false)} className="btn-ghost">Cancel</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FormSettings;
