import React, { useState, useEffect, useRef } from "react";
import Editor from "react-simple-code-editor";
import hljs from "highlight.js/lib/core";
import debounce from "lodash.debounce";
import {
    MoveHorizontal,
    MoveVertical,
    MoveDiagonal,
    MoveDiagonal2,
    Plus,
    Minus,
} from "lucide-react"; // Import necessary icons

// Import Highlight.js GitHub Theme
import "highlight.js/styles/github-dark.css";
import "../styles/SimpleTextArea.css";

// Import languages (you can add more if needed)
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";

// Register languages with Highlight.js
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("java", java);

interface SimpleTextAreaProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    charCount: number;
    setCharCount: (count: number) => void;
}

export default function SimpleTextArea({
    prompt,
    setPrompt,
    charCount,
    setCharCount,
}: SimpleTextAreaProps) {
    const [code, setCode] = useState(prompt);
    const [detectedLanguage, setDetectedLanguage] = useState<string>(
        "No Language Detected"
    );

    // State for dimensions
    const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
        width: 2000, // Initial width in pixels
        height: 500, // Initial height in pixels
    });

    // Updated Font Size State
    const [fontSize, setFontSize] = useState<number>(13); // Default font size set to 13

    // Define font size options
    const fontSizeOptions = [8, 11, 12, 13, 14, 15, 16, 18, 22, 24, 25];

    const containerRef = useRef<HTMLDivElement>(null);
    const isResizingRef = useRef<boolean>(false);
    const resizeDirectionRef = useRef<string | null>(null);
    const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const startSizeRef = useRef<{ width: number; height: number }>({
        width: dimensions.width,
        height: dimensions.height,
    });

    // Debounced language detection
    const debouncedDetectLanguage = useRef(
        debounce((currentCode: string) => {
            detectLanguage(currentCode);
        }, 300)
    ).current;

    useEffect(() => {
        setCode(prompt);
        debouncedDetectLanguage(prompt);

        return () => {
            debouncedDetectLanguage.cancel();
        };
    }, [prompt, debouncedDetectLanguage]);

    // Function to detect language
    const detectLanguage = (code: string) => {
        if (!code.trim()) {
            setDetectedLanguage("No Language Detected");
            return;
        }

        const result = hljs.highlightAuto(code, hljs.listLanguages());

        if (result.language) {
            const displayLang = result.language
                .replace(/-/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase());
            setDetectedLanguage(displayLang);
        } else {
            setDetectedLanguage("No Language Detected");
        }
    };

    // Function to handle code changes
    const handleCodeChange = (newCode: string) => {
        setCode(newCode);
        setPrompt(newCode);
        setCharCount(newCode.length);
        debouncedDetectLanguage(newCode);
    };

    // Function to highlight code using Highlight.js
    const highlightCode = (code: string) => {
        if (!code.trim()) {
            return "";
        }
        const result = hljs.highlightAuto(code, hljs.listLanguages());
        return result.value;
    };

    // Function to handle mouse down on resize handle
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

        // Add event listeners with standard DOM MouseEvent
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };

    // Function to handle mouse move with standard DOM MouseEvent
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

        // Optional: Set maximum size based on viewport or desired limits
        const maxWidth = window.innerWidth * 2; // Allow up to 200% of viewport width
        const maxHeight = window.innerHeight * 2; // Similarly for height
        newWidth = Math.min(newWidth, maxWidth);
        newHeight = Math.min(newHeight, maxHeight);

        setDimensions({
            width: newWidth,
            height: newHeight,
        });
    };

    // Function to handle mouse up with standard DOM MouseEvent
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

    // Function to handle font size changes via buttons
    const increaseFontSize = () => {
        const currentIndex = fontSizeOptions.indexOf(fontSize);
        if (currentIndex < fontSizeOptions.length - 1) {
            setFontSize(fontSizeOptions[currentIndex + 1]);
        }
    };

    const decreaseFontSize = () => {
        const currentIndex = fontSizeOptions.indexOf(fontSize);
        if (currentIndex > 0) {
            setFontSize(fontSizeOptions[currentIndex - 1]);
        }
    };

    // Function to handle manual font size selection via dropdown
    const handleFontSizeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value)) {
            setFontSize(value);
        }
    };

    return (
        <div className="flex justify-center items-center w-full h-full relative">
            <div
                ref={containerRef}
                className="relative rounded-2xl bg-[#FFF2D7] dark:bg-neutral-900 shadow-lg"
                style={{
                    width: `${dimensions.width}px`,
                    height: `${dimensions.height}px`,
                    transition: isResizingRef.current
                        ? "none"
                        : "width 0.2s, height 0.2s",
                    boxSizing: "border-box",
                }}
            >
                {/* Resize Handles */}
                {/* Top */}
                <div
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-ns-resize"
                    onMouseDown={(e) => handleMouseDown(e, "top")}
                    aria-label="Resize Top"
                >
                    <MoveVertical className="w-4 h-4 text-gray-500" />
                </div>
                {/* Bottom */}
                <div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-6 h-6 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-ns-resize"
                    onMouseDown={(e) => handleMouseDown(e, "bottom")}
                    aria-label="Resize Bottom"
                >
                    <MoveVertical className="w-4 h-4 text-gray-500" />
                </div>
                {/* Left */}
                <div
                    className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-ew-resize"
                    onMouseDown={(e) => handleMouseDown(e, "left")}
                    aria-label="Resize Left"
                >
                    <MoveHorizontal className="w-4 h-4 text-gray-500" />
                </div>
                {/* Right */}
                <div
                    className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-ew-resize"
                    onMouseDown={(e) => handleMouseDown(e, "right")}
                    aria-label="Resize Right"
                >
                    <MoveHorizontal className="w-4 h-4 text-gray-500" />
                </div>
                {/* Top-Left */}
                <div
                    className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-nwse-resize"
                    onMouseDown={(e) => handleMouseDown(e, "top-left")}
                    aria-label="Resize Top Left"
                >
                    <MoveDiagonal2 className="w-4 h-4 text-gray-500" />
                </div>
                {/* Top-Right */}
                <div
                    className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-nesw-resize"
                    onMouseDown={(e) => handleMouseDown(e, "top-right")}
                    aria-label="Resize Top Right"
                >
                    <MoveDiagonal className="w-4 h-4 text-gray-500" />
                </div>
                {/* Bottom-Left */}
                <div
                    className="absolute bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2 w-6 h-6 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-nesw-resize"
                    onMouseDown={(e) => handleMouseDown(e, "bottom-left")}
                    aria-label="Resize Bottom Left"
                >
                    <MoveDiagonal className="w-4 h-4 text-gray-500" />
                </div>
                {/* Bottom-Right */}
                <div
                    className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 w-6 h-6 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-nwse-resize"
                    onMouseDown={(e) => handleMouseDown(e, "bottom-right")}
                    aria-label="Resize Bottom Right"
                >
                    <MoveDiagonal2 className="w-4 h-4 text-gray-500" />
                </div>

                {/* Header Section */}
                <div className="bg-[#FFF2D7] dark:bg-neutral-900 p-2 rounded-t-lg flex justify-between items-center text-black dark:text-white">
                    {/* Detected Language Display */}
                    <span className="text-indigo-400 font-mono pl-2">
                        {detectedLanguage}
                    </span>

                    {/* Char count and Font Size Controls */}
                    <div className="flex items-center space-x-4">
                        {/* Char Count */}
                        <span className="text-[#4f46e5] font-mono">
                            {charCount}{" "}
                            <span className="text-black dark:text-white">chars</span>
                        </span>

                        {/* Font Size Controls */}
                        <div className="flex items-center space-x-1">
                            <Minus
                                className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700"
                                onClick={decreaseFontSize}
                                aria-label="Decrease font size"
                            />
                            {/* Font Size Dropdown */}
                            <select
                                value={fontSize}
                                onChange={handleFontSizeSelect}
                                className="w-16 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                                aria-label="Select font size"
                            >
                                {fontSizeOptions.map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                            <Plus
                                className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700"
                                onClick={increaseFontSize}
                                aria-label="Increase font size"
                            />
                        </div>
                    </div>
                </div>

                {/* Editor Container */}
                <div
                    className="w-full border-none resize-none overflow-y-auto overflow-x-hidden focus:outline-none focus:ring-0 bg-[#FFF2D7] dark:bg-neutral-900 rounded-b-lg"
                    style={{
                        fontFamily: "GggSans, monospace",
                        padding: "10px 0 10px 12px", // Added 2px left padding
                        height: `calc(${dimensions.height}px - 40px)`, // Adjust based on header height
                        overflowY: "auto",
                        overflowX: "hidden",
                        boxSizing: "border-box",
                    }}
                >
                    <Editor
                        value={code}
                        onValueChange={handleCodeChange}
                        highlight={highlightCode}
                        padding={0} // Remove padding from Editor, handled by container
                        className="custom-editor"
                        textareaId="codeArea"
                        textareaClassName="code-textarea"
                        style={{
                            minHeight: "100%",
                            width: "100%",
                            outline: "none",
                            border: "none",
                            resize: "none",
                            backgroundColor: "transparent",
                            color: "inherit",
                            whiteSpace: "pre-wrap",
                            wordWrap: "break-word",
                            overflow: "hidden", // Let the container handle scrolling
                            fontFamily: "inherit",
                            fontSize: `${fontSize}px`, // Apply dynamic font size
                            paddingLeft: "6px" // Added left padding here
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
