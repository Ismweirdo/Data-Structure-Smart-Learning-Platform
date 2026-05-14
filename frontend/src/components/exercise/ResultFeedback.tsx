import {
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { Alert, Descriptions, Space, Tag, Typography } from "antd";

const { Text, Title } = Typography;

interface ResultFeedbackProps {
  isCorrect: boolean;
  correctAnswer?: Record<string, unknown>;
  explanation?: string | null;
  masteryChange?: number;
}

export default function ResultFeedback({
  isCorrect,
  correctAnswer,
  explanation,
  masteryChange = 0,
}: ResultFeedbackProps) {
  return (
    <div style={{ marginTop: 24 }}>
      <Alert
        type={isCorrect ? "success" : "error"}
        icon={isCorrect ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
        message={
          <Title level={5} style={{ margin: 0 }}>
            {isCorrect ? "回答正确！" : "回答错误"}
          </Title>
        }
        description={
          <Space direction="vertical" style={{ width: "100%" }}>
            {!isCorrect && correctAnswer && (
              <div>
                <Text strong>正确答案：</Text>
                <Descriptions size="small" column={1} style={{ marginTop: 8 }}>
                  {Object.entries(correctAnswer).map(([key, val]) => (
                    <Descriptions.Item key={key} label={key}>
                      {String(val)}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </div>
            )}

            {masteryChange !== 0 && (
              <div>
                <Text strong>掌握度变化：</Text>
                <Tag color={masteryChange > 0 ? "green" : "red"}>
                  {masteryChange > 0 ? "+" : ""}
                  {masteryChange}
                </Tag>
              </div>
            )}

            {explanation && (
              <div>
                <Text strong>题目解析：</Text>
                <div
                  style={{
                    marginTop: 8,
                    padding: "12px 16px",
                    background: "#f6f8fa",
                    borderRadius: 6,
                    lineHeight: 1.8,
                  }}
                >
                  {explanation}
                </div>
              </div>
            )}
          </Space>
        }
        showIcon
      />
    </div>
  );
}
