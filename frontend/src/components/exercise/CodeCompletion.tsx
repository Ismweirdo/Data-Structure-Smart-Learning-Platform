import Editor from "@monaco-editor/react";

interface CodeCompletionProps {
  codeTemplate?: string;
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  language?: string;
}

export default function CodeCompletion({
  codeTemplate,
  value = "",
  onChange,
  disabled = false,
  language = "cpp",
}: CodeCompletionProps) {
  return (
    <div style={{ border: "1px solid #d9d9d9", borderRadius: 8, overflow: "hidden" }}>
      {codeTemplate && (
        <div
          style={{
            padding: "8px 16px",
            background: "#fafafa",
            borderBottom: "1px solid #d9d9d9",
            fontFamily: "monospace",
            fontSize: 13,
            color: "#666",
            whiteSpace: "pre-wrap",
          }}
        >
          {codeTemplate}
        </div>
      )}
      <Editor
        height="280px"
        language={language}
        value={value}
        onChange={(v) => onChange(v || "")}
        options={{
          readOnly: disabled,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
