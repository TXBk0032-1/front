/**
 * Port.jsx - 端口组件
 * 
 * 单独的端口组件，可用于更复杂的端口交互
 */

import { Handle, Position } from '@xyflow/react';

// ========== 输入端口 ==========

export const InputPort = ({ id, label, onMouseDown }) => (
  <div className="port-item">
    <Handle
      type="target"
      position={Position.Left}
      id={id}
      className="handle"
      onMouseDown={onMouseDown}
    />
    <span className="input-label">{label}</span>
  </div>
);

// ========== 输出端口 ==========

export const OutputPort = ({ id, label }) => (
  <div className="port-item">
    <span className="output-label">{label}</span>
    <Handle
      type="source"
      position={Position.Right}
      id={id}
      className="handle"
    />
  </div>
);

// ========== 通用端口 ==========

const Port = ({ type, id, label, position, onMouseDown }) => {
  const isInput = type === 'input' || type === 'target';
  
  return (
    <div className="port-item">
      {isInput && (
        <>
          <Handle
            type="target"
            position={position || Position.Left}
            id={id}
            className="handle"
            onMouseDown={onMouseDown}
          />
          <span className="input-label">{label}</span>
        </>
      )}
      {!isInput && (
        <>
          <span className="output-label">{label}</span>
          <Handle
            type="source"
            position={position || Position.Right}
            id={id}
            className="handle"
          />
        </>
      )}
    </div>
  );
};

export default Port;
