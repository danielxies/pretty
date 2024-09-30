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
import html2canvas from "html2canvas"; // Import html2canvas

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

// New: Lists for naming convention
const adjectives = [
    "ostentatious",
    "brilliant",
    "mysterious",
    "vibrant",
    "graceful",
    "majestic",
    "radiant",
    "serene",
    "luminous",
    "enigmatic",
];

const oceanLife = [
    "narwhal",
    "dolphin",
    "seahorse",
    "octopus",
    "jellyfish",
    "coral",
    "starfish",
    "shark",
    "whale",
    "crab",
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
            width: 1266, // Initial width in pixels
            height: 600, // Initial height in pixels
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
            setDetectedLanguage("plaintext"); // Default to plaintext
            return;
        }

        const result = hljs.highlightAuto(code, hljs.listLanguages());

        if (result.language) {
            const displayLang = result.language
                .replace(/-/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase());
            setDetectedLanguage(result.language); // Store actual language code
            console.log(`Detected language: ${result.language}`);
        } else {
            setDetectedLanguage("plaintext"); // Default to plaintext
            console.log("No language detected. Defaulting to plaintext.");
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

    // Breakpoints State as an array to maintain order
    const [breakpoints, setBreakpoints] = useState<number[]>([]);

    // Calculate line height based on font size (assuming 1.5 line height)
    const lineHeight = fontSize * 1.5;

    // Function to handle gutter (line number) clicks
    const handleGutterClick = (lineNumber: number) => {
        setBreakpoints((prev) => {
            const isAlreadyBreakpoint = prev.includes(lineNumber);
            let newBreakpoints = [...prev];

            if (isAlreadyBreakpoint) {
                // Remove the breakpoint
                newBreakpoints = newBreakpoints.filter((ln) => ln !== lineNumber);
            } else {
                // Add the breakpoint
                if (newBreakpoints.length < 2) {
                    newBreakpoints.push(lineNumber);
                } else {
                    // Decide which breakpoint to remove.
                    // For simplicity, remove the earliest breakpoint.
                    newBreakpoints.shift();
                    newBreakpoints.push(lineNumber);
                }
            }

            console.log(`Breakpoints set to: ${newBreakpoints.map((ln) => ln + 1).join(", ")}`);
            return newBreakpoints;
        });
    };

    // useEffect to validate breakpoints when code changes
    useEffect(() => {
        const numLines = code.split('\n').length;
        setBreakpoints((prev) =>
            prev.filter((line) => line < numLines)
        );
    }, [code]);

    // Calculate highlight regions based on breakpoints
    const sortedBreakpoints = [...breakpoints].sort((a, b) => a - b);
    const highlightRegions: Array<{ start: number; end: number }> = [];

    if (sortedBreakpoints.length === 2) {
        const [start, end] = sortedBreakpoints;
        // Ensure start is less than end
        if (start < end) {
            // Check if there's any text between start and end
            const hasText = code
                .split('\n')
                .slice(start, end + 1)
                .some(line => line.trim() !== '');
            if (hasText) {
                highlightRegions.push({ start, end });
            }
        }
    }

    // Optional: Handle window resize to update dimensions dynamically
    useEffect(() => {
        const handleResize = () => {
            setDimensions((prev) => ({
                width: Math.min(window.innerWidth * 0.9, prev.width),
                height: Math.min(window.innerHeight * 0.9, prev.height),
            }));
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // ======== Screenshot Functionality ========

    // Ref for the hidden screenshot container
    const screenshotRef = useRef<HTMLDivElement>(null);

    // Function to generate and download the screenshot
    const generateScreenshot = async () => {
        try {
            if (sortedBreakpoints.length !== 2) {
                alert("Please set exactly two breakpoints to generate a screenshot.");
                return;
            }

            const [startLine, endLine] = sortedBreakpoints;
            const snippetLines = code.split('\n').slice(startLine, endLine + 1);
            const snippetCode = snippetLines.join('\n');

            if (!snippetCode.trim()) {
                alert("Selected lines contain no code to screenshot.");
                return;
            }

            // Create a temporary div to render the snippet
            const tempDiv = document.createElement("div");

            tempDiv.style.position = "absolute";
            tempDiv.style.top = "-9999px";
            tempDiv.style.left = "-9999px";
            tempDiv.style.padding = "20px 20px 35px 20px"; // Increased bottom padding by 15px
            tempDiv.style.background = "#18181b"; // Neutral-900 background
            tempDiv.style.fontFamily = "monospace";
            tempDiv.style.fontSize = `${fontSize}px`;
            tempDiv.style.lineHeight = `${lineHeight}px`;
            tempDiv.style.whiteSpace = "pre-wrap";
            tempDiv.style.wordWrap = "break-word";
            tempDiv.style.color = "white"; // Set text color to white for dark background

            // Apply the current Highlight.js theme
            const themeStylesheet = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/${currentTheme}.min.css`;
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = themeStylesheet;
            document.head.appendChild(link);

            // Wait for the stylesheet to load
            await new Promise<void>((resolve) => {
                link.onload = () => resolve();
                link.onerror = () => {
                    console.error("Stylesheet failed to load");
                    resolve();
                };
                // Add a timeout in case the stylesheet doesn't load
                setTimeout(resolve, 3000);
            });

            // Create a pre element to hold the code
            const pre = document.createElement("pre");
            const languageToUse = detectedLanguage !== "plaintext" ? detectedLanguage : "plaintext";
            pre.innerHTML = hljs.highlight(snippetCode, { language: languageToUse }).value;
            pre.style.margin = "0";
            pre.style.padding = "0";
            pre.style.background = "transparent"; // Ensure background is transparent
            pre.style.color = "inherit"; // Inherit text color

            tempDiv.appendChild(pre);
            document.body.appendChild(tempDiv);

            // Use html2canvas to capture the tempDiv
            const canvas = await html2canvas(tempDiv, {
                backgroundColor: null, // Transparent background if possible
                scale: 3, // Adjusted scale for high resolution without performance issues
                useCORS: true, // Enable CORS if needed
                logging: true, // Enable logging for debugging
            });

            // Remove the temporary div and stylesheet
            document.body.removeChild(tempDiv);
            document.head.removeChild(link);

            // Generate a random filename
            const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
            const randomOceanLife = oceanLife[Math.floor(Math.random() * oceanLife.length)];
            const fileName = `${randomAdjective}-${randomOceanLife}.png`;

            // Convert the canvas to a data URL and trigger download
            const imgData = canvas.toDataURL("image/png");

            const linkDownload = document.createElement("a");
            linkDownload.href = imgData;
            linkDownload.download = fileName;
            document.body.appendChild(linkDownload);
            linkDownload.click();
            document.body.removeChild(linkDownload);

            console.log(`Screenshot "${fileName}" generated and downloaded successfully.`);
        } catch (error) {
            console.error("Error generating screenshot:", error);
            alert("An error occurred while generating the screenshot. Please check the console for details.");
        }
    };

    return (
        <div className="flex justify-center items-center w-full h-full relative">
            <div
                ref={containerRef}
                className="relative rounded-2xl bg-[#18181b] dark:bg-neutral-900 shadow-lg" // Changed light background to dark
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
                <div className="bg-[#18181b] dark:bg-neutral-900 p-2 rounded-t-lg flex flex-wrap justify-between items-center text-white" /* Changed text color to white and added flex-wrap */>
                    {/* Detected Language Display */}
                    <span className="text-indigo-400 font-mono mb-2 sm:mb-0">
                        {detectedLanguage !== "plaintext" ? detectedLanguage.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()) : "No Language Detected"}
                    </span>

                    {/* Right Side Controls */}
                    <div className="flex items-center space-x-4 flex-wrap">
                        {/* Camera Icon */}
                        <Camera
                            className="w-5 h-5 text-gray-300 cursor-pointer hover:text-gray-500" // Adjusted text color
                            onClick={generateScreenshot}
                            aria-label="Download Screenshot"
                        />
                        {/* Theme Dropdown */}
                        <select
                            value={currentTheme}
                            onChange={handleThemeChange}
                            className="border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white font-mono text-sm mb-2 sm:mb-0"
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
                                className="w-4 h-4 text-gray-300 cursor-pointer hover:text-gray-500" // Adjusted text color
                                onClick={decreaseFontSize}
                                aria-label="Decrease font size"
                            />
                            {/* Font Size Dropdown */}
                            <select
                                value={fontSize}
                                onChange={handleFontSizeSelect}
                                className="w-16 text-center border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white font-sm"
                                aria-label="Select font size"
                            >
                                {fontSizeOptions.map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                            <Plus
                                className="w-4 h-4 text-gray-300 cursor-pointer hover:text-gray-500" // Adjusted text color
                                onClick={increaseFontSize}
                                aria-label="Increase font size"
                            />
                        </div>
                    </div>
                </div>

                {/* Editor Container */}
                <div
                    className="w-full border-none resize-none overflow-y-auto overflow-x-hidden focus:outline-none focus:ring-0 bg-[#18181b] dark:bg-neutral-900 rounded-b-lg relative flex flex-row" // Changed background
                    style={{
                        fontFamily: "monospace", // Changed from "GggSans, monospace" to "monospace"
                        height: `calc(${dimensions.height}px - 40px)`, // Adjust based on header height
                        width: `calc(${dimensions.width}px - 1px)`, // Adjust based on header width
                        overflowY: "auto",
                        overflowX: "hidden",
                        boxSizing: "border-box",
                    }}
                >
                    {/* Line Numbers Gutter */}
                    <div
                        className="line-numbers gutter text-gray-400 dark:text-gray-300 text-right pr-2 select-none"
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
                                {breakpoints.includes(index) && (
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
                                <span
                                    className="line-number-text"
                                    style={{ paddingLeft: breakpoints.includes(index) ? '12px' : '0', color: 'inherit' }}
                                >
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
