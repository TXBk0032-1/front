/**
 * BaseNode - 通用蓝图节点组件
 * 
 * 这是所有节点的基础模板，包含：
 * - 左侧输入端口（数据流入）
 * - 中间标题区域
 * - 右侧输出端口（数据流出）
 */

import { Handle, Position } from "@xyflow/react";
import { Button } from "@heroui/react";
import "./BaseNode.css";

// ========== 端口组件 ==========
// 端口就是节点上那些可以连线的小圆点

/**
 * 输入端口 - 在节点左边，用来接收数据
 * Handle 是 React Flow 提供的连接点组件
 */
const InputPort = ({ id, label }) => (
  <div className="port-item">
    <Handle type="target" position={Position.Left} id={id} className="handle" />
    <span className="input-label">{label}</span>
  </div>
);

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
 */
const BaseNode = ({ data }) => {
  // 解构数据，设置默认值
  const {
    color = "rgb(137, 146, 235)",
    label = "未命名节点",
    inputs = [],
    outputs = [],
  } = data;

  return (
    // 这里用 Button 组件是为了实现点击反馈效果，仅此而已
    <Button className="container" style={{ background: color }}>
      {/* 左侧：输入端口区域 */}
      <div className="port-container">
        {inputs.map((port, index) => (
          <InputPort key={`in-${index}`} id={port.id} label={port.label} />
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
