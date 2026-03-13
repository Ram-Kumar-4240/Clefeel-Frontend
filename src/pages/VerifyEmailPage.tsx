import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';

export default function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const { verifyEmail } = useAuthStore();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            return;
        }

        const verify = async () => {
            const success = await verifyEmail(token);
            setStatus(success ? 'success' : 'error');
        };
        verify();
    }, [token, verifyEmail]);

    return (
        <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center px-6">
            <div className="max-w-md w-full text-center">
                {status === 'loading' && (
                    <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-12">
                        <Loader2 className="w-16 h-16 text-[#D4A24F] mx-auto mb-6 animate-spin" />
                        <h1 className="luxury-heading text-[#F4F1EA] text-2xl mb-3">
                            VERIFYING <span className="text-[#D4A24F]">EMAIL</span>
                        </h1>
                        <p className="text-[#F4F1EA]/60">Please wait while we verify your email address...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-12">
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h1 className="luxury-heading text-[#F4F1EA] text-2xl mb-3">
                            EMAIL <span className="text-[#D4A24F]">VERIFIED</span>
                        </h1>
                        <p className="text-[#F4F1EA]/60 mb-8">
                            Your email has been verified successfully! You can now sign in to your CLEFEEL account.
                        </p>
                        <Link to="/account" className="btn-primary inline-block px-8">
                            Sign In
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 p-12">
                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle className="w-10 h-10 text-red-500" />
                        </div>
                        <h1 className="luxury-heading text-[#F4F1EA] text-2xl mb-3">
                            VERIFICATION <span className="text-red-400">FAILED</span>
                        </h1>
                        <p className="text-[#F4F1EA]/60 mb-8">
                            {!token
                                ? 'No verification token found. Please check the link from your email.'
                                : 'The verification link is invalid or has expired. Please request a new one.'}
                        </p>
                        <div className="flex flex-col gap-3">
                            <Link to="/account" className="btn-primary inline-block px-8">
                                Go to Login
                            </Link>
                        </div>
                    </div>
                )}

                <div className="mt-6 flex items-center justify-center gap-2 text-[#F4F1EA]/30 text-sm">
                    <Mail className="w-4 h-4" />
                    <span>Check your inbox for the verification email</span>
                </div>
            </div>
        </div>
    );
}
