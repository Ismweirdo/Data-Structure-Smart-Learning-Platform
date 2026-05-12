// TODO: H 练习系统 UI — 答题页

import { Button, Card, Typography } from "antd";
import { Link } from "react-router-dom";

const { Title } = Typography;

export default function ExercisePage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <Link to="/exercises" style={{ marginBottom: 16, display: "inline-block" }}>← 返回练习列表</Link>
      <Card>
        <Title level={4}>题目详情</Title>
        <div style={{ textAlign: "center", color: "#999", padding: 40 }}>
          <p>TODO: H 答题页</p>
          <p>选择题组件(Radio.Group) / 填空题组件(Input) / 代码题组件(Monaco Editor)</p>
          <p>提交后展示批改结果、题目解析、掌握度变化</p>
        </div>
      </Card>
    </div>
  );
}
