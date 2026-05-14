import { LockOutlined, MailOutlined, UserAddOutlined, UserOutlined } from "@ant-design/icons";
import { App, Button, Card, Form, Input, Typography } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "@/api/endpoints";
import type { RegisterRequest } from "@/types";
import { getErrorMessage } from "@/utils";

const { Title, Text } = Typography;

interface RegisterFormValues extends RegisterRequest {
  confirmPassword: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: RegisterFormValues) => {
    setSubmitting(true);
    try {
      await authApi.register({
        username: values.username,
        email: values.email,
        password: values.password,
      });
      message.success("注册成功，请登录");
      navigate("/login", {
        replace: true,
        state: { username: values.username },
      });
    } catch (error: unknown) {
      message.error(getErrorMessage(error, "注册失败，请稍后重试"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <div className="auth-heading">
          <Title level={3}>注册</Title>
          <Text type="secondary">创建账号后即可记录练习与掌握度</Text>
        </div>

        <Form<RegisterFormValues>
          layout="vertical"
          requiredMark={false}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: "请输入用户名" },
              { min: 2, max: 50, message: "用户名长度为 2-50 个字符" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入用户名"
              autoComplete="username"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: "请输入邮箱" },
              { type: "email", message: "邮箱格式不正确" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="请输入邮箱"
              autoComplete="email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: "请输入密码" },
              { min: 6, max: 128, message: "密码长度为 6-128 个字符" },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              autoComplete="new-password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "请再次输入密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次输入的密码不一致"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请再次输入密码"
              autoComplete="new-password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<UserAddOutlined />}
              loading={submitting}
              block
              size="large"
            >
              注册
            </Button>
          </Form.Item>
        </Form>

        <div className="auth-footer">
          已有账号？<Link to="/login">立即登录</Link>
        </div>
      </Card>
    </div>
  );
}
