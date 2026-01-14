/**
 * PropertyPanel.jsx - 节点属性面板
 * 
 * 右键点击节点时显示的属性编辑面板
 * 根据节点配置的 params 参数动态生成编辑控件
 * 支持的参数类型：number（数字输入框）、string（文本输入框）、boolean（开关）
 */

import { Input, Switch } from "@heroui/react";                                   // UI 组件
import "./PropertyPanel.css";                                                    // 样式


// ========== 参数编辑器组件 ==========

/** 数字输入框 */
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

/** 文本输入框 */
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

/** 布尔开关 */
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


// ========== 主组件 ==========

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
  
  if (!params || Object.keys(params).length === 0) return null;                  // 没有参数，不显示面板

  const clampedScale = Math.max(0.5, Math.min(1.5, scale));                       // 限制缩放范围
  const positionStyle = calcPositionStyle(x, y, position, clampedScale);         // 计算位置样式

  return (
    <div className="property-panel" style={positionStyle}>
      {/* 面板标题 */}
      <div className="panel-header">
        <span className="panel-title">{nodeLabel} 属性</span>
      </div>
      
      {/* 参数列表 */}
      <div className="panel-content">
        {Object.entries(params).map(([paramKey, paramConfig]) =>
          renderParamEditor(paramKey, paramConfig, paramValues, onParamChange)
        )}
      </div>
    </div>
  );
};


// ========== 辅助函数 ==========

/** 计算面板位置样式 */
function calcPositionStyle(x, y, position, scale) {
  if (position === 'above') {
    return {
      left: x,
      top: y,
      transform: `translate(-50%, -100%) scale(${scale})`,                       // 水平居中 + 向上偏移 + 缩放
      transformOrigin: 'center bottom',                                          // 缩放原点在底部中心
    };
  } else {
    return {
      left: x,
      top: y,
      transform: `translateX(-50%) scale(${scale})`,                             // 水平居中 + 缩放
      transformOrigin: 'center top',                                             // 缩放原点在顶部中心
    };
  }
}

/** 根据参数类型渲染对应的编辑器 */
function renderParamEditor(paramKey, paramConfig, paramValues, onParamChange) {
  const currentValue = paramValues[paramKey] ?? paramConfig.default;             // 当前值，没有就用默认值
  const handleChange = (newValue) => onParamChange(paramKey, newValue);          // 变化回调
  
  const editorMap = {                                                            // 类型到编辑器的映射
    number: NumberInput,
    string: StringInput,
    boolean: BooleanSwitch,
  };
  
  const Editor = editorMap[paramConfig.type] || StringInput;                     // 获取编辑器组件，默认用文本输入框
  
  return (
    <Editor
      key={paramKey}
      label={paramConfig.label}
      value={currentValue}
      onChange={handleChange}
    />
  );
}


export default PropertyPanel;
