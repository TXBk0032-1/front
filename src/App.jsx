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

// 定义初始节点，使用自定义的 baseNode 类型
const initialNodes = [
  {
    id: "node-1",
    type: "baseNode",
    position: { x: 100, y: 100 },
    data: {
      label: "节点1",
      inputs: [{ id: "in-1", label: "输入1" }],
      outputs: [
        { id: "out-1", label: "输出1" },
        { id: "out-2", label: "输出2" },
      ],
    },
  },
  {
    id: "node-2",
    type: "baseNode",
    position: { x: 400, y: 100 },
    data: {
      label: "节点2",
      inputs: [
        { id: "in-2", label: "输入2" },
        { id: "in-3", label: "输入3" },
      ],
      outputs: [{ id: "out-2", label: "输出2" }],
    },
  },
];

// 定义初始连线
const initialEdges = [
  {
    id: "e1-2",
    source: "node-1",
    sourceHandle: "out-1",
    target: "node-2",
    targetHandle: "in-2",
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
          style: { strokeWidth: 3, stroke: "#fff"},
        }}
      >
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
}
export default App;
