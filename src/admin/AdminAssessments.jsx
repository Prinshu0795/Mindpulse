import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Edit2, Trash2, Eye, ClipboardList } from 'lucide-react';
import Pagination from './components/Pagination';
import ConfirmDialog from './components/ConfirmDialog';
import EditModal from './components/EditModal';
import { useAdminApi } from './hooks/useAdminApi';
import { useToast } from './components/Toast';

const AdminAssessments = ({ setTitle }) => {
    const [assessments, setAssessments] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 20 });
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [sortField, setSortField] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [editTarget, setEditTarget] = useState(null);
    const [saving, setSaving] = useState(false);
    const { apiCall } = useAdminApi();
    const { addToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => { setTitle('Assessments'); }, [setTitle]);

    const fetchAssessments = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const data = await apiCall('/assessments', {
                params: { page, limit: 20, search, sortField, sortOrder }
            });
            setAssessments(data.data);
            setPagination(data.pagination);
        } catch (err) {
            addToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    }, [apiCall, search, sortField, sortOrder, addToast]);

    useEffect(() => { fetchAssessments(); }, [fetchAssessments]);

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
            await apiCall(`/assessments/${deleteTarget._id}`, { method: 'DELETE' });
            addToast('Assessment deleted', 'success');
            setDeleteTarget(null);
            fetchAssessments(pagination.page);
        } catch (err) {
            addToast(err.message, 'error');
        }
    };

    const handleEdit = async (formData) => {
        if (!editTarget) return;
        try {
            setSaving(true);
            await apiCall(`/assessments/${editTarget._id}`, { method: 'PUT', body: formData });
            addToast('Assessment updated', 'success');
            setEditTarget(null);
            fetchAssessments(pagination.page);
        } catch (err) {
            addToast(err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (d) => d ? new Date(d).toLocaleString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric'
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
                            placeholder="Search by trigger..."
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                        />
                    </form>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                        {pagination.total} total assessments
                    </div>
                </div>

                {loading ? (
                    <div className="admin-loading"><div className="admin-spinner" /></div>
                ) : assessments.length === 0 ? (
                    <div className="admin-empty-state">
                        <ClipboardList size={48} />
                        <p>{search ? 'No assessments match your search' : 'No assessments recorded yet'}</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th onClick={() => handleSort('stress')} className={sortField === 'stress' ? 'sorted' : ''}>
                                        Stress <SortIcon field="stress" />
                                    </th>
                                    <th onClick={() => handleSort('anxiety')} className={sortField === 'anxiety' ? 'sorted' : ''}>
                                        Anxiety <SortIcon field="anxiety" />
                                    </th>
                                    <th>Trigger</th>
                                    <th>Day</th>
                                    <th onClick={() => handleSort('createdAt')} className={sortField === 'createdAt' ? 'sorted' : ''}>
                                        Date <SortIcon field="createdAt" />
                                    </th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assessments.map(a => (
                                    <tr key={a._id}>
                                        <td>
                                            {a.user ? (
                                                <span
                                                    style={{ color: 'var(--color-accent)', cursor: 'pointer', fontWeight: 600 }}
                                                    onClick={() => navigate(`/admin/users/${a.user._id}`)}
                                                >
                                                    {a.user.name}
                                                </span>
                                            ) : (
                                                <span style={{ color: 'var(--color-text-secondary)' }}>Deleted User</span>
                                            )}
                                        </td>
                                        <td><span className="admin-badge admin-badge-red">{a.stress}</span></td>
                                        <td><span className="admin-badge admin-badge-amber">{a.anxiety}</span></td>
                                        <td>{a.trigger || '—'}</td>
                                        <td>{a.date || '—'}</td>
                                        <td style={{ whiteSpace: 'nowrap' }}>{formatDate(a.fullDate || a.createdAt)}</td>
                                        <td>
                                            <div className="admin-table-actions">
                                                <button className="admin-btn-icon" title="Edit" onClick={() => setEditTarget(a)}>
                                                    <Edit2 size={16} />
                                                </button>
                                                <button className="admin-btn-icon" title="Delete" onClick={() => setDeleteTarget(a)} style={{ color: '#DC2626' }}>
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
                    onPageChange={(p) => fetchAssessments(p)}
                />
            </div>

            <ConfirmDialog
                isOpen={!!deleteTarget}
                title="Delete Assessment"
                message="Are you sure you want to delete this assessment? This action cannot be undone."
                confirmText="Delete"
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />

            <EditModal
                isOpen={!!editTarget}
                title="Edit Assessment"
                fields={[
                    { key: 'stress', label: 'Stress Level', type: 'number', min: 0, max: 100 },
                    { key: 'anxiety', label: 'Anxiety Level', type: 'number', min: 0, max: 100 },
                    { key: 'trigger', label: 'Trigger', type: 'text', placeholder: 'e.g. Work, Family' }
                ]}
                initialData={editTarget}
                onSave={handleEdit}
                onClose={() => setEditTarget(null)}
                saving={saving}
            />
        </div>
    );
};

export default AdminAssessments;
