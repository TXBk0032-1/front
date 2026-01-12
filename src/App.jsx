import { useCallback } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
} from "@xyflow/react";

// 导入 React Flow 的基础样式
import "@xyflow/react/dist/style.css";

// 定义初始节点
const initialNodes = [
  {
    id: "1",
    type: "input",
    position: { x: 250, y: 5 },
    data: { label: "输入节点" },
  },
  {
    id: "2",
    position: { x: 100, y: 100 },
    data: { label: "处理节点 A" },
  },
  {
    id: "3",
    position: { x: 400, y: 100 },
    data: { label: "处理节点 B" },
  }
];

// 定义初始连线
const initialEdges = [
  { id: "e1-2", source: "1", target: "2" },
];

function App() {
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
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default App;
