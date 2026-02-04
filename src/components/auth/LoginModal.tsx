import { useEffect } from 'react';
import { X } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { Link } from 'react-router-dom';
import { getLenis } from '@/lib/lenis';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSignupClick?: () => void;
}

export const LoginModal = ({ isOpen, onClose, onSignupClick }: LoginModalProps) => {
    useEffect(() => {
        const lenis = getLenis();
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            lenis?.stop();
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            lenis?.start();
        }
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            lenis?.start();
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all animate-in fade-in duration-200">
            {/* Backdrop click to close */}
            <div className="absolute inset-0 touch-none" onClick={onClose} />

            <div
                className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl p-8 md:p-12 animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh] overscroll-contain"
                onClick={(e) => e.stopPropagation()}
                style={{ fontFamily: 'Poppins' }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Content of the Login Card */}
                <div className="text-center mb-8">
                    <img
                        src="https://cdn.prod.website-files.com/664330484432dcdd6519a8fd/665dd8e0007de68a44f3750b_Black%20and%20White%20Bold%20Typography%20Clothing%20Brand%20Logo%20(940%20x%20400%20px)%20(940%20x%20200%20px)%20(940%20x%20150%20px).png"
                        alt="FlashSpace Logo"
                        className="w-60 mx-auto mb-4"
                    />
                    <h2 className="text-xl font-bold text-[#172A3A] mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-slate-600 text-base font-medium">
                        Sign in to access your virtual office
                    </p>
                </div>

                <LoginForm />

                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-600">
                        Don't have an account?{' '}
                        {onSignupClick ? (
                            <button
                                onClick={() => {
                                    onClose();
                                    onSignupClick();
                                }}
                                className="font-bold text-[#4DA1FF] hover:text-[#3B82F6] transition-colors duration-200"
                            >
                                Sign up for free
                            </button>
                        ) : (
                            <Link
                                to="/signup"
                                onClick={onClose}
                                className="font-bold text-[#4DA1FF] hover:text-[#3B82F6] transition-colors duration-200"
                            >
                                Sign up for free
                            </Link>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};
