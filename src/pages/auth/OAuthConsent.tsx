import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { axiosInstance } from '@/lib/axios';
import { Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function OAuthConsent() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
    
    const [clientName, setClientName] = useState<string>('');
    const [isVerifying, setIsVerifying] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const clientId = searchParams.get('client_id');
    const redirectUri = searchParams.get('redirect_uri');
    const state = searchParams.get('state');

    useEffect(() => {
        const verifyClient = async () => {
            if (!clientId || !redirectUri) {
                setError('Invalid authorization request: Missing client_id or redirect_uri');
                setIsVerifying(false);
                return;
            }

            try {
                const response = await axiosInstance.get(`/oauth/authorize?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}`);
                if (response.data.success) {
                    setClientName(response.data.data.clientName);
                } else {
                    setError(response.data.message || 'Invalid client application');
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to verify application. Please check the URL.');
            } finally {
                setIsVerifying(false);
            }
        };

        if (!isAuthLoading) {
            if (!isAuthenticated) {
                // Save intended destination and redirect to login
                const currentUrl = window.location.pathname + window.location.search;
                navigate(`/login?redirect=${encodeURIComponent(currentUrl)}`);
            } else {
                verifyClient();
            }
        }
    }, [clientId, redirectUri, isAuthenticated, isAuthLoading, navigate]);

    const handleAllow = async () => {
        setIsSubmitting(true);
        try {
            const response = await axiosInstance.post('/oauth/authorize', {
                client_id: clientId,
                redirect_uri: redirectUri,
                state: state
            });

            if (response.data.success && response.data.redirectUrl) {
                // Redirect user to the callback URL of the AI Agent (e.g. Claude)
                window.location.href = response.data.redirectUrl;
            } else {
                setError('Failed to generate authorization code.');
                setIsSubmitting(false);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Authorization failed.');
            setIsSubmitting(false);
        }
    };

    const handleDeny = () => {
        // Redirect back with access_denied error
        if (redirectUri) {
            const url = new URL(redirectUri);
            url.searchParams.append('error', 'access_denied');
            if (state) url.searchParams.append('state', state);
            window.location.href = url.toString();
        } else {
            navigate('/dashboard');
        }
    };

    if (isAuthLoading || isVerifying) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin mb-4" />
                    <p>Verifying application...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="max-w-md w-full">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Authorization Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                    <Button className="w-full mt-4" variant="outline" onClick={() => navigate('/')}>
                        Return to Home
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-8 text-center bg-gradient-to-b from-teal-50 to-white border-b border-gray-100">
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck className="w-8 h-8 text-teal-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Application</h2>
                    <p className="text-gray-500 text-sm">
                        <strong className="text-gray-900">{clientName || 'An application'}</strong> is requesting access to your FlashSpace account.
                    </p>
                </div>
                
                <div className="p-8">
                    <div className="bg-gray-50 rounded-xl p-4 mb-8">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">This application will be able to:</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start text-sm text-gray-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 mr-2 flex-shrink-0"></span>
                                Access your FlashSpace data via Model Context Protocol (MCP)
                            </li>
                            <li className="flex items-start text-sm text-gray-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 mr-2 flex-shrink-0"></span>
                                Perform actions on your behalf according to your role permissions
                            </li>
                        </ul>
                    </div>
                    
                    <p className="text-xs text-gray-500 text-center mb-6">
                        You can revoke this access at any time from your AI Integrations dashboard.
                    </p>

                    <div className="flex flex-col gap-3">
                        <Button 
                            className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-base font-semibold"
                            onClick={handleAllow}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                            {isSubmitting ? 'Approving...' : 'Allow Access'}
                        </Button>
                        <Button 
                            className="w-full h-12 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-base font-medium"
                            variant="outline"
                            onClick={handleDeny}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
