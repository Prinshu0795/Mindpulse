import React, { useState, useEffect, useCallback } from 'react';
import { Search, Edit2, Trash2, Eye, MessageSquare, X } from 'lucide-react';
import Pagination from './components/Pagination';
import ConfirmDialog from './components/ConfirmDialog';
import EditModal from './components/EditModal';
import { useAdminApi } from './hooks/useAdminApi';
import { useToast } from './components/Toast';

const AdminQueries = ({ setTitle }) => {
    const [messages, setMessages] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 20 });
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [sortField, setSortField] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [editTarget, setEditTarget] = useState(null);
    const [viewTarget, setViewTarget] = useState(null);
    const [saving, setSaving] = useState(false);
    const { apiCall } = useAdminApi();
    const { addToast } = useToast();

    useEffect(() => { setTitle('Contact Queries'); }, [setTitle]);

    const fetchMessages = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const data = await apiCall('/contacts', {
                params: { page, limit: 20, search, sortField, sortOrder }
            });
            setMessages(data.data);
            setPagination(data.pagination);
        } catch (err) {
            addToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    }, [apiCall, search, sortField, sortOrder, addToast]);

    useEffect(() => { fetchMessages(); }, [fetchMessages]);

    const handleSearch = (e) => { e.preventDefault(); setSearch(searchInput); };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await apiCall(`/contacts/${deleteTarget._id}`, { method: 'DELETE' });
            addToast('Contact message deleted', 'success');
            setDeleteTarget(null);
            fetchMessages(pagination.page);
        } catch (err) {
            addToast(err.message, 'error');
        }
    };

    const handleEdit = async (formData) => {
        if (!editTarget) return;
        try {
            setSaving(true);
            await apiCall(`/contacts/${editTarget._id}`, {
                method: 'PUT',
                body: { subject: formData.subject, message: formData.message }
            });
            addToast('Contact message updated', 'success');
            setEditTarget(null);
            fetchMessages(pagination.page);
        } catch (err) {
            addToast(err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (d) => d ? new Date(d).toLocaleString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }) : '—';

    const SortIcon = ({ field }) => {
        if (sortField !== field) return null;
        return <span style={{ fontSize: '0.65rem', marginLeft: '0.25rem' }}>{sortOrder === 'asc' ? '▲' : '▼'}</span>;
    };

    return (
        <div>
            <div className="admin-table-wrapper">
                <div className="admin-table-header">
                    <form onSubmit={handleSearch} className="admin-table-search">
                        <Search size={16} style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} />
                        <input
                            placeholder="Search by name, email, subject, or message..."
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                        />
                    </form>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                        {pagination.total} total queries
                    </div>
                </div>

                {loading ? (
                    <div className="admin-loading"><div className="admin-spinner" /></div>
                ) : messages.length === 0 ? (
                    <div className="admin-empty-state">
                        <MessageSquare size={48} />
                        <p>{search ? 'No queries match your search' : 'No contact queries yet'}</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort('name')} className={sortField === 'name' ? 'sorted' : ''}>
                                        Name <SortIcon field="name" />
                                    </th>
                                    <th onClick={() => handleSort('email')} className={sortField === 'email' ? 'sorted' : ''}>
                                        Email <SortIcon field="email" />
                                    </th>
                                    <th onClick={() => handleSort('subject')} className={sortField === 'subject' ? 'sorted' : ''}>
                                        Subject <SortIcon field="subject" />
                                    </th>
                                    <th>Message</th>
                                    <th onClick={() => handleSort('createdAt')} className={sortField === 'createdAt' ? 'sorted' : ''}>
                                        Date <SortIcon field="createdAt" />
                                    </th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {messages.map(msg => (
                                    <tr key={msg._id}>
                                        <td style={{ fontWeight: 600 }}>{msg.name}</td>
                                        <td style={{ color: 'var(--color-text-secondary)' }}>{msg.email}</td>
                                        <td>{msg.subject}</td>
                                        <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {msg.message}
                                        </td>
                                        <td style={{ whiteSpace: 'nowrap' }}>{formatDate(msg.createdAt)}</td>
                                        <td>
                                            <div className="admin-table-actions">
                                                <button className="admin-btn-icon" title="View" onClick={() => setViewTarget(msg)}>
                                                    <Eye size={16} />
                                                </button>
                                                <button className="admin-btn-icon" title="Edit" onClick={() => setEditTarget(msg)}>
                                                    <Edit2 size={16} />
                                                </button>
                                                <button className="admin-btn-icon" title="Delete" onClick={() => setDeleteTarget(msg)} style={{ color: '#DC2626' }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <Pagination
                    page={pagination.page}
                    pages={pagination.pages}
                    total={pagination.total}
                    limit={pagination.limit}
                    onPageChange={(p) => fetchMessages(p)}
                />
            </div>

            {/* View Modal */}
            {viewTarget && (
                <div className="admin-modal-overlay" onClick={() => setViewTarget(null)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h3>Contact Query</h3>
                            <button className="admin-btn-icon" onClick={() => setViewTarget(null)}><X size={18} /></button>
                        </div>
                        <div className="admin-modal-body">
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">From</span>
                                <span className="admin-detail-value">{viewTarget.name}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Email</span>
                                <span className="admin-detail-value">{viewTarget.email}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Subject</span>
                                <span className="admin-detail-value">{viewTarget.subject}</span>
                            </div>
                            <div className="admin-detail-row">
                                <span className="admin-detail-label">Date</span>
                                <span className="admin-detail-value">{formatDate(viewTarget.createdAt)}</span>
                            </div>
                            <div style={{ marginTop: '1rem' }}>
                                <span className="admin-detail-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Message</span>
                                <div style={{
                                    background: 'var(--color-bg)',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    lineHeight: 1.6,
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {viewTarget.message}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmDialog
                isOpen={!!deleteTarget}
                title="Delete Contact Query"
                message={`Delete the query from "${deleteTarget?.name}" with subject "${deleteTarget?.subject}"? This action cannot be undone.`}
                confirmText="Delete"
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />

            <EditModal
                isOpen={!!editTarget}
                title="Edit Contact Query"
                fields={[
                    { key: 'subject', label: 'Subject', type: 'text' },
                    { key: 'message', label: 'Message', type: 'textarea' }
                ]}
                initialData={editTarget}
                onSave={handleEdit}
                onClose={() => setEditTarget(null)}
                saving={saving}
            />
        </div>
    );
};

export default AdminQueries;
