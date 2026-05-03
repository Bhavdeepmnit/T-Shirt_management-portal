import { useState, useEffect } from 'react';
import { getFormSettings, updateFormSettings, lockForm } from '../../api/superadmin.api';
import { formatDateTime, formatCurrency } from '../../utils/formatters';
import { BRANCHES } from '../../utils/constants';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import toast from 'react-hot-toast';

const FormSettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [defaultPrice, setDefaultPrice] = useState('');
  const [branchPrices, setBranchPrices] = useState({});
  const [deadline, setDeadline] = useState('');
  const [saving, setSaving] = useState(false);
  const [showLockConfirm, setShowLockConfirm] = useState(false);
  const [lockReason, setLockReason] = useState('');
  const [locking, setLocking] = useState(false);

  useEffect(() => {
    getFormSettings().then(({ data }) => {
      setSettings(data.settings);
      setDefaultPrice(data.settings.tshirtPrice || 350);
      setDeadline(data.settings.registrationDeadline ? new Date(data.settings.registrationDeadline).toISOString().slice(0, 16) : '');
      
      // Initialize branch prices
      const prices = {};
      BRANCHES.forEach(b => {
        const found = (data.settings.branchPrices || []).find(bp => bp.branch === b.value);
        prices[b.value] = found ? found.price : (data.settings.tshirtPrice || 350);
      });
      setBranchPrices(prices);
    }).finally(() => setLoading(false));
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const branchPricesArray = Object.entries(branchPrices).map(([branch, price]) => ({
        branch,
        price: Number(price)
      }));
      const updates = {
        tshirtPrice: Number(defaultPrice),
        branchPrices: branchPricesArray
      };
      if (deadline) updates.registrationDeadline = new Date(deadline).toISOString();
      await updateFormSettings(updates);
      toast.success('Settings saved!');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleSetAllPrices = () => {
    const newPrices = {};
    BRANCHES.forEach(b => { newPrices[b.value] = Number(defaultPrice); });
    setBranchPrices(newPrices);
    toast.success(`All branches set to ₹${defaultPrice}`);
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
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div><h1 className="page-header">Form Settings</h1><p className="page-subtitle">Configure T-shirt pricing and form status · Batch 2026</p></div>

      {/* Default Price & Deadline */}
      <div className="card">
        <h3 className="font-bold text-slate-900 mb-4">📋 General Configuration</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="input-label">Default T-Shirt Price (₹)</label>
            <input type="number" value={defaultPrice} onChange={e => setDefaultPrice(e.target.value)} className="input-field" min={1} />
            <p className="text-xs text-slate-400 mt-1">Used as fallback if branch price is not set</p>
          </div>
          <div>
            <label className="input-label">Registration Deadline</label>
            <input type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)} className="input-field" />
          </div>
        </div>
      </div>

      {/* Branch-wise Pricing */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-slate-900">💰 Branch-wise T-Shirt Pricing</h3>
            <p className="text-xs text-slate-400 mt-0.5">Set different prices for each branch</p>
          </div>
          <button onClick={handleSetAllPrices} className="btn-ghost text-sm text-indigo-600 hover:bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5">
            Set all to ₹{defaultPrice}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {BRANCHES.map(b => (
            <div key={b.value} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{b.value}</p>
                <p className="text-xs text-slate-400 truncate">{b.label}</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm text-slate-500">₹</span>
                <input
                  type="number"
                  value={branchPrices[b.value] || ''}
                  onChange={e => setBranchPrices(prev => ({ ...prev, [b.value]: e.target.value }))}
                  className="w-20 px-2 py-1.5 text-sm border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-200 transition-colors text-right font-semibold"
                  min={1}
                />
              </div>
            </div>
          ))}
        </div>
        <button onClick={handleSaveSettings} disabled={saving} className="btn-primary mt-5 w-full sm:w-auto">
          {saving ? 'Saving...' : '💾 Save All Settings'}
        </button>
      </div>

      {/* Form Lock */}
      <div className={`rounded-2xl p-6 border-2 ${settings?.isFormOpen ? 'bg-red-50 border-red-400' : 'bg-slate-100 border-slate-300'}`}>
        {!settings?.isFormOpen ? (
          <div>
            <p className="text-slate-600 font-semibold">✅ Form is LOCKED</p>
            <p className="text-sm text-slate-400 mt-1">Locked at: {formatDateTime(settings.lockedAt)}</p>
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

export default FormSettingsPage;
