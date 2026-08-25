import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider as UIThemeProvider } from './context/ThemeContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Layout & Global Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import CustomerService from './components/CustomerService';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import PublicAssessments from './pages/PublicAssessments';
import Resources from './pages/Resources';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Experts from './pages/Experts';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Dashboard from './pages/Dashboard';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import MedicalDisclaimer from './pages/MedicalDisclaimer';

import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

// Admin
import { AdminAuthProvider, useAdminAuth } from './admin/context/AdminAuthContext';
import AdminLogin from './admin/AdminLogin';
import AdminApp from './admin/AdminApp';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen bg-bg flex items-center justify-center text-text-primary">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AdminProtectedRoute = ({ children }) => {
  const { admin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg)',
        color: 'var(--color-text-primary)'
      }}>
        Loading...
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

const AppContent = () => {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-text-primary transition-colors duration-300">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/assessments" element={<PublicAssessments />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/experts" element={<Experts />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/medical-disclaimer" element={<MedicalDisclaimer />} />
          
          {/* Auth System Routes */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback — exclude /admin paths so they don't get caught here */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
      <CustomerService />
      <AuthModal />
    </div>
  );
};

function App() {
  return (
    <HelmetProvider>
      <Router>
        <UIThemeProvider>
          <AuthProvider>
            <Routes>
              {/* Admin Routes — separate layout, no main Navbar/Footer */}
              <Route path="/admin/login" element={
                <AdminAuthProvider>
                  <AdminLogin />
                </AdminAuthProvider>
              } />
              <Route path="/admin/*" element={
                <AdminAuthProvider>
                  <AdminProtectedRoute>
                    <AdminApp />
                  </AdminProtectedRoute>
                </AdminAuthProvider>
              } />

              {/* All other routes go through the main AppContent layout */}
              <Route path="/*" element={<AppContent />} />
            </Routes>
          </AuthProvider>
        </UIThemeProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
