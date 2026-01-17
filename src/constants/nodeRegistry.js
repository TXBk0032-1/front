/**
 * nodeRegistry.js - 节点注册表
 * 
 * 存储所有可用节点的配置信息
 * 实际项目中，这些数据应该从后端API获取
 */


// ========== 节点注册表数据 ==========
// 从node_registry.json里读取节点配置
import nodeRegistry from './node_registry.json';
export const NODE_REGISTRY = nodeRegistry;


// ========== 辅助函数 ==========

/** 根据节点ID获取节点配置 */
export const getNodeConfig = (nodeKey) => {
  return NODE_REGISTRY.nodes[nodeKey] || {};                                     // 取不到就返回空对象
};

/** 根据节点ID找到它属于哪个分类 */
export const findCategoryByNode = (nodeKey) => {
  const categories = NODE_REGISTRY.categories;                                   // 获取所有分类
  for (const catKey of Object.keys(categories)) {                                // 遍历分类
    if (categories[catKey].nodes.includes(nodeKey)) return catKey;               // 找到就返回分类ID
  }
  return null;                                                                   // 找不到返回 null
};

/** 根据节点ID获取它的主题色 */
export const getNodeColor = (nodeKey) => {
  const catKey = findCategoryByNode(nodeKey);                                    // 第1步：找到分类
  if (!catKey) return undefined;                                                 // 第2步：找不到分类就返回 undefined
  return NODE_REGISTRY.categories[catKey].color;                                 // 第3步：返回分类的颜色
};

/** 获取所有分类（用于渲染节点面板） */
export const getAllCategories = () => {
  return Object.entries(NODE_REGISTRY.categories);                               // 返回 [分类ID, 分类数据] 数组
};
