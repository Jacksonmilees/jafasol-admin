import React, { useState, useEffect } from 'react';

interface LoginPageProps {
    onLogin: (email: string, password: string) => void;
    isLoading?: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, isLoading = false }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [lockoutTime, setLockoutTime] = useState(0);
    const [countdown, setCountdown] = useState(0);

    // Check for existing lockout on component mount
    useEffect(() => {
        const savedAttempts = localStorage.getItem('adminLoginAttempts');
        const savedLockoutTime = localStorage.getItem('adminLockoutTime');
        
        if (savedAttempts) {
            setLoginAttempts(parseInt(savedAttempts));
        }
        
        if (savedLockoutTime) {
            const lockoutEnd = parseInt(savedLockoutTime);
            const now = Date.now();
            
            if (now < lockoutEnd) {
                setIsLocked(true);
                setLockoutTime(lockoutEnd);
                setCountdown(Math.ceil((lockoutEnd - now) / 1000));
            } else {
                // Lockout expired, reset
                localStorage.removeItem('adminLoginAttempts');
                localStorage.removeItem('adminLockoutTime');
                setLoginAttempts(0);
                setIsLocked(false);
            }
        }
    }, []);

    // Countdown timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        
        if (isLocked && countdown > 0) {
            interval = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        setIsLocked(false);
                        setLoginAttempts(0);
                        localStorage.removeItem('adminLoginAttempts');
                        localStorage.removeItem('adminLockoutTime');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isLocked, countdown]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isLocked) {
            return;
        }
        
        // Simulate login attempt
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        localStorage.setItem('adminLoginAttempts', newAttempts.toString());
        
        if (newAttempts >= 3) {
            // Lock the account for 20 minutes
            const lockoutEnd = Date.now() + (20 * 60 * 1000); // 20 minutes
            setLockoutTime(lockoutEnd);
            setIsLocked(true);
            setCountdown(20 * 60); // 20 minutes in seconds
            localStorage.setItem('adminLockoutTime', lockoutEnd.toString());
        } else {
            // Attempt login
            onLogin(email, password);
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
                {/* Logo and Branding */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl mb-6 overflow-hidden">
                        <img 
                            src="/admin/logo.png" 
                            alt="Jafasol Logo" 
                            className="w-12 h-12 object-contain"
                            onError={(e) => {
                                // Fallback to SVG if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.setAttribute('style', 'display: block');
                            }}
                        />
                        <svg className="w-12 h-12 text-white hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-5xl font-black text-white mb-2 tracking-tight">
                        JAFASOL
                    </h1>
                    <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                        <span className="text-white/90 text-sm font-medium">ADMIN PORTAL</span>
                    </div>
                    <p className="mt-4 text-white/70 text-sm max-w-sm mx-auto">
                        Secure access to administrative functions
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-white mb-2">Sign In</h2>
                        <p className="text-white/70 text-sm">Enter your credentials to continue</p>
                    </div>

                    {isLocked ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Account Temporarily Locked</h3>
                            <p className="text-white/70 text-sm mb-4">
                                Too many failed login attempts. Please wait before trying again.
                            </p>
                            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white mb-2">
                                        {formatTime(countdown)}
                                    </div>
                                    <p className="text-white/70 text-sm">Time remaining</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-white/90 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                            </svg>
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            disabled={isLoading}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold text-white/90 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            disabled={isLoading}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="Enter your password"
                                        />
                                    </div>
                                </div>

                                {/* Login Attempts Warning */}
                                {loginAttempts > 0 && (
                                    <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-3">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                            <span className="text-yellow-200 text-sm">
                                                {3 - loginAttempts} attempts remaining
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            disabled={isLoading}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-white/30 rounded bg-white/10 disabled:cursor-not-allowed"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-white/80">
                                            Remember me
                                        </label>
                                    </div>

                                    <div className="text-sm">
                                        <a href="#" className="font-medium text-indigo-300 hover:text-indigo-200 transition-colors">
                                            Forgot password?
                                        </a>
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Accessing Portal...
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                </svg>
                                                Access Portal
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </form>

                            {/* Security Notice */}
                            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    <span className="text-white/70 text-xs">Secure connection • Authorized access only</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                <p className="text-white/50 text-xs">
                    © 2025 Jafasol. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
