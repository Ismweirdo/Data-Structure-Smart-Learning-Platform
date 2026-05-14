import { LockOutlined, LoginOutlined, UserOutlined } from "@ant-design/icons";
import { App, Button, Card, Form, Input, Typography } from "antd";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authApi } from "@/api/endpoints";
import { useAuthStore } from "@/store/authStore";
import type { LoginRequest } from "@/types";
import { getErrorMessage } from "@/utils";

const { Title, Text } = Typography;

interface LoginLocationState {
  from?: {
    pathname?: string;
    search?: string;
  };
  username?: string;
}

function normalizeRedirect(raw: string | null | undefined) {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/dashboard";
  return raw;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = App.useApp();
  const { isAuthenticated, setAuth, setUser } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);
  const state = location.state as LoginLocationState | null;

  const stateRedirect = state?.from
    ? `${state.from.pathname || ""}${state.from.search || ""}`
    : undefined;
  const redirectPath = normalizeRedirect(
    new URLSearchParams(location.search).get("redirect") || stateRedirect,
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleSubmit = async (values: LoginRequest) => {
    setSubmitting(true);
    try {
      const tokenRes = await authApi.login(values);
      setAuth(tokenRes.data);

      try {
        const userRes = await authApi.me();
        setUser(userRes.data);
      } catch {
        setUser(null);
      }

      message.success("登录成功");
      navigate(redirectPath, { replace: true });
    } catch (error: unknown) {
      message.error(getErrorMessage(error, "登录失败，请检查用户名和密码"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <div className="auth-heading">
          <Title level={3}>登录</Title>
          <Text type="secondary">使用平台账号继续学习</Text>
        </div>

        <Form<LoginRequest>
          layout="vertical"
          requiredMark={false}
          initialValues={{ username: state?.username }}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入用户名"
              autoComplete="username"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              autoComplete="current-password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<LoginOutlined />}
              loading={submitting}
              block
              size="large"
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <div className="auth-footer">
          还没有账号？<Link to="/register">立即注册</Link>
        </div>
      </Card>
    </div>
  );
}
