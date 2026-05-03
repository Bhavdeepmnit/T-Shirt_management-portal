import { useState } from 'react';
import { HiOutlineExclamation } from 'react-icons/hi';

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', danger = false, loading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
            danger ? 'bg-red-100' : 'bg-primary-100'
          }`}>
            <HiOutlineExclamation className={`w-6 h-6 ${danger ? 'text-red-600' : 'text-primary-600'}`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-surface-900">{title}</h3>
            <p className="mt-2 text-sm text-surface-600">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="btn-ghost" disabled={loading}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={danger ? 'btn-danger' : 'btn-primary'}
            disabled={loading}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
