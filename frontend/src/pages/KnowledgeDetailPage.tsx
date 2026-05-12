// TODO: E 知识图谱 UI — 知识点详情页

import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Typography } from "antd";
import { Link } from "react-router-dom";

const { Title } = Typography;

export default function KnowledgeDetailPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <Link to="/knowledge-graph">
        <Button icon={<ArrowLeftOutlined />} type="text">返回知识图谱</Button>
      </Link>
      <Card style={{ marginTop: 16 }}>
        <Title level={4}>知识点详情</Title>
        <p style={{ color: "#999" }}>
          TODO: E 展示知识点信息（描述/难度/分类）、配套可视化演示入口、关联练习题列表
        </p>
      </Card>
    </div>
  );
}
