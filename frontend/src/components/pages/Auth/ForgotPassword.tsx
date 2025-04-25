import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    Button,
    Typography,
    Link,
    Alert,
    Paper,
    CircularProgress,
    Container,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ProductShowcase from '../../../assets/images/ProductShowcase.png';

const ForgotPassword = () => {
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleRequestOtp = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);
        
        try {
            const response = await fetch('/api/auth/reset/request-password-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send OTP');
            }

            setMessage('OTP sent successfully. Please check your email.');
            setStep('otp');

        } catch (err: any) {
            console.error("Error sending OTP request:", err);
            setError(err.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setMessage(null);

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/reset/verify-password-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword }),
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to reset password');
            }

            setMessage('Password reset successfully! You can now log in with your new password.');
            setTimeout(() => navigate('/login'), 3000);

        } catch (err: any) {
            console.error("Error verifying OTP:", err);
            setError(err.message || 'An error occurred during password reset.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtp(e.target.value);
        if (message) setMessage(null);
    };

    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value);
        if (message) setMessage(null);
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        if (message) setMessage(null);
    };

    return (
        <Box
            sx={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: (theme) => theme.palette.background.default,
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    display: 'flex',
                    height: '500px',
                    width: '900px',
                    borderRadius: 2,
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                <Box
                    sx={{
                        width: '50%',
                        height: '100%',
                        position: 'relative',
                    }}
                >
                    <img
                        src={ProductShowcase}
                        alt="Product Showcase"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                        }}
                    />
                </Box>

                <Box
                    sx={{
                        width: '50%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        p: 5,
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: '350px',
                            mx: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            flexGrow: 1,
                        }}
                    >
                        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                            {step === 'email' ? 'Reset Password' : 'Verify & Update'}
                        </Typography>

                        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                        {message && <Alert severity="success" sx={{ mb: 3 }}>{message}</Alert>}

                        {step === 'email' ? (
                            <form onSubmit={handleRequestOtp} style={{ width: '100%' }}>
                                <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
                                    Enter your email to receive a password reset code
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <TextField
                                        label="Email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        fullWidth
                                        required
                                        autoComplete="email"
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        disabled={loading}
                                    >
                                        {loading ? <CircularProgress size={24} /> : 'Send Reset Code'}
                                    </Button>
                                </Box>
                                <Box sx={{ mt: 3, textAlign: 'center' }}>
                                    <Typography variant="body2">
                                        <Link component={RouterLink} to="/login">
                                            Back to Login
                                        </Link>
                                    </Typography>
                                </Box>
                            </form>
                        ) : (
                            <form onSubmit={handleResetPassword} style={{ width: '100%' }}>
                                <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
                                    Enter the code sent to {email} and your new password
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <TextField
                                        label="Verification Code"
                                        value={otp}
                                        onChange={handleOtpChange}
                                        fullWidth
                                        required
                                        inputProps={{ maxLength: 4 }}
                                    />
                                    <TextField
                                        label="New Password"
                                        type="password"
                                        value={newPassword}
                                        onChange={handleNewPasswordChange}
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        label="Confirm New Password"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                        fullWidth
                                        required
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        disabled={loading || !otp || !newPassword || !confirmPassword}
                                    >
                                        {loading ? <CircularProgress size={24} /> : 'Reset Password'}
                                    </Button>
                                </Box>
                                <Box sx={{ mt: 3, textAlign: 'center', display: 'flex', justifyContent: 'space-between' }}>
                                    <Button
                                        onClick={handleRequestOtp}
                                        disabled={loading}
                                        size="small"
                                    >
                                        Resend Code
                                    </Button>
                                    <Typography variant="body2">
                                        <Link component={RouterLink} to="/login">
                                            Back to Login
                                        </Link>
                                    </Typography>
                                </Box>
                            </form>
                        )}
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default ForgotPassword;