/**
 * App.jsx - 蓝图编辑器主入口
 *
 * 这个文件是整个应用的"总控室"，负责：
 * 1. 初始化各个功能模块
 * 2. 把模块连接到画布事件上
 * 3. 渲染界面
 */

import { useMemo, useRef } from "react";                                         // React 基础 hooks
import { ReactFlow, useNodesState, useEdgesState, ReactFlowProvider } from "@xyflow/react";  // React Flow 核心
import "@xyflow/react/dist/style.css";                                           // React Flow 样式

import BaseNode from "./components/BaseNode";                                    // 自定义节点组件
import NodeBox from "./components/NodeBox";                                      // 左侧节点面板
import NodeContextMenu from "./components/NodeContextMenu";                      // 右键菜单
import PropertyPanel from "./components/PropertyPanel";                          // 属性面板
import RenameModal from "./components/RenameModal";                              // 重命名弹窗

import useHistory from "./hooks/useHistory";                                     // 撤销/重做功能
import useClipboard from "./hooks/useClipboard";                                 // 复制/粘贴功能
import useKeyboardShortcuts from "./hooks/useKeyboardShortcuts";                 // 键盘快捷键
import useContextMenu from "./hooks/useContextMenu";                             // 右键菜单控制
import usePropertyPanel from "./hooks/usePropertyPanel";                         // 属性面板控制
import useRename from "./hooks/useRename";                                       // 重命名功能
import useNodeActions from "./hooks/useNodeActions";                             // 节点操作（复制、删除）
import useFlowEvents from "./hooks/useFlowEvents";                               // 画布事件处理

import { createNode } from "./utils/createNode";                                 // 创建节点的工具函数
import { initialNodes, initialEdges, INITIAL_NODE_ID } from "./config/initialData";  // 初始数据
import * as flowConfig from "./config/flowConfig";                               // 画布配置


/**
 * FlowCanvas - 画布组件
 * 
 * 这是核心组件，但它只做"组装"工作：
 * 把各个功能模块初始化好，然后绑定到画布的事件上
 */
function FlowCanvas() {

  // ==================== 第一步：准备基础数据 ====================

  const nodeTypes = useMemo(() => ({ baseNode: BaseNode }), []);                 // 注册自定义节点类型
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);          // 节点状态：当前画布上的所有节点
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);          // 连线状态：当前画布上的所有连线
  const nodeIdCounter = useRef(INITIAL_NODE_ID);                                 // 节点ID计数器：用于生成唯一ID

  // ==================== 第二步：初始化功能模块 ====================

  const history = useHistory(nodes, edges, setNodes, setEdges);                  // 历史记录模块：管理撤销/重做
  const clipboard = useClipboard(nodes, setNodes, createNode, nodeIdCounter, history.saveToHistory);  // 剪贴板模块：管理复制/粘贴
  const contextMenu = useContextMenu(nodes);                                     // 右键菜单模块：管理菜单显示/隐藏
  const propertyPanel = usePropertyPanel(nodes, setNodes, history.saveToHistory);  // 属性面板模块：管理属性编辑
  const rename = useRename(nodes, setNodes, history.saveToHistory);              // 重命名模块：管理重命名弹窗
  const nodeActions = useNodeActions(nodes, setNodes, setEdges, nodeIdCounter, history.saveToHistory);  // 节点操作模块：复制、删除
  const flowEvents = useFlowEvents(setNodes, setEdges, onNodesChange, onEdgesChange, history.saveToHistory, history.isUndoingRef, nodeIdCounter);  // 画布事件模块

  // ==================== 第三步：注册键盘快捷键 ====================

  useKeyboardShortcuts({                                                         // 绑定快捷键到对应功能
    undo: history.undo,                                                          // Ctrl+Z -> 撤销
    redo: history.redo,                                                          // Ctrl+Y -> 重做
    copy: clipboard.copy,                                                        // Ctrl+C -> 复制
    paste: clipboard.paste,                                                      // Ctrl+V -> 粘贴
  });

  // ==================== 第四步：定义节点右键事件处理 ====================

  /**
   * 节点右键事件处理
   * 同时打开右键菜单和属性面板（仅单选时显示属性面板）
   */
  const handleNodeContextMenu = (event, node) => {
    contextMenu.openContextMenu(event, node);                                    // 打开右键菜单
    
    // 判断是否为单选（只有单选时才显示属性面板）
    const selectedNodes = nodes.filter((n) => n.selected);
    const isClickedNodeSelected = selectedNodes.some((n) => n.id === node.id);
    const isSingleNode = !isClickedNodeSelected || selectedNodes.length <= 1;
    
    if (isSingleNode) {
      propertyPanel.openPropertyPanel(node.id);                                  // 打开属性面板
    } else {
      propertyPanel.closePropertyPanel();                                        // 多选时关闭属性面板
    }
  };

  // ==================== 第五步：定义右键菜单的操作 ====================

  const handleMenuCopyPaste = () => {                                            // 菜单点击"复制并粘贴"
    if (!contextMenu.contextMenu) return;                                        // 如果菜单没打开，不执行
    nodeActions.duplicateNodes(contextMenu.contextMenu.nodeIds);                 // 复制选中的节点
    contextMenu.closeContextMenu();                                              // 关闭菜单
    propertyPanel.closePropertyPanel();                                          // 关闭属性面板
  };

  const handleMenuDelete = () => {                                               // 菜单点击"删除"
    if (!contextMenu.contextMenu) return;                                        // 如果菜单没打开，不执行
    nodeActions.deleteNodes(contextMenu.contextMenu.nodeIds);                    // 删除选中的节点
    contextMenu.closeContextMenu();                                              // 关闭菜单
    propertyPanel.closePropertyPanel();                                          // 关闭属性面板
  };

  const handleMenuRename = () => {                                               // 菜单点击"重命名"
    if (!contextMenu.contextMenu) return;                                        // 如果菜单没打开，不执行
    rename.openRenameModal(contextMenu.contextMenu.nodeIds);                     // 打开重命名弹窗（支持多节点）
    contextMenu.closeContextMenu();                                              // 关闭菜单
    propertyPanel.closePropertyPanel();                                          // 关闭属性面板
  };

  // ==================== 第五步：给节点注入双击回调 ====================

  const nodesWithCallbacks = useMemo(() => {                                     // 给每个节点添加双击回调
    return nodes.map((node) => ({                                                // 遍历所有节点
      ...node,                                                                   // 保留原有属性
      data: { ...node.data, onDoubleClick: rename.openRenameModal },             // 注入双击回调：打开重命名弹窗
    }));
  }, [nodes, rename.openRenameModal]);

  // ==================== 第六步：渲染界面 ====================

  return (
    <>
      {/* 画布主体 */}
      <ReactFlow
        nodes={nodesWithCallbacks}                                               // 节点数据
        edges={edges}                                                            // 连线数据
        nodeTypes={nodeTypes}                                                    // 自定义节点类型
        onNodesChange={flowEvents.handleNodesChange}                             // 节点变化时的回调
        onEdgesChange={flowEvents.handleEdgesChange}                             // 连线变化时的回调
        onConnect={flowEvents.handleConnect}                                     // 新建连线时的回调
        onDrop={flowEvents.handleDrop}                                           // 拖拽放置时的回调
        onDragOver={flowEvents.handleDragOver}                                   // 拖拽经过时的回调
        onMouseMove={clipboard.trackMousePosition}                               // 鼠标移动时记录位置（用于粘贴定位）
        onNodeContextMenu={handleNodeContextMenu}                                // 节点右键时的回调
        onPaneContextMenu={contextMenu.handlePaneContextMenu}                    // 画布空白处右键时的回调
        onPaneClick={contextMenu.handlePaneClick}                                // 画布空白处点击时的回调
        onNodeClick={contextMenu.handleNodeClick}                                // 节点点击时的回调
        onReconnect={flowEvents.handleReconnect}                                 // 连线重连时的回调
        onReconnectStart={flowEvents.handleReconnectStart}                       // 开始重连时的回调
        onReconnectEnd={flowEvents.handleReconnectEnd}                           // 结束重连时的回调
        panOnDrag={flowConfig.panOnDrag}                                         // 拖拽画布的鼠标按键配置
        selectionOnDrag                                                          // 启用拖拽框选
        selectionMode={flowConfig.selectionMode}                                 // 框选模式配置
        deleteKeyCode={flowConfig.deleteKeyCode}                                 // 删除键配置
        nodeOrigin={flowConfig.nodeOrigin}                                       // 节点原点配置
        colorMode={flowConfig.colorMode}                                         // 颜色模式配置
        fitView                                                                  // 自动适应视图
        defaultEdgeOptions={flowConfig.defaultEdgeOptions}                       // 连线默认样式
        connectionLineStyle={flowConfig.defaultEdgeOptions.style}                // 拖拽连线时的样式
      />

      {/* 右键菜单 */}
      {contextMenu.contextMenu && contextMenu.menuPosition && (                  // 如果菜单打开了且位置有效
        <NodeContextMenu
          x={contextMenu.menuPosition.x}                                         // 菜单X坐标（动态计算）
          y={contextMenu.menuPosition.y}                                         // 菜单Y坐标（动态计算）
          position={contextMenu.menuPosition.position}                           // 菜单位置：'above' 或 'below'
          scale={contextMenu.menuPosition.scale}                                 // 缩放比例
          onCopyPaste={handleMenuCopyPaste}                                      // 复制并粘贴的回调
          onDelete={handleMenuDelete}                                            // 删除的回调
          onRename={handleMenuRename}                                            // 重命名的回调
          onClose={contextMenu.closeContextMenu}                                 // 关闭菜单的回调
        />
      )}

      {/* 属性面板 */}
      {propertyPanel.propertyPanel && propertyPanel.panelPosition && propertyPanel.panelNodeInfo && (
        <PropertyPanel
          x={propertyPanel.panelPosition.x}                                      // 面板X坐标（动态计算）
          y={propertyPanel.panelPosition.y}                                      // 面板Y坐标（动态计算）
          position={propertyPanel.panelPosition.position}                        // 面板位置：'above' 或 'below'
          scale={propertyPanel.panelPosition.scale}                              // 缩放比例
          nodeLabel={propertyPanel.panelNodeInfo.nodeLabel}                      // 节点名称
          params={propertyPanel.panelNodeInfo.params}                            // 参数配置
          paramValues={propertyPanel.panelNodeInfo.paramValues}                  // 当前参数值
          onParamChange={propertyPanel.handleParamChange}                        // 参数变化回调
        />
      )}

      {/* 重命名弹窗 */}
      <RenameModal
        isOpen={rename.isRenameOpen}                                             // 弹窗是否打开
        onClose={rename.closeRenameModal}                                        // 关闭弹窗的回调
        currentName={rename.renameTarget?.currentName || ""}                     // 当前节点名称
        isMultiple={rename.isMultiple}                                           // 是否多选模式
        onConfirm={rename.confirmRename}                                         // 确认重命名的回调
      />
    </>
  );
}


/**
 * App - 应用入口
 * 
 * 布局结构：左边节点面板 + 右边画布
 */
function App() {
  return (
    <div style={flowConfig.containerStyle}>                                      {/* 整体容器：flex布局 */}
      <NodeBox />                                                                {/* 左侧：节点面板 */}
      <div style={{ flex: 1, height: "100%" }}>                                  {/* 右侧：画布容器 */}
        <ReactFlowProvider>                                                      {/* React Flow 上下文提供者 */}
          <FlowCanvas />                                                         {/* 画布组件 */}
        </ReactFlowProvider>
      </div>
    </div>
  );
}

export default App;
