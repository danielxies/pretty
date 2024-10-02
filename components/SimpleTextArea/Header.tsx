// ./SimpleTextArea/Header.tsx

import React from "react";
import { Camera, RotateCcw, Plus, Minus, Sparkles } from "lucide-react";

interface HeaderProps {
    detectedLanguage: string;
    currentTheme: string;
    availableThemes: { name: string; displayName: string }[];
    onThemeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    fontSize: number;
    fontSizeOptions: number[];
    onIncreaseFont: () => void;
    onDecreaseFont: () => void;
    onFontSizeSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onScreenshot: () => void;
    onClear: () => void;
    onEditScreenshot: () => void; // New prop for Sparkles button
}

const Header: React.FC<HeaderProps> = ({
    detectedLanguage,
    currentTheme,
    availableThemes,
    onThemeChange,
    fontSize,
    fontSizeOptions,
    onIncreaseFont,
    onDecreaseFont,
    onFontSizeSelect,
    onScreenshot,
    onClear,
    onEditScreenshot,
}) => {
    return (
        <div className="bg-[#18181b] dark:bg-neutral-900 p-2 rounded-t-lg flex flex-wrap justify-between items-center text-white">
            {/* Detected Language Display */}
            <span className="text-indigo-400 font-mono mb-2 sm:mb-0">
                {detectedLanguage !== "plaintext"
                    ? detectedLanguage
                          .replace(/-/g, " ")
                          .replace(/\b\w/g, (char) => char.toUpperCase())
                    : "No Language Detected"}
            </span>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-4 flex-wrap">
                {/* Sparkles Icon */}
                <Sparkles
                    className="w-5 h-5 text-gray-300 cursor-pointer hover:text-gray-500"
                    onClick={onEditScreenshot}
                    aria-label="Edit Screenshot"
                />
                {/* Camera Icon */}
                <Camera
                    className="w-5 h-5 text-gray-300 cursor-pointer hover:text-gray-500"
                    onClick={onScreenshot}
                    aria-label="Download Screenshot"
                />
                {/* Rotate-Ccw Icon */}
                <RotateCcw
                    className="w-5 h-5 text-gray-300 cursor-pointer hover:text-gray-500"
                    onClick={onClear}
                    aria-label="Clear Code Editor"
                />
                {/* Theme Dropdown */}
                <select
                    value={currentTheme}
                    onChange={onThemeChange}
                    className="border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white font-mono text-sm mb-2 sm:mb-0"
                    aria-label="Select theme"
                >
                    {availableThemes.map((theme) => (
                        <option key={theme.name} value={theme.name}>
                            {theme.displayName}
                        </option>
                    ))}
                </select>

                {/* Font Size Controls */}
                <div className="flex items-center space-x-1">
                    <Minus
                        className="w-4 h-4 text-gray-300 cursor-pointer hover:text-gray-500"
                        onClick={onDecreaseFont}
                        aria-label="Decrease font size"
                    />
                    {/* Font Size Dropdown */}
                    <select
                        value={fontSize}
                        onChange={onFontSizeSelect}
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
                        className="w-4 h-4 text-gray-300 cursor-pointer hover:text-gray-500"
                        onClick={onIncreaseFont}
                        aria-label="Increase font size"
                    />
                </div>
            </div>
        </div>
    );
};

export default Header;