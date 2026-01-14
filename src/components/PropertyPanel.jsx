/**
 * PropertyPanel - 节点属性面板
 *
 * 右键点击节点时显示的属性编辑面板
 * 根据节点配置的 params 参数动态生成编辑控件
 * 支持的参数类型：number（数字输入框）、string（文本输入框）、boolean（开关）
 */

import { Input, Switch } from "@heroui/react";                                   // UI 组件
import "./PropertyPanel.css";                                                    // 样式


// ==================== 参数编辑器组件 ====================

/**
 * NumberInput - 数字输入框
 */
const NumberInput = ({ label, value, onChange }) => (
  <div className="param-item">
    <span className="param-label">{label}</span>
    <Input
      type="number"
      size="sm"
      value={String(value)}
      onChange={(e) => onChange(Number(e.target.value))}
      className="param-input"
    />
  </div>
);

/**
 * StringInput - 文本输入框
 */
const StringInput = ({ label, value, onChange }) => (
  <div className="param-item">
    <span className="param-label">{label}</span>
    <Input
      type="text"
      size="sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="param-input"
    />
  </div>
);

/**
 * BooleanSwitch - 布尔开关
 */
const BooleanSwitch = ({ label, value, onChange }) => (
  <div className="param-item param-item-switch">
    <span className="param-label">{label}</span>
    <Switch
      size="sm"
      isSelected={value}
      onValueChange={onChange}
    />
  </div>
);


// ==================== 主组件 ====================

/**
 * PropertyPanel - 属性面板主体
 * 
 * @param {number} x - 面板X坐标
 * @param {number} y - 面板Y坐标
 * @param {string} position - 面板位置：'below' 显示在节点下方，'above' 显示在节点上方
 * @param {number} scale - 缩放比例
 * @param {string} nodeLabel - 节点名称
 * @param {object} params - 参数配置（来自 nodeRegistry）
 * @param {object} paramValues - 当前参数值
 * @param {function} onParamChange - 参数变化回调
 */
const PropertyPanel = ({ x, y, position = 'below', scale = 1, nodeLabel, params, paramValues, onParamChange }) => {
  
  // 如果没有参数，不显示面板
  if (!params || Object.keys(params).length === 0) {
    return null;
  }

  // 限制缩放范围
  const clampedScale = Math.max(0.5, Math.min(1.5, scale));

  // 根据位置计算样式
  const positionStyle = position === 'above'
    ? {
        left: x,
        top: y,
        transform: `translate(-50%, -100%) scale(${clampedScale})`,
        transformOrigin: 'center bottom',
      }
    : {
        left: x,
        top: y,
        transform: `translateX(-50%) scale(${clampedScale})`,
        transformOrigin: 'center top',
      };

  /**
   * 根据参数类型渲染对应的编辑器
   */
  const renderParamEditor = (paramKey, paramConfig) => {
    const currentValue = paramValues[paramKey] ?? paramConfig.default;           // 当前值，没有就用默认值
    const handleChange = (newValue) => onParamChange(paramKey, newValue);        // 变化回调
    
    switch (paramConfig.type) {
      case 'number':
        return (
          <NumberInput
            key={paramKey}
            label={paramConfig.label}
            value={currentValue}
            onChange={handleChange}
          />
        );
      case 'string':
        return (
          <StringInput
            key={paramKey}
            label={paramConfig.label}
            value={currentValue}
            onChange={handleChange}
          />
        );
      case 'boolean':
        return (
          <BooleanSwitch
            key={paramKey}
            label={paramConfig.label}
            value={currentValue}
            onChange={handleChange}
          />
        );
      default:
        // 未知类型，默认用文本输入框
        return (
          <StringInput
            key={paramKey}
            label={paramConfig.label}
            value={String(currentValue)}
            onChange={handleChange}
          />
        );
    }
  };

  return (
    <div className="property-panel" style={positionStyle}>
      {/* 面板标题 */}
      <div className="panel-header">
        <span className="panel-title">{nodeLabel} 属性</span>
      </div>
      
      {/* 参数列表 */}
      <div className="panel-content">
        {Object.entries(params).map(([paramKey, paramConfig]) =>
          renderParamEditor(paramKey, paramConfig)
        )}
      </div>
    </div>
  );
};

export default PropertyPanel;
