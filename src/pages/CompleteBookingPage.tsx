import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Check, Shield, ShieldAlert, AlertTriangle, Clock, Star, Loader2, Tag, X,
    Building2, MapPin, IndianRupee, CheckCircle2, Package, CreditCard,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getVirtualOfficeById } from '@/services/virtualOffice.service';
import { VirtualOfficeItem } from '@/types/services';
import { getVirtualOfficePricing } from '@/utils/priceUtils';
import { useAuth } from '@/contexts/AuthContext';
import { validateCoupon, markCouponUsed } from '@/services/coupon.service';
import {
    createPaymentOrder,
    openRazorpayCheckout,
    verifyPayment,
    reportPaymentFailure,
    simulatePayment,
} from '@/services/payment.service';
import hotToast from 'react-hot-toast';
import userDashboardService from '@/services/userDashboard.service';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface TenureOption {
    years: 1 | 2 | 3;
    label: string;
    totalPrice: number;
    savings: number;
    savingsPercent: number;
    popular: boolean;
}

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
const CompleteBookingPage = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const planKeyId = searchParams.get('plan') || 'gst';
    const spaceType = searchParams.get('type') || 'virtual_office';

    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const isDevMode = import.meta.env.DEV;

    // Data
    const [loading, setLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [spaceDetails, setSpaceDetails] = useState<VirtualOfficeItem | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Tenure selection
    const [selectedTenure, setSelectedTenure] = useState<1 | 2 | 3>(1);
    const [tenureOptions, setTenureOptions] = useState<TenureOption[]>([]);
    const [planFeatures, setPlanFeatures] = useState<string[]>([]);
    const [planDisplayName, setPlanDisplayName] = useState('');
    const [yearlyBasePrice, setYearlyBasePrice] = useState(0);

    // Coupon
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{
        code: string;
        discountValue: number;
        affiliateId?: string;
    } | null>(null);
    const [couponLoading, setCouponLoading] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentOrder, setPaymentOrder] = useState<any>(null);

    // KYC STATE
    const [kycStatus, setKycStatus] = useState<string | null>(null);
    const [kycLoading, setKycLoading] = useState(true);

    // ─── LOAD SPACE ───────────────────────────
    useEffect(() => {
        if (!id) { setError('Invalid booking URL'); setLoading(false); return; }

        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getVirtualOfficeById(id);
                if (!data) { setError('Space not found'); return; }

                setSpaceDetails(data);
                const pricing = getVirtualOfficePricing(data);
                const plan = pricing?.[planKeyId as keyof typeof pricing] || pricing?.gst;
                if (!plan) { setError('Plan not found'); return; }

                const yearly = plan.yearlyPrice;
                setYearlyBasePrice(yearly);
                setPlanDisplayName(plan.name);
                setPlanFeatures(plan.features || ['Business Address', 'Mail Handling', 'GST Registration Support']);

                setTenureOptions([
                    { years: 1, label: '1 Year', totalPrice: yearly, savings: 0, savingsPercent: 0, popular: false },
                    { years: 2, label: '2 Years', totalPrice: Math.round(yearly * 2 * 0.9), savings: Math.round(yearly * 2 * 0.1), savingsPercent: 10, popular: true },
                    { years: 3, label: '3 Years', totalPrice: Math.round(yearly * 3 * 0.85), savings: Math.round(yearly * 3 * 0.15), savingsPercent: 15, popular: false },
                ]);
            } catch (err) {
                console.error(err);
                setError('Failed to load booking details');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, planKeyId]);

    // ─── AUTH GUARD ──────────────────────────
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate(`/login?redirect=/booking/${id}/complete?plan=${planKeyId}&type=${spaceType}`);
        }
    }, [authLoading, isAuthenticated]);

    // ─── KYC STATUS CHECK ──────────────────
    useEffect(() => {
        const checkKycStatus = async () => {
            if (!isAuthenticated || !user) {
                setKycLoading(false);
                setKycStatus(null);
                return;
            }

            // Bypass KYC for admins
            if (user.role === 'admin' || user.role === 'super_admin') {
                setKycStatus('approved');
                setKycLoading(false);
                return;
            }
            try {
                setKycLoading(true);
                const response = await userDashboardService.getKYC();
                if (response.success && response.data) {
                    const kycRecords = Array.isArray(response.data) ? response.data : [response.data];
                    const approved = kycRecords.find((k: any) => k.overallStatus === 'approved');
                    if (approved) {
                        setKycStatus('approved');
                    } else {
                        hotToast("KYC Verification Required", {
                            icon: "🛡️",
                            duration: 4000,
                        });
                        navigate('/dashboard/profile');
                        return;
                    }
                } else {
                    hotToast("KYC Verification Required", {
                        icon: "🛡️",
                        duration: 4000,
                    });
                    navigate('/dashboard/profile');
                    return;
                }
            } catch (err) {
                console.error('KYC check failed:', err);
                setKycStatus('not_started');
            } finally {
                setKycLoading(false);
            }
        };
        checkKycStatus();
    }, [isAuthenticated, user]);

    // ─── PRICING CALCULATION ──────────────────
    const selectedOption = tenureOptions.find(t => t.years === selectedTenure);
    const rawTotal = selectedOption?.totalPrice || 0;
    const couponDiscount = appliedCoupon ? Math.round(rawTotal * appliedCoupon.discountValue / 100) : 0;
    const tenureSavings = selectedOption?.savings || 0;
    const finalTotal = rawTotal - couponDiscount;

    // ─── COUPON HANDLER ───────────────────────
    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        if (!isAuthenticated) {
            hotToast.error('Please log in to apply a coupon.');
            return;
        }
        setCouponLoading(true);
        try {
            const result = await validateCoupon(couponCode.trim().toUpperCase());
            if (result.valid && result.data) {
                setAppliedCoupon({
                    code: result.data.code,      
                    discountValue: result.data.discountValue,
                    affiliateId: result.data.affiliateId,
                });
                hotToast.success(`Coupon applied! You saved ${result.data.discountValue}%`);
            } else {
                hotToast.error(result.message || 'Invalid coupon code');
                setAppliedCoupon(null);
            }
        } catch (err: any) {
            hotToast.error(err?.message || 'Failed to validate coupon');
            setAppliedCoupon(null);
        } finally {
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        hotToast('Coupon removed');
    };

    // ─── BUILD PAYLOAD ────────────────────────
    const buildPayload = () => ({
        userId: user!.id || (user as any)._id,
        userEmail: user!.email,
        userName: user!.fullName || user!.email,
        userPhone: (user as any)?.phoneNumber,
        spaceId: id!,
        spaceName: spaceDetails!.name,
        planName: planDisplayName,
        planKey: planKeyId,
        tenure: selectedTenure,
        yearlyPrice: yearlyBasePrice,
        totalAmount: finalTotal,
        discountPercent: appliedCoupon?.discountValue || 0,
        discountAmount: couponDiscount,
        paymentType: spaceType === 'coworking' ? 'coworking_space' as const : 'virtual_office' as const,
        couponCode: appliedCoupon?.code,
        affiliateId: appliedCoupon?.affiliateId,
    });

    // ─── STEP 1: Open payment modal + create order ─
    const handleOpenPaymentModal = async () => {
        if (!spaceDetails || !user || !selectedOption) return;
        setPaymentLoading(true);
        try {
            const order = await createPaymentOrder(buildPayload());
            setPaymentOrder(order);
            setShowPaymentModal(true);
        } catch (err: any) {
            // Handle KYC-required error from backend
            if (err?.response?.data?.kycRequired || err?.kycRequired) {
                hotToast.error(err?.response?.data?.message || 'KYC verification required before booking.');
                navigate('/dashboard/profile');
                return;
            }
            hotToast.error(err?.message || 'Failed to initiate payment. Please try again.');
        } finally {
            setPaymentLoading(false);
        }
    };

    // ─── STEP 2a: Pay with Razorpay ───────────
    const handleRazorpayPayment = async () => {
        if (!paymentOrder || !spaceDetails || !user) return;
        setPaymentLoading(true);
        setShowPaymentModal(false);
        try {
            await openRazorpayCheckout({
                orderId: paymentOrder.orderId,
                amount: paymentOrder.amount,
                currency: paymentOrder.currency,
                keyId: paymentOrder.keyId,
                userEmail: user.email,
                userName: user.fullName || user.email,
                userPhone: (user as any).phoneNumber,
                spaceName: spaceDetails.name,
                planName: planDisplayName,
                onSuccess: async (response) => {
                    try {
                        const result = await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        if (appliedCoupon) await markCouponUsed(appliedCoupon.code).catch(() => { });
                        navigate(`/payment/success?orderId=${result.orderId}&paymentId=${result.paymentId}&spaceName=${encodeURIComponent(spaceDetails.name)}&planName=${encodeURIComponent(planDisplayName)}&amount=${finalTotal}`);
                    } catch (err) {
                        hotToast.error('Payment verification failed. Please contact support.');
                    }
                },
                onFailure: (err) => {
                    reportPaymentFailure(paymentOrder.orderId, err.code, err.description);
                    navigate(`/payment/failed?orderId=${paymentOrder.orderId}`);
                },
                onDismiss: () => hotToast('Payment cancelled'),
            });
        } catch (err: any) {
            hotToast.error(err?.message || 'Failed to open Razorpay. Please try again.');
        } finally {
            setPaymentLoading(false);
        }
    };

    // ─── STEP 2b: Simulate payment (dev/test) ─
    const handleSimulatePayment = async () => {
        if (!paymentOrder || !spaceDetails) return;
        setPaymentLoading(true);
        setShowPaymentModal(false);
        try {
            hotToast.loading('Simulating payment...', { id: 'sim' });
            const result = await simulatePayment(paymentOrder.orderId);
            hotToast.dismiss('sim');
            if (appliedCoupon) await markCouponUsed(appliedCoupon.code).catch(() => { });
            navigate(`/payment/success?orderId=${result.orderId}&paymentId=${result.paymentId}&spaceName=${encodeURIComponent(spaceDetails.name)}&planName=${encodeURIComponent(planDisplayName)}&amount=${finalTotal}`);
        } catch (err: any) {
            hotToast.dismiss('sim');
            if (err?.response?.status === 403 || err?.response?.data?.kycRequired || err?.kycRequired) {
                hotToast.error(err?.response?.data?.message || 'KYC verification required.');
                navigate('/dashboard/profile');
                return;
            }
            hotToast.error(err?.message || 'Simulation failed.');
        } finally {
            setPaymentLoading(false);
        }
    };

    // ─── RENDER ───────────────────────────
    if (loading || authLoading || kycLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-background text-foreground">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading booking details…</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }


    if (error) {
        return (
            <div className="min-h-screen flex flex-col bg-background text-foreground">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <Building2 className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                        <p className="text-foreground font-medium">{error}</p>
                        <button onClick={() => navigate(-1)} className="mt-4 underline text-primary">Go back</button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Header />

            <main className="relative flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 pt-28 pb-8">
                {/* Back */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Space Details
                </button>

                <h1 className="text-3xl font-bold text-foreground mb-1">Complete Your Booking</h1>
                <p className="text-muted-foreground mb-8 text-sm">
                    Choose your preferred tenure for <span className="font-medium text-foreground">{planDisplayName}</span> at{' '}
                    <span className="font-medium text-foreground">{spaceDetails?.name}</span>
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
                    {/* ── LEFT PANEL ── */}
                    <div className="space-y-6">
                        {/* Tenure Selector */}
                        <section>
                            <h2 className="text-base font-semibold text-foreground mb-4">Select Tenure</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {tenureOptions.map((opt) => (
                                    <button
                                        key={opt.years}
                                        onClick={() => setSelectedTenure(opt.years)}
                                        className={`relative rounded-2xl border-2 p-5 text-left transition-all duration-200 ${selectedTenure === opt.years
                                            ? 'border-primary/60 bg-primary/10 shadow-md'
                                            : 'border-border bg-card hover:border-primary/40'
                                            }`}
                                    >
                                        {/* Popular badge */}
                                        {opt.popular && (
                                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                                                Most Popular
                                            </span>
                                        )}

                                        {/* Selected checkmark */}
                                        {selectedTenure === opt.years && (
                                            <span className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                                <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />
                                            </span>
                                        )}

                                        <p className="text-base font-semibold text-foreground mb-1">{opt.label}</p>
                                        <p className="text-2xl font-bold text-foreground">
                                            {formatCurrency(opt.totalPrice)}
                                            <span className="text-sm font-normal text-muted-foreground"> Total</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">Valid for {opt.years} Year{opt.years > 1 ? 's' : ''}</p>

                                        {opt.savingsPercent > 0 && (
                                            <span className="inline-block mt-2 text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                                                Save {formatCurrency(opt.savings)} ({opt.savingsPercent}% OFF)
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Plan Features */}
                        <section className="bg-muted/40 border border-border rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Package className="w-4 h-4 text-primary" />
                                <h3 className="font-semibold text-foreground text-sm">What's Included in {planDisplayName}</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8">
                                {planFeatures.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Trust badges */}
                        <div className="flex flex-wrap gap-6 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Instant Activation</span>
                            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> 100% Secure Payment</span>
                            <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5" /> Premium Support</span>
                        </div>
                    </div>

                    {/* ── RIGHT SIDEBAR ── */}
                    <div className="lg:sticky lg:top-24 self-start">
                        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                            {/* Space Image */}
                            {spaceDetails?.image && (
                                <div className="relative">
                                    <img
                                        src={spaceDetails.image}
                                        alt={spaceDetails.name}
                                        className="w-full h-40 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-3 left-4 text-white">
                                        <p className="font-semibold text-sm">{spaceDetails.name}</p>
                                        <p className="text-xs text-white/80 flex items-center gap-1 mt-0.5">
                                            <MapPin className="w-3 h-3" />
                                            {spaceDetails.address}, {spaceDetails.city}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="p-5 space-y-4">
                                {/* Order Summary */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <IndianRupee className="w-4 h-4 text-yellow-500" />
                                        <h3 className="font-bold text-foreground">Order Summary</h3>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>Plan</span>
                                            <span className="font-medium text-foreground">{planDisplayName}</span>
                                        </div>
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>Tenure</span>
                                            <span className="font-medium text-foreground">{selectedTenure} Year{selectedTenure > 1 ? 's' : ''}</span>
                                        </div>
                                        {tenureSavings > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Tenure Savings ({selectedOption?.savingsPercent}%)</span>
                                                <span className="font-medium">−{formatCurrency(tenureSavings)}</span>
                                            </div>
                                        )}
                                        {couponDiscount > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Coupon ({appliedCoupon?.code})</span>
                                                <span className="font-medium">−{formatCurrency(couponDiscount)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Coupon Input */}
                                {!appliedCoupon ? (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                            placeholder="Have a coupon code?"
                                            className="flex-1 text-sm border border-border bg-background rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground"
                                        />
                                        <button
                                            onClick={handleApplyCoupon}
                                            disabled={couponLoading || !couponCode.trim()}
                                            className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                                        >
                                            {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                            <span className="text-sm font-medium text-green-700 dark:text-green-400">{appliedCoupon.code} — {appliedCoupon.discountValue}% off</span>
                                        </div>
                                        <button onClick={handleRemoveCoupon}>
                                            <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                                        </button>
                                    </div>
                                )}

                                {/* Divider */}
                                <div className="h-px bg-border" />

                                {/* Total */}
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Amount</p>
                                        <p className="text-3xl font-bold text-foreground">{formatCurrency(finalTotal)}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">for {selectedTenure} year{selectedTenure > 1 ? 's' : ''}</p>
                                    </div>
                                </div>

                                {/* CTA */}
                                <button
                                    onClick={handleOpenPaymentModal}
                                    disabled={paymentLoading}
                                    className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow-md disabled:opacity-70"
                                >
                                    {paymentLoading ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Creating order…</>
                                    ) : (
                                        'Proceed to Payment'
                                    )}
                                </button>

                                <p className="text-center text-[11px] text-muted-foreground">
                                    By proceeding, you agree to our{' '}
                                    <a href="/terms" className="underline hover:text-foreground">Terms of Service</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* ── PAYMENT METHOD MODAL ── */}
            {showPaymentModal && paymentOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="bg-card border border-border rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
                        {/* Close */}
                        <button
                            onClick={() => setShowPaymentModal(false)}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
                        >
                            <X className="w-4 h-4 text-muted-foreground" />
                        </button>

                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-primary/15 rounded-xl flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-foreground">Complete Payment</h2>
                                <p className="text-sm text-muted-foreground">Choose how you'd like to pay</p>
                            </div>
                        </div>

                        {/* Amount banner */}
                        <div className="bg-foreground rounded-2xl p-5 mb-6 text-background">
                            <p className="text-sm text-background/70 mb-1">Amount to Pay</p>
                            <p className="text-3xl font-extrabold">{formatCurrency(finalTotal)}</p>
                            <p className="text-xs text-background/70 mt-1">{planDisplayName} · {selectedTenure} Year{selectedTenure > 1 ? 's' : ''}</p>
                        </div>

                        {/* Available methods (info only) */}
                        <div className="space-y-2 mb-6">
                            {['UPI (GPay, PhonePe, Paytm)', 'Credit / Debit Card', 'Net Banking (50+ Banks)'].map((m, i) => (
                                <div key={i} className="flex items-center justify-between px-4 py-3 bg-muted/40 border border-border rounded-xl text-sm text-muted-foreground">
                                    <span>{m}</span>
                                    <Check className="w-3.5 h-3.5 text-green-500" />
                                </div>
                            ))}
                        </div>

                        {/* Razorpay Pay button */}
                        <button
                            onClick={handleRazorpayPayment}
                            disabled={paymentLoading}
                            className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70"
                        >
                            <Shield className="w-4 h-4" />
                            Pay {formatCurrency(finalTotal)} with Razorpay
                        </button>

                        {/* Simulate button */}
                        <button
                            onClick={handleSimulatePayment}
                            disabled={paymentLoading}
                            className="w-full mt-3 py-3.5 border-2 border-dashed border-border text-muted-foreground hover:border-primary/60 hover:text-foreground font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                        >
                            🧪 Simulate Payment (Test Mode)
                        </button>

                        <p className="text-center text-[10px] text-muted-foreground mt-4 flex items-center justify-center gap-1">
                            <Shield className="w-3 h-3" /> Secured by 256-bit SSL · PCI DSS Compliant
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompleteBookingPage;
