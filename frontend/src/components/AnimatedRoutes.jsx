import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import ScriptingPage from './ScriptingPage';
import MyCreations from './MyCreations';
import CategoriesPage from './CategoriesPage';
import GlobalNewsHub from './GlobalNewsHub';
import PostRenderer from './PostRenderer';
import SubscriptionPage from '../pages/SubscriptionPage';
import LandingPage from '../pages/LandingPage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import PrivacyPolicy from './PrivacyPolicy';

// Protected Route Component (General Auth)
const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Admin Route Component (Auth + Role Check)
const AdminRoute = ({ children }) => {
  const token = sessionStorage.getItem('token');
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const isAdmin = user.role?.toLowerCase() === 'admin';

  if (!token || !isAdmin) {
    // Hidden redirect for security: back to login
    return <Navigate to="/" replace />;
  }
  return children;
};

const AnimatedRoutes = () => {
  return (
    <Routes>
      {/* ─── Public Routes (no auth required) ─── */}
      <Route path="/"             element={<Login />} />
      <Route path="/welcome"      element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
      <Route path="/subscription" element={<SubscriptionPage />} />
      <Route path="/signup"       element={<SignUp />} />

      {/* ─── Protected Routes ─── */}
      <Route path="/home"          element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/latest"        element={<ProtectedRoute><GlobalNewsHub /></ProtectedRoute>} />
      <Route path="/intelligence"  element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
      <Route path="/creations"     element={<ProtectedRoute><MyCreations /></ProtectedRoute>} />
      <Route path="/scripting/:id" element={<ProtectedRoute><ScriptingPage /></ProtectedRoute>} />
      <Route path="/render-post"   element={<ProtectedRoute><PostRenderer /></ProtectedRoute>} />
      <Route path="/admin"         element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/about"         element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
      <Route path="/contact"       element={<ProtectedRoute><ContactPage /></ProtectedRoute>} />
      <Route path="/privacy"       element={<ProtectedRoute><PrivacyPolicy /></ProtectedRoute>} />

      {/* ─── Catch-all ─── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AnimatedRoutes;
