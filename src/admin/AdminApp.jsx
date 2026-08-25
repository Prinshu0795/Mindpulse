import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminTopbar from './components/AdminTopbar';
import AdminDashboard from './AdminDashboard';
import AdminUsers from './AdminUsers';
import AdminUserDetail from './AdminUserDetail';
import AdminQueries from './AdminQueries';
import AdminAssessments from './AdminAssessments';
import AdminMentalAssessments from './AdminMentalAssessments';
import AdminCheckIns from './AdminCheckIns';
import AdminSettings from './AdminSettings';
import { ToastProvider } from './components/Toast';
import './admin.css';

const AdminApp = () => {
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 769);
    const [pageTitle, setPageTitle] = useState('Dashboard');

    return (
        <ToastProvider>
            <div className="admin-layout">
                <AdminSidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />
                {/* Spacer for desktop */}
                {sidebarOpen && <div className="admin-sidebar-spacer" />}

                <div className="admin-main">
                    <AdminTopbar
                        title={pageTitle}
                        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    />
                    <div className="admin-content">
                        <Routes>
                            <Route path="dashboard" element={<AdminDashboard setTitle={setPageTitle} />} />
                            <Route path="users" element={<AdminUsers setTitle={setPageTitle} />} />
                            <Route path="users/:id" element={<AdminUserDetail setTitle={setPageTitle} />} />
                            <Route path="queries" element={<AdminQueries setTitle={setPageTitle} />} />
                            <Route path="assessments" element={<AdminAssessments setTitle={setPageTitle} />} />
                            <Route path="mental-assessments" element={<AdminMentalAssessments setTitle={setPageTitle} />} />
                            <Route path="checkins" element={<AdminCheckIns setTitle={setPageTitle} />} />
                            <Route path="settings" element={<AdminSettings setTitle={setPageTitle} />} />
                            <Route path="*" element={<Navigate to="dashboard" replace />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </ToastProvider>
    );
};

export default AdminApp;
