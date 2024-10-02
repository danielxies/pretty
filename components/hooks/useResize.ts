import { useRef, useEffect } from "react";

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

        // Add event listeners
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e: globalThis.MouseEvent) => {
        if (!isResizingRef.current || !resizeDirectionRef.current) return;

        const dx = e.clientX - startPosRef.current.x;
        const dy = e.clientY - startPosRef.current.y;

        let newWidth = startSizeRef.current.width;
        let newHeight = startSizeRef.current.height;

        const direction = resizeDirectionRef.current;

        // Adjust width and height based on direction
        if (direction.includes("right")) {
            newWidth = startSizeRef.current.width + dx;
        }
        if (direction.includes("left")) {
            newWidth = startSizeRef.current.width - dx;
        }
        if (direction.includes("bottom")) {
            newHeight = startSizeRef.current.height + dy;
        }
        if (direction.includes("top")) {
            newHeight = startSizeRef.current.height - dy;
        }

        // Set minimum and maximum sizes
        newWidth = Math.max(newWidth, 300); // minimum width
        newHeight = Math.max(newHeight, 200); // minimum height

        // Set maximum size based on 90% of viewport
        const maxWidth = window.innerWidth * 0.9; // 90% of viewport width
        const maxHeight = window.innerHeight * 0.9; // 90% of viewport height
        newWidth = Math.min(newWidth, maxWidth);
        newHeight = Math.min(newHeight, maxHeight);

        setDimensions({
            width: newWidth,
            height: newHeight,
        });
    };

    const handleMouseUp = () => {
        isResizingRef.current = false;
        resizeDirectionRef.current = null;

        // Allow text selection after resizing
        document.body.classList.remove("no-select");

        // Remove event listeners
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
    };

    // Cleanup event listeners on unmount
    useEffect(() => {
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            document.body.classList.remove("no-select");
        };
    }, []);

    return { handleMouseDown, containerRef, isResizing: isResizingRef.current };
};

export default useResize;
