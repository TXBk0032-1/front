import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
} from "@xyflow/react";

// 导入 React Flow 的基础样式
import "@xyflow/react/dist/style.css";

// 导入自定义的通用节点组件
import BaseNode from "./components/BaseNode";
import NodeBox from "./components/NodeBox";

// 导入节点注册表
import { NODE_REGISTRY } from "./constants/nodeRegistry";

// 根据注册表创建节点数据
const createNodeFromRegistry = (id, nodeKey, position) => {
  const config = NODE_REGISTRY.nodes[nodeKey];
  // 默认节点类型为 baseNode
  config.type = config.type || "baseNode";

  // 查找该节点所属的分类以获取颜色
  const categoryKey = Object.keys(NODE_REGISTRY.categories).find((cat) =>
    NODE_REGISTRY.categories[cat].nodes.includes(nodeKey)
  );
  const color = categoryKey
    ? NODE_REGISTRY.categories[categoryKey].color
    : undefined;

  return {
    id,
    type: config.type,
    position,
    data: {
      ...config,
      color,
    },
  };
};

// 使用注册表定义初始节点
const initialNodes = [
  createNodeFromRegistry("node-1", "node1", { x: 100, y: 100 }),
  createNodeFromRegistry("node-2", "node2", { x: 350, y: 100 }),
  createNodeFromRegistry("node-3", "node3", { x: 600, y: 100 }),
  createNodeFromRegistry("node-4", "node4", { x: 850, y: 100 }),
];

// 定义初始连线
const initialEdges = [
  {
    id: "e1-2",
    source: "node-1",
    sourceHandle: "out",
    target: "node-2",
    targetHandle: "in",
  },
  {
    id: "e2-3",
    source: "node-2",
    sourceHandle: "out",
    target: "node-3",
    targetHandle: "in",
  },
  {
    id: "e3-4",
    source: "node-3",
    sourceHandle: "out",
    target: "node-4",
    targetHandle: "in",
  },
];

function App() {
  // 定义自定义节点类型
  const nodeTypes = useMemo(
    () => ({
      baseNode: BaseNode,
    }),
    []
  );

  // 使用 React Flow 提供的 Hook 管理节点和连线的状态
  // setNodes 暂时没用到，所以用逗号跳过以避免 ESLint 报错
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // 处理连线事件
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    // React Flow 需要一个有明确宽高的容器
    <div style={styles.container}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        colorMode="light"
        fitView
        defaultEdgeOptions={{
          style: { strokeWidth: 3, stroke: "#fff" },
        }}
      >
        <NodeBox />
        <Controls />
      </ReactFlow>
    </div>
  );
}
const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    background: "#e2e9faff",
  },
};
export default App;
