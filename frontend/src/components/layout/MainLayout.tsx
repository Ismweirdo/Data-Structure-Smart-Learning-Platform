import {
  BookOutlined,
  DashboardOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  NodeIndexOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, Space } from "antd";
import { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { authApi } from "@/api/endpoints";
import { useAuthStore } from "@/store/authStore";

const { Header, Content, Sider } = Layout;

const menuItems = [
  { key: "/", icon: <HomeOutlined />, label: "首页" },
  { key: "/knowledge-graph", icon: <NodeIndexOutlined />, label: "知识图谱" },
  { key: "/exercises", icon: <BookOutlined />, label: "练习中心" },
  { key: "/dashboard", icon: <DashboardOutlined />, label: "学习仪表盘" },
];

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, setUser, logout } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && !user) {
      authApi.me().then((res) => setUser(res.data)).catch(() => logout());
    }
  }, [isAuthenticated, user, setUser, logout]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#001529",
          padding: "0 24px",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Link to="/" style={{ color: "#fff", fontSize: 18, fontWeight: 700, textDecoration: "none" }}>
          数据结构智能学习平台
        </Link>
        <Space>
          {isAuthenticated ? (
            <>
              <span style={{ color: "rgba(255,255,255,0.7)" }}>
                <UserOutlined /> {user?.username}
              </span>
              <Button type="text" icon={<LogoutOutlined />} onClick={logout} style={{ color: "#fff" }}>
                退出
              </Button>
            </>
          ) : (
            <Button type="primary" icon={<LoginOutlined />} onClick={() => navigate("/login")}>
              登录
            </Button>
          )}
        </Space>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: "#fff" }} breakpoint="lg" collapsedWidth="0">
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{ height: "100%", borderRight: 0, paddingTop: 16 }}
          />
        </Sider>
        <Content style={{ padding: 24, background: "#f5f5f5", minHeight: "calc(100vh - 64px)" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
