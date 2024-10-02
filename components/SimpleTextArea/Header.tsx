import React from "react";
import { Camera, RotateCcw, Sparkles } from "lucide-react";
import CustomDropdown from "./CustomDropdown";

interface HeaderProps {
    detectedLanguage: string;
    currentTheme: string;
    availableThemes: { name: string; displayName: string }[];
    onThemeChange: (value: string) => void;
    fontSize: number;
    fontSizeOptions: number[];
    onIncreaseFont: () => void;
    onDecreaseFont: () => void;
    onFontSizeSelect: (value: number) => void;
    onScreenshot: () => void;
    onClear: () => void;
    onEditScreenshot: () => void;
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
        <div className="header-container flex justify-between items-center px-4 py-2 bg-[#171717] rounded-t-lg">
            {/* Detected Language Display */}
            <span className="language-display font-medium text-lg">
                {detectedLanguage !== "plaintext"
                    ? detectedLanguage
                          .replace(/-/g, " ")
                          .replace(/\b\w/g, (char) => char.toUpperCase())
                    : "No Language Detected"}
            </span>

            {/* Control Buttons */}
            <div className="controls flex items-center space-x-4">
                {/* Sparkles Icon */}
                <button onClick={onEditScreenshot} aria-label="Edit Screenshot">
                    <Sparkles className="icon text-gray-500 hover:text-gray-800" />
                </button>

                {/* Camera Icon */}
                <button onClick={onScreenshot} aria-label="Download Screenshot">
                    <Camera className="icon text-gray-500 hover:text-gray-800" />
                </button>

                {/* Clear Editor Icon */}
                <button onClick={onClear} aria-label="Clear Code Editor">
                    <RotateCcw className="icon text-gray-500 hover:text-gray-800" />
                </button>

                {/* Theme Dropdown */}
                <CustomDropdown
                    options={availableThemes.map((theme) => ({
                        value: theme.name,
                        label: theme.displayName,
                    }))}
                    selectedValue={currentTheme}
                    onChange={onThemeChange}
                    placeholder="Select Theme"
                />

                {/* Font Size Controls */}
                <div className="font-size-controls flex items-center space-x-2">
                    <CustomDropdown
                        options={fontSizeOptions.map((size) => ({
                            value: size.toString(),
                            label: size.toString(),
                        }))}
                        selectedValue={fontSize.toString()}
                        onChange={(value) => onFontSizeSelect(parseInt(value, 10))}
                        placeholder="Font Size"
                    />
                    <button
                        onClick={onDecreaseFont}
                        className="text-xl"
                        aria-label="Decrease Font Size"
                    >
                        -
                    </button>
                    <button
                        onClick={onIncreaseFont}
                        className="text-xl"
                        aria-label="Increase Font Size"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Header;