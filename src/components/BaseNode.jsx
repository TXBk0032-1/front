/**
 * BaseNode - 通用蓝图节点组件
 * 
 * 这是所有节点的基础模板，包含：
 * - 左侧输入端口（数据流入）
 * - 中间标题区域
 * - 右侧输出端口（数据流出）
 */

import { Handle, Position, useEdges, useReactFlow } from "@xyflow/react";
import { Button } from "@heroui/react";
import "./BaseNode.css";

// ========== 端口组件 ==========
// 端口就是节点上那些可以连线的小圆点

/**
 * 输入端口 - 在节点左边，用来接收数据
 * Handle 是 React Flow 提供的连接点组件
 * 
 * 特殊处理：实现"拔出连接线"效果
 * - 禁止从输入端口开始创建新连接（isConnectableStart={false}）
 * - 当输入端口有连接时，点击会触发从源端口开始的重连
 */
const InputPort = ({ id, label, nodeId }) => {
  const edges = useEdges();
  const { setEdges } = useReactFlow();

  // 处理鼠标按下事件：实现拔出连接线效果
  // 只有在拖拽时才断开连接，点击不会断开
  const handleMouseDown = (event) => {
    // 查找连接到这个输入端口的边
    const connectedEdge = edges.find(
      (edge) => edge.target === nodeId && edge.targetHandle === id
    );

    // 如果没有连接，让 React Flow 正常处理（从输入端口创建新连接）
    if (!connectedEdge) return;

    // 阻止默认行为，防止 React Flow 从输入端口创建连接
    event.stopPropagation();

    // 记录起始位置
    const startX = event.clientX;
    const startY = event.clientY;
    const dragThreshold = 5; // 拖拽阈值（像素）
    let hasDragged = false;

    // 处理鼠标移动：检测是否开始拖拽
    const handleMouseMove = (moveEvent) => {
      // 计算移动距离
      const deltaX = Math.abs(moveEvent.clientX - startX);
      const deltaY = Math.abs(moveEvent.clientY - startY);

      // 如果移动距离超过阈值，认为是拖拽
      if (!hasDragged && (deltaX > dragThreshold || deltaY > dragThreshold)) {
        hasDragged = true;

        // 断开连接（删除这条边）
        setEdges((eds) => eds.filter((e) => e.id !== connectedEdge.id));

        // 获取源端口的 DOM 元素
        const sourceHandleSelector = `[data-nodeid="${connectedEdge.source}"][data-handleid="${connectedEdge.sourceHandle}"]`;
        const sourceHandle = document.querySelector(sourceHandleSelector);

        if (sourceHandle) {
          // 模拟在源端口上触发 mousedown 事件
          // 这样 React Flow 会从源端口开始创建连接
          const mouseDownEvent = new MouseEvent("mousedown", {
            bubbles: true,
            cancelable: true,
            clientX: moveEvent.clientX,
            clientY: moveEvent.clientY,
            button: 0,
          });
          sourceHandle.dispatchEvent(mouseDownEvent);
        }

        // 清理监听器
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      }
    };

    // 处理鼠标松开：清理监听器
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    // 添加监听器
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="port-item">
      <Handle
        type="target"
        position={Position.Left}
        id={id}
        className="handle"
        onMouseDown={handleMouseDown}
      />
      <span className="input-label">{label}</span>
    </div>
  );
};

/**
 * 输出端口 - 在节点右边，用来发送数据
 * 注意：输出端口的标签在左边，连接点在右边（和输入端口相反）
 */
const OutputPort = ({ id, label }) => (
  <div className="port-item">
    <span className="output-label">{label}</span>
    <Handle type="source" position={Position.Right} id={id} className="handle" />
  </div>
);

// ========== 主组件 ==========

/**
 * BaseNode - 节点主体
 *
 * @param {Object} data - 节点数据，从 React Flow 传入
 * @param {string} data.color - 节点背景色
 * @param {string} data.label - 节点标题
 * @param {Array} data.inputs - 输入端口列表
 * @param {Array} data.outputs - 输出端口列表
 * @param {Function} data.onDoubleClick - 双击回调，用于触发重命名
 * @param {string} id - 节点ID，从 React Flow 传入
 */
const BaseNode = ({ data, id }) => {
  // 解构数据，设置默认值
  const {
    color = "rgb(137, 146, 235)",
    label = "未命名节点",
    inputs = [],
    outputs = [],
    onDoubleClick,
  } = data;

  /**
   * 处理双击事件
   * 双击节点时触发重命名弹窗
   */
  const handleDoubleClick = (event) => {
    // 阻止事件冒泡，避免触发其他事件
    event.stopPropagation();
    
    // 调用父组件传入的回调函数
    if (onDoubleClick) {
      onDoubleClick(id);
    }
  };

  return (
    // 这里用 Button 组件是为了实现点击反馈效果，仅此而已
    // 添加 onDoubleClick 事件处理双击重命名
    <Button
      className="container"
      style={{ background: color }}
      onDoubleClick={handleDoubleClick}
    >
      {/* 左侧：输入端口区域 */}
      <div className="port-container">
        {inputs.map((port, index) => (
          <InputPort
            key={`in-${index}`}
            id={port.id}
            label={port.label}
            nodeId={id}
          />
        ))}
      </div>

      {/* 中间：标题区域 */}
      <div className="title-container">
        <div className="title">{label}</div>
      </div>

      {/* 右侧：输出端口区域 */}
      <div className="port-container">
        {outputs.map((port, index) => (
          <OutputPort key={`out-${index}`} id={port.id} label={port.label} />
        ))}
      </div>
    </Button>
  );
};

export default BaseNode;
