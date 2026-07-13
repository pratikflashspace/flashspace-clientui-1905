import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Shield, Clock, Star, Loader2,
    IndianRupee, Package, Leaf, Gem, Crown, CheckCircle2
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import {
    createPaymentOrder,
    openRazorpayCheckout,
    verifyPayment,
    reportPaymentFailure,
    simulatePayment,
} from '@/services/payment.service';
import hotToast from 'react-hot-toast';

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

const allFeatures = [
    { name: "Virtual office", plans: ["basic", "pro", "premium", "elite"] },
    { name: "One CRM", plans: ["basic", "pro", "premium", "elite"] },
    { name: "GST", plans: ["pro", "premium", "elite"] },
    { name: "MSME/ Trade License", plans: ["pro", "premium", "elite"] },
    { name: "ESIC/PF", plans: ["pro", "premium", "elite"] },
    { name: "Website Development (AI chatbot + Domain + Hosting)", plans: ["premium", "elite"] },
    { name: "Pvt Ltd/LLP/OPC Registration", plans: ["elite"] },
];

const PackageCheckout = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const planKey = searchParams.get('plan') || 'basic';
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();

    const [paymentLoading, setPaymentLoading] = useState(false);
    const [isDevMode] = useState(import.meta.env.DEV);

    // Pricing config for packages
    const prices: Record<string, number> = {
        'basic': 9999,
        'pro': 11999,
        'premium': 14999,
        'elite': 24999
    };
    
    const basePrice = prices[planKey] || 9999;
    const cgstAmount = Math.round(basePrice * 0.09);
    const sgstAmount = Math.round(basePrice * 0.09);
    const finalTotal = basePrice + cgstAmount + sgstAmount;

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/auth/login?redirect=/package-checkout?plan=' + planKey);
        }
    }, [authLoading, isAuthenticated, navigate, planKey]);

    const buildPayload = () => ({
        userId: user!.id || (user as any)._id,
        userEmail: user!.email,
        userName: user!.fullName || user!.email,
        userPhone: (user as any)?.phoneNumber || undefined,
        spaceName: `${planKey.toUpperCase()} Package`,
        planName: `${planKey.toUpperCase()} Package`,
        planKey: planKey,
        tenure: 1,
        yearlyPrice: basePrice,
        totalAmount: finalTotal,
        discountPercent: 0,
        discountAmount: 0,
        paymentType: 'package_purchase' as const,
    });

    const handlePayment = async () => {
        if (!isAuthenticated || !user) {
            hotToast.error('Please login to continue');
            return;
        }

        setPaymentLoading(true);
        try {
            const order = await createPaymentOrder(buildPayload());
            
            if (order.devMode) {
                hotToast.loading('Simulating payment...', { id: 'sim' });
                const result = await simulatePayment(order.orderId);
                hotToast.dismiss('sim');
                navigate(`/payment/success?orderId=${result.orderId}&paymentId=${result.paymentId}&spaceName=${encodeURIComponent(planKey.toUpperCase() + ' Package')}&amount=${finalTotal}`);
                return;
            }

            await openRazorpayCheckout({
                orderId: order.orderId,
                amount: order.amount,
                currency: order.currency,
                keyId: order.keyId,
                userEmail: user.email,
                userName: user.fullName || user.email,
                userPhone: (user as any).phoneNumber,
                spaceName: `${planKey.toUpperCase()} Package`,
                planName: `${planKey.toUpperCase()} Package`,
                onSuccess: async (response) => {
                    try {
                        const result = await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        navigate(`/payment/success?orderId=${result.orderId}&paymentId=${result.paymentId}&spaceName=${encodeURIComponent(planKey.toUpperCase() + ' Package')}&amount=${finalTotal}`);
                    } catch (err) {
                        hotToast.error('Payment verification failed. Please contact support.');
                    }
                },
                onFailure: (err) => {
                    reportPaymentFailure(order.orderId, err.code, err.description);
                    navigate(`/payment/failed?orderId=${order.orderId}`);
                },
                onDismiss: () => hotToast('Payment cancelled'),
            });
        } catch (err: any) {
            hotToast.error(err?.message || 'Failed to open Razorpay. Please try again.');
        } finally {
            setPaymentLoading(false);
        }
    };

    const handleSimulatePayment = async () => {
        if (!isAuthenticated || !user) {
            hotToast.error('Please login to continue');
            return;
        }

        setPaymentLoading(true);
        try {
            hotToast.loading('Creating test order...', { id: 'sim' });
            const order = await createPaymentOrder(buildPayload());
            
            hotToast.loading('Simulating payment success...', { id: 'sim' });
            const result = await simulatePayment(order.orderId);
            hotToast.dismiss('sim');
            
            hotToast.success('Test Payment Successful! 🎉');
            navigate(`/payment/success?orderId=${result.orderId}&paymentId=${result.paymentId}&spaceName=${encodeURIComponent(planKey.toUpperCase() + ' Package')}&amount=${finalTotal}`);
        } catch (err: any) {
            hotToast.dismiss('sim');
            hotToast.error(err?.message || 'Simulation failed.');
        } finally {
            setPaymentLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-background text-foreground">
                <Header loginBlack forceWhiteBackground />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#FAFAF7] text-foreground font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
            <Header loginBlack forceWhiteBackground />

            <main className="relative flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 pt-28 pb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Packages
                </button>

                <h1 className="text-3xl font-bold text-[#1F2E26] mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Complete Your Purchase</h1>
                <p className="text-muted-foreground mb-8 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                    You are purchasing the <span className="font-medium text-[#36503F]">{planKey.toUpperCase()}</span> package.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-8 items-stretch">
                            {/* Selected Plan Card */}
                            <div className="relative z-10 w-full md:w-1/2 max-w-sm mx-auto lg:mx-0 bg-[#FCFBF8] py-12 px-6 text-center border-2 border-[#36503F] ring-1 ring-[#36503F]/50 rounded-xl shadow-[0_0_25px_rgba(54,80,63,0.15)] flex flex-col items-center shrink-0">
                                {planKey.toLowerCase() === 'premium' && (
                                    <div className="mb-6 mx-auto">
                                      <span className="bg-[#FEF8C5] text-[#36503F] text-[10px] font-bold px-4 py-1.5 rounded-full tracking-wider uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
                                        Most Popular
                                      </span>
                                    </div>
                                )}
                                
                                <div className="w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center mx-auto mb-6 text-[#36503F]">
                                    {planKey.toLowerCase() === 'basic' && <Leaf className="w-6 h-6" />}
                                    {planKey.toLowerCase() === 'pro' && <Star className="w-6 h-6" />}
                                    {planKey.toLowerCase() === 'premium' && <Gem className="w-8 h-8" />}
                                    {planKey.toLowerCase() === 'elite' && <Crown className="w-6 h-6" />}
                                </div>

                                <h3 className="text-base tracking-widest font-bold text-[#36503F] mb-4 uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    {planKey}
                                </h3>
                                <div className="w-8 h-[2px] bg-[#36503F] mx-auto mb-6"></div>

                                <p className="text-gray-600 text-xs leading-relaxed mb-8 whitespace-pre-line flex-grow" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    {planKey.toLowerCase() === 'basic' && "Everything you need\nto get started."}
                                    {planKey.toLowerCase() === 'pro' && "More power. More\nfeatures. More growth."}
                                    {planKey.toLowerCase() === 'premium' && "Advanced tools for\nserious results."}
                                    {planKey.toLowerCase() === 'elite' && "Unmatched performance\nfor top achievers."}
                                </p>

                                <div className="mb-4">
                                    <span className="text-5xl font-serif text-[#36503F]" style={{ fontFamily: "'Inter', sans-serif" }}>
                                        {formatCurrency(basePrice).replace('.00', '')}
                                    </span>
                                </div>
                            </div>

                            {/* Features List */}
                            <div className="w-full md:w-1/2 bg-white rounded-xl p-8 border border-[#E8E2D9] shadow-sm flex flex-col justify-center">
                                <h3 className="font-bold text-[#1F2E26] text-xl mb-6 font-sans border-b border-[#E8E2D9] pb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    What's Included:
                                </h3>
                                <ul className="space-y-5">
                                    {allFeatures.filter(f => f.plans.includes(planKey.toLowerCase())).map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-4">
                                            <div className="mt-0.5 flex-shrink-0">
                                                <CheckCircle2 className="w-5 h-5 text-[#36503F]" />
                                            </div>
                                            <span className="text-[15px] text-[#677E73] font-medium leading-snug" style={{ fontFamily: "'Inter', sans-serif" }}>{feature.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-6 text-xs text-muted-foreground justify-center lg:justify-start">
                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Instant Activation</span>
                            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> 100% Secure Payment</span>
                            <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5" /> Premium Support</span>
                        </div>
                    </div>

                    <div className="lg:sticky lg:top-24 self-start">
                        <div className="bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden shadow-md">
                            <div className="p-6 space-y-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <IndianRupee className="w-5 h-5 text-[#36503F]" />
                                        <h3 className="font-bold text-[#1F2E26] text-lg">Order Summary</h3>
                                    </div>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between text-[#677E73]">
                                            <span>Package</span>
                                            <span className="font-bold text-[#1F2E26]">{planKey.toUpperCase()}</span>
                                        </div>
                                        <div className="flex justify-between text-[#677E73]">
                                            <span>Base Price</span>
                                            <span className="font-medium text-[#1F2E26]">{formatCurrency(basePrice)}</span>
                                        </div>
                                        <div className="flex justify-between text-[#677E73]">
                                            <span>CGST (9%)</span>
                                            <span className="font-medium text-[#1F2E26]">{formatCurrency(cgstAmount)}</span>
                                        </div>
                                        <div className="flex justify-between text-[#677E73]">
                                            <span>SGST (9%)</span>
                                            <span className="font-medium text-[#1F2E26]">{formatCurrency(sgstAmount)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-[#E8E2D9]" />

                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-xs text-[#677E73] uppercase tracking-wider font-bold mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Total Amount</p>
                                        <p className="text-4xl font-bold text-[#36503F] tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>{formatCurrency(finalTotal)}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePayment}
                                    disabled={paymentLoading}
                                    className="w-full py-4 bg-[#36503F] hover:bg-[#1F2E26] text-[#FEF8C5] font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow-md disabled:opacity-70"
                                >
                                    {paymentLoading ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                                    ) : (
                                        'Proceed to Payment'
                                    )}
                                </button>

                                {isDevMode && (
                                    <button
                                        onClick={handleSimulatePayment}
                                        disabled={paymentLoading}
                                        className="w-full py-3 border-2 border-dashed border-[#36503F] bg-white text-[#36503F] hover:bg-[#F0F4EE] font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-xs"
                                    >
                                        {paymentLoading ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> Simulating…</>
                                        ) : (
                                            'Test Payment (Dev Only)'
                                        )}
                                    </button>
                                )}

                                <p className="text-center text-xs text-[#677E73]">
                                    By proceeding, you agree to our{' '}
                                    <a href="/terms" className="underline hover:text-[#36503F]">Terms of Service</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PackageCheckout;
