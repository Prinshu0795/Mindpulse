import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Delete', danger = true }) => {
    if (!isOpen) return null;

    return (
        <div className="admin-modal-overlay" onClick={onCancel}>
            <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
                <div className="admin-modal-header">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertTriangle size={20} style={{ color: danger ? '#DC2626' : '#D97706' }} />
                        {title || 'Confirm Action'}
                    </h3>
                    <button className="admin-btn-icon" onClick={onCancel}>
                        <X size={18} />
                    </button>
                </div>
                <div className="admin-modal-body">
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                        {message || 'Are you sure? This action cannot be undone.'}
                    </p>
                </div>
                <div className="admin-modal-footer">
                    <button className="admin-btn admin-btn-secondary" onClick={onCancel}>
                        Cancel
                    </button>
                    <button
                        className={`admin-btn ${danger ? 'admin-btn-danger' : 'admin-btn-primary'}`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
