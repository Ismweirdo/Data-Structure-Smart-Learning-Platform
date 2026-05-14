import {
  ArrowRightOutlined,
  BookOutlined,
  CheckCircleOutlined,
  DashboardOutlined,
  NodeIndexOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Progress, Row, Space, Tag, Typography } from "antd";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const { Title, Paragraph, Text } = Typography;

const featureLinks = [
  {
    title: "知识图谱",
    description: "查看知识点、先修关系与跨模块关联",
    path: "/knowledge-graph",
    icon: <NodeIndexOutlined />,
    tag: "KG",
  },
  {
    title: "可视化演示",
    description: "进入数据结构操作动画与逐步状态播放",
    path: "/visualization/bst",
    icon: <PlayCircleOutlined />,
    tag: "Visual",
  },
  {
    title: "练习中心",
    description: "按知识点筛选题目并提交答案",
    path: "/exercises",
    icon: <BookOutlined />,
    tag: "Exercise",
  },
  {
    title: "学习仪表盘",
    description: "查看练习记录、正确率与掌握度变化",
    path: "/dashboard",
    icon: <DashboardOutlined />,
    tag: "Progress",
  },
];

const treeTopics = [
  { name: "二叉树", difficulty: 2, note: "树形结构基础" },
  { name: "二叉树的遍历", difficulty: 3, note: "前序 / 中序 / 后序 / 层序" },
  { name: "二叉搜索树", difficulty: 3, note: "BST 查找与插入基础" },
];

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="home-shell">
      <section className="home-hero">
        <div className="home-hero-main">
          <Tag color="blue">Data Structure Learning</Tag>
          <Title level={1}>数据结构智能学习平台</Title>
          <Paragraph>
            以知识图谱为主线，串联可视化演示、练习反馈和学习进度，帮助学习者按先修关系推进数据结构课程。
          </Paragraph>
          <Space wrap>
            <Link to="/knowledge-graph">
              <Button type="primary" size="large" icon={<NodeIndexOutlined />}>
                进入知识图谱
              </Button>
            </Link>
            <Link to={isAuthenticated ? "/dashboard" : "/login"}>
              <Button size="large" icon={<DashboardOutlined />}>
                {isAuthenticated ? "查看仪表盘" : "登录账号"}
              </Button>
            </Link>
          </Space>
        </div>

        <Card className="tree-module-card" title="树形结构 Part1">
          <Space direction="vertical" size={14} style={{ width: "100%" }}>
            {treeTopics.map((topic) => (
              <div key={topic.name} className="tree-topic-row">
                <div>
                  <Text strong>{topic.name}</Text>
                  <div className="muted-text">{topic.note}</div>
                </div>
                <Progress
                  type="circle"
                  size={42}
                  percent={topic.difficulty * 20}
                  format={() => topic.difficulty}
                />
              </div>
            ))}
          </Space>
        </Card>
      </section>

      <Row gutter={[16, 16]} className="home-feature-grid">
        {featureLinks.map((item) => (
          <Col xs={24} sm={12} lg={6} key={item.path}>
            <Link to={item.path}>
              <Card hoverable className="feature-card">
                <div className="feature-card-icon">{item.icon}</div>
                <Space align="center" style={{ marginBottom: 8 }}>
                  <Title level={4} style={{ margin: 0 }}>
                    {item.title}
                  </Title>
                  <Tag>{item.tag}</Tag>
                </Space>
                <Paragraph type="secondary">{item.description}</Paragraph>
                <Text className="feature-card-link">
                  打开 <ArrowRightOutlined />
                </Text>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      <Card className="home-status-card">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Space>
              <CheckCircleOutlined className="status-icon" />
              <div>
                <Text strong>路由基础层</Text>
                <div className="muted-text">首页、登录、注册、受保护页面和管理后台入口</div>
              </div>
            </Space>
          </Col>
          <Col xs={24} md={8}>
            <Space>
              <CheckCircleOutlined className="status-icon" />
              <div>
                <Text strong>API 客户端</Text>
                <div className="muted-text">统一 Axios 实例、JWT 注入和 401 刷新处理</div>
              </div>
            </Space>
          </Col>
          <Col xs={24} md={8}>
            <Space>
              <CheckCircleOutlined className="status-icon" />
              <div>
                <Text strong>全局状态</Text>
                <div className="muted-text">Zustand 管理登录态、用户信息和知识图谱状态</div>
              </div>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
