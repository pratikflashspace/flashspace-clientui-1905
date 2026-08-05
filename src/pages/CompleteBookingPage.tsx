import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import {
    ArrowLeft, Check, Shield, Clock, Star, Loader2, Tag, X,
    Building2, MapPin, IndianRupee, CheckCircle2, Package, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
import {
    clearCheckoutState,
    getLoginRedirectUrl,
    persistCheckoutState,
    readCheckoutState,
} from '@/utils/checkoutSession';
import axiosInstance from '@/services/api.service';

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
    const location = useLocation();
    const planKeyId = searchParams.get('plan') || 'gst';
    const spaceType = searchParams.get('type') || 'virtual_office';
    const checkoutReturnTo = `${location.pathname}${location.search}${location.hash}`;

    const { user, isAuthenticated, isLoading: authLoading } = useAuth();

    // Data
    const [loading, setLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [spaceDetails, setSpaceDetails] = useState<VirtualOfficeItem | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDevMode] = useState(import.meta.env.DEV);

    // Tenure selection
    let urlTenure = parseInt(searchParams.get('tenure') || '1', 10);
    if (urlTenure > 3) urlTenure = Math.round(urlTenure / 12);
    const initialTenure = [1, 2, 3].includes(urlTenure) ? (urlTenure as 1 | 2 | 3) : 1;
    const [selectedTenure, setSelectedTenure] = useState<1 | 2 | 3>(initialTenure);
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

    const persistCurrentCheckout = () => {
        persistCheckoutState(
            {
                page: 'complete-booking',
                path: checkoutReturnTo,
                selectedTenure,
                couponCode,
                appliedCoupon,
            },
            checkoutReturnTo,
        );
    };

    useEffect(() => {
        const saved = readCheckoutState<{
            page?: string;
            path?: string;
            selectedTenure?: 1 | 2 | 3;
            couponCode?: string;
            appliedCoupon?: typeof appliedCoupon;
        }>();

        if (saved?.page !== 'complete-booking' || saved.path !== checkoutReturnTo) return;
        if (saved.selectedTenure) setSelectedTenure(saved.selectedTenure);
        if (typeof saved.couponCode === 'string') setCouponCode(saved.couponCode);
        if (saved.appliedCoupon !== undefined) setAppliedCoupon(saved.appliedCoupon);
    }, [checkoutReturnTo]);

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
            persistCurrentCheckout();
            navigate(getLoginRedirectUrl(checkoutReturnTo), {
                state: { redirectTo: checkoutReturnTo },
                replace: true,
            });
        }
    }, [authLoading, isAuthenticated, checkoutReturnTo]);

    // ─── PRICING CALCULATION ──────────────────
    const selectedOption = tenureOptions.find(t => t.years === selectedTenure);
    const rawTotal = selectedOption?.totalPrice || 0;
    const couponDiscount = appliedCoupon ? Math.round(rawTotal * appliedCoupon.discountValue / 100) : 0;
    const tenureSavings = selectedOption?.savings || 0;
    const taxableAmount = Math.max(rawTotal - couponDiscount, 0);
    const cgstAmount = Math.round(taxableAmount * 0.09);
    const sgstAmount = Math.round(taxableAmount * 0.09);
    const finalTotal = taxableAmount + cgstAmount + sgstAmount;
    const originalFinalTotal = rawTotal + Math.round(rawTotal * 0.09) + Math.round(rawTotal * 0.09);

    // ─── COUPON HANDLER ───────────────────────
    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        if (!isAuthenticated) {
            hotToast.error('Please log in to apply a coupon.');
            persistCurrentCheckout();
            navigate(getLoginRedirectUrl(checkoutReturnTo), {
                state: { redirectTo: checkoutReturnTo },
            });
            return;
        }
        setCouponLoading(true);
        try {
            const result = await validateCoupon(couponCode.trim().toUpperCase(), spaceDetails?.name);
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
        spaceId: (spaceDetails as any)?._id || spaceDetails?.id || id!,
        spaceName: spaceDetails!.name,
        planName: planDisplayName,
        planKey: planKeyId,
        tenure: selectedTenure,
        yearlyPrice: yearlyBasePrice,
        totalAmount: finalTotal,
        discountPercent: appliedCoupon?.discountValue || 0,
        discountAmount: couponDiscount,
        paymentType: spaceType === 'coworking' ? 'coworking_space' as const : 'virtual_office' as const,
        couponCode: appliedCoupon?.code || undefined,
        affiliateId: appliedCoupon?.affiliateId || undefined,
        bookingId: searchParams.get('booking') || undefined,
    });

    // ─── STEP 1: Process Payment ─
    const handlePayment = async () => {
        if (!isAuthenticated || !user) {
            hotToast.error('Please login to continue with your booking');
            persistCurrentCheckout();
            navigate(getLoginRedirectUrl(checkoutReturnTo), {
                state: { redirectTo: checkoutReturnTo },
            });
            return;
        }
        if (!spaceDetails || !selectedOption) return;

        try {
            await axiosInstance.post('/leads/booking-lead', {
                userId: user.id || (user as any)._id,
                name: user.fullName || user.email.split('@')[0],
                email: user.email,
                phone: (user as any).phoneNumber,
                spaceId: id!,
                spaceName: spaceDetails.name,
            });
        } catch (err) {
            console.error('Lead capture failed:', err);
        }

        setPaymentLoading(true);
        try {
            const order = await createPaymentOrder(buildPayload());
            
            // Auto-simulate if in dev mode and keys are missing
            if (order.devMode) {
                hotToast.loading('Simulating payment...', { id: 'sim' });
                const result = await simulatePayment(order.orderId);
                hotToast.dismiss('sim');
                if (appliedCoupon) await markCouponUsed(appliedCoupon.code).catch(() => { });
                clearCheckoutState();
                navigate(`/payment/success?orderId=${result.orderId}&paymentId=${result.paymentId}&spaceName=${encodeURIComponent(spaceDetails.name)}&planName=${encodeURIComponent(planDisplayName)}&amount=${finalTotal}`);
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
                        clearCheckoutState();
                        navigate(`/payment/success?orderId=${result.orderId}&paymentId=${result.paymentId}&spaceName=${encodeURIComponent(spaceDetails.name)}&planName=${encodeURIComponent(planDisplayName)}&amount=${finalTotal}`);
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

    // ─── STEP 2b: Simulate payment (dev/test) ─
    const handleSimulatePayment = async () => {
        if (!isAuthenticated || !user) {
            hotToast.error('Please login to continue');
            persistCurrentCheckout();
            navigate(getLoginRedirectUrl(checkoutReturnTo), {
                state: { redirectTo: checkoutReturnTo },
            });
            return;
        }
        if (!spaceDetails) return;

        // --- CAPTURE BOOKING LEAD ---
        try {
            await axiosInstance.post('/leads/booking-lead', {
                userId: user.id || (user as any)._id,
                name: user.fullName || user.email.split('@')[0],
                email: user.email,
                phone: (user as any).phoneNumber,
                spaceId: id!,
                spaceName: spaceDetails.name,
            });
        } catch (err) {
            console.error('Lead capture failed:', err);
        }
        // ----------------------------

        setPaymentLoading(true);
        try {
            hotToast.loading('Creating test order...', { id: 'sim' });
            const order = await createPaymentOrder(buildPayload());
            
            hotToast.loading('Simulating payment success...', { id: 'sim' });
            const result = await simulatePayment(order.orderId);
            hotToast.dismiss('sim');
            
            if (appliedCoupon) await markCouponUsed(appliedCoupon.code).catch(() => { });
            clearCheckoutState();
            hotToast.success('Test Payment Successful! 🎉');
            navigate(`/payment/success?orderId=${result.orderId}&paymentId=${result.paymentId}&spaceName=${encodeURIComponent(spaceDetails.name)}&planName=${encodeURIComponent(planDisplayName)}&amount=${finalTotal}`);
        } catch (err: any) {
            hotToast.dismiss('sim');
            hotToast.error(err?.message || 'Simulation failed.');
        } finally {
            setPaymentLoading(false);
        }
    };



    // ─── RENDER ───────────────────────────
    if (loading || authLoading) {
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
                    <span className="font-medium text-foreground">{spaceDetails?.spaceId || spaceDetails?.id || spaceDetails?._id || spaceDetails?.name}</span>
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
                                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FEF865] text-[#36503F] text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
                                                Most Popular
                                            </span>
                                        )}

                                        {/* Selected checkmark */}
                                        {selectedTenure === opt.years && (
                                            <span className="absolute top-3 right-3 w-5 h-5 bg-[#36503F] rounded-full flex items-center justify-center">
                                                <Check className="w-3 h-3 text-white" strokeWidth={3} />
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
                                <motion.div 
                                    animate={appliedCoupon ? { 
                                        scale: [1, 1.03, 1], 
                                        boxShadow: ["0 0 0px rgba(34,197,94,0)", "0 0 20px rgba(34,197,94,0.3)", "0 0 0px rgba(34,197,94,0)"] 
                                    } : {}}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    className="rounded-xl relative overflow-hidden"
                                >
                                    {/* Full-box magic stars */}
                                    {appliedCoupon && (
                                        <div className="absolute inset-0 pointer-events-none z-0">
                                            {[
                                                { x: -80, y: -60, scale: 1.2, delay: 0 },
                                                { x: 100, y: -40, scale: 0.8, delay: 0.1 },
                                                { x: -50, y: 80, scale: 1.5, delay: 0.2 },
                                                { x: 90, y: 70, scale: 1, delay: 0.3 },
                                                { x: 0, y: -90, scale: 0.9, delay: 0.15 },
                                                { x: 30, y: 100, scale: 1.1, delay: 0.05 },
                                            ].map((star, i) => (
                                                <motion.div
                                                    key={`star-${i}-${finalTotal}`}
                                                    initial={{ opacity: 0, scale: 0, x: 0, y: 0, rotate: 0 }}
                                                    animate={{ 
                                                        opacity: [0, 1, 1, 0], 
                                                        scale: [0, star.scale, 0], 
                                                        x: star.x, 
                                                        y: star.y,
                                                        rotate: 180
                                                    }}
                                                    transition={{ duration: 1.2, ease: "easeOut", delay: star.delay }}
                                                    className="absolute top-1/2 left-1/2 text-yellow-400"
                                                >
                                                    <Sparkles className="w-5 h-5 fill-yellow-400/50" />
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 mb-3 h-6 relative z-10">
                                        <AnimatePresence mode="wait">
                                            {appliedCoupon ? (
                                                <motion.div
                                                    key="special-price"
                                                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Sparkles className="w-4 h-4 text-green-500 animate-pulse" />
                                                    <h3 className="font-bold text-green-600 dark:text-green-500">
                                                        Your New Special Price
                                                    </h3>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="order-summary"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="flex items-center gap-2"
                                                >
                                                    <IndianRupee className="w-4 h-4 text-yellow-500" />
                                                    <h3 className="font-bold text-foreground">Order Summary</h3>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        {appliedCoupon && (
                                            <div className="flex justify-between text-muted-foreground pb-2 mb-2 border-b border-border/40">
                                                <span>Actual Price (Excluding GST)</span>
                                                <span className="font-medium text-muted-foreground line-through decoration-red-500/50">
                                                    {formatCurrency(rawTotal)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>Plan</span>
                                            <span className="font-medium text-foreground">{planDisplayName}</span>
                                        </div>
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>Total Price</span>
                                            <span className="font-medium text-foreground">{formatCurrency(rawTotal)}</span>
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
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>CGST (9%)</span>
                                            <span className="font-medium text-foreground">{formatCurrency(cgstAmount)}</span>
                                        </div>
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>SGST (9%)</span>
                                            <span className="font-medium text-foreground">{formatCurrency(sgstAmount)}</span>
                                        </div>
                                    </div>
                                </motion.div>

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
                                            className="px-4 py-2 bg-[#36503F] text-[#FEF8C5] text-sm font-bold rounded-lg hover:bg-[#1F2E26] disabled:opacity-50 transition-colors"
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
                                        <div className="relative inline-block z-10">
                                            <AnimatePresence mode="wait">
                                                <motion.div 
                                                    key={finalTotal}
                                                    initial={{ filter: "blur(12px)", opacity: 0, scale: 0.8 }}
                                                    animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
                                                    exit={{ filter: "blur(12px)", opacity: 0, scale: 1.2 }}
                                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                                    className={`text-3xl font-bold ${appliedCoupon ? 'text-green-600' : 'text-foreground'}`}
                                                >
                                                    {formatCurrency(finalTotal)}
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">for {selectedTenure} year{selectedTenure > 1 ? 's' : ''}</p>
                                    </div>
                                </div>

                                {/* CTA */}
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
                                        className="w-full mt-2 py-3 border-2 border-dashed border-[#36503F] bg-[#36503F] text-[#FEF8C5] hover:bg-[#1F2E26] font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-xs"
                                    >
                                        {paymentLoading ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> Simulating…</>
                                        ) : (
                                            'Test Payment (Dev Only)'
                                        )}
                                    </button>
                                )}

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

            {/* Removed Payment Modal - Going direct to Razorpay */}
        </div>
    );
};

export default CompleteBookingPage;
