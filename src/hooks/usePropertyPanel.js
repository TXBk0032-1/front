/**
 * usePropertyPanel.js - 属性面板控制
 * 
 * 管理节点属性面板的显示和隐藏
 * 支持动态跟随：面板会跟随节点移动和画布缩放
 */

import { useState, useCallback, useEffect, useMemo } from "react";               // React hooks
import { useReactFlow, useViewport } from "@xyflow/react";                       // React Flow hooks
import { getNodeConfig } from "../constants/nodeRegistry";                       // 节点配置
import { calcPositionBelowNode } from "../utils/positionUtils";                  // 位置计算工具


const usePropertyPanel = (nodes, setNodes, saveToHistory) => {
  
  const [propertyPanel, setPropertyPanel] = useState(null);                      // 面板状态：null=关闭，否则={targetNodeId}
  const { getNode, flowToScreenPosition } = useReactFlow();                      // React Flow 工具函数
  const viewport = useViewport();                                                // 视口状态（包含缩放比例）


  // ========== 计算面板位置 ==========

  const panelPosition = useMemo(() => {
    if (!propertyPanel) return null;                                             // 第1步：面板没打开，返回null
    const nodeData = getNode(propertyPanel.targetNodeId);                        // 第2步：获取目标节点数据
    if (!nodeData) return null;                                                  // 第3步：节点不存在，返回null
    return calcPositionBelowNode(nodeData, flowToScreenPosition, viewport.zoom); // 第4步：计算位置（显示在节点下方）
  }, [propertyPanel, getNode, flowToScreenPosition, viewport]);


  // ========== 获取节点信息 ==========

  const panelNodeInfo = useMemo(() => {
    if (!propertyPanel) return null;                                             // 第1步：面板没打开，返回null
    const node = nodes.find(n => n.id === propertyPanel.targetNodeId);           // 第2步：从nodes数组中找到目标节点
    if (!node) return null;                                                      // 第3步：节点不存在，返回null
    const nodeConfig = getNodeConfig(node.data.nodeKey);                         // 第4步：获取节点的注册表配置
    return {                                                                     // 第5步：返回节点信息
      nodeId: node.id,                                                           // 节点ID
      nodeLabel: node.data.label,                                                // 节点名称
      params: nodeConfig.params || {},                                           // 参数配置
      paramValues: node.data.paramValues || {},                                  // 当前参数值
    };
  }, [propertyPanel, nodes]);


  // ========== 打开面板 ==========

  const openPropertyPanel = useCallback((nodeId) => {
    setPropertyPanel({ targetNodeId: nodeId });                                  // 设置面板状态
  }, []);


  // ========== 关闭面板 ==========

  const closePropertyPanel = useCallback(() => {
    setPropertyPanel(null);                                                      // 清空面板状态
  }, []);


  // ========== 参数变化处理 ==========

  const handleParamChange = useCallback((paramKey, newValue) => {
    if (!propertyPanel) return;                                                  // 第1步：面板没打开，不处理
    
    setNodes((nds) =>                                                            // 第2步：更新节点数据
      nds.map((node) => {
        if (node.id !== propertyPanel.targetNodeId) return node;                 // 不是目标节点，保持不变
        return {                                                                 // 是目标节点，更新参数值
          ...node,
          data: {
            ...node.data,
            paramValues: {
              ...node.data.paramValues,
              [paramKey]: newValue,                                              // 更新指定参数
            },
          },
        };
      })
    );
    
    if (saveToHistory) saveToHistory();                                          // 第3步：保存到历史记录
  }, [propertyPanel, setNodes, saveToHistory]);


  // ========== 点击外部关闭 ==========

  useEffect(() => {
    if (!propertyPanel) return;                                                  // 面板没打开就不监听
    
    const handleClickOutside = (event) => {                                      // 点击事件处理
      const panelElement = document.querySelector(".property-panel");            // 获取面板DOM元素
      const isClickInside = panelElement && panelElement.contains(event.target); // 判断是否点击在面板内部
      if (!isClickInside) closePropertyPanel();                                  // 点击外部则关闭面板
    };
    
    const timer = setTimeout(() => {                                             // 延迟添加监听（避免打开面板的点击事件立即触发关闭）
      document.addEventListener("mousedown", handleClickOutside, true);
    }, 100);
    
    return () => {                                                               // 清理函数
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [propertyPanel, closePropertyPanel]);


  // ========== 返回 ==========

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
