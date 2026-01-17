/**
 * initialData.js - 初始数据配置
 * 
 * 存放画布的初始状态：默认显示的节点和连线
 * 
 * 为什么单独放一个文件？
 * 1. 初始数据可能很长，放主组件里影响阅读
 * 2. 方便修改初始状态（比如演示不同场景）
 * 3. 以后可能从后端加载，这里可以改成 API 调用
 */

// import { createNode } from "../utils/createNode";                                // 创建节点的工具函数


// ========== 初始节点 ==========

/** 画布上默认显示的节点（演示用，横向排列4个节点） */
export const initialNodes = [
  // createNode("node-1", "node1", { x: 100, y: 100 }),                              // 第1个节点
  // createNode("node-2", "node2", { x: 350, y: 100 }),                              // 第2个节点
  // createNode("node-3", "node3", { x: 600, y: 100 }),                              // 第3个节点
  // createNode("node-4", "node4", { x: 850, y: 100 }),                              // 第4个节点
];


// ========== 初始连线 ==========

/** 把上面4个节点串联起来，形成数据流：node1 -> node2 -> node3 -> node4 */
export const initialEdges = [
  // { id: "e1-2", source: "node-1", sourceHandle: "out", target: "node-2", targetHandle: "in" },  // 1 -> 2
  // { id: "e2-3", source: "node-2", sourceHandle: "out", target: "node-3", targetHandle: "in" },  // 2 -> 3
  // { id: "e3-4", source: "node-3", sourceHandle: "out", target: "node-4", targetHandle: "in" },  // 3 -> 4
];


// ========== 节点ID计数器初始值 ==========

/** 因为初始节点用了 node-1 到 node-4，所以新节点从 node-5 开始编号 */
export const INITIAL_NODE_ID = 5;
