/**
 * BaseNode - 通用蓝图节点组件
 * 
 * 这是所有节点的基础模板，包含：
 * - 左侧输入端口（数据流入）
 * - 中间标题区域
 * - 右侧输出端口（数据流出）
 */

import { Handle, Position, useEdges, useReactFlow } from "@xyflow/react";        // React Flow 组件
import { Button } from "@heroui/react";                                          // UI 组件
import "./BaseNode.css";                                                         // 样式

const DRAG_THRESHOLD = 5;                                                        // 拖拽阈值（像素）


// ==================== 输入端口组件 ====================

/**
 * InputPort - 输入端口
 * 
 * 特殊功能：实现"拔出连接线"效果
 * 当用户拖拽已连接的输入端口时，会断开连接并从源端口开始创建新连接
 */
const InputPort = ({ id, label, nodeId }) => {
  const edges = useEdges();                                                      // 获取所有连线
  const { setEdges } = useReactFlow();                                           // 获取设置连线的函数

  /**
   * 处理鼠标按下
   * 实现拔出连接线效果：只有拖拽时才断开，点击不会断开
   */
  const handleMouseDown = (event) => {
    // 第一步：查找连接到这个端口的连线
    const connectedEdge = edges.find((edge) =>                                   // 遍历所有连线
      edge.target === nodeId && edge.targetHandle === id                         // 找到连接到这个端口的
    );
    if (!connectedEdge) return;                                                  // 没有连接，让 React Flow 正常处理

    // 第二步：阻止默认行为
    event.stopPropagation();                                                     // 阻止事件冒泡

    // 第三步：记录起始位置
    const startX = event.clientX;                                                // 起始X坐标
    const startY = event.clientY;                                                // 起始Y坐标
    let hasDragged = false;                                                      // 是否已开始拖拽

    // 第四步：定义鼠标移动处理
    const handleMouseMove = (moveEvent) => {
      const deltaX = Math.abs(moveEvent.clientX - startX);                       // X方向移动距离
      const deltaY = Math.abs(moveEvent.clientY - startY);                       // Y方向移动距离
      const isDragging = deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD;     // 是否超过阈值
      
      if (!hasDragged && isDragging) {                                           // 首次超过阈值
        hasDragged = true;                                                       // 标记已开始拖拽
        setEdges((eds) => eds.filter((e) => e.id !== connectedEdge.id));         // 断开连接
        
        // 在源端口上模拟 mousedown，让 React Flow 从源端口开始创建连接
        const sourceSelector = `[data-nodeid="${connectedEdge.source}"][data-handleid="${connectedEdge.sourceHandle}"]`;
        const sourceHandle = document.querySelector(sourceSelector);             // 获取源端口DOM
        if (sourceHandle) {                                                      // 如果找到了
          const fakeMouseDown = new MouseEvent("mousedown", {                    // 创建模拟事件
            bubbles: true, cancelable: true,
            clientX: moveEvent.clientX, clientY: moveEvent.clientY, button: 0,
          });
          sourceHandle.dispatchEvent(fakeMouseDown);                             // 触发事件
        }
        
        // 清理监听器
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      }
    };

    // 第五步：定义鼠标松开处理
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);                // 移除移动监听
      document.removeEventListener("mouseup", handleMouseUp);                    // 移除松开监听
    };

    // 第六步：添加监听器
    document.addEventListener("mousemove", handleMouseMove);                     // 监听鼠标移动
    document.addEventListener("mouseup", handleMouseUp);                         // 监听鼠标松开
  };

  // 渲染
  return (
    <div className="port-item">
      <Handle
        type="target"                                                            // 目标端口（输入）
        position={Position.Left}                                                 // 位置在左边
        id={id}                                                                  // 端口ID
        className="handle"                                                       // 样式类名
        onMouseDown={handleMouseDown}                                            // 鼠标按下事件
      />
      <span className="input-label">{label}</span>                               {/* 端口标签 */}
    </div>
  );
};


// ==================== 输出端口组件 ====================

/**
 * OutputPort - 输出端口
 * 标签在左边，连接点在右边
 */
const OutputPort = ({ id, label }) => (
  <div className="port-item">
    <span className="output-label">{label}</span>                                {/* 端口标签 */}
    <Handle
      type="source"                                                              // 源端口（输出）
      position={Position.Right}                                                  // 位置在右边
      id={id}                                                                    // 端口ID
      className="handle"                                                         // 样式类名
    />
  </div>
);


// ==================== 节点主体组件 ====================

/**
 * BaseNode - 节点主体
 */
const BaseNode = ({ data, id }) => {
  // 解构数据，设置默认值
  const color = data.color || "rgb(137, 146, 235)";                              // 节点背景色
  const label = data.label || "未命名节点";                                       // 节点标题
  const inputs = data.inputs || [];                                              // 输入端口列表
  const outputs = data.outputs || [];                                            // 输出端口列表
  const onDoubleClick = data.onDoubleClick;                                      // 双击回调

  /**
   * 处理双击事件
   * 双击节点时触发重命名弹窗
   */
  const handleDoubleClick = (event) => {
    event.stopPropagation();                                                     // 阻止事件冒泡
    if (onDoubleClick) onDoubleClick(id);                                        // 调用回调
  };

  // 渲染
  return (
    <Button                                                                      // 用 Button 实现点击反馈效果
      className="container"
      style={{ background: color }}
      onDoubleClick={handleDoubleClick}
    >
      {/* 左侧：输入端口区域 */}
      <div className="port-container">
        {inputs.map((port, index) => (
          <InputPort key={`in-${index}`} id={port.id} label={port.label} nodeId={id} />
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
