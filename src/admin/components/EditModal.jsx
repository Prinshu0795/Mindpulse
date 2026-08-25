import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const EditModal = ({ isOpen, title, fields, initialData, onSave, onClose, saving = false }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (isOpen && initialData) {
            const data = {};
            fields.forEach(f => {
                data[f.key] = initialData[f.key] ?? '';
            });
            setFormData(data);
        }
    }, [isOpen, initialData, fields]);

    if (!isOpen) return null;

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <div className="admin-modal" onClick={e => e.stopPropagation()}>
                <div className="admin-modal-header">
                    <h3>{title || 'Edit'}</h3>
                    <button className="admin-btn-icon" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="admin-modal-body">
                        {fields.map(field => (
                            <div className="admin-form-group" key={field.key}>
                                <label>{field.label}</label>
                                {field.type === 'textarea' ? (
                                    <textarea
                                        className="admin-form-textarea"
                                        value={formData[field.key] || ''}
                                        onChange={e => handleChange(field.key, e.target.value)}
                                        disabled={field.disabled}
                                        placeholder={field.placeholder}
                                    />
                                ) : field.type === 'select' ? (
                                    <select
                                        className="admin-form-input"
                                        value={formData[field.key] || ''}
                                        onChange={e => handleChange(field.key, e.target.value)}
                                        disabled={field.disabled}
                                    >
                                        {field.options?.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                ) : field.type === 'number' ? (
                                    <input
                                        type="number"
                                        className="admin-form-input"
                                        value={formData[field.key] || ''}
                                        onChange={e => handleChange(field.key, parseFloat(e.target.value) || '')}
                                        disabled={field.disabled}
                                        placeholder={field.placeholder}
                                        min={field.min}
                                        max={field.max}
                                    />
                                ) : (
                                    <input
                                        type={field.type || 'text'}
                                        className="admin-form-input"
                                        value={formData[field.key] || ''}
                                        onChange={e => handleChange(field.key, e.target.value)}
                                        disabled={field.disabled}
                                        placeholder={field.placeholder}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="admin-modal-footer">
                        <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditModal;
