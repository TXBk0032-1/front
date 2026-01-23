/**
 * NodePanel.jsx - 节点属性面板组件
 * 
 * 包含：
 * - PropertyPanel：显示节点参数
 * - RenameModal：重命名弹窗
 */


import { useStore } from '../store';
import { Input, Switch } from '@heroui/react';
import { calcPositionAroundNode } from '../utils/data/position';
import { updateNodeParam } from '../utils/blueprint/updateNodeParam';

import { useReactFlow } from '@xyflow/react';

import '../styles/NodePanel.css';

// ========== 参数编辑器组件 ==========

const NumberInput = ({ label, value, onChange }) => (
  <div className="param-item">
    <span className="param-label">{label}</span>
    <Input
      type="number"
      aria-label={label}
      placeholder={label}
      value={String(value)}
      onChange={(e) => onChange(Number(e.target.value))}
      className="param-input"
    />
  </div>
);

const StringInput = ({ label, value, onChange }) => (
  <div className="param-item">
    <span className="param-label">{label}</span>
    <Input
      type="text"
      aria-label={label}
      placeholder={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="param-input"
    />
  </div>
);

const BooleanSwitch = ({ label, value, onChange }) => (
  <div className="param-item">
    <span className="param-label">{label}</span>
    <Switch
      size="md"
      isSelected={value}
      onChange={onChange}
    >
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
    </Switch>
  </div>
);

// ========== NodePanel 组件 ==========

export function NodePanel() {
  const { visible, nodeId } = useStore((s) => s.nodePanel);
  const nodes = useStore((s) => s.nodes);
  const viewport = useStore((s) => s.viewport);
  const { flowToScreenPosition } = useReactFlow();

  if (!visible || !nodeId) return null;

  const targetNode = nodes.find(n => n.id === nodeId);

  if (!targetNode) return null;

  const panelPosition = calcPositionAroundNode(targetNode, flowToScreenPosition, viewport.zoom, 'below');
  const scale = viewport.zoom;
  const positionStyle = calcPositionStyle(panelPosition.x, panelPosition.y, scale);

  const nodeName = targetNode.data.label || '未命名节点';
  const params = targetNode.data.params || {};

  const handleParamChange = (paramKey, paramValue) => {
    updateNodeParam(nodeId, paramKey, paramValue);
  };

  return (
    <div
      id='node-panel'
      className="node-panel"
      style={positionStyle}
    >
      <div className="panel-header">
        <span className="panel-title">{nodeName} 属性</span>
      </div>
      <div className="panel-content">
        {Object.entries(params).map(([paramKey, paramConfig]) => {
          const { label, type, default: defaultValue } = paramConfig;

          switch (type) {
            case 'number':
              return (
                <NumberInput
                  key={paramKey}
                  label={label}
                  value={defaultValue}
                  onChange={(value) => handleParamChange(paramKey, value)}
                />
              );
            case 'string':
              return (
                <StringInput
                  key={paramKey}
                  label={label}
                  value={defaultValue}
                  onChange={(value) => handleParamChange(paramKey, value)}
                />
              );
            case 'boolean':
              return (
                <BooleanSwitch
                  key={paramKey}
                  label={label}
                  value={defaultValue}
                  onChange={(value) => handleParamChange(paramKey, value)}
                />
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}

function calcPositionStyle(x, y, scale) {
  return {
    left: x,
    top: y,
    transform: `translate(-50%) scale(${scale})`,                       // 水平居中 + 向上偏移 + 缩放
    transformOrigin: 'center top',                                          // 缩放原点在顶部中心
  };
}


// 默认导出两个组件
export default NodePanel;
