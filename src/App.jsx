/**
 * App.jsx - 蓝图编辑器主入口
 * 
 * 这个文件是整个应用的"总控室"
 * 代码按照执行顺序从上到下排列，像流程图一样清晰
 */

// ========== 第一部分：导入依赖 ==========

import { useMemo, useRef, forwardRef, useImperativeHandle } from "react";        // React 基础 hooks
import { ReactFlow, useNodesState, useEdgesState, ReactFlowProvider } from "@xyflow/react";  // React Flow 核心
import "@xyflow/react/dist/style.css";                                           // React Flow 样式

import BaseNode from "./components/BaseNode";                                    // 自定义节点组件
import NodeBox from "./components/NodeBox";                                      // 左侧节点面板
import NodeContextMenu from "./components/NodeContextMenu";                      // 右键菜单
import PropertyPanel from "./components/PropertyPanel";                          // 属性面板
import RenameModal from "./components/RenameModal";                              // 重命名弹窗
import TopMenu from "./components/TopMenu";                                      // 顶部菜单栏

import useHistory from "./hooks/useHistory";                                     // 撤销/重做功能
import useClipboard from "./hooks/useClipboard";                                 // 复制/粘贴功能
import useKeyboardShortcuts from "./hooks/useKeyboardShortcuts";                 // 键盘快捷键
import useContextMenu from "./hooks/useContextMenu";                             // 右键菜单控制
import usePropertyPanel from "./hooks/usePropertyPanel";                         // 属性面板控制
import useRename from "./hooks/useRename";                                       // 重命名功能
import useNodeActions from "./hooks/useNodeActions";                             // 节点操作（复制、删除）
import useFlowEvents from "./hooks/useFlowEvents";                               // 画布事件处理
import getLayoutedElements from "./hooks/useGetLayoutedElements";                // 自动布局功能

import { createNode } from "./utils/createNode";                                 // 创建节点的工具函数
import { initialNodes, initialEdges, INITIAL_NODE_ID } from "./config/initialData";  // 初始数据
import { FLOW_CONFIG, APP_CONTAINER_STYLE, WORKSPACE_STYLE } from "./config/flowConfig";  // 画布配置


// ========== 第二部分：画布组件 ==========

const FlowCanvas = forwardRef(function FlowCanvas(props, ref) {
  
  // ---------- 步骤1：注册节点类型 ----------
  const nodeTypes = useMemo(() => ({ baseNode: BaseNode }), []);                 // 告诉ReactFlow我们有哪些自定义节点

  // ---------- 步骤2：初始化画布数据 ----------
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);          // 画布上的所有节点
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);          // 画布上的所有连线
  const nodeIdCounter = useRef(INITIAL_NODE_ID);                                 // 新节点的ID从这个数字开始

  // ---------- 暴露方法给父组件 ----------
  useImperativeHandle(ref, () => ({
    // 获取蓝图数据（用于导出）
    getBlueprint: () => ({
      nodes: nodes.map(n => ({ ...n, data: { ...n.data, onDoubleClick: undefined } })),  // 移除回调函数
      edges: edges,
      nodeIdCounter: nodeIdCounter.current,
    }),
    // 设置蓝图数据（用于导入）
    setBlueprint: (data) => {
      if (data.nodes) setNodes(data.nodes);
      if (data.edges) setEdges(data.edges);
      if (data.nodeIdCounter) nodeIdCounter.current = data.nodeIdCounter;
    },
    // 自动布局功能
    autoLayout: async () => {
      const elkOptions = {
        "elk.algorithm": "layered",
        "elk.layered.spacing.nodeNodeBetweenLayers": "100",
        "elk.spacing.nodeNode": "80",
        "elk.direction": "RIGHT",
      };
      const layouted = await getLayoutedElements(nodes, edges, elkOptions);
      if (layouted) {
        setNodes(layouted.nodes);
        setEdges(layouted.edges);
      }
    },
  }), [nodes, edges, setNodes, setEdges]);

  // ---------- 步骤3：初始化功能模块 ----------
  const history = useHistory(nodes, edges, setNodes, setEdges);                  // 历史记录（撤销/重做）
  const clipboard = useClipboard(nodes, setNodes, createNode, nodeIdCounter, history.saveToHistory);  // 剪贴板（复制/粘贴）
  const contextMenu = useContextMenu(nodes);                                     // 右键菜单
  const propertyPanel = usePropertyPanel(nodes, setNodes, history.saveToHistory);  // 属性面板
  const rename = useRename(nodes, setNodes, history.saveToHistory);              // 重命名
  const nodeActions = useNodeActions(nodes, setNodes, setEdges, nodeIdCounter, history.saveToHistory);  // 节点操作
  const flowEvents = useFlowEvents(setNodes, setEdges, onNodesChange, onEdgesChange, history.saveToHistory, history.isUndoingRef, nodeIdCounter);  // 画布事件

  // ---------- 步骤4：绑定键盘快捷键 ----------
  useKeyboardShortcuts({                                                         // 把快捷键绑定到对应功能
    undo: history.undo,                                                          // Ctrl+Z 撤销
    redo: history.redo,                                                          // Ctrl+Y 重做
    copy: clipboard.copy,                                                        // Ctrl+C 复制
    paste: clipboard.paste,                                                      // Ctrl+V 粘贴
  });

  // ---------- 步骤5：处理节点右键点击 ----------
  const handleNodeContextMenu = (event, node) => {
    contextMenu.openContextMenu(event, node);                                    // 打开右键菜单
    const isSingleSelect = checkIsSingleSelect(nodes, node);                     // 检查是否单选
    if (isSingleSelect) propertyPanel.openPropertyPanel(node.id);                // 单选时打开属性面板
    else propertyPanel.closePropertyPanel();                                     // 多选时关闭属性面板
  };

  // ---------- 步骤6：处理右键菜单的三个按钮 ----------
  const handleMenuCopyPaste = () => {                                            // 点击"复制粘贴"按钮
    if (!contextMenu.contextMenu) return;                                        // 菜单没打开就不执行
    nodeActions.duplicateNodes(contextMenu.contextMenu.nodeIds);                 // 复制选中的节点
    contextMenu.closeContextMenu();                                              // 关闭菜单
    propertyPanel.closePropertyPanel();                                          // 关闭属性面板
  };

  const handleMenuDelete = () => {                                               // 点击"删除"按钮
    if (!contextMenu.contextMenu) return;                                        // 菜单没打开就不执行
    nodeActions.deleteNodes(contextMenu.contextMenu.nodeIds);                    // 删除选中的节点
    contextMenu.closeContextMenu();                                              // 关闭菜单
    propertyPanel.closePropertyPanel();                                          // 关闭属性面板
  };

  const handleMenuRename = () => {                                               // 点击"重命名"按钮
    if (!contextMenu.contextMenu) return;                                        // 菜单没打开就不执行
    rename.openRenameModal(contextMenu.contextMenu.nodeIds);                     // 打开重命名弹窗
    contextMenu.closeContextMenu();                                              // 关闭菜单
    propertyPanel.closePropertyPanel();                                          // 关闭属性面板
  };

  // ---------- 步骤7：给节点注入双击回调 ----------
  const nodesWithCallbacks = useMemo(() => {                                     // 给每个节点添加双击事件
    return nodes.map((node) => ({                                                // 遍历所有节点
      ...node,                                                                   // 保留原有属性
      data: { ...node.data, onDoubleClick: rename.openRenameModal },             // 双击时打开重命名弹窗
    }));
  }, [nodes, rename.openRenameModal]);

  // ---------- 步骤8：渲染画布 ----------
  return (
    <>
      <ReactFlow
        nodes={nodesWithCallbacks}                                               // 节点数据
        edges={edges}                                                            // 连线数据
        nodeTypes={nodeTypes}                                                    // 自定义节点类型
        onNodesChange={flowEvents.handleNodesChange}                             // 节点变化回调
        onEdgesChange={flowEvents.handleEdgesChange}                             // 连线变化回调
        onConnect={flowEvents.handleConnect}                                     // 新建连线回调
        onDrop={flowEvents.handleDrop}                                           // 拖拽放置回调
        onDragOver={flowEvents.handleDragOver}                                   // 拖拽经过回调
        onMouseMove={clipboard.trackMousePosition}                               // 鼠标移动回调
        onNodeContextMenu={handleNodeContextMenu}                                // 节点右键回调
        onPaneContextMenu={contextMenu.handlePaneContextMenu}                    // 画布右键回调
        onPaneClick={contextMenu.handlePaneClick}                                // 画布点击回调
        onNodeClick={contextMenu.handleNodeClick}                                // 节点点击回调
        onReconnect={flowEvents.handleReconnect}                                 // 连线重连回调
        onReconnectStart={flowEvents.handleReconnectStart}                       // 开始重连回调
        onReconnectEnd={flowEvents.handleReconnectEnd}                           // 结束重连回调
        {...FLOW_CONFIG}                                                         // 展开所有配置项
      />

      {renderContextMenu(contextMenu, handleMenuCopyPaste, handleMenuDelete, handleMenuRename)}
      {renderPropertyPanel(propertyPanel)}
      {renderRenameModal(rename)}
    </>
  );
});


// ========== 第三部分：辅助函数（纯逻辑，无副作用） ==========

/** 检查是否为单选模式 */
function checkIsSingleSelect(nodes, clickedNode) {
  const selectedNodes = nodes.filter((n) => n.selected);                         // 获取所有选中的节点
  const isClickedNodeSelected = selectedNodes.some((n) => n.id === clickedNode.id);  // 点击的节点是否在选中列表里
  const isSingleNode = !isClickedNodeSelected || selectedNodes.length <= 1;      // 判断是否单选
  return isSingleNode;                                                           // 返回结果
}


// ========== 第四部分：渲染函数（纯UI，无逻辑） ==========

/** 渲染右键菜单 */
function renderContextMenu(contextMenu, onCopyPaste, onDelete, onRename) {
  const shouldShow = contextMenu.contextMenu && contextMenu.menuPosition;        // 判断是否应该显示
  if (!shouldShow) return null;                                                  // 不显示就返回null
  
  return (
    <NodeContextMenu
      x={contextMenu.menuPosition.x}                                             // X坐标
      y={contextMenu.menuPosition.y}                                             // Y坐标
      position={contextMenu.menuPosition.position}                               // 位置（上方/下方）
      scale={contextMenu.menuPosition.scale}                                     // 缩放比例
      onCopyPaste={onCopyPaste}                                                  // 复制粘贴回调
      onDelete={onDelete}                                                        // 删除回调
      onRename={onRename}                                                        // 重命名回调
      onClose={contextMenu.closeContextMenu}                                     // 关闭回调
    />
  );
}

/** 渲染属性面板 */
function renderPropertyPanel(propertyPanel) {
  const shouldShow = propertyPanel.propertyPanel && propertyPanel.panelPosition && propertyPanel.panelNodeInfo;  // 判断是否应该显示
  if (!shouldShow) return null;                                                  // 不显示就返回null
  
  return (
    <PropertyPanel
      x={propertyPanel.panelPosition.x}                                          // X坐标
      y={propertyPanel.panelPosition.y}                                          // Y坐标
      position={propertyPanel.panelPosition.position}                            // 位置（上方/下方）
      scale={propertyPanel.panelPosition.scale}                                  // 缩放比例
      nodeLabel={propertyPanel.panelNodeInfo.nodeLabel}                          // 节点名称
      params={propertyPanel.panelNodeInfo.params}                                // 参数配置
      paramValues={propertyPanel.panelNodeInfo.paramValues}                      // 当前参数值
      onParamChange={propertyPanel.handleParamChange}                            // 参数变化回调
    />
  );
}

/** 渲染重命名弹窗 */
function renderRenameModal(rename) {
  return (
    <RenameModal
      isOpen={rename.isRenameOpen}                                               // 是否打开
      onClose={rename.closeRenameModal}                                          // 关闭回调
      currentName={rename.renameTarget?.currentName || ""}                       // 当前名称
      isMultiple={rename.isMultiple}                                             // 是否多选
      onConfirm={rename.confirmRename}                                           // 确认回调
    />
  );
}


// ========== 第五部分：应用入口 ==========

function App() {
  const flowCanvasRef = useRef(null);                                            // 画布组件的引用

  // ---------- 导出蓝图功能 ----------
  const handleExport = () => {
    if (!flowCanvasRef.current) return;
    
    const blueprint = flowCanvasRef.current.getBlueprint();                      // 获取蓝图数据
    const jsonString = JSON.stringify(blueprint, null, 2);                       // 转为 JSON 字符串
    const blob = new Blob([jsonString], { type: "application/json" });           // 创建 Blob
    const url = URL.createObjectURL(blob);                                       // 生成下载链接
    
    const a = document.createElement("a");                                       // 创建下载链接
    a.href = url;
    a.download = `blueprint-${Date.now()}.json`;                                 // 文件名带时间戳
    a.click();                                                                   // 触发下载
    URL.revokeObjectURL(url);                                                    // 释放链接
  };

  // ---------- 导入蓝图功能 ----------
  const handleImport = (data) => {
    if (!flowCanvasRef.current) return;
    if (!data.nodes || !data.edges) {
      alert("导入失败：蓝图数据格式不正确");
      return;
    }
    flowCanvasRef.current.setBlueprint(data);                                    // 设置蓝图数据
  };

  // ---------- 自动布局功能 ----------
  const handleAutoLayout = () => {
    if (!flowCanvasRef.current) return;
    flowCanvasRef.current.autoLayout();                                          // 调用自动布局
  };

  return (
    <div style={APP_CONTAINER_STYLE}>                                            {/* 最外层：垂直布局 */}
      <TopMenu onExport={handleExport} onImport={handleImport} onAutoLayout={handleAutoLayout} />  {/* 顶部菜单栏 */}
      <div style={WORKSPACE_STYLE}>                                              {/* 工作区：水平布局 */}
        <NodeBox />                                                              {/* 左侧节点面板 */}
        <div style={{ flex: 1, height: "100%" }}>                                {/* 右侧画布容器 */}
          <ReactFlowProvider>                                                    {/* ReactFlow上下文 */}
            <FlowCanvas ref={flowCanvasRef} />                                   {/* 画布组件（带引用） */}
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  );
}

export default App;
