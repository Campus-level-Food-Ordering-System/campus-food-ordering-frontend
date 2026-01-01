import { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import ForgotPassword from './components/auth/ForgotPassword';
import ChangePassword from './components/auth/ChangePassword';
import EmailVerification from './components/auth/EmailVerification';
import CollegeVerification from './components/auth/CollegeVerification';
import Dashboard from './components/Dashboard';

export default function App() {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState('student');
    const [userEmail, setUserEmail] = useState('');
    const [isGoogleAuth, setIsGoogleAuth] = useState(false);

    const handleGoogleSignIn = () => {
        setIsGoogleAuth(true);
        // Skip email verification for Google sign-in   
        navigate('/dashboard');
    };

    const handleGoogleSignUp = () => {
        setIsGoogleAuth(true);
        navigate('/college-verification');
    };

    const handleSignUpSuccess = (email, isGoogle = false) => {
        setUserEmail(email);
        setIsGoogleAuth(isGoogle);
        if (isGoogle) {
            navigate('/college-verification');
        }
        else {
            navigate('/email-verification');
        }
    };

    const handleForgotPasswordSubmit = () => {
        navigate('/change-password');
    };

    const handleChangePasswordSuccess = () => {
        navigate('/signin');
    };

    const handleEmailVerificationSuccess = () => {
        navigate('/college-verification');
    };

    const handleCollegeVerificationSuccess = () => {
        navigate('/dashboard');
    };

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/signin" replace />} />
            <Route path="/signin" element={
                <SignIn
                    onNavigateToSignUp={() => navigate('/signup')}
                    onNavigateToForgotPassword={() => navigate('/forgot-password')}
                    onNavigateToDashboard={() => navigate('/dashboard')}
                    onGoogleSignIn={handleGoogleSignIn}
                    userRole={userRole}
                    setUserRole={setUserRole}
                />
            } />
            <Route path="/signup" element={
                <SignUp
                    onNavigateToSignIn={() => navigate('/signin')}
                    onSignUpSuccess={handleSignUpSuccess}
                    onGoogleSignUp={handleGoogleSignUp}
                    userRole={userRole}
                    setUserRole={setUserRole}
                />
            } />
            <Route path="/forgot-password" element={
                <ForgotPassword
                    onNavigateToSignIn={() => navigate('/signin')}
                    onVerifySuccess={handleForgotPasswordSubmit}
                />
            } />
            <Route path="/change-password" element={
                <ChangePassword
                    onChangePasswordSuccess={handleChangePasswordSuccess}
                    userEmail={userEmail}
                />
            } />
            <Route path="/email-verification" element={
                <EmailVerification
                    userEmail={userEmail}
                    onVerifySuccess={handleEmailVerificationSuccess}
                />
            } />
            <Route path="/college-verification" element={
                <CollegeVerification
                    onCompleteProfile={handleCollegeVerificationSuccess}
                />
            } />
            <Route path="/dashboard" element={
                <Dashboard
                    onLogout={() => navigate('/signin')}
                />
            } />
        </Routes>
    );
}
