import React from "react";
import Editor from "react-simple-code-editor";
import hljs from "highlight.js/lib/core";

interface CodeEditorProps {
    code: string;
    onChange: (code: string) => void;
    highlight: (code: string) => string;
    fontSize: number;
    lineHeight: number;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
    code,
    onChange,
    highlight,
    fontSize,
    lineHeight,
}) => {
    return (
        <Editor
            value={code}
            onValueChange={onChange}
            highlight={highlight}
            padding={0}
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
                overflow: "hidden",
                fontFamily: "monospace",
                fontSize: `${fontSize}px`,
                lineHeight: `${lineHeight}px`,
                position: "relative",
                zIndex: 1,
            }}
        />
    );
};

export default CodeEditor;
