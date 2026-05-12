// TODO: E 知识图谱 UI — 知识图谱页面（D3.js 力导向图）

import { Card, Typography } from "antd";

const { Title } = Typography;

export default function KnowledgeGraphPage() {
  return (
    <div>
      <Title level={3}>知识图谱</Title>
      <Card bodyStyle={{ height: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#999" }}>
          <p>TODO: E 知识图谱 UI 模块</p>
          <p>使用 D3.js Force Simulation 渲染知识节点和关系边</p>
          <p>交互：缩放/平移、节点拖拽、按分类筛选、点击查看详情</p>
        </div>
      </Card>
    </div>
  );
}
