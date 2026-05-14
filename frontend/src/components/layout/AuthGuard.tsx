import { Result, Spin } from "antd";
import type React from "react";
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authApi } from "@/api/endpoints";
import { useAuthStore } from "@/store/authStore";

interface Props {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function AuthGuard({ children, adminOnly }: Props) {
  const location = useLocation();
  const { isAuthenticated, user, setUser, logout } = useAuthStore();

  useEffect(() => {
    let ignore = false;
    if (!isAuthenticated || user) return;

    authApi.me()
      .then((res) => {
        if (!ignore) setUser(res.data);
      })
      .catch(() => {
        if (!ignore) logout();
      });

    return () => {
      ignore = true;
    };
  }, [isAuthenticated, user, setUser, logout]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!user) {
    return (
      <div className="route-loading">
        <Spin size="large" tip="正在校验登录状态..." />
      </div>
    );
  }

  if (adminOnly && user?.role !== "admin") {
    return (
      <Result
        status="403"
        title="403"
        subTitle="当前账号没有管理员权限"
        extra={null}
      />
    );
  }

  return <>{children}</>;
}
