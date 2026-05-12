// TODO: F 可视化引擎 — 数据结构可视化演示页

import { Card, Select, Typography } from "antd";

const { Title } = Typography;

const DS_OPTIONS = [
  { label: "顺序表 (Array)", value: "array" },
  { label: "链表 (Linked List)", value: "linked-list" },
  { label: "栈 (Stack)", value: "stack" },
  { label: "队列 (Queue)", value: "queue" },
  { label: "二叉树 (Binary Tree)", value: "binary-tree" },
  { label: "二叉搜索树 (BST)", value: "bst" },
  { label: "图 (Graph)", value: "graph" },
];

export default function VisualizationPage() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>可视化演示</Title>
        <Select placeholder="选择数据结构" style={{ width: 240 }} options={DS_OPTIONS} />
      </div>

      <Card bodyStyle={{ padding: 0 }}>
        <div style={{
          width: "100%", height: 400, background: "#1e1e2e",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ textAlign: "center", color: "#888" }}>
            <p>TODO: F 可视化引擎模块</p>
            <p>Canvas 2D 渲染数据结构操作动画</p>
            <p>实现 renderers/: ArrayRenderer, LinkedListRenderer, StackRenderer,</p>
            <p>QueueRenderer, TreeRenderer, GraphRenderer, SortRenderer</p>
          </div>
        </div>
      </Card>

      <Card style={{ marginTop: 8 }}>
        <p style={{ color: "#999", textAlign: "center" }}>
          TODO: F 播放控件 — 播放/暂停/单步/重置/速度调节
        </p>
      </Card>
    </div>
  );
}
