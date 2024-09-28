/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-empty-object-type */

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
    Camera,
} from "lucide-react"; // Import necessary icons

// Removed static import of GitHub Dark theme
// import "highlight.js/styles/github-dark.css";
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
}

// Array of available Highlight.js themes
const availableThemes = [
    "github-dark",
    "github",
    "monokai",
    "vs2015",
    "nord",
    "tokyo-night-dark",
];

export default function SimpleTextArea({
    prompt,
    setPrompt,
}: SimpleTextAreaProps) {
    const [code, setCode] = useState(prompt);
    const [detectedLanguage, setDetectedLanguage] = useState<string>(
        "No Language Detected"
    );
    const [currentTheme, setCurrentTheme] = useState("github-dark");

    // Initialize dimensions with specific width and height
    const [dimensions, setDimensions] = useState<{ width: number; height: number }>(
        {
            width: 1222, // Initial width in pixels
            height: 555, // Initial height in pixels
        }
    );

    // Font Size State
    const [fontSize, setFontSize] = useState<number>(11); // Default font size set to 11

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

    // Ref to manage the theme link element
    const themeLinkRef = useRef<HTMLLinkElement | null>(null);

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

    // Function to handle theme change
    const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newTheme = e.target.value;
        setCurrentTheme(newTheme);
    };

    // useEffect to manage the theme link element
    useEffect(() => {
        // If the link element doesn't exist, create it
        if (!themeLinkRef.current) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/${currentTheme}.min.css`;
            link.id = "hljs-theme-link";
            document.head.appendChild(link);
            themeLinkRef.current = link;
        } else {
            // Update the href to the new theme
            themeLinkRef.current.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/${currentTheme}.min.css`;
        }

        // Trigger a re-render by updating the code state
        setCode((prevCode) => prevCode);

        // Cleanup function to remove the link if component unmounts
        return () => {
            if (themeLinkRef.current) {
                document.head.removeChild(themeLinkRef.current);
                themeLinkRef.current = null;
            }
        };
    }, [currentTheme]);

    // ======== Breakpoint Functionality ========

    // Breakpoints State
    const [breakpoints, setBreakpoints] = useState<Set<number>>(new Set());

    // Calculate line height based on font size (assuming 1.5 line height)
    const lineHeight = fontSize * 1.5;

    // Calculate highlight regions based on breakpoints
    const sortedBreakpoints = Array.from(breakpoints).sort((a, b) => a - b);
    const highlightRegions: Array<{ start: number; end: number }> = [];

    for (let i = 0; i < sortedBreakpoints.length - 1; i += 2) {
        highlightRegions.push({ start: sortedBreakpoints[i], end: sortedBreakpoints[i + 1] });
    }

    // Function to handle gutter (line number) clicks
    const handleGutterClick = (lineNumber: number) => {
        setBreakpoints(prev => {
            const newBreakpoints = new Set(prev);
            if (newBreakpoints.has(lineNumber)) {
                newBreakpoints.delete(lineNumber);
            } else {
                newBreakpoints.add(lineNumber);
            }
            return newBreakpoints;
        });
    };

    // Optional: Handle window resize to update dimensions dynamically
    useEffect(() => {
        const handleResize = () => {
            setDimensions(prev => ({
                width: Math.min(window.innerWidth * 0.9, prev.width),
                height: Math.min(window.innerHeight * 0.9, prev.height),
            }));
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

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
                    display: "flex",
                    flexDirection: "column",
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
                    <span className="text-indigo-400 font-mono">
                        {detectedLanguage}
                    </span>

                    {/* Right Side Controls */}
                    <div className="flex items-center space-x-4">
                        {/* Camera Icon */}
                        <Camera className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
                        {/* Theme Dropdown */}
                        <select
                            value={currentTheme}
                            onChange={handleThemeChange}
                            className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white font-mono text-sm"
                            aria-label="Select theme"
                        >
                            {availableThemes.map((theme) => (
                                <option key={theme} value={theme}>
                                    {theme}
                                </option>
                            ))}
                        </select>

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
                                className="w-16 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white font-sm"
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
                    className="w-full border-none resize-none overflow-y-auto overflow-x-hidden focus:outline-none focus:ring-0 bg-[#FFF2D7] dark:bg-neutral-900 rounded-b-lg relative flex flex-row"
                    style={{
                        fontFamily: "GggSans, monospace",
                        height: `calc(${dimensions.height}px - 40px)`, // Adjust based on header height
                        width: `calc(${dimensions.width}px - 1px)`, // Adjust based on header width
                        overflowY: "auto",
                        overflowX: "hidden",
                        boxSizing: "border-box",
                    }}
                >
                    {/* Line Numbers Gutter */}
                    <div
                        className="line-numbers gutter text-gray-500 dark:text-gray-400 text-right pr-2 select-none"
                        style={{
                            userSelect: 'none',
                            paddingRight: '8px',
                            paddingLeft: '15px', // Added paddingLeft to move line numbers to the right
                            minWidth: '40px',
                            boxSizing: 'border-box',
                            fontSize: `${fontSize}px`, // Match editor's font size
                            lineHeight: `${lineHeight}px`, // Match editor's line height
                            background: 'transparent', // Ensure no background
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {code.split('\n').map((_, index) => (
                            <div
                                key={index}
                                className="line-number relative flex items-center"
                                style={{ height: `${lineHeight}px`, cursor: 'pointer', position: 'relative' }}
                                onClick={() => handleGutterClick(index)}
                                aria-label={`Toggle breakpoint on line ${index + 1}`}
                            >
                                {/* Breakpoint Dot */}
                                {breakpoints.has(index) && (
                                    <span
                                        className="breakpoint-dot"
                                        style={{
                                            position: 'absolute',
                                            left: '-10px',
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            backgroundColor: '#818cf8',
                                        }}
                                        aria-label={`Breakpoint on line ${index + 1}`}
                                    ></span>
                                )}
                                <span className="line-number-text" style={{ paddingLeft: breakpoints.has(index) ? '12px' : '0' }}>
                                    {index + 1}
                                </span>
                            </div>
                        ))}
                    </div>
                    {/* Editor and Highlight Overlay */}
                    <div className="editor-wrapper relative flex-1">
                        {/* Highlight Overlay */}
                        {highlightRegions.map((region, idx) => (
                            <div
                                key={idx}
                                className="absolute bg-blue-500 bg-opacity-25 rounded pointer-events-none"
                                style={{
                                    top: `${region.start * lineHeight}px`,
                                    height: `${(region.end - region.start + 1) * lineHeight}px`,
                                    left: 0, // Gutter width is handled
                                    right: 0,
                                    zIndex: 0, // Behind the editor
                                }}
                            >
                                {/* Optional: Additional controls can be added here */}
                            </div>
                        ))}

                        {/* Editor Component */}
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
                                lineHeight: `${lineHeight}px`,
                                position: "relative",
                                zIndex: 1, // Ensure text is above highlight
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
