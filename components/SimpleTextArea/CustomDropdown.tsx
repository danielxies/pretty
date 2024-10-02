// ./SimpleTextArea/CustomDropdown.tsx

import React, { useState, useRef, useEffect } from "react";
import "../../styles/SimpleTextArea.css";

interface CustomDropdownProps {
    options: { value: string; label: string }[];
    selectedValue: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
    options,
    selectedValue,
    onChange,
    placeholder = "Select an option",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [dropdownWidth, setDropdownWidth] = useState<number>(0);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleOptionClick = (value: string) => {
        onChange(value);
        setIsOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
        ) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const longestOption = options.reduce((longest, option) => 
            option.label.length > longest.length ? option.label : longest
        , placeholder);
        
        const tempSpan = document.createElement('span');
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.position = 'absolute';
        tempSpan.style.whiteSpace = 'nowrap';
        tempSpan.style.font = window.getComputedStyle(dropdownRef.current as Element).font;
        tempSpan.textContent = longestOption;
        
        document.body.appendChild(tempSpan);
        const width = tempSpan.getBoundingClientRect().width;
        document.body.removeChild(tempSpan);
        
        setDropdownWidth(width + 30); // Add some padding
    }, [options, placeholder]);

    const selectedLabel =
        options.find((option) => option.value === selectedValue)?.label ||
        placeholder;

    return (
        <div className="custom-dropdown" ref={dropdownRef} style={{ height: 'calc(100% - 10px)', width: `${dropdownWidth}px` }}>
            <div
                className="dropdown-header"
                onClick={toggleDropdown}
                style={{ height: 'calc(100% - 4px)', lineHeight: 'calc(100% - 4px)' }}
            >
                <span className="dropdown-selected">{selectedLabel}</span>
                <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}></span>
            </div>
            {isOpen && (
                <div className="dropdown-options" style={{ width: `${dropdownWidth}px` }}>
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={`dropdown-option ${
                                option.value === selectedValue ? "selected" : ""
                            }`}
                            onClick={() => handleOptionClick(option.value)}
                            style={{ height: 'calc(100% - 4px)', lineHeight: 'calc(100% - 4px)' }}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;
