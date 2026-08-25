import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Edit2, Trash2, Eye, Users as UsersIcon } from 'lucide-react';
import Pagination from './components/Pagination';
import ConfirmDialog from './components/ConfirmDialog';
import EditModal from './components/EditModal';
import { useAdminApi } from './hooks/useAdminApi';
import { useToast } from './components/Toast';

const AdminUsers = ({ setTitle }) => {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 20 });
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [sortField, setSortField] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('desc');
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [editTarget, setEditTarget] = useState(null);
    const [saving, setSaving] = useState(false);
    const { apiCall } = useAdminApi();
    const { addToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => { setTitle('Users'); }, [setTitle]);

    const fetchUsers = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const data = await apiCall('/users', {
                params: { page, limit: 20, search, sortField, sortOrder }
            });
            setUsers(data.data);
            setPagination(data.pagination);
        } catch (err) {
            addToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    }, [apiCall, search, sortField, sortOrder, addToast]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(searchInput);
    };

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
            await apiCall(`/users/${deleteTarget._id}`, { method: 'DELETE' });
            addToast('User deleted successfully', 'success');
            setDeleteTarget(null);
            fetchUsers(pagination.page);
        } catch (err) {
            addToast(err.message, 'error');
        }
    };

    const handleEdit = async (formData) => {
        if (!editTarget) return;
        try {
            setSaving(true);
            await apiCall(`/users/${editTarget._id}`, { method: 'PUT', body: formData });
            addToast('User updated successfully', 'success');
            setEditTarget(null);
            fetchUsers(pagination.page);
        } catch (err) {
            addToast(err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

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
                            placeholder="Search users by name or email..."
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                        />
                    </form>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                        {pagination.total} total users
                    </div>
                </div>

                {loading ? (
                    <div className="admin-loading"><div className="admin-spinner" /></div>
                ) : users.length === 0 ? (
                    <div className="admin-empty-state">
                        <UsersIcon size={48} />
                        <p>{search ? 'No users match your search' : 'No users registered yet'}</p>
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
                                    <th onClick={() => handleSort('created_at')} className={sortField === 'created_at' ? 'sorted' : ''}>
                                        Registered <SortIcon field="created_at" />
                                    </th>
                                    <th>Assessments</th>
                                    <th>Mental</th>
                                    <th>Check-Ins</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id} className="admin-clickable-row" onClick={() => navigate(`/admin/users/${user._id}`)}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                                <div
                                                    className="admin-avatar"
                                                    style={{ background: `hsl(${user.name?.charCodeAt(0) * 5 % 360}, 60%, 55%)`, width: 32, height: 32, fontSize: '0.75rem' }}
                                                >
                                                    {user.name?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <span style={{ fontWeight: 600 }}>{user.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ color: 'var(--color-text-secondary)' }}>{user.email}</td>
                                        <td>{formatDate(user.created_at)}</td>
                                        <td><span className="admin-badge admin-badge-blue">{user.assessmentCount}</span></td>
                                        <td><span className="admin-badge admin-badge-green">{user.mentalAssessmentCount}</span></td>
                                        <td><span className="admin-badge admin-badge-amber">{user.checkInCount}</span></td>
                                        <td onClick={e => e.stopPropagation()}>
                                            <div className="admin-table-actions">
                                                <button
                                                    className="admin-btn-icon"
                                                    title="View"
                                                    onClick={() => navigate(`/admin/users/${user._id}`)}
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    className="admin-btn-icon"
                                                    title="Edit"
                                                    onClick={() => setEditTarget(user)}
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    className="admin-btn-icon"
                                                    title="Delete"
                                                    onClick={() => setDeleteTarget(user)}
                                                    style={{ color: '#DC2626' }}
                                                >
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
                    onPageChange={(p) => fetchUsers(p)}
                />
            </div>

            <ConfirmDialog
                isOpen={!!deleteTarget}
                title="Delete User"
                message={`Are you sure you want to delete "${deleteTarget?.name}" (${deleteTarget?.email})? This will also delete all their assessments, check-ins, and related data. This action cannot be undone.`}
                confirmText="Delete User"
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />

            <EditModal
                isOpen={!!editTarget}
                title="Edit User"
                fields={[
                    { key: 'name', label: 'Name', type: 'text', placeholder: 'Full name' },
                    { key: 'email', label: 'Email', type: 'email', placeholder: 'user@example.com' }
                ]}
                initialData={editTarget}
                onSave={handleEdit}
                onClose={() => setEditTarget(null)}
                saving={saving}
            />
        </div>
    );
};

export default AdminUsers;
