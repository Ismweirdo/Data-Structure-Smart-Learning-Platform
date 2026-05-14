import {
  BookOutlined,
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Empty,
  Result,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { exerciseApi, knowledgeGraphApi } from "@/api/endpoints";
import type { Exercise, KnowledgePoint } from "@/types";

const { Title } = Typography;

const typeLabel: Record<string, string> = {
  choice: "选择题",
  fill: "填空题",
  code: "代码题",
  simulation: "模拟题",
};

const typeColor: Record<string, string> = {
  choice: "blue",
  fill: "green",
  code: "orange",
  simulation: "purple",
};

const difficultyColor: Record<number, string> = {
  1: "green",
  2: "cyan",
  3: "blue",
  4: "orange",
  5: "red",
};

export default function ExercisesPage() {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [knowledgePoints, setKnowledgePoints] = useState<KnowledgePoint[]>([]);
  const [filterKpId, setFilterKpId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKnowledgePoints = useCallback(async () => {
    try {
      // 依赖：成员 D 的知识图谱 API — GET /knowledge-graph/nodes
      const res = await knowledgeGraphApi.listNodes();
      setKnowledgePoints(res.data);
    } catch {
      // 知识点筛选下拉框在 API 不可用时为空，不影响题目列表主体功能
      setKnowledgePoints([]);
    }
  }, []);

  const fetchExercises = useCallback(async (kpId?: string) => {
    setLoading(true);
    setError(null);
    try {
      // 依赖：成员 A 的练习 API — GET /exercises?knowledge_point_id=xxx
      const res = await exerciseApi.list(kpId);
      setExercises(res.data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "获取题目列表失败";
      setError(msg);
      setExercises([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExercises(filterKpId);
    fetchKnowledgePoints();
  }, [fetchExercises, fetchKnowledgePoints, filterKpId]);

  const handleFilterChange = (value: string | undefined) => {
    setFilterKpId(value || undefined);
  };

  const columns: ColumnsType<Exercise> = useMemo(
    () => [
      {
        title: "题目",
        dataIndex: "title",
        key: "title",
        width: "40%",
        render: (title: string) => (
          <Space>
            <BookOutlined style={{ color: "#1677ff" }} />
            <span>{title}</span>
          </Space>
        ),
      },
      {
        title: "题型",
        dataIndex: "type",
        key: "type",
        width: "15%",
        render: (type: string) => (
          <Tag color={typeColor[type] || "default"}>
            {typeLabel[type] || type}
          </Tag>
        ),
      },
      {
        title: "难度",
        dataIndex: "difficulty",
        key: "difficulty",
        width: "15%",
        sorter: (a: Exercise, b: Exercise) => a.difficulty - b.difficulty,
        render: (d: number) => (
          <Tag color={difficultyColor[d] || "default"}>
            {"★".repeat(d)}{"☆".repeat(5 - d)}
          </Tag>
        ),
      },
      {
        title: "操作",
        key: "action",
        width: "15%",
        render: (_: unknown, record: Exercise) => (
          <Button
            type="primary"
            size="small"
            onClick={() => navigate(`/exercises/${record.id}`)}
          >
            开始练习
          </Button>
        ),
      },
    ],
    [navigate],
  );

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          练习中心
        </Title>
        <Space>
          <Tooltip title="按知识点筛选">
            <Select
              allowClear
              showSearch
              placeholder="全部知识点"
              style={{ width: 220 }}
              value={filterKpId}
              onChange={handleFilterChange}
              filterOption={(input, option) =>
                (option?.label as string)?.includes(input)
              }
              options={knowledgePoints.map((kp) => ({
                value: kp.id,
                label: kp.name,
              }))}
              suffixIcon={<FilterOutlined />}
              notFoundContent="暂无可选知识点"
            />
          </Tooltip>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => fetchExercises(filterKpId)}
          >
            刷新
          </Button>
        </Space>
      </div>

      <Card>
        {loading ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <Spin size="large" tip="加载题目列表..." />
          </div>
        ) : error ? (
          <Result
            status="warning"
            title="题目数据暂时不可用"
            subTitle={
              <span>
                依赖成员 A（练习系统 API）尚未完成。
                <br />
                题目列表接口 GET /exercises 返回 501。
              </span>
            }
            extra={
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={() => fetchExercises(filterKpId)}
              >
                重试
              </Button>
            }
          />
        ) : exercises.length === 0 ? (
          <Empty
            description={
              filterKpId
                ? "该知识点下暂无题目"
                : "暂无题目数据（依赖 A：练习系统 API）"
            }
          />
        ) : (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={exercises}
            pagination={{ pageSize: 10, showSizeChanger: true }}
            onRow={(record) => ({
              onClick: () => navigate(`/exercises/${record.id}`),
              style: { cursor: "pointer" },
            })}
          />
        )}
      </Card>
    </div>
  );
}
