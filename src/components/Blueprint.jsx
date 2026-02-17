/**
 * Blueprint.jsx - 蓝图组件
 *
 * 布局结构：
 *   蓝图
 *     节点
 *       输入端口组
 *         端口
 *         端口名
 *       节点名称
 *       输出端口组
 *         端口名
 *         端口
 *     节点菜单
 *       复制并粘贴
 *       重命名
 *       删除节点
 *     节点面板
 *       属性
 *       根据节点列出所有参数
 *     工具栏
 *       撤销、反撤销、放大、缩放数值显示、缩小、整理
 *
 * 对象操作逻辑：
 *   蓝图
 *     当空白位置被鼠标单击
 *       如果没有按下Ctrl键
 *         清空节点选择
 *     当接收拖入时
 *       获取节点opcode
 *       创建节点
 *
 * 核心职责：
 *   展示节点和连接线，处理拖放创建节点，管理视口状态
 */

import { useMemo } from "react"; // 导入React的useMemo钩子
import { ReactFlow, Background, useReactFlow, applyNodeChanges, applyEdgeChanges } from "@xyflow/react"; // 导入ReactFlow相关组件
import "@xyflow/react/dist/style.css"; // 导入ReactFlow样式

import { useStore, setState } from "../store"; // 导入store相关函数
import { FLOW_CONFIG } from "../constants/config"; // 导入流程配置
import { createNode, clearSelect } from "../commands/Node"; // 导入节点命令
import { createEdge } from "../commands/Edge"; // 导入连接线命令
import { setViewport } from "../commands/Blueprint"; // 导入蓝图命令

import Node from "./Node"; // 导入节点组件
import ToolBar from "./ToolBar"; // 导入工具栏组件
import NodeMenu from "./NodeMenu"; // 导入节点菜单组件
import NodePanel from "./NodePanel"; // 导入节点面板组件

import "../styles/Blueprint.css"; // 导入蓝图样式

/**
 * handleNodesChange - 处理节点变化事件
 *
 * 当节点位置、选择状态等变化时触发
 * 选中状态直接存储在node.selected上，由ReactFlow管理
 *
 * @param {Array} changes - 变化数组
 */
function handleNodesChange(changes) {
	setState((state) => ({
		nodes: applyNodeChanges(changes, state.nodes) // 应用节点变化，选中状态由ReactFlow直接管理在node.selected上
	}));
}

/**
 * handleEdgesChange - 处理连接线变化事件
 *
 * 当连接线被删除等变化时触发
 *
 * @param {Array} changes - 变化数组
 */
function handleEdgesChange(changes) {
	setState((state) => ({
		// 更新store中的连接线数据
		edges: applyEdgeChanges(changes, state.edges), // 应用连接线变化
	}));
}

/**
 * handleConnect - 处理连接事件
 *
 * 当用户拖拽端口创建连接时触发
 *
 * @param {Object} connection - 连接信息对象
 */
function handleConnect(connection) {
	createEdge({
		// 调用创建连接线命令
		from: {
			// 起始端口信息
			nodeId: connection.source, // 起始节点ID
			portName: connection.sourceHandle, // 起始端口名
		},
		to: {
			// 目标端口信息
			nodeId: connection.target, // 目标节点ID
			portName: connection.targetHandle, // 目标端口名
		},
	});
}

/**
 * handleDragOver - 处理拖拽经过事件
 *
 * 允许放置操作
 *
 * @param {Event} e - 拖拽事件
 */
function handleDragOver(e) {
	e.preventDefault(); // 阻止默认行为，允许放置
	e.dataTransfer.dropEffect = "copy"; // 设置拖拽效果为复制
}

/**
 * handleContextMenu - 处理右键菜单事件
 *
 * 阻止浏览器默认右键菜单
 *
 * @param {Event} e - 右键菜单事件
 */
function handleContextMenu(e) {
	e.preventDefault(); // 阻止默认右键菜单
	e.stopPropagation(); // 阻止事件冒泡
}

/**
 * handlePaneClick - 处理蓝图空白区域点击事件
 *
 * 当空白位置被鼠标单击
 *   如果没有按下Ctrl键
 *     清空节点选择
 *
 * @param {Event} e - 点击事件
 */
function handlePaneClick(e) {
	if (!e.ctrlKey) {
		// 如果没有按下Ctrl键
		clearSelect(); // 清空节点选择
	}
	hideMenuAndPanel(); // 隐藏菜单和面板
}

/**
 * hideMenuAndPanel - 隐藏节点菜单和节点面板
 */
function hideMenuAndPanel() {
	setState({
		// 更新store状态
		nodeMenu: { visible: false, nodeId: null }, // 隐藏节点菜单
		nodePanel: { visible: false, nodeId: null }, // 隐藏节点面板
	});
}

/**
 * handleViewportChange - 处理视口变化事件
 *
 * 当视口平移或缩放时触发
 *
 * @param {Object} newViewport - 新的视口状态
 */
function handleViewportChange(newViewport) {
	setViewport(newViewport); // 调用命令更新视口状态
}

/**
 * Blueprint - 蓝图主组件
 *
 * 用法示例：
 *   <Blueprint />                                                 // 在App中使用
 */
function Blueprint() {
	const nodes = useStore((s) => s.nodes); // 从store获取节点数据
	const edges = useStore((s) => s.edges); // 从store获取连接线数据
	const viewport = useStore((s) => s.viewport); // 从store获取视口状态
	const nodeTypes = useMemo(() => ({ baseNode: Node }), []); // 定义节点类型映射，使用useMemo缓存

	const { screenToFlowPosition } = useReactFlow(); // 获取ReactFlow的坐标转换函数

	/**
	 * handleDrop - 处理拖放事件
	 *
	 * 当接收拖入时
	 *   获取节点opcode
	 *   创建节点
	 *
	 * @param {Event} e - 拖放事件
	 */
	const handleDrop = (e) => {
		// 处理拖放事件
		e.preventDefault(); // 阻止默认行为

		const opcode = e.dataTransfer.getData("opcode"); // 获取节点opcode
		if (!opcode) return; // 如果没有opcode，直接返回

		const position = screenToFlowPosition({
			// 将屏幕坐标转为画布坐标
			x: e.clientX, // 鼠标X坐标
			y: e.clientY, // 鼠标Y坐标
		});

		createNode(opcode, {
			// 创建节点
			x: position.x, // 节点X坐标
			y: position.y, // 节点Y坐标
		});
	};

	return (
		// 返回蓝图元素
		<ReactFlow /* ReactFlow容器 */
			nodes={nodes} /* 绑定节点数据，选中状态直接存储在node.selected上 */
			edges={edges} /* 绑定连接线数据 */
			onNodesChange={handleNodesChange} /* 绑定节点变化事件 */
			onEdgesChange={handleEdgesChange} /* 绑定连接线变化事件 */
			viewport={viewport} /* 绑定视口状态 */
			onViewportChange={handleViewportChange} /* 绑定视口变化事件 */
			onConnect={handleConnect} /* 绑定连接事件 */
			nodeTypes={nodeTypes} /* 节点类型映射 */
			onPaneClick={handlePaneClick} /* 绑定空白区域右键事件 */
			onContextMenu={handleContextMenu} /* 阻止默认右键菜单 */
			proOptions={{ hideAttribution: true }} /* 隐藏ReactFlow水印 */
			{...FLOW_CONFIG} /* 展开流程配置 */
			onDragOver={handleDragOver} /* 绑定拖拽经过事件 */
			onDrop={handleDrop} /* 绑定拖放事件 */
		>
			<ToolBar /> {/* 工具栏组件 */}
			<NodeMenu /> {/* 节点菜单组件 */}
			<NodePanel /> {/* 节点面板组件 */}
			<Background /> {/* 背景网格组件 */}
		</ReactFlow>
	);
}

export default Blueprint; // 导出蓝图组件
