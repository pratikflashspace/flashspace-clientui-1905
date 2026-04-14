import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

/**
 * Magnetic button effect — pulls toward cursor
 */
export const Magnetic: React.FC<{ children: React.ReactNode; strength?: number }> = ({ 
  children, 
  strength = 35 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Calculate distance from center
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    x.set(distanceX * (strength / 100));
    y.set(distanceY * (strength / 100));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
};

/**
 * 3D Tilt Card effect
 */
export const TiltCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springX = useSpring(rotateX, { stiffness: 120, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 120, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const rY = ((mouseX / width) - 0.5) * 15; // range: -7.5 to 7.5 deg
    const rX = ((mouseY / height) - 0.5) * -15;

    rotateY.set(rY);
    rotateX.set(rX);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        rotateX: springX,
        rotateY: springY,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Background Mouse Glow effect
 */
export const MouseGlow: React.FC<{ color?: string; size?: number; opacity?: number }> = ({
  color = "#FFC700",
  size = 400,
  opacity = 0.15
}) => {
  const mouseX = useMotionValue(-size);
  const mouseY = useMotionValue(-size);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - size / 2);
      mouseY.set(e.clientY - size / 2);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[1]"
      style={{
        background: `radial-gradient(circle at ${size / 2}px ${size / 2}px, ${color}, transparent 65%)`,
        width: size,
        height: size,
        left: mouseX,
        top: mouseY,
        opacity,
        filter: 'blur(60px)',
      }}
    />
  );
};
