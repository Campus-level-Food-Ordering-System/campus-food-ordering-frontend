import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import { CartProvider } from './context/CartContext';
import { MenuProvider } from './context/MenuContext';

import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import ForgotPassword from './components/auth/ForgotPassword';
import ChangePassword from './components/auth/ChangePassword';
import EmailVerification from './components/auth/EmailVerification';
import CollegeVerification from './components/auth/CollegeVerification';
import AuthLayout from './components/auth/AuthLayout';
import Dashboard from './components/user/Dashboard';
import MenuDashboard from './components/menu/MenuDashboard';
import Orders from './components/user/Orders';
import LoadingDemo from './components/user/LoadingDemo';
import LoadingPlate from './components/common/LoadingPlate';
import OfflineMessage from './components/common/OfflineMessage';
import VendorDashboard from './components/vendor/VendorDashboard';
import AdminDashboard from './components/admin/AdminDashboard';


export default function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Ensure the loading screen transitions after a guaranteed duration
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1200);

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);


  // Handle retry when offline
  const handleRetry = () => {
    window.location.reload();
  };

  // Show offline message if no internet
  if (!isOnline) {
    return <OfflineMessage onRetry={handleRetry} />;
  }

  // Show loading animation while app is initializing
  if (isInitialLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #E6F7FF 0%, #ffffff 100%)'
      }}>
        <LoadingPlate message="Welcome to CampusEats..." />
      </div>
    );
  }

  return (
    <AuthProvider>
      <OrderProvider>
        <MenuProvider>
          <CartProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Navigate to="/signin" replace />} />

                {/* Authentication Routes with Layout */}
                <Route element={<AuthLayout />}>
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signin/admin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/change-password" element={<ChangePassword />} />
                  <Route path="/email-verification" element={<EmailVerification />} />
                  <Route path="/college-verification" element={<CollegeVerification />} />
                </Route>

                {/* Demo Route */}
                <Route path="/loading-demo" element={<LoadingDemo />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/vendor-dashboard" element={<VendorDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/menu/:shopId" element={<MenuDashboard />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="*" element={<Navigate to="/signin" replace />} />
              </Routes>
            </Router>
          </CartProvider>
        </MenuProvider>
      </OrderProvider>
    </AuthProvider>
  );
}
