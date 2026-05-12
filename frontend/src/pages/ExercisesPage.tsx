// TODO: H 练习系统 UI — 练习列表页

import { Card, Typography } from "antd";

const { Title } = Typography;

export default function ExercisesPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <Title level={3}>练习中心</Title>
      <Card>
        <div style={{ textAlign: "center", color: "#999", padding: 40 }}>
          <p>TODO: H 练习列表页</p>
          <p>按知识点筛选题目、题目类型标签（选择/填空/代码）、难度标签</p>
        </div>
      </Card>
    </div>
  );
}
