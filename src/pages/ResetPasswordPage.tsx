import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Lock, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const { resetPassword } = useAuthStore();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error('Invalid reset link. Please request a new one.');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsSubmitting(true);
        const success = await resetPassword(token, password);
        setIsSubmitting(false);

        if (success) {
            setIsSuccess(true);
            toast.success('Password reset successfully!');
        } else {
            toast.error('Failed to reset password. The link may have expired.');
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center px-6">
                <div className="max-w-md w-full text-center bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-12">
                    <Lock className="w-16 h-16 text-red-400 mx-auto mb-6" />
                    <h1 className="luxury-heading text-[#F4F1EA] text-2xl mb-3">
                        INVALID <span className="text-red-400">LINK</span>
                    </h1>
                    <p className="text-[#F4F1EA]/60 mb-6">
                        This password reset link is invalid. Please request a new one from the login page.
                    </p>
                    <Link to="/account" className="btn-primary inline-block px-8">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center px-6">
                <div className="max-w-md w-full text-center bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-12">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h1 className="luxury-heading text-[#F4F1EA] text-2xl mb-3">
                        PASSWORD <span className="text-[#D4A24F]">RESET</span>
                    </h1>
                    <p className="text-[#F4F1EA]/60 mb-8">
                        Your password has been updated successfully. You can now sign in with your new password.
                    </p>
                    <button onClick={() => navigate('/account')} className="btn-primary px-8">
                        Sign In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center px-6">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="luxury-heading text-[#F4F1EA] text-3xl mb-2">
                        SET NEW <span className="text-[#D4A24F]">PASSWORD</span>
                    </h1>
                    <p className="text-[#F4F1EA]/60">
                        Enter your new password below
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-8">
                    <div className="space-y-6">
                        <div>
                            <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors pr-12"
                                    placeholder="Min. 6 characters"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F4F1EA]/40 hover:text-[#D4A24F] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="luxury-label text-[#F4F1EA]/40 mb-2 block">Confirm Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#F4F1EA]/20 text-[#F4F1EA] focus:outline-none focus:border-[#D4A24F] transition-colors"
                                placeholder="Re-enter password"
                            />
                            {confirmPassword && password !== confirmPassword && (
                                <p className="text-red-400 text-xs mt-2">Passwords do not match</p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || password !== confirmPassword}
                        className="btn-primary w-full mt-8 flex justify-center items-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting && <div className="w-4 h-4 border-2 border-[#0B0B0D] border-t-transparent rounded-full animate-spin" />}
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
}
