import { useRef, useEffect, useCallback } from "react";

const useResize = (
    dimensions: { width: number; height: number },
    setDimensions: React.Dispatch<React.SetStateAction<{ width: number; height: number }>>
) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isResizingRef = useRef<boolean>(false);
    const resizeDirectionRef = useRef<string | null>(null);
    const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const startSizeRef = useRef<{ width: number; height: number }>({
        width: dimensions.width,
        height: dimensions.height,
    });

    const handleMouseDown = (
        e: React.MouseEvent<HTMLDivElement>,
        direction: string
    ) => {
        e.preventDefault();
        isResizingRef.current = true;
        resizeDirectionRef.current = direction;
        startPosRef.current = { x: e.clientX, y: e.clientY };
        startSizeRef.current = { ...dimensions };

        // Prevent text selection during resizing
        document.body.classList.add("no-select");



        // Allow text selection after resizing
        document.body.classList.remove("no-select");

        return () => {
            document.body.classList.remove("no-select");
        };
    };

    return { handleMouseDown, containerRef, isResizing: isResizingRef.current };
};

export default useResize;
