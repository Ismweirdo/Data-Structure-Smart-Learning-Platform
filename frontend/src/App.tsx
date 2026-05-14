import { ConfigProvider, App as AntApp } from "antd";
import zhCN from "antd/locale/zh_CN";
import AppRouter from "./router";

const theme = {
  token: {
    colorPrimary: "#1677ff",
    borderRadius: 8,
    colorBgContainer: "#ffffff",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
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
