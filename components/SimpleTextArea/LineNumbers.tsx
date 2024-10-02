import React from "react";

interface LineNumbersProps {
    code: string;
    breakpoints: number[];
    onToggleBreakpoint: (lineNumber: number) => void;
    fontSize: number;
    lineHeight: number;
}

const LineNumbers: React.FC<LineNumbersProps> = ({
    code,
    breakpoints,
    onToggleBreakpoint,
    fontSize,
    lineHeight,
}) => {
    return (
        <div
            className="line-numbers gutter text-gray-400 dark:text-gray-300 text-right pr-2 select-none"
            style={{
                userSelect: 'none',
                paddingRight: '8px',
                paddingLeft: '15px',
                minWidth: '40px',
                boxSizing: 'border-box',
                fontSize: `${fontSize}px`,
                lineHeight: `${lineHeight}px`,
                background: 'transparent',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {code.split('\n').map((_, index) => (
                <div
                    key={index}
                    className="line-number relative flex items-center"
                    style={{ height: `${lineHeight}px`, cursor: 'pointer', position: 'relative' }}
                    onClick={() => onToggleBreakpoint(index)}
                    aria-label={`Toggle breakpoint on line ${index}`}
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
                            aria-label={`Breakpoint on line ${index}`}
                        ></span>
                    )}
                    <span
                        className="line-number-text"
                        style={{ paddingLeft: breakpoints.includes(index) ? '12px' : '0', color: 'inherit' }}
                    >
                        {index}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default LineNumbers;
