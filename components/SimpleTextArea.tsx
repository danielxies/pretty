// ./SimpleTextArea/SimpleTextArea.tsx

import React, { useState, useEffect, useRef } from "react";
import hljs from "highlight.js/lib/core";
import debounce from "lodash.debounce";
import html2canvas from "html2canvas";
import ResizableContainer from "./SimpleTextArea/ResizeableContainer";
import Header from "./SimpleTextArea/Header";
import LineNumbers from "./SimpleTextArea/LineNumbers";
import CodeEditor from "./SimpleTextArea/CodeEditor";
import ScreenshotModal from "./SimpleTextArea/ScreenshotModal"; // Import the updated modal
import "../styles/SimpleTextArea.css";

// Import languages
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";

// Register languages
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("java", java);

// Define available themes for code editor
const availableThemes = [
    { name: "github-dark", displayName: "GitHub Dark" },
    { name: "monokai", displayName: "Monokai" },
    { name: "vs2015", displayName: "VS2015" },
    { name: "nord", displayName: "Nord" },
    { name: "tokyo-night-dark", displayName: "Tokyo Dark" },
    { name: "atom-one-dark", displayName: "Atom Dark" },
    { name: "hybrid", displayName: "Hybrid" },
];

// Naming conventions
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

// Default code
const defaultCode = `shout("This is a tool to help you take code snippet screenshots for your presentations.");
type("try it below");

// <--------- click here !!

"""
\`;-\\.          ___,
  \`.\`\\_...._/\\.\`-"\`
    \\        /      ,
    /()   () \\    .' \`-._
   |)  .    ()\\  /   _.'
   \\  -'-     ,; '. <
    ;.__     ,;|   > \\
   / ,    / ,  |.-'.-'
  (_/    (_/ ,;|.<\`
    \\    ,     ;-\`
>   \\    /
    (_,-'\`> .'
jgs      (_,'                          
"""

// <--------- click here !!

shout(f"Now press the {Camera} icon to take a picture");
credits("detection and canvas powered by highlightJS");`;

interface SimpleTextAreaProps {
    prompt?: string;
    setPrompt?: (prompt: string) => void;
}

const SimpleTextArea: React.FC<SimpleTextAreaProps> = ({
    prompt,
    setPrompt,
}) => {
    // State management
    const [code, setCode] = useState<string>(() => prompt || defaultCode);
    const [detectedLanguage, setDetectedLanguage] = useState<string>("No Language Detected");
    const [currentTheme, setCurrentTheme] = useState("github-dark");
    const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
        width: 1400,
        height: 650,
    });
    const [fontSize, setFontSize] = useState<number>(11);
    const fontSizeOptions = [8, 11, 12, 13, 14, 15, 16, 18, 22, 24, 25];

    // Ref for theme link
    const themeLinkRef = useRef<HTMLLinkElement | null>(null);

    // Breakpoints
    const [breakpoints, setBreakpoints] = useState<number[]>([]);
    const lineHeight = fontSize * 1.5;

    // Debounced language detection
    const debouncedDetectLanguage = useRef(
        debounce((currentCode: string) => {
            detectLanguage(currentCode);
        }, 300)
    ).current;

    // Language detection function
    const detectLanguage = (code: string) => {
        if (!code.trim()) {
            setDetectedLanguage("plaintext");
            return;
        }

        const result = hljs.highlightAuto(code, hljs.listLanguages());

        if (result.language) {
            setDetectedLanguage(result.language);
            console.log(`Detected language: ${result.language}`);
        } else {
            setDetectedLanguage("plaintext");
            console.log("No language detected. Defaulting to plaintext.");
        }
    };

    // Initial language detection
    useEffect(() => {
        detectLanguage(code);
    }, []);

    // Handle code change
    const handleCodeChange = (newCode: string) => {
        setCode(newCode);
        if (setPrompt) {
            setPrompt(newCode);
        }
        debouncedDetectLanguage(newCode);
    };

    // Highlight code
    const highlightCode = (code: string) => {
        if (!code.trim()) {
            return "";
        }
        const result = hljs.highlightAuto(code, hljs.listLanguages());
        return result.value;
    };

    // Handle theme change for code editor
    const handleThemeChange = (newTheme: string) => {
        setCurrentTheme(newTheme);
    };

    // Manage theme stylesheet for code editor
    useEffect(() => {
        const theme = currentTheme;
        if (!themeLinkRef.current) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/${theme}.min.css`;
            link.id = "hljs-theme-link";
            document.head.appendChild(link);
            themeLinkRef.current = link;
        } else {
            themeLinkRef.current.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/${theme}.min.css`;
        }

        // Trigger re-render
        setCode((prevCode) => prevCode);

        // Cleanup
        return () => {
            if (themeLinkRef.current) {
                document.head.removeChild(themeLinkRef.current);
                themeLinkRef.current = null;
            }
        };
    }, [currentTheme]);

    // Font size controls
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

    const handleFontSizeSelect = (value: number) => {
        setFontSize(value);
    };

    // Handle window resize
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

    // Handle gutter (line number) clicks
    const handleToggleBreakpoint = (lineNumber: number) => {
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
                    // Remove the earliest breakpoint
                    newBreakpoints.shift();
                    newBreakpoints.push(lineNumber);
                }
            }

            console.log(`Breakpoints set to: ${newBreakpoints.map((ln) => ln + 1).join(", ")}`);
            return newBreakpoints;
        });
    };

    // Validate breakpoints when code changes
    useEffect(() => {
        const numLines = code.split('\n').length;
        setBreakpoints((prev) =>
            prev.filter((line) => line < numLines)
        );
    }, [code]);

    // Highlight regions based on breakpoints
    const sortedBreakpoints = [...breakpoints].sort((a, b) => a - b);
    const highlightRegions: Array<{ start: number; end: number }> = [];

    if (sortedBreakpoints.length === 2) {
        const [start, end] = sortedBreakpoints;
        if (start < end) {
            const hasText = code
                .split('\n')
                .slice(start, end + 1)
                .some(line => line.trim() !== '');
            if (hasText) {
                highlightRegions.push({ start, end });
            }
        }
    }

    // Screenshot Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImageSrc, setModalImageSrc] = useState<string>("");

    // Function to generate screenshot data URL
    const generateScreenshotDataURL = async (): Promise<string | null> => {
        try {
            if (sortedBreakpoints.length !== 2) {
                alert("Please set exactly two breakpoints to generate a screenshot.");
                return null;
            }

            const [startLine, endLine] = sortedBreakpoints;
            const snippetLines = code.split('\n').slice(startLine, endLine + 1);
            const snippetCode = snippetLines.join('\n');

            if (!snippetCode.trim()) {
                alert("Selected lines contain no code to screenshot.");
                return null;
            }

            // Create a temporary div to render the snippet
            const tempDiv = document.createElement("div");

            tempDiv.style.position = "absolute";
            tempDiv.style.top = "-9999px";
            tempDiv.style.left = "-9999px";
            tempDiv.style.padding = "20px 88px 35px 20px";
            tempDiv.style.background = "#18181b"; // Dark mode background
            tempDiv.style.fontFamily = "monospace";
            tempDiv.style.fontSize = `${fontSize}px`;
            tempDiv.style.lineHeight = `${lineHeight}px`;
            tempDiv.style.whiteSpace = "pre-wrap";
            tempDiv.style.wordWrap = "break-word";
            tempDiv.style.color = "white"; // Dark mode text color

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
                setTimeout(resolve, 3000);
            });

            // Create a pre element to hold the code
            const pre = document.createElement("pre");
            const languageToUse = detectedLanguage !== "plaintext" ? detectedLanguage : "plaintext";
            pre.innerHTML = hljs.highlight(snippetCode, { language: languageToUse }).value;
            pre.style.margin = "0";
            pre.style.padding = "0";
            pre.style.background = "transparent";
            pre.style.color = "inherit";

            tempDiv.appendChild(pre);
            document.body.appendChild(tempDiv);

            // Use html2canvas to capture the tempDiv
            const canvas = await html2canvas(tempDiv, {
                backgroundColor: null,
                scale: 3,
                useCORS: true,
                logging: true,
            });

            // Remove the temporary div and stylesheet
            document.body.removeChild(tempDiv);
            document.head.removeChild(link);

            // Get the data URL
            const imgData = canvas.toDataURL("image/png");
            return imgData;
        } catch (error) {
            console.error("Error generating screenshot:", error);
            alert("An error occurred while generating the screenshot. Please check the console for details.");
            return null;
        }
    };

    // Function to generate and download screenshot directly (Camera button)
    const generateAndDownloadScreenshot = async () => {
        const imgData = await generateScreenshotDataURL();
        if (imgData) {
            // Generate a random filename
            const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
            const randomOceanLife = oceanLife[Math.floor(Math.random() * oceanLife.length)];
            const fileName = `${randomAdjective}-${randomOceanLife}.png`;

            // Trigger download
            const linkDownload = document.createElement("a");
            linkDownload.href = imgData;
            linkDownload.download = fileName;
            document.body.appendChild(linkDownload);
            linkDownload.click();
            document.body.removeChild(linkDownload);

            console.log(`Screenshot "${fileName}" generated and downloaded successfully.`);
        }
    };

    // Function to handle Sparkles button click (open modal)
    const handleEditScreenshot = async () => {
        if (breakpoints.length !== 2) {
            alert("Please set exactly two breakpoints to edit a screenshot.");
            return;
        }

        const imgData = await generateScreenshotDataURL();
        if (imgData) {
            setModalImageSrc(imgData);
            setIsModalOpen(true);
        }
    };

    // Clear code editor
    const clearCode = () => {
        setCode("");
        if (setPrompt) {
            setPrompt("");
        }
    };

    return (
        <>
            <ResizableContainer initialWidth={dimensions.width} initialHeight={dimensions.height}>
                {/* Header */}
                <Header
                    detectedLanguage={detectedLanguage}
                    currentTheme={currentTheme}
                    availableThemes={availableThemes}
                    onThemeChange={handleThemeChange}
                    fontSize={fontSize}
                    fontSizeOptions={fontSizeOptions}
                    onIncreaseFont={increaseFontSize}
                    onDecreaseFont={decreaseFontSize}
                    onFontSizeSelect={handleFontSizeSelect}
                    onScreenshot={generateAndDownloadScreenshot} // Camera button
                    onClear={clearCode}
                    onEditScreenshot={handleEditScreenshot} // Sparkles button
                    // Removed uiTheme and toggleTheme props as light mode is no longer supported
                />

                {/* Editor Container */}
                <div
                    className={`w-full border-none resize-none overflow-y-auto overflow-x-hidden focus:outline-none focus:ring-0 rounded-b-lg relative flex flex-row bg-neutral-900 text-white`}
                    style={{
                        fontFamily: "monospace",
                        height: `calc(${dimensions.height}px - 40px)`,
                        width: `calc(${dimensions.width}px - 1px)`,
                        overflowY: "auto",
                        overflowX: "hidden",
                        boxSizing: "border-box",
                        position: "relative",
                        zIndex: 1, // Ensure editor is below the modal
                    }}
                >
                    {/* Line Numbers Gutter */}
                    <LineNumbers
                        code={code}
                        breakpoints={breakpoints}
                        onToggleBreakpoint={handleToggleBreakpoint}
                        fontSize={fontSize}
                        lineHeight={lineHeight}
                    />

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
                                    left: 0,
                                    right: 0,
                                    zIndex: 0,
                                }}
                            ></div>
                        ))}

                        {/* Code Editor */}
                        <CodeEditor
                            code={code}
                            onChange={handleCodeChange}
                            highlight={highlightCode}
                            fontSize={fontSize}
                            lineHeight={lineHeight}
                        />
                    </div>
                </div>
            </ResizableContainer>

            {/* Screenshot Modal */}
            <ScreenshotModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                imageSrc={modalImageSrc}
            />
        </>
    );
};

export default SimpleTextArea;