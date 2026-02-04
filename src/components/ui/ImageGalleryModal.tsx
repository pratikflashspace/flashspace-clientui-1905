import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageGalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    images: string[];
    initialIndex?: number;
}

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({ isOpen, onClose, images, initialIndex = 0 }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, initialIndex]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, currentIndex]);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black animate-in fade-in duration-200">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all z-[10000]"
                aria-label="Close gallery"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all z-[10000] group"
                aria-label="Previous image"
            >
                <ChevronLeft className="w-8 h-8 group-hover:scale-110 transition-transform" />
            </button>

            <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all z-[10000] group"
                aria-label="Next image"
            >
                <ChevronRight className="w-8 h-8 group-hover:scale-110 transition-transform" />
            </button>

            {/* Main Image Container */}
            <div
                className="w-full h-full p-4 flex items-center justify-center"
                onClick={onClose}
            >
                <div
                    className="relative w-full h-full flex items-center justify-center pointer-events-none"
                    onClick={(e) => e.stopPropagation()}
                >
                    <img
                        src={images[currentIndex]}
                        alt={`Gallery image ${currentIndex + 1}`}
                        className="h-[85vh] w-auto max-w-[90vw] object-contain rounded-md shadow-2xl select-none pointer-events-auto"
                        draggable={false}
                    />

                    {/* Image Counter */}
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/80 font-medium tracking-widest text-sm">
                        {currentIndex + 1} <span className="text-white/40 mx-2">/</span> {images.length}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageGalleryModal;
