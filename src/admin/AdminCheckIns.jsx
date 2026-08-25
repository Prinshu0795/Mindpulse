import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Trash2, CalendarCheck } from 'lucide-react';
import Pagination from './components/Pagination';
import ConfirmDialog from './components/ConfirmDialog';
import { useAdminApi } from './hooks/useAdminApi';
import { useToast } from './components/Toast';

const MOODS = ['Very Happy', 'Happy', 'Neutral', 'Anxious', 'Stressed', 'Sad', 'Irritated'];

const moodColors = {
    'Very Happy': 'admin-badge-green',
    'Happy': 'admin-badge-green',
    'Neutral': 'admin-badge-blue',
    'Anxious': 'admin-badge-amber',
    'Stressed': 'admin-badge-red',
    'Sad': 'admin-badge-gray',
    'Irritated': 'admin-badge-red'
};

const AdminCheckIns = ({ setTitle }) => {
    const [checkins, setCheckins] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 20 });
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [filterMood, setFilterMood] = useState('');
    const [sortField, setSortField] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const { apiCall } = useAdminApi();
    const { addToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => { setTitle('Daily Check-Ins'); }, [setTitle]);

    const fetchCheckins = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const data = await apiCall('/checkins', {
                params: { page, limit: 20, search, mood: filterMood, sortField, sortOrder }
            });
            setCheckins(data.data);
            setPagination(data.pagination);
        } catch (err) {
            addToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    }, [apiCall, search, filterMood, sortField, sortOrder, addToast]);

    useEffect(() => { fetchCheckins(); }, [fetchCheckins]);

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
            await apiCall(`/checkins/${deleteTarget._id}`, { method: 'DELETE' });
            addToast('Check-in deleted', 'success');
            setDeleteTarget(null);
            fetchCheckins(pagination.page);
        } catch (err) {
            addToast(err.message, 'error');
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
                            placeholder="Search by notes..."
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                        />
                    </form>
                    <div className="admin-table-filters">
                        <select
                            className="admin-filter-select"
                            value={filterMood}
                            onChange={e => setFilterMood(e.target.value)}
                        >
                            <option value="">All Moods</option>
                            {MOODS.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                            {pagination.total} total
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="admin-loading"><div className="admin-spinner" /></div>
                ) : checkins.length === 0 ? (
                    <div className="admin-empty-state">
                        <CalendarCheck size={48} />
                        <p>{search || filterMood ? 'No check-ins match your filters' : 'No daily check-ins recorded yet'}</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Mood</th>
                                    <th onClick={() => handleSort('stressLevel')} className={sortField === 'stressLevel' ? 'sorted' : ''}>
                                        Stress <SortIcon field="stressLevel" />
                                    </th>
                                    <th onClick={() => handleSort('anxietyLevel')} className={sortField === 'anxietyLevel' ? 'sorted' : ''}>
                                        Anxiety <SortIcon field="anxietyLevel" />
                                    </th>
                                    <th>Energy</th>
                                    <th>Sleep</th>
                                    <th>Triggers</th>
                                    <th onClick={() => handleSort('createdAt')} className={sortField === 'createdAt' ? 'sorted' : ''}>
                                        Date <SortIcon field="createdAt" />
                                    </th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {checkins.map(c => (
                                    <tr key={c._id}>
                                        <td>
                                            {c.user ? (
                                                <span
                                                    style={{ color: 'var(--color-accent)', cursor: 'pointer', fontWeight: 600 }}
                                                    onClick={() => navigate(`/admin/users/${c.user._id}`)}
                                                >
                                                    {c.user.name}
                                                </span>
                                            ) : (
                                                <span style={{ color: 'var(--color-text-secondary)' }}>Deleted User</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`admin-badge ${moodColors[c.mood] || 'admin-badge-gray'}`}>
                                                {c.mood}
                                            </span>
                                        </td>
                                        <td>{c.stressLevel}/10</td>
                                        <td>{c.anxietyLevel}/10</td>
                                        <td>{c.energyLevel}/10</td>
                                        <td>{c.sleepQuality}/10</td>
                                        <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {c.stressTriggers?.join(', ') || '—'}
                                        </td>
                                        <td style={{ whiteSpace: 'nowrap' }}>{formatDate(c.createdAt)}</td>
                                        <td>
                                            <button className="admin-btn-icon" title="Delete" onClick={() => setDeleteTarget(c)} style={{ color: '#DC2626' }}>
                                                <Trash2 size={16} />
                                            </button>
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
                    onPageChange={(p) => fetchCheckins(p)}
                />
            </div>

            <ConfirmDialog
                isOpen={!!deleteTarget}
                title="Delete Daily Check-In"
                message="Are you sure you want to delete this daily check-in? This action cannot be undone."
                confirmText="Delete"
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
};

export default AdminCheckIns;
