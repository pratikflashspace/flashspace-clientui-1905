import { useEffect, useState } from "react";

const VideoBackground = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Professional office images slideshow
  const backgroundImages = [
    "https://id-preview--64fc9692-b7e7-4f25-852e-a5069b0a3c34.lovable.app/lovable-uploads/1880c486-fd35-40fb-bd96-35bc9be21cfd.png", // Modern dark office with LED lighting
    "https://id-preview--64fc9692-b7e7-4f25-852e-a5069b0a3c34.lovable.app/lovable-uploads/1880c486-fd35-40fb-bd96-35bc9be21cfd.png", // Dark meeting room with plants
    "https://id-preview--64fc9692-b7e7-4f25-852e-a5069b0a3c34.lovable.app/lovable-uploads/81b34a7c-74b6-4999-b549-e53aac7f6a16.png", // Dark workspace setup
    "https://id-preview--64fc9692-b7e7-4f25-852e-a5069b0a3c34.lovable.app/lovable-uploads/8c7281e3-7a9c-40ab-be77-442b12d1ed61.png", // Evening office with city view
    "https://id-preview--64fc9692-b7e7-4f25-852e-a5069b0a3c34.lovable.app/lovable-uploads/49fbe989-fb43-4562-b816-006c4fe48ecd.png"  // Modern conference room
  ];

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const totalImages = backgroundImages.length;

    backgroundImages.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        setLoadingProgress((loadedCount / totalImages) * 100);
        if (loadedCount === totalImages) {
          setTimeout(() => setImagesLoaded(true), 500);
        }
      };
      img.onerror = () => {
        loadedCount++;
        setLoadingProgress((loadedCount / totalImages) * 100);
        if (loadedCount === totalImages) {
          setTimeout(() => setImagesLoaded(true), 500);
        }
      };
      img.src = src;
    });
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
        setIsVisible(true);
      }, 1000);
    }, 6000); // 6 seconds per image

    return () => clearInterval(interval);
  }, [backgroundImages.length, imagesLoaded]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Loading State */}
      {!imagesLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mb-4 mx-auto"></div>
            <div className="text-white/80 text-sm font-medium mb-2">Loading workspace images...</div>
            <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <div className="text-white/60 text-xs mt-1">{Math.round(loadingProgress)}% complete</div>
          </div>
        </div>
      )}

      {/* Professional Office Images Slideshow */}
      {imagesLoaded && (
        <>
          <div 
            className={`absolute inset-0 transition-all ease-in-out transform ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-60 scale-[1.02]'
            }`}
            style={{
              backgroundImage: `url(${backgroundImages[currentImage]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: 'brightness(0.9) contrast(1.2) saturate(1.1)',
              transitionDuration: '2000ms',
            }}
          />
          
          {/* Transition overlay */}
          <div 
            className={`absolute inset-0 bg-black transition-opacity duration-1000 ${
              isVisible ? 'opacity-0' : 'opacity-30'
            }`}
          ></div>
        </>
      )}
      
      {/* Darker overlay for better contrast */}
      <div className="absolute inset-0 bg-black/30"></div>
    </div>
  );
};

export default VideoBackground;