// TODO: B 前端基础架构 — 注册页

import { Card, Typography } from "antd";
import { Link } from "react-router-dom";

const { Title } = Typography;

export default function RegisterPage() {
  return (
    <div style={{ maxWidth: 400, margin: "60px auto" }}>
      <Card>
        <Title level={3} style={{ textAlign: "center" }}>注册</Title>
        <p style={{ textAlign: "center", color: "#999" }}>
          TODO: B 实现注册表单（用户名 + 邮箱 + 密码 + 确认密码），调用 authApi.register
        </p>
        <div style={{ textAlign: "center" }}>
          已有账号？<Link to="/login">立即登录</Link>
        </div>
      </Card>
    </div>
  );
}
