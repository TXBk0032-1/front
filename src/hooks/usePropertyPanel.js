/**
 * usePropertyPanel - 属性面板控制
 * 
 * 管理节点属性面板的显示和隐藏
 * 支持动态跟随：面板会跟随节点移动和画布缩放
 */

import { useState, useCallback, useEffect, useMemo } from "react";               // React hooks
import { useReactFlow, useViewport } from "@xyflow/react";                       // React Flow hooks
import { getNodeConfig } from "../constants/nodeRegistry";                       // 节点配置


const usePropertyPanel = (nodes, setNodes, saveToHistory) => {
  
  // 面板状态：null 表示关闭，否则包含 { targetNodeId }
  const [propertyPanel, setPropertyPanel] = useState(null);
  
  // 获取 React Flow 实例，用于坐标转换
  const { getNode, flowToScreenPosition } = useReactFlow();
  
  // 获取视口状态（缩放比例）
  const viewport = useViewport();

  // ==================== 计算面板位置 ====================

  /**
   * 根据目标节点ID动态计算面板位置
   * 面板固定显示在节点下方
   */
  const panelPosition = useMemo(() => {
    if (!propertyPanel) return null;
    
    const nodeData = getNode(propertyPanel.targetNodeId);
    if (!nodeData) return null;
    
    // 获取节点的高度
    const nodeHeight = nodeData.measured?.height || 100;
    
    // 将节点的 flow 坐标转换为屏幕坐标
    const nodeCenterScreen = flowToScreenPosition({
      x: nodeData.position.x,
      y: nodeData.position.y,
    });
    
    // 计算节点底部的屏幕位置
    const nodeBottomScreen = flowToScreenPosition({
      x: nodeData.position.x,
      y: nodeData.position.y + nodeHeight / 2,
    });
    
    // 面板与节点的间距
    const panelGap = 10 * viewport.zoom;
    
    // 面板固定显示在节点下方
    return {
      x: nodeCenterScreen.x,
      y: nodeBottomScreen.y + panelGap,
      position: 'below',                                                         // 固定在下方
      scale: viewport.zoom,
    };
  }, [propertyPanel, getNode, flowToScreenPosition, viewport]);

  // ==================== 获取节点信息 ====================

  /**
   * 获取当前面板对应的节点信息
   */
  const panelNodeInfo = useMemo(() => {
    if (!propertyPanel) return null;
    
    // 从 nodes 数组中找到目标节点
    const node = nodes.find(n => n.id === propertyPanel.targetNodeId);
    if (!node) return null;
    
    // 获取节点的注册表配置
    const nodeConfig = getNodeConfig(node.data.nodeKey);
    
    return {
      nodeId: node.id,
      nodeLabel: node.data.label,
      params: nodeConfig.params || {},
      paramValues: node.data.paramValues || {},
    };
  }, [propertyPanel, nodes]);

  // ==================== 打开面板 ====================

  /**
   * 打开属性面板
   * 只支持单个节点（多选时不显示属性面板）
   */
  const openPropertyPanel = useCallback((nodeId) => {
    setPropertyPanel({
      targetNodeId: nodeId,
    });
  }, []);

  // ==================== 关闭面板 ====================

  /**
   * 关闭属性面板
   */
  const closePropertyPanel = useCallback(() => {
    setPropertyPanel(null);
  }, []);

  // ==================== 参数变化处理 ====================

  /**
   * 处理参数值变化
   */
  const handleParamChange = useCallback((paramKey, newValue) => {
    if (!propertyPanel) return;
    
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === propertyPanel.targetNodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              paramValues: {
                ...node.data.paramValues,
                [paramKey]: newValue,
              },
            },
          };
        }
        return node;
      })
    );
    
    // 保存到历史记录
    if (saveToHistory) {
      saveToHistory();
    }
  }, [propertyPanel, setNodes, saveToHistory]);

  // ==================== 点击外部关闭 ====================

  /**
   * 监听全局点击，点击面板外部时关闭面板
   */
  useEffect(() => {
    if (!propertyPanel) return;
    
    const handleClickOutside = (event) => {
      const panelElement = document.querySelector(".property-panel");
      const isClickInside = panelElement && panelElement.contains(event.target);
      if (!isClickInside) closePropertyPanel();
    };
    
    // 延迟添加监听，避免打开面板的点击事件立即触发关闭
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside, true);
    }, 100);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [propertyPanel, closePropertyPanel]);

  // ==================== 返回 ====================

  return {
    propertyPanel,                                                               // 面板状态
    panelPosition,                                                               // 面板位置
    panelNodeInfo,                                                               // 节点信息
    openPropertyPanel,                                                           // 打开面板
    closePropertyPanel,                                                          // 关闭面板
    handleParamChange,                                                           // 参数变化处理
  };
};

export default usePropertyPanel;
