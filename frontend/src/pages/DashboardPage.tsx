import {
  BarChartOutlined,
  BookOutlined,
  CheckCircleOutlined,
  FieldTimeOutlined,
  PercentageOutlined,
  ReloadOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Progress,
  Result,
  Row,
  Skeleton,
  Space,
  Spin,
  Statistic,
  Tag,
  Typography,
} from "antd";
import { useCallback, useEffect, useState } from "react";
import { progressApi } from "@/api/endpoints";
import { useAuthStore } from "@/store/authStore";
import type { KnowledgeMastery, LearningStats, UserProgress } from "@/types";

const { Title, Text } = Typography;

const categoryColors: Record<string, string> = {
  linear: "#1677ff",
  tree: "#52c41a",
  graph: "#722ed1",
  sort: "#fa8c16",
  search: "#eb2f96",
  other: "#666",
};

const categoryLabels: Record<string, string> = {
  linear: "线性结构",
  tree: "树形结构",
  graph: "图形结构",
  sort: "排序算法",
  search: "查找算法",
  other: "基础概念",
};

const dayLabels = ["一", "二", "三", "四", "五", "六", "日"];

export default function DashboardPage() {
  const { user } = useAuthStore();

  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [mastery, setMastery] = useState<KnowledgeMastery[]>([]);
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      // 依赖：成员 G 的推荐引擎 & 学习统计 API
      // GET /progress/{user_id} — 进度总览
      // GET /progress/{user_id}/mastery — 掌握度列表
      // GET /progress/{user_id}/stats — 学习统计
      const [progressRes, masteryRes, statsRes] = await Promise.all([
        progressApi.overview(user.id),
        progressApi.mastery(user.id),
        progressApi.stats(user.id),
      ]);
      setProgress(progressRes.data);
      setMastery(masteryRes.data);
      setStats(statsRes.data);
    } catch (err: unknown) {
      // G 的 API 尚未实现时，显示占位提示
      setError(
        err instanceof Error ? err.message : "获取学习数据失败",
      );
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // 渲染周活跃柱状图（手写简单柱状图，不依赖 recharts）
  const renderWeeklyChart = () => {
    if (!stats?.weekly_activity || stats.weekly_activity.length === 0) {
      return <Empty description="暂无周活跃数据" />;
    }
    const maxVal = Math.max(...stats.weekly_activity, 1);
    return (
      <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 160 }}>
        {stats.weekly_activity.map((count, idx) => (
          <div
            key={idx}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 12, marginBottom: 4 }}>{count}</Text>
            <div
              style={{
                width: "100%",
                height: `${Math.max((count / maxVal) * 120, 4)}px`,
                background: "#1677ff",
                borderRadius: "4px 4px 0 0",
                transition: "height 0.3s",
              }}
            />
            <Text style={{ fontSize: 12, marginTop: 4, color: "#999" }}>
              {dayLabels[idx] || ""}
            </Text>
          </div>
        ))}
      </div>
    );
  };

  // 渲染分类掌握度
  const renderCategoryMastery = () => {
    const entries = stats?.category_mastery
      ? Object.entries(stats.category_mastery)
      : [];
    if (entries.length === 0) {
      return <Empty description="暂无分类掌握度数据" />;
    }
    return (
      <Space direction="vertical" style={{ width: "100%" }}>
        {entries.map(([cat, score]) => (
          <div key={cat} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Tag color={categoryColors[cat] || "#666"} style={{ width: 80, textAlign: "center" }}>
              {categoryLabels[cat] || cat}
            </Tag>
            <Progress
              percent={Math.round(score * 100)}
              size="small"
              strokeColor={categoryColors[cat]}
              style={{ flex: 1, marginBottom: 0 }}
            />
            <Text style={{ width: 48, textAlign: "right" }}>
              {Math.round(score * 100)}%
            </Text>
          </div>
        ))}
      </Space>
    );
  };

  // ---- 标题栏 ----
  const header = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
      }}
    >
      <Title level={3} style={{ margin: 0 }}>
        学习仪表盘
      </Title>
      <Button icon={<ReloadOutlined />} onClick={fetchAll}>
        刷新
      </Button>
    </div>
  );

  // ---- API 未就绪时展示 ----
  if (error && !progress && !stats) {
    return (
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {header}
        <Result
          status="warning"
          title="学习数据暂时不可用"
          subTitle={
            <span>
              依赖成员 G（推荐引擎 & 学习统计 API）尚未完成。
              <br />
              进度/掌握度/统计接口均返回未实现状态。
            </span>
          }
          extra={
            <Button type="primary" icon={<ReloadOutlined />} onClick={fetchAll}>
              重试
            </Button>
          }
        />
      </div>
    );
  }

  // ---- 加载态 ----
  if (loading) {
    return (
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {header}
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>
      {header}

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="知识点总数"
              value={progress?.total_knowledge_points ?? "--"}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="已掌握"
              value={progress?.mastered_count ?? "--"}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="正确率"
              value={progress != null ? progress.correct_rate : "--"}
              suffix="%"
              precision={1}
              prefix={<PercentageOutlined />}
              valueStyle={{
                color:
                  progress != null && progress.correct_rate >= 60
                    ? "#52c41a"
                    : "#ff4d4f",
              }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="练习总次数"
              value={progress?.total_practice_count ?? "--"}
              prefix={<FieldTimeOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 整体掌握度进度条 */}
      <Card title="整体掌握度" style={{ marginBottom: 20 }}>
        {progress ? (
          <Progress
            percent={Math.round(progress.average_mastery * 100)}
            strokeColor={{
              "0%": "#1677ff",
              "100%": "#52c41a",
            }}
          />
        ) : (
          <Empty description="暂无数据" />
        )}
      </Card>

      {/* 分类掌握度 + 周活跃 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card
            title={
              <Space>
                <BarChartOutlined />
                <span>分类掌握度</span>
              </Space>
            }
          >
            {renderCategoryMastery()}
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            title={
              <Space>
                <CheckCircleOutlined />
                <span>最近 7 天练习</span>
              </Space>
            }
          >
            {renderWeeklyChart()}
          </Card>
        </Col>
      </Row>

      {/* 知识点掌握详情 */}
      <Card
        title="各知识点掌握度"
        style={{ marginTop: 20 }}
      >
        {mastery.length === 0 ? (
          <Empty description="暂无掌握度数据（依赖 G：掌握度 API）" />
        ) : (
          <Space direction="vertical" style={{ width: "100%" }}>
            {mastery.map((m) => (
              <div
                key={m.knowledge_point_id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "4px 0",
                }}
              >
                <Text style={{ minWidth: 120 }}>{m.knowledge_point_name}</Text>
                <Progress
                  percent={Math.round(m.mastery_score * 100)}
                  size="small"
                  style={{ flex: 1, marginBottom: 0 }}
                />
                <Text type="secondary" style={{ fontSize: 12, minWidth: 100 }}>
                  {m.correct_attempts}/{m.total_attempts} 正确
                </Text>
              </div>
            ))}
          </Space>
        )}
      </Card>

      {/* 底部信息：显示 API 依赖状态 */}
      {error && (
        <Divider />
      )}
    </div>
  );
}
