// TODO: B 前端基础架构 — 首页：平台介绍 + 功能导航卡片

import { Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function HomePage() {
  return (
    <div style={{ textAlign: "center", padding: "80px 0" }}>
      <Title level={1}>数据结构智能学习平台</Title>
      <Paragraph style={{ fontSize: 18, color: "#666" }}>
        基于知识工程的智能化数据结构学习系统
      </Paragraph>
      <Paragraph type="secondary" style={{ marginTop: 48 }}>
        TODO: B 实现功能导航卡片（知识图谱、可视化演示、自适应练习、智能推荐）
      </Paragraph>
    </div>
  );
}
