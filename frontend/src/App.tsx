import { ConfigProvider, App as AntApp } from "antd";
import zhCN from "antd/locale/zh_CN";
import AppRouter from "./router";

const theme = {
  token: {
    colorPrimary: "#4f46e5",
    borderRadius: 8,
    colorBgContainer: "#ffffff",
  },
};

export default function App() {
  return (
    <ConfigProvider locale={zhCN} theme={theme}>
      <AntApp>
        <AppRouter />
      </AntApp>
    </ConfigProvider>
  );
}
