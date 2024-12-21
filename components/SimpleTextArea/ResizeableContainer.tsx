import React, { useState } from "react";
import { MoveVertical } from "lucide-react";

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

    return (
        <div className="flex justify-center items-center w-full h-full relative">
            <div
                className="relative rounded-2xl bg-[#18181b] dark:bg-neutral-900 shadow-lg"
                style={{
                    width: `${dimensions.width}px`,
                    height: `${dimensions.height}px`,
                    transition: "width 0.2s, height 0.2s",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default ResizableContainer;
