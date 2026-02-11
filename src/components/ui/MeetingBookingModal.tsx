import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { X, Calendar, Clock, User, ChevronLeft, ChevronRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { getAvailability, bookMeeting, TimeSlot } from '@/services/meeting.service';
import { ListingItem } from '@/components/services/ListingCardModern';

interface MeetingBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: ListingItem;
}

type ModalStep = 'calendar' | 'form' | 'success' | 'error';

export default function MeetingBookingModal({ isOpen, onClose, item }: MeetingBookingModalProps) {
    const ref = useRef<HTMLDivElement | null>(null);

    // State
    const [step, setStep] = useState<ModalStep>('calendar');
    const [loading, setLoading] = useState(false);
    const [availability, setAvailability] = useState<{ [date: string]: TimeSlot[] }>({});
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

    // Form state
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    // Fetch availability on mount
    useEffect(() => {
        if (isOpen) {
            fetchAvailability();
        }
    }, [isOpen]);

    // Close on ESC key
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
        }
        if (isOpen) {
            document.addEventListener('keydown', onKey);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setStep('calendar');
            setSelectedDate(null);
            setSelectedSlot(null);
            setFullName('');
            setEmail('');
            setPhoneNumber('');
            setErrorMessage('');
        }
    }, [isOpen]);

    const fetchAvailability = async () => {
        setLoading(true);
        try {
            const response = await getAvailability(7);
            // Convert array format to object format: [{date, slots}] -> {date: slots}
            const availabilityData = response.availability || response.data?.availability || [];
            const availabilityMap: { [date: string]: TimeSlot[] } = {};

            if (Array.isArray(availabilityData)) {
                availabilityData.forEach((day: { date: string; slots: TimeSlot[] }) => {
                    if (day.slots && day.slots.length > 0) {
                        availabilityMap[day.date] = day.slots;
                    }
                });
            } else if (typeof availabilityData === 'object') {
                // Already in object format
                Object.assign(availabilityMap, availabilityData);
            }

            setAvailability(availabilityMap);
        } catch (error) {
            setErrorMessage('Failed to fetch availability. Please try again.');
            setStep('error');
        } finally {
            setLoading(false);
        }
    };

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
        setSelectedSlot(null);
    };

    const handleSlotSelect = (slot: TimeSlot) => {
        setSelectedSlot(slot);
    };

    const handleProceedToForm = () => {
        if (selectedSlot) {
            setStep('form');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedSlot || !fullName || !email || !phoneNumber) {
            return;
        }

        setLoading(true);
        try {
            const slotTime = new Date(selectedSlot.startTime).toISOString();

            const response = await bookMeeting({
                fullName,
                email,
                phoneNumber,
                slotTime,
                notes: `${item.name} - ${item.address}`,
            });

            if (response.success) {
                setStep('success');
            } else {
                setErrorMessage(response.message || 'Booking failed. Please try again.');
                setStep('error');
            }
        } catch (error: any) {
            setErrorMessage(error.message || 'Booking failed. Please try again.');
            setStep('error');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatTime = (slot: TimeSlot) => {
        // Use displayTime if available, otherwise format from startTime
        if (slot.displayTime) {
            return slot.displayTime.split(' - ')[0]; // Just the start time
        }
        const date = new Date(slot.startTime);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const isDateToday = (dateStr: string) => {
        const today = new Date().toDateString();
        const date = new Date(dateStr).toDateString();
        return today === date;
    };

    if (!isOpen) return null;

    const sortedDates = Object.keys(availability).sort((a, b) =>
        new Date(a).getTime() - new Date(b).getTime()
    );

    const modal = (
        <div
            ref={ref}
            className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-8"
            aria-modal="true"
            role="dialog"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Background overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal card */}
            <div
                className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-amber-500" />
                        <h3 className="text-lg font-semibold text-gray-900">
                            {step === 'calendar' && 'Schedule a Meeting'}
                            {step === 'form' && 'Your Details'}
                            {step === 'success' && 'Meeting Booked!'}
                            {step === 'error' && 'Booking Failed'}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {/* Loading State */}
                    {loading && step === 'calendar' && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-3" />
                            <p className="text-gray-500">Loading available times...</p>
                        </div>
                    )}

                    {/* Calendar Step */}
                    {!loading && step === 'calendar' && (
                        <div className="space-y-4">
                            {/* Date Selection */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Select a Date</h4>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                    {sortedDates.map((date) => (
                                        <button
                                            key={date}
                                            onClick={() => handleDateSelect(date)}
                                            className={`p-3 rounded-xl text-center transition-all ${selectedDate === date
                                                ? 'bg-amber-500 text-white shadow-md'
                                                : availability[date]?.length > 0
                                                    ? 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                                                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                                }`}
                                            disabled={!availability[date]?.length}
                                        >
                                            <div className="text-xs font-medium">
                                                {isDateToday(date) ? 'Today' : formatDate(date).split(',')[0]}
                                            </div>
                                            <div className="text-sm font-semibold">
                                                {new Date(date).getDate()}
                                            </div>
                                            <div className="text-xs opacity-75">
                                                {availability[date]?.length || 0} slots
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                {sortedDates.length === 0 && (
                                    <p className="text-center text-gray-500 py-6">
                                        No availability found for the next 7 days.
                                    </p>
                                )}
                            </div>

                            {/* Time Slot Selection */}
                            {selectedDate && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                                        Available Times for {formatDate(selectedDate)}
                                    </h4>
                                    {availability[selectedDate]?.length > 0 ? (
                                        <div className="grid grid-cols-3 gap-2">
                                            {availability[selectedDate].map((slot, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleSlotSelect(slot)}
                                                    className={`p-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${selectedSlot?.startTime === slot.startTime
                                                        ? 'bg-amber-500 text-white shadow-md'
                                                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                                                        }`}
                                                >
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {formatTime(slot)}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 bg-gray-50 rounded-xl">
                                            <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                            <p className="text-gray-500">No time slots available for this date</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Continue Button */}
                            {selectedSlot && (
                                <button
                                    onClick={handleProceedToForm}
                                    className="w-full py-3 bg-gray-900 hover:bg-amber-500 text-white font-medium rounded-xl transition-all hover:shadow-md"
                                >
                                    Continue
                                </button>
                            )}
                        </div>
                    )}

                    {/* Form Step */}
                    {step === 'form' && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Selected Time Summary */}
                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-amber-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {selectedDate && formatDate(selectedDate)}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        {selectedSlot && formatTime(selectedSlot)}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setStep('calendar')}
                                    className="ml-auto text-xs text-amber-600 hover:text-amber-700 font-medium"
                                >
                                    Change
                                </button>
                            </div>

                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                    placeholder="+91 98765 43210"
                                    required
                                />
                            </div>

                            {/* Property Info */}
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-500 mb-1">Regarding</p>
                                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                <p className="text-xs text-gray-600">{item.address}</p>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gray-900 hover:bg-amber-500 text-white font-medium rounded-xl transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Booking...
                                    </>
                                ) : (
                                    'Book Meeting'
                                )}
                            </button>
                        </form>
                    )}

                    {/* Success Step */}
                    {step === 'success' && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h4 className="text-xl font-semibold text-gray-900 mb-2">
                                Meeting Scheduled!
                            </h4>
                            <p className="text-gray-600 mb-6">
                                We've sent a confirmation email to <strong>{email}</strong> with all the details.
                            </p>
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-all"
                            >
                                Done
                            </button>
                        </div>
                    )}

                    {/* Error Step */}
                    {step === 'error' && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8 text-red-600" />
                            </div>
                            <h4 className="text-xl font-semibold text-gray-900 mb-2">
                                Booking Failed
                            </h4>
                            <p className="text-gray-600 mb-6">
                                {errorMessage || 'Something went wrong. Please try again.'}
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => {
                                        setStep('calendar');
                                        setErrorMessage('');
                                    }}
                                    className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all"
                                >
                                    Try Again
                                </button>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modal, document.body);
}
