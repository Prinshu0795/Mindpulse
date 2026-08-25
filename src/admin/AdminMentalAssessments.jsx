import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Edit2, Trash2, Brain } from 'lucide-react';
import Pagination from './components/Pagination';
import ConfirmDialog from './components/ConfirmDialog';
import EditModal from './components/EditModal';
import { useAdminApi } from './hooks/useAdminApi';
import { useToast } from './components/Toast';

const ASSESSMENT_TYPES = ['PSS-10', 'GAD-7', 'DASS-21', 'PHQ-9', 'WHO-5'];

const AdminMentalAssessments = ({ setTitle }) => {
    const [assessments, setAssessments] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 20 });
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [filterType, setFilterType] = useState('');
    const [sortField, setSortField] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [editTarget, setEditTarget] = useState(null);
    const [saving, setSaving] = useState(false);
    const { apiCall } = useAdminApi();
    const { addToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => { setTitle('Mental Assessments'); }, [setTitle]);

    const fetchAssessments = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const data = await apiCall('/mental-assessments', {
                params: { page, limit: 20, search, type: filterType, sortField, sortOrder }
            });
            setAssessments(data.data);
            setPagination(data.pagination);
        } catch (err) {
            addToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    }, [apiCall, search, filterType, sortField, sortOrder, addToast]);

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
            await apiCall(`/mental-assessments/${deleteTarget._id}`, { method: 'DELETE' });
            addToast('Mental assessment deleted', 'success');
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
            await apiCall(`/mental-assessments/${editTarget._id}`, { method: 'PUT', body: formData });
            addToast('Mental assessment updated', 'success');
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

    const getScoreDisplay = (a) => {
        if (a.type === 'DASS-21' && a.subScores) {
            return `D:${a.subScores.depression ?? '—'} A:${a.subScores.anxiety ?? '—'} S:${a.subScores.stress ?? '—'}`;
        }
        return a.score ?? '—';
    };

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
                            placeholder="Search by severity..."
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                        />
                    </form>
                    <div className="admin-table-filters">
                        <select
                            className="admin-filter-select"
                            value={filterType}
                            onChange={e => setFilterType(e.target.value)}
                        >
                            <option value="">All Types</option>
                            {ASSESSMENT_TYPES.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                            {pagination.total} total
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="admin-loading"><div className="admin-spinner" /></div>
                ) : assessments.length === 0 ? (
                    <div className="admin-empty-state">
                        <Brain size={48} />
                        <p>{search || filterType ? 'No assessments match your filters' : 'No mental assessments recorded yet'}</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Type</th>
                                    <th onClick={() => handleSort('score')} className={sortField === 'score' ? 'sorted' : ''}>
                                        Score <SortIcon field="score" />
                                    </th>
                                    <th>Severity</th>
                                    <th onClick={() => handleSort('createdAt')} className={sortField === 'createdAt' ? 'sorted' : ''}>
                                        Completed <SortIcon field="createdAt" />
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
                                        <td><span className="admin-badge admin-badge-indigo">{a.type}</span></td>
                                        <td style={{ fontWeight: 600 }}>{getScoreDisplay(a)}</td>
                                        <td>
                                            <span className={`admin-badge ${
                                                a.severity?.toLowerCase()?.includes('severe') ? 'admin-badge-red' :
                                                a.severity?.toLowerCase()?.includes('moderate') ? 'admin-badge-amber' :
                                                a.severity?.toLowerCase()?.includes('mild') ? 'admin-badge-blue' :
                                                'admin-badge-green'
                                            }`}>
                                                {a.severity || '—'}
                                            </span>
                                        </td>
                                        <td style={{ whiteSpace: 'nowrap' }}>{formatDate(a.completedAt)}</td>
                                        <td>
                                            <div className="admin-table-actions">
                                                <button className="admin-btn-icon" title="Edit Severity" onClick={() => setEditTarget(a)}>
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
                title="Delete Mental Assessment"
                message="Are you sure you want to delete this mental assessment? This action cannot be undone."
                confirmText="Delete"
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />

            <EditModal
                isOpen={!!editTarget}
                title="Edit Mental Assessment"
                fields={[
                    {
                        key: 'severity', label: 'Severity', type: 'select',
                        options: [
                            { value: '', label: 'Select severity' },
                            { value: 'Normal', label: 'Normal' },
                            { value: 'Mild', label: 'Mild' },
                            { value: 'Moderate', label: 'Moderate' },
                            { value: 'Moderately Severe', label: 'Moderately Severe' },
                            { value: 'Severe', label: 'Severe' },
                            { value: 'Extremely Severe', label: 'Extremely Severe' }
                        ]
                    }
                ]}
                initialData={editTarget}
                onSave={handleEdit}
                onClose={() => setEditTarget(null)}
                saving={saving}
            />
        </div>
    );
};

export default AdminMentalAssessments;
