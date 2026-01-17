/**
 * nodeRegistry.js - 节点注册表
 *
 * 存储所有可用节点的配置信息
 * 支持从后端API动态获取数据
 */


// ========== 节点注册表数据 ==========
// 从node_registry.json里读取默认节点配置
import defaultNodeRegistry from './node_registry.json';

// 可动态更新的注册表（初始为默认值）
let NODE_REGISTRY = { ...defaultNodeRegistry };

/** 更新节点注册表 */
export const updateNodeRegistry = (newRegistry) => {
  if (newRegistry && newRegistry.categories && newRegistry.nodes) {
    // 清空原对象并复制新内容（保持对象引用不变）
    Object.keys(NODE_REGISTRY).forEach(key => delete NODE_REGISTRY[key]);
    Object.assign(NODE_REGISTRY, newRegistry);
    console.log("✅ 节点注册表已更新");
    console.log("   分类数量:", Object.keys(NODE_REGISTRY.categories).length);
    console.log("   节点数量:", Object.keys(NODE_REGISTRY.nodes).length);
    console.log("   节点列表:", Object.keys(NODE_REGISTRY.nodes));
    console.log("   完整数据:", JSON.stringify(NODE_REGISTRY, null, 2));
    return true;
  }
  console.warn("⚠️ 无效的节点注册表数据:", newRegistry);
  return false;
};

/** 获取当前注册表 */
export const getNodeRegistry = () => NODE_REGISTRY;

// 导出用于向后兼容
export { NODE_REGISTRY };


// ========== 辅助函数 ==========

/** 根据节点ID获取节点配置 */
export const getNodeConfig = (nodeKey, registry = null) => {
  const reg = registry || NODE_REGISTRY;
  const config = reg.nodes[nodeKey] || {};
  
  // 调试输出
  if (Object.keys(config).length === 0) {
    console.warn(`⚠️ getNodeConfig: 找不到节点配置 "${nodeKey}"`);
    console.log("   当前注册表节点:", Object.keys(reg.nodes || {}));
  }
  
  return config;
};

/** 根据节点ID找到它属于哪个分类 */
export const findCategoryByNode = (nodeKey, registry = null) => {
  const reg = registry || NODE_REGISTRY;
  const categories = reg.categories;                                             // 获取所有分类
  for (const catKey of Object.keys(categories)) {                                // 遍历分类
    if (categories[catKey].nodes.includes(nodeKey)) return catKey;               // 找到就返回分类ID
  }
  return null;                                                                   // 找不到返回 null
};

/** 根据节点ID获取它的主题色 */
export const getNodeColor = (nodeKey, registry = null) => {
  const reg = registry || NODE_REGISTRY;
  const catKey = findCategoryByNode(nodeKey, reg);                               // 第1步：找到分类
  if (!catKey) return undefined;                                                 // 第2步：找不到分类就返回 undefined
  return reg.categories[catKey].color;                                           // 第3步：返回分类的颜色
};

/** 获取所有分类（用于渲染节点面板） */
export const getAllCategories = (registry = null) => {
  const reg = registry || NODE_REGISTRY;
  return Object.entries(reg.categories);                                         // 返回 [分类ID, 分类数据] 数组
};
