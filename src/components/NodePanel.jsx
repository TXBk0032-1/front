/**
 * NodePanel.jsx - 节点属性面板组件
 * 
 * 包含：
 * - PropertyPanel：显示节点参数
 * - RenameModal：重命名弹窗
 */


import { Input, Switch } from '@heroui/react';

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

// ========== PropertyPanel 组件 ==========

export function PropertyPanel() {
  return (
    <div className="property-panel">
      <div className="panel-header">
        <span className="panel-title">节点 属性</span>
      </div>
      <div className="panel-content">

      </div>
    </div>
  );
}

// ========== RenameModal 组件 ==========



// 默认导出两个组件
export default PropertyPanel;
