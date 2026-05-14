import { Radio, Space, Typography } from "antd";

const { Text } = Typography;

interface ChoiceOption {
  key: string;
  text: string;
}

interface ChoiceQuestionProps {
  options: ChoiceOption[];
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function ChoiceQuestion({
  options,
  value,
  onChange,
  disabled = false,
}: ChoiceQuestionProps) {
  return (
    <Radio.Group
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        {options.map((opt) => (
          <Radio key={opt.key} value={opt.key}>
            <Text strong>{opt.key}. </Text>
            <Text>{opt.text}</Text>
          </Radio>
        ))}
      </Space>
    </Radio.Group>
  );
}
