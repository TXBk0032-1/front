/**
 * createNode.js - 创建节点的函数
 * 
 * 这个文件提供创建节点对象的函数
 * 当你需要在画布上添加一个新节点时，就调用这里的函数
 * 
 * 使用场景：
 * 1. 从节点面板拖拽节点到画布
 * 2. 复制粘贴节点
 * 3. 初始化画布时创建默认节点
 */

import { getNodeConfig, getNodeColor } from "../constants/nodeRegistry";

/**
 * 创建一个节点对象
 * 
 * 这个函数做三件事：
 * 1. 从注册表获取节点的配置信息（标签、端口等）
 * 2. 从注册表获取节点的主题色（从所属分类继承）
 * 3. 把这些信息组装成 React Flow 需要的节点格式
 * 
 * @param {string} id - 节点的唯一标识（如 "node-1"）
 * @param {string} nodeKey - 节点在注册表中的类型（如 "node1"）
 * @param {Object} position - 节点位置 { x, y }
 * @returns {Object} React Flow 节点对象
 * 
 * @example
 * // 创建一个 node1 类型的节点，放在坐标 (100, 100) 的位置
 * const node = createNode("node-1", "node1", { x: 100, y: 100 });
 */
export const createNode = (id, nodeKey, position) => {
  // 从注册表获取节点配置
  const config = getNodeConfig(nodeKey);

  // 从注册表获取节点颜色（根据所属分类）
  const color = getNodeColor(nodeKey);

  // 组装成 React Flow 需要的格式
  return {
    id,
    type: config.type || "baseNode", // 默认使用 baseNode 类型
    position,
    data: {
      ...config,        // 展开配置（label、inputs、outputs、params 等）
      nodeKey,          // 保存节点类型，用于复制粘贴时识别
      color,            // 节点主题色
    },
  };
};

/**
 * 批量创建节点
 * 
 * 一次性创建多个节点，比如初始化画布时用
 * 
 * @param {Array} nodeConfigs - 节点配置数组
 * @returns {Array} React Flow 节点数组
 * 
 * @example
 * const nodes = createNodes([
 *   { id: "node-1", nodeKey: "node1", position: { x: 100, y: 100 } },
 *   { id: "node-2", nodeKey: "node2", position: { x: 300, y: 100 } },
 * ]);
 */
export const createNodes = (nodeConfigs) => {
  return nodeConfigs.map(({ id, nodeKey, position }) => 
    createNode(id, nodeKey, position)
  );
};
