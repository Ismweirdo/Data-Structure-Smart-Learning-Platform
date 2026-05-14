import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SettingOutlined,
  UserOutlined,
  BookOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Empty,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Spin,
  Table,
  Tabs,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useCallback, useEffect, useState } from "react";
import { exerciseApi, knowledgeGraphApi } from "@/api/endpoints";
import type { Exercise, KnowledgePoint, User } from "@/types";

const { Title } = Typography;

// ============================================================
// 知识点管理 Tab（依赖：成员 D 的知识图谱 API）
// ============================================================
function KnowledgeTab() {
  const [data, setData] = useState<KnowledgePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiReady, setApiReady] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KnowledgePoint | null>(null);
  const [form] = Form.useForm();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 依赖：成员 D — GET /knowledge-graph/nodes
      const res = await knowledgeGraphApi.listNodes();
      setData(res.data);
      setApiReady(true);
    } catch {
      setApiReady(false);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async () => {
    const values = await form.validateFields();
    try {
      if (editingItem) {
        // 依赖：成员 D — PUT /knowledge-graph/nodes/{id}
        await knowledgeGraphApi.listNodes(); // placeholder: 实际应调用 update API
        message.success("知识点已更新（API 待成员 D 实现）");
      } else {
        // 依赖：成员 D — POST /knowledge-graph/nodes
        await knowledgeGraphApi.listNodes(); // placeholder: 实际应调用 create API
        message.success("知识点已创建（API 待成员 D 实现）");
      }
      setModalOpen(false);
      form.resetFields();
      fetchData();
    } catch {
      message.warning("API 尚未实现（依赖成员 D）");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // 依赖：成员 D — DELETE /knowledge-graph/nodes/{id}
      message.success("知识点已删除（API 待成员 D 实现）");
      fetchData();
    } catch {
      message.warning("API 尚未实现（依赖成员 D）");
    }
  };

  const columns: ColumnsType<KnowledgePoint> = [
    { title: "名称", dataIndex: "name", key: "name" },
    { title: "分类", dataIndex: "category", key: "category", render: (c: string) => <Tag>{c}</Tag> },
    {
      title: "难度", dataIndex: "difficulty", key: "difficulty",
      render: (d: number) => "★".repeat(d) + "☆".repeat(5 - d),
    },
    {
      title: "操作", key: "action", width: 180,
      render: (_: unknown, record: KnowledgePoint) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingItem(record);
              form.setFieldsValue(record);
              setModalOpen(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除该知识点？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (!apiReady && data.length === 0) {
    return (
      <Card>
        <Empty description="知识点管理 API 尚未就绪（依赖成员 D）">
          <Button icon={<ReloadOutlined />} onClick={fetchData}>重试</Button>
        </Empty>
      </Card>
    );
  }

  return (
    <Card>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <Title level={5} style={{ margin: 0 }}>知识点列表</Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchData}>刷新</Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingItem(null);
              form.resetFields();
              setModalOpen(true);
            }}
          >
            新增知识点
          </Button>
        </Space>
      </div>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading} />

      <Modal
        title={editingItem ? "编辑知识点" : "新增知识点"}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true, message: "请输入名称" }]}>
            <Input maxLength={10} />
          </Form.Item>
          <Form.Item name="category" label="分类" rules={[{ required: true }]}>
            <Select
              options={[
                { value: "linear", label: "线性结构" },
                { value: "tree", label: "树形结构" },
                { value: "graph", label: "图形结构" },
                { value: "sort", label: "排序算法" },
                { value: "search", label: "查找算法" },
                { value: "other", label: "基础概念" },
              ]}
            />
          </Form.Item>
          <Form.Item name="difficulty" label="难度 (1-5)" rules={[{ required: true }]}>
            <InputNumber min={1} max={5} />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}

// ============================================================
// 题目管理 Tab（依赖：成员 A 的练习系统 API）
// ============================================================
function ExercisesTab() {
  const [data, setData] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiReady, setApiReady] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 依赖：成员 A — GET /exercises
      const res = await exerciseApi.list();
      setData(res.data);
      setApiReady(true);
    } catch {
      setApiReady(false);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async () => {
    const values = await form.validateFields();
    try {
      // 依赖：成员 A — 题目 CRUD API（待补充管理端点）
      message.success("题目已保存（API 待成员 A 实现）");
      setModalOpen(false);
      form.resetFields();
      fetchData();
    } catch {
      message.warning("API 尚未实现（依赖成员 A）");
    }
  };

  const typeLabel: Record<string, string> = {
    choice: "选择", fill: "填空", code: "代码", simulation: "模拟",
  };

  const columns: ColumnsType<Exercise> = [
    { title: "标题", dataIndex: "title", key: "title" },
    { title: "题型", dataIndex: "type", key: "type", render: (t: string) => <Tag>{typeLabel[t] || t}</Tag> },
    { title: "难度", dataIndex: "difficulty", key: "difficulty",
      render: (d: number) => "★".repeat(d) + "☆".repeat(5 - d),
    },
    {
      title: "操作", key: "action", width: 120,
      render: (_: unknown, record: Exercise) => (
        <Space>
          <Button size="small" icon={<EditOutlined />}
            onClick={() => { form.setFieldsValue(record); setModalOpen(true); }}>
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  if (!apiReady && data.length === 0) {
    return (
      <Card>
        <Empty description="题目管理 API 尚未就绪（依赖成员 A）">
          <Button icon={<ReloadOutlined />} onClick={fetchData}>重试</Button>
        </Empty>
      </Card>
    );
  }

  return (
    <Card>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <Title level={5} style={{ margin: 0 }}>题目列表</Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchData}>刷新</Button>
          <Button type="primary" icon={<PlusOutlined />}
            onClick={() => { form.resetFields(); setModalOpen(true); }}>
            新增题目
          </Button>
        </Space>
      </div>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading} />

      <Modal title="编辑题目" open={modalOpen}
        onOk={handleSave} onCancel={() => setModalOpen(false)} destroyOnClose width={640}>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="题型" rules={[{ required: true }]}>
            <Select options={[
              { value: "choice", label: "选择题" },
              { value: "fill", label: "填空题" },
              { value: "code", label: "代码题" },
            ]} />
          </Form.Item>
          <Form.Item name="difficulty" label="难度" rules={[{ required: true }]}>
            <InputNumber min={1} max={5} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}

// ============================================================
// 用户管理 Tab（依赖：成员 C 的用户认证模块 — 管理员端点）
// ============================================================
function UsersTab() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [apiReady, setApiReady] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // 依赖：成员 C — 用户管理 API（待补充管理员用户列表端点）
      // GET /auth/users 或类似端点（待成员 C 实现）
      setApiReady(false);
      setUsers([]);
    } catch {
      setApiReady(false);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const columns: ColumnsType<User> = [
    { title: "用户名", dataIndex: "username", key: "username" },
    { title: "邮箱", dataIndex: "email", key: "email" },
    {
      title: "角色", dataIndex: "role", key: "role",
      render: (r: string) => <Tag color={r === "admin" ? "red" : "blue"}>{r}</Tag>,
    },
    {
      title: "注册时间", dataIndex: "created_at", key: "created_at",
      render: (d: string) => d ? new Date(d).toLocaleDateString("zh-CN") : "-",
    },
  ];

  if (!apiReady) {
    return (
      <Card>
        <Empty description="用户管理 API 尚未就绪（依赖成员 C — 用户认证模块）">
          <Button icon={<ReloadOutlined />} onClick={fetchUsers}>重试</Button>
        </Empty>
      </Card>
    );
  }

  return (
    <Card>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <Title level={5} style={{ margin: 0 }}>用户列表</Title>
        <Button icon={<ReloadOutlined />} onClick={fetchUsers}>刷新</Button>
      </div>
      <Table rowKey="id" columns={columns} dataSource={users} loading={loading} />
    </Card>
  );
}

// ============================================================
// 管理后台主页面
// ============================================================
export default function AdminPage() {
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <Title level={3}>
        <SettingOutlined /> 管理后台
      </Title>
      <Tabs
        defaultActiveKey="knowledge"
        items={[
          {
            key: "knowledge",
            label: <span><BookOutlined /> 知识点管理</span>,
            children: <KnowledgeTab />,
          },
          {
            key: "exercises",
            label: <span><BookOutlined /> 题目管理</span>,
            children: <ExercisesTab />,
          },
          {
            key: "users",
            label: <span><UserOutlined /> 用户管理</span>,
            children: <UsersTab />,
          },
        ]}
      />
    </div>
  );
}
