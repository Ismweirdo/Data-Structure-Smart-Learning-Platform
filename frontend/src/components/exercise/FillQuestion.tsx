import { Input, Space, Typography } from "antd";

const { Text } = Typography;

interface FillQuestionProps {
  blanks: string[]; // 空白标识列表，用于渲染输入框数量
  values?: string[];
  onChange: (values: string[]) => void;
  disabled?: boolean;
}

export default function FillQuestion({
  blanks,
  values = [],
  onChange,
  disabled = false,
}: FillQuestionProps) {
  const handleChange = (index: number, value: string) => {
    const next = [...values];
    next[index] = value;
    onChange(next);
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {blanks.map((_hint, idx) => (
        <Space key={idx} align="center">
          <Text>空 {idx + 1}：</Text>
          <Input
            value={values[idx] || ""}
            onChange={(e) => handleChange(idx, e.target.value)}
            disabled={disabled}
            placeholder={`请输入第 ${idx + 1} 个空格的答案`}
            style={{ width: 320 }}
          />
        </Space>
      ))}
    </Space>
  );
}
