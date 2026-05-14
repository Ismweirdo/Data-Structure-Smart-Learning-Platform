import { ArrowLeftOutlined, SendOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Descriptions,
  Result,
  Skeleton,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { exerciseApi } from "@/api/endpoints";
import type { Exercise } from "@/types";
import ChoiceQuestion from "@/components/exercise/ChoiceQuestion";
import CodeCompletion from "@/components/exercise/CodeCompletion";
import FillQuestion from "@/components/exercise/FillQuestion";
import ResultFeedback from "@/components/exercise/ResultFeedback";

const { Title, Text, Paragraph } = Typography;

const typeLabel: Record<string, string> = {
  choice: "选择题",
  fill: "填空题",
  code: "代码题",
  simulation: "模拟题",
};

const difficultyColor: Record<number, string> = {
  1: "green",
  2: "cyan",
  3: "blue",
  4: "orange",
  5: "red",
};

export default function ExercisePage() {
  const { id } = useParams<{ id: string }>();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 用户答案状态
  const [choiceAnswer, setChoiceAnswer] = useState<string>("");
  const [fillAnswers, setFillAnswers] = useState<string[]>([]);
  const [codeAnswer, setCodeAnswer] = useState<string>("");

  // 提交状态
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    isCorrect: boolean;
    correctAnswer?: Record<string, unknown>;
    explanation?: string | null;
    masteryChange?: number;
  } | null>(null);

  const fetchExercise = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      // 依赖：成员 A 的练习 API — GET /exercises/{id}
      const res = await exerciseApi.get(id);
      setExercise(res.data);
      // 重置答案和结果
      setChoiceAnswer("");
      setFillAnswers([]);
      setCodeAnswer("");
      setSubmitResult(null);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "获取题目详情失败";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchExercise();
  }, [fetchExercise]);

  const handleSubmit = async () => {
    if (!id || !exercise) return;

    // 构建答案对象
    let answer: Record<string, unknown>;
    switch (exercise.type) {
      case "choice":
        if (!choiceAnswer) {
          message.warning("请选择一个选项");
          return;
        }
        answer = { selected: choiceAnswer };
        break;
      case "fill":
        if (fillAnswers.length === 0 || fillAnswers.some((a) => !a.trim())) {
          message.warning("请填写所有空格");
          return;
        }
        answer = { blanks: fillAnswers };
        break;
      case "code":
        if (!codeAnswer.trim()) {
          message.warning("请输入代码");
          return;
        }
        answer = { code: codeAnswer };
        break;
      default:
        answer = {};
    }

    setSubmitting(true);
    try {
      // 依赖：成员 A 的练习 API — POST /exercises/{id}/submit
      const res = await exerciseApi.submit(id, { answer });
      setSubmitResult({
        isCorrect: res.data.is_correct,
        correctAnswer: res.data.correct_answer,
        explanation: res.data.explanation,
        masteryChange: res.data.mastery_change,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "提交失败";
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ---- 渲染题目内容 ----
  const renderQuestion = () => {
    if (!exercise) return null;

    const { type, content } = exercise;

    return (
      <div style={{ marginTop: 24 }}>
        <Paragraph
          style={{ fontSize: 16, lineHeight: 1.8, whiteSpace: "pre-wrap" }}
        >
          {content.question}
        </Paragraph>

        <div style={{ marginTop: 24 }}>
          {type === "choice" && content.options && (
            <ChoiceQuestion
              options={content.options}
              value={choiceAnswer}
              onChange={setChoiceAnswer}
              disabled={!!submitResult}
            />
          )}
          {type === "fill" && (
            <FillQuestion
              blanks={content.blanks || ["", ""]}
              values={fillAnswers}
              onChange={setFillAnswers}
              disabled={!!submitResult}
            />
          )}
          {type === "code" && (
            <CodeCompletion
              codeTemplate={content.code_template}
              value={codeAnswer}
              onChange={setCodeAnswer}
              disabled={!!submitResult}
            />
          )}
        </div>

        {!submitResult && (
          <div style={{ marginTop: 32, textAlign: "center" }}>
            <Button
              type="primary"
              size="large"
              icon={<SendOutlined />}
              loading={submitting}
              onClick={handleSubmit}
            >
              提交答案
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      <Link
        to="/exercises"
        style={{
          marginBottom: 16,
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <ArrowLeftOutlined /> 返回练习列表
      </Link>

      {loading ? (
        <Card>
          <Skeleton active paragraph={{ rows: 6 }} />
        </Card>
      ) : error ? (
        <Result
          status="warning"
          title="题目数据暂时不可用"
          subTitle={
            <span>
              依赖成员 A（练习系统 API）尚未完成。
              <br />
              题目详情接口返回错误：{error}
            </span>
          }
          extra={
            <Button onClick={fetchExercise}>重试</Button>
          }
        />
      ) : exercise ? (
        <Card>
          {/* 题目元信息 */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <Title level={4} style={{ margin: 0 }}>
              {exercise.title}
            </Title>
            <Space>
              <Tag color="blue">{typeLabel[exercise.type]}</Tag>
              <Tag color={difficultyColor[exercise.difficulty]}>
                {"★".repeat(exercise.difficulty)}
                {"☆".repeat(5 - exercise.difficulty)}
              </Tag>
            </Space>
          </div>

          {/* 题目描述信息 */}
          <Descriptions
            size="small"
            column={2}
            style={{ marginTop: 12, marginBottom: 0 }}
          >
            <Descriptions.Item label="题型">
              {typeLabel[exercise.type]}
            </Descriptions.Item>
            <Descriptions.Item label="难度">
              {exercise.difficulty} / 5
            </Descriptions.Item>
          </Descriptions>

          {/* 题目内容 */}
          {renderQuestion()}

          {/* 提交结果反馈 */}
          {submitResult && <ResultFeedback {...submitResult} />}

          {/* 提交后可重新作答 */}
          {submitResult && (
            <div style={{ marginTop: 24, textAlign: "center" }}>
              <Button onClick={fetchExercise}>重新作答</Button>
              <Button
                type="link"
                onClick={() => {
                  const kpId = exercise.knowledge_point_id;
                  // 跳转到同知识点下的其他题目
                }}
              >
                下一题
              </Button>
            </div>
          )}
        </Card>
      ) : (
        <Result status="404" title="题目不存在" subTitle="未找到该题目，可能已被删除。" />
      )}
    </div>
  );
}
