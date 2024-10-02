import React, { useState, useRef, useEffect } from "react";
import { MoveHorizontal, MoveVertical, MoveDiagonal, MoveDiagonal2 } from "lucide-react";
import useResize from "../hooks/useResize";

interface ResizableContainerProps {
    children: React.ReactNode;
    initialWidth?: number;
    initialHeight?: number;
}

const ResizableContainer: React.FC<ResizableContainerProps> = ({
    children,
    initialWidth = 1266,
    initialHeight = 600,
}) => {
    const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
        width: initialWidth,
        height: initialHeight,
    });

    const {
        handleMouseDown,
        containerRef,
        isResizing,
    } = useResize(dimensions, setDimensions);

    return (
        <div className="flex justify-center items-center w-full h-full relative">
            <div
                ref={containerRef}
                className="relative rounded-2xl bg-[#18181b] dark:bg-neutral-900 shadow-lg"
                style={{
                    width: `${dimensions.width}px`,
                    height: `${dimensions.height}px`,
                    transition: isResizing ? "none" : "width 0.2s, height 0.2s",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Resize Handles */}
                {/* Repeat similar divs for each resize handle direction */}
                {/* Example for Top */}
                <div
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-ns-resize"
                    onMouseDown={(e) => handleMouseDown(e, "top")}
                    aria-label="Resize Top"
                >
                    <MoveVertical className="w-4 h-4 text-gray-500" />
                </div>
                {/* Add other resize handles (Bottom, Left, Right, Top-Left, Top-Right, Bottom-Left, Bottom-Right) */}
                
                {children}
            </div>
        </div>
    );
};

export default ResizableContainer;
