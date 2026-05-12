// TODO: B 前端基础架构 — 登录页

import { Card, Typography } from "antd";
import { Link } from "react-router-dom";

const { Title } = Typography;

export default function LoginPage() {
  return (
    <div style={{ maxWidth: 400, margin: "80px auto" }}>
      <Card>
        <Title level={3} style={{ textAlign: "center" }}>登录</Title>
        <p style={{ textAlign: "center", color: "#999" }}>
          TODO: B 实现登录表单（用户名 + 密码），调用 authApi.login，存储 Token 并跳转
        </p>
        <div style={{ textAlign: "center" }}>
          还没有账号？<Link to="/register">立即注册</Link>
        </div>
      </Card>
    </div>
  );
}
