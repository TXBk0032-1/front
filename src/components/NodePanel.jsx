/**
 * NodePanel.jsx - 节点属性面板组件
 * 
 * 包含：
 * - PropertyPanel：显示节点参数
 * - RenameModal：重命名弹窗
 */

import { useMemo, useEffect, useState, useRef } from 'react';
import { useReactFlow, useViewport } from '@xyflow/react';
import { Input, Switch, Button, TextField, Label } from '@heroui/react';
import useStore from '../store';
import { calcPositionBelowNode } from '../utils/canvas/position';
import { clampScale } from '../utils/canvas/zoom';
import { getNodeConfig } from '../constants/nodeRegistry';
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
  const { getNode, flowToScreenPosition } = useReactFlow();
  const viewport = useViewport();
  
  const {
    nodes,
    propertyPanel,
    closePropertyPanel,
    updateNodeParam
  } = useStore();

  // 计算面板位置
  const panelPosition = useMemo(() => {
    if (!propertyPanel) return null;
    const nodeData = getNode(propertyPanel.targetNodeId);
    if (!nodeData) return null;
    return calcPositionBelowNode(nodeData, flowToScreenPosition, viewport.zoom);
  }, [propertyPanel, getNode, flowToScreenPosition, viewport]);

  // 获取节点信息
  const panelNodeInfo = useMemo(() => {
    if (!propertyPanel) return null;
    const node = nodes.find(n => n.id === propertyPanel.targetNodeId);
    if (!node) return null;
    const nodeConfig = getNodeConfig(node.data.nodeKey);
    return {
      nodeId: node.id,
      nodeLabel: node.data.label,
      params: nodeConfig.params || {},
      paramValues: node.data.paramValues || {}
    };
  }, [propertyPanel, nodes]);

  // 点击外部关闭
  useEffect(() => {
    if (!propertyPanel) return;

    const handleClickOutside = (event) => {
      const panelElement = document.querySelector('.property-panel');
      const isClickInside = panelElement && panelElement.contains(event.target);
      if (!isClickInside) closePropertyPanel();
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside, true);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [propertyPanel, closePropertyPanel]);

  // 不显示
  if (!propertyPanel || !panelPosition || !panelNodeInfo) return null;
  if (!panelNodeInfo.params || Object.keys(panelNodeInfo.params).length === 0) return null;

  const clampedScale = clampScale(panelPosition.scale);

  // 计算位置样式
  const positionStyle = panelPosition.position === 'above'
    ? {
        left: panelPosition.x,
        top: panelPosition.y,
        transform: `translate(-50%, -100%) scale(${clampedScale})`,
        transformOrigin: 'center bottom'
      }
    : {
        left: panelPosition.x,
        top: panelPosition.y,
        transform: `translateX(-50%) scale(${clampedScale})`,
        transformOrigin: 'center top'
      };

  // 渲染参数编辑器
  const renderParamEditor = (paramKey, paramConfig) => {
    const currentValue = panelNodeInfo.paramValues[paramKey] ?? paramConfig.default;
    const handleChange = (newValue) => updateNodeParam(paramKey, newValue);

    const editorMap = {
      number: NumberInput,
      string: StringInput,
      boolean: BooleanSwitch
    };

    const Editor = editorMap[paramConfig.type] || StringInput;

    return (
      <Editor
        key={paramKey}
        label={paramConfig.label}
        value={currentValue}
        onChange={handleChange}
      />
    );
  };

  return (
    <div className="property-panel" style={positionStyle}>
      <div className="panel-header">
        <span className="panel-title">{panelNodeInfo.nodeLabel} 属性</span>
      </div>
      <div className="panel-content">
        {Object.entries(panelNodeInfo.params).map(([paramKey, paramConfig]) =>
          renderParamEditor(paramKey, paramConfig)
        )}
      </div>
    </div>
  );
}

// ========== RenameModal 组件 ==========

export function RenameModal() {
  const {
    renameModal,
    closeRenameModal,
    confirmRename
  } = useStore();

  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const prevIsOpenRef = useRef(false);

  const isOpen = renameModal !== null;
  const isMultiple = renameModal?.nodeIds?.length > 1;
  const currentName = renameModal?.currentName || '';

  // 弹窗打开时初始化
  useEffect(() => {
    const justOpened = isOpen && !prevIsOpenRef.current;
    prevIsOpenRef.current = isOpen;
    if (!justOpened) return;

    setTimeout(() => {
      setInputValue(isMultiple ? '' : currentName);
      inputRef.current?.focus();
      if (!isMultiple) inputRef.current?.select();
    }, 50);
  }, [isOpen, currentName, isMultiple]);

  // 确认重命名
  const handleConfirm = () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) { closeRenameModal(); return; }
    if (!isMultiple && trimmedValue === currentName) { closeRenameModal(); return; }
    confirmRename(trimmedValue);
  };

  // 键盘事件
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleConfirm();
    if (e.key === 'Escape') closeRenameModal();
  };

  // 点击遮罩关闭
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) closeRenameModal();
  };

  if (!isOpen) return null;

  const title = isMultiple ? '批量节点重命名' : '节点重命名';
  const placeholder = isMultiple ? '多值' : currentName;

  return (
    <div className="rename-modal-overlay" onClick={handleOverlayClick}>
      <div className="rename-modal">
        <div className="rename-modal-header">
          <h3 className="rename-modal-title">{title}</h3>
        </div>
        <div className="rename-modal-body">
          <TextField>
            <Label>节点名称</Label>
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
            />
          </TextField>
        </div>
        <div className="rename-modal-footer">
          <Button variant="flat" onPress={closeRenameModal}>取消</Button>
          <Button color="primary" onPress={handleConfirm}>确认</Button>
        </div>
      </div>
    </div>
  );
}

// 默认导出两个组件
export default { PropertyPanel, RenameModal };
