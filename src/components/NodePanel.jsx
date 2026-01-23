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

  // 下面是一些节点信息提前提取
  console.log(targetNode);
  /* {
    "id": "8x4.assssuf7a369c15cecca004d",
    "type": "baseNode",
    "position": {
        "x": 222.5795440673828,
        "y": 143.9808235168457
    },
    "data": {
        "label": "全连接层",
        "opcode": "linear",
        "inputs": [
            {
                "id": "x",
                "label": "x"
            }
        ],
        "outputs": [
            {
                "id": "y",
                "label": "y"
            }
        ],
        "params": {
            "输出特征数": {
                "label": "输出特征数",
                "type": "number",
                "default": "128"
            },
            "bias": {
                "label": "bias",
                "type": "boolean",
                "default": true
            }
        },
        "color": "#82CBFA"
    },
    "measured": {
        "width": 150,
        "height": 36
    }
} */

  return (
    <div
      id='node-panel'
      className="node-panel"
      style={positionStyle}
    >
      <div className="panel-header">
        <span className="panel-title">节点 属性</span>
      </div>
      <div className="panel-content">

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
