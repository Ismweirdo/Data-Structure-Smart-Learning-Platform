// TODO: H 练习系统 UI — 管理后台（结合 DA 的管理 API）

import { Card, Tabs, Typography } from "antd";

const { Title } = Typography;

export default function AdminPage() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <Title level={3}>管理后台</Title>
      <Tabs
        items={[
          {
            key: "knowledge",
            label: "知识点管理",
            children: (
              <Card>
                <p style={{ color: "#999" }}>TODO: H 知识点列表 + 新增/编辑表单</p>
              </Card>
            ),
          },
          {
            key: "exercises",
            label: "题目管理",
            children: (
              <Card>
                <p style={{ color: "#999" }}>TODO: H 题目列表 + 创建/编辑表单</p>
              </Card>
            ),
          },
          {
            key: "users",
            label: "用户管理",
            children: (
              <Card>
                <p style={{ color: "#999" }}>TODO: H 用户列表查看</p>
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
}
