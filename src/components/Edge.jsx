/**
 * Edge.jsx - 连线组件
 * 
 * 自定义连线样式（如果需要）
 * 目前使用 React Flow 默认连线
 */

import { getBezierPath, EdgeLabelRenderer } from '@xyflow/react';

/**
 * 自定义连线组件
 * 
 * 可以添加：
 * - 自定义路径样式
 * - 动画效果
 * - 标签显示
 * - 删除按钮
 */
const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });

  return (
    <>
      <path
        id={id}
        style={{
          strokeWidth: 3,
          stroke: '#fff',
          ...style
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      
      {/* 可选：连线标签 */}
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 12,
              pointerEvents: 'all'
            }}
            className="nodrag nopan"
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

/**
 * 动画连线组件
 * 显示数据流动方向的动画效果
 */
export const AnimatedEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });

  return (
    <>
      <path
        id={id}
        style={{
          strokeWidth: 3,
          stroke: '#fff',
          ...style
        }}
        className="react-flow__edge-path animated"
        d={edgePath}
        markerEnd={markerEnd}
      />
    </>
  );
};

export default CustomEdge;
