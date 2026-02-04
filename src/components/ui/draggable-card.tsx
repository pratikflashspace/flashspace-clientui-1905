import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const DraggableCardContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("relative w-full h-full perspective-1000", className)}>
            {children}
        </div>
    );
};

export const DraggableCardBody = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    const ref = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [zIndex, setZIndex] = useState(0);

    return (
        <motion.div
            ref={ref}
            drag
            // Constraints allow for some movement but keep it loosely in the area
            dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
            dragElastic={0.2}
            onDragStart={() => {
                setIsDragging(true);
                setZIndex(50); // Bring to front
            }}
            onDragEnd={() => {
                setIsDragging(false);
                setZIndex(10); // Return to normal-ish (or keep high? usually reset but if we want it to stay on top we need context)
                // Actually, let's keep it 'relative' z-index effectively by letting it settle. 
                // For simple dragging, zIndex on drag is key.
            }}
            whileDrag={{ scale: 1.05, cursor: "grabbing", zIndex: 100 }}
            whileHover={{ scale: 1.02, zIndex: 20 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1, zIndex: isDragging ? 100 : zIndex }}
            transition={{ duration: 0.4 }}
            className={cn("cursor-grab active:cursor-grabbing", className)}
            style={{ zIndex }}
        >
            {children}
        </motion.div>
    );
};
