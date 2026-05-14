import {
  BookOutlined,
  DashboardOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  NodeIndexOutlined,
  PlayCircleOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Layout, Menu, Space, type MenuProps } from "antd";
import axios from "axios";
import { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { authApi } from "@/api/endpoints";
import { useAuthStore } from "@/store/authStore";

const { Header, Content, Sider } = Layout;

type MenuItem = NonNullable<MenuProps["items"]>[number];

const baseMenuItems: MenuItem[] = [
  { key: "/", icon: <HomeOutlined />, label: "首页" },
  { key: "/knowledge-graph", icon: <NodeIndexOutlined />, label: "知识图谱" },
  { key: "/visualization/bst", icon: <PlayCircleOutlined />, label: "可视化演示" },
  { key: "/exercises", icon: <BookOutlined />, label: "练习中心" },
  { key: "/dashboard", icon: <DashboardOutlined />, label: "学习仪表盘" },
];

function getSelectedKey(pathname: string) {
  if (pathname.startsWith("/knowledge")) return "/knowledge-graph";
  if (pathname.startsWith("/visualization")) return "/visualization/bst";
  if (pathname.startsWith("/exercises")) return "/exercises";
  if (pathname.startsWith("/dashboard")) return "/dashboard";
  if (pathname.startsWith("/admin")) return "/admin";
  return "/";
}

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, setUser, logout } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && !user) {
      authApi.me()
        .then((res) => setUser(res.data))
        .catch((error: unknown) => {
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            logout();
          }
        });
    }
  }, [isAuthenticated, user, setUser, logout]);

  const adminMenuItem: MenuItem = {
    key: "/admin",
    icon: <SettingOutlined />,
    label: "管理后台",
  };

  const menuItems: MenuItem[] = user?.role === "admin"
    ? [...baseMenuItems, adminMenuItem]
    : baseMenuItems;

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const userMenu: MenuProps = {
    onClick: ({ key }) => {
      if (key === "logout") {
        handleLogout();
        return;
      }
      navigate(String(key));
    },
    items: [
      { key: "/dashboard", icon: <DashboardOutlined />, label: "学习仪表盘" },
      ...(user?.role === "admin"
        ? [{ key: "/admin", icon: <SettingOutlined />, label: "管理后台" }]
        : []),
      { type: "divider" },
      { key: "logout", icon: <LogoutOutlined />, label: "退出登录" },
    ],
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        className="app-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#102033",
          padding: "0 20px",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Link to="/" className="brand-link">
          <span className="brand-mark">DS</span>
          <span>数据结构智能学习平台</span>
        </Link>
        <Space>
          {isAuthenticated ? (
            <Dropdown menu={userMenu} placement="bottomRight" trigger={["click"]}>
              <Button type="text" className="header-user-button">
                <Avatar size="small" icon={<UserOutlined />} />
                <span>{user?.username || "已登录"}</span>
              </Button>
            </Dropdown>
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
            selectedKeys={[getSelectedKey(location.pathname)]}
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
