import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAdminAuth } from './context/AdminAuthContext';
import './admin.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login, error, admin } = useAdminAuth();
    const navigate = useNavigate();

    // If already logged in, redirect
    React.useEffect(() => {
        if (admin) {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [admin, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await login(email, password);
        setLoading(false);
        if (result.success) {
            navigate('/admin/dashboard', { replace: true });
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-card">
                <div className="admin-login-logo">
                    <Shield size={48} style={{ color: '#4F46E5', margin: '0 auto' }} />
                    <h1>Admin Panel</h1>
                    <p>MindPulse Administration</p>
                </div>

                {error && (
                    <div className="admin-login-error">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="admin-form-group">
                        <label>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail
                                size={16}
                                style={{
                                    position: 'absolute',
                                    left: '0.75rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--color-text-secondary)'
                                }}
                            />
                            <input
                                type="email"
                                className="admin-form-input"
                                style={{ paddingLeft: '2.25rem' }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                required
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className="admin-form-group">
                        <label>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock
                                size={16}
                                style={{
                                    position: 'absolute',
                                    left: '0.75rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--color-text-secondary)'
                                }}
                            />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="admin-form-input"
                                style={{ paddingLeft: '2.25rem', paddingRight: '2.5rem' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={6}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '0.75rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--color-text-secondary)',
                                    cursor: 'pointer',
                                    padding: 0,
                                    display: 'flex'
                                }}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="admin-btn admin-btn-primary"
                        disabled={loading}
                        style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', fontSize: '0.9rem' }}
                    >
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div className="admin-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                                Authenticating...
                            </span>
                        ) : (
                            'Sign In to Admin Panel'
                        )}
                    </button>
                </form>

                <p style={{
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-secondary)',
                    marginTop: '1.5rem'
                }}>
                    Only authorized administrators can access this panel.
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
