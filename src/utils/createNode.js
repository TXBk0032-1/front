/**
 * createNode.js - 创建节点的工具函数
 * 
 * 当需要在画布上添加新节点时，调用这里的函数
 * 
 * 使用场景：
 * 1. 从节点面板拖拽节点到画布
 * 2. 复制粘贴节点
 * 3. 初始化画布时创建默认节点
 */

import { getNodeConfig, getNodeColor } from "@/constants/nodeRegistry";         // 节点注册表工具函数


/**
 * 创建一个节点对象
 * 
 * @param {string} id - 节点的唯一标识（如 "node-1"）
 * @param {string} nodeKey - 节点在注册表中的类型（如 "node1"）
 * @param {Object} position - 节点位置 { x, y }
 * @returns {Object} React Flow 节点对象
 */
export const createNode = (id, nodeKey, position) => {
  const config = getNodeConfig(nodeKey);                                         // 第1步：从注册表获取节点配置
  const color = getNodeColor(nodeKey);                                           // 第2步：从注册表获取节点颜色

  return {                                                                       // 第3步：返回 React Flow 节点格式
    id,                                                                          // 节点ID
    type: config.type || "baseNode",                                             // 节点类型（默认 baseNode）
    position,                                                                    // 节点位置
    data: {                                                                      // 节点数据
      ...config,                                                                 // 展开配置（label、inputs、outputs 等）
      nodeKey,                                                                   // 保存节点类型（用于复制粘贴）
      color,                                                                     // 节点主题色
    },
  };
};


/**
 * 批量创建节点
 * 
 * @param {Array} nodeConfigs - 节点配置数组 [{ id, nodeKey, position }, ...]
 * @returns {Array} React Flow 节点数组
 */
export const createNodes = (nodeConfigs) => {
  return nodeConfigs.map(({ id, nodeKey, position }) =>                          // 遍历配置数组
    createNode(id, nodeKey, position)                                            // 创建每个节点
  );
};
