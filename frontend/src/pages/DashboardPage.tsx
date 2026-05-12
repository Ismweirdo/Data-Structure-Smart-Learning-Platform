// TODO: H 练习系统 UI — 学习仪表盘

import { Card, Typography } from "antd";

const { Title } = Typography;

export default function DashboardPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <Title level={3}>学习仪表盘</Title>
      <Card>
        <div style={{ textAlign: "center", color: "#999", padding: 40 }}>
          <p>TODO: H 学习仪表盘</p>
          <p>统计卡片（知识点总数/已掌握/正确率）</p>
          <p>整体掌握度进度条 + 分类掌握度柱状图</p>
          <p>最近 7 天练习频次图</p>
        </div>
      </Card>
    </div>
  );
}
