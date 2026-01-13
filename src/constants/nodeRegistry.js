/**
 * 节点注册表 - 存储所有可用节点的配置信息
 * 
 * 这个文件模拟后端返回的节点列表数据
 * 实际项目中，这些数据应该从后端API获取
 */

export const NODE_REGISTRY = {
  // ========== 节点分类 ==========
  // 每个分类包含：显示名称、主题色、包含的节点ID列表
  categories: {
    node_group1: {
      label: "节点组1",
      color: "rgb(137, 146, 235)",
      nodes: ["node1", "node2"],
    },
    node_group2: {
      label: "节点组2",
      color: "rgb(242, 177, 144)",
      nodes: ["node3", "node4"],
    },
  },

  // ========== 节点配置 ==========
  // 每个节点包含：显示名称、输入端口、输出端口、参数配置
  nodes: {
    node1: {
      label: "节点1",
      inputs: [{ id: "in", label: "" }],
      outputs: [{ id: "out", label: "" }],
      params: {
        param1: { label: "参数1", type: "number", default: 1 },
        param2: { label: "参数2", type: "number", default: 2 },
      },
    },
    node2: {
      label: "节点2",
      inputs: [{ id: "in", label: "输入" }],
      outputs: [{ id: "out", label: "输出" }],
      params: {
        param1: { label: "参数1", type: "number", default: 1 },
        param2: { label: "参数2", type: "number", default: 2 },
      },
    },
    node3: {
      label: "节点3",
      inputs: [{ id: "in", label: "输入" }],
      outputs: [{ id: "out", label: "输出" }],
      params: {
        param1: { label: "参数1", type: "number", default: 1 },
        param2: { label: "参数2", type: "number", default: 2 },
      },
    },
    node4: {
      label: "节点4",
      inputs: [{ id: "in", label: "输入" }],
      outputs: [{ id: "out", label: "输出" }],
      params: {
        param1: { label: "参数1", type: "number", default: 1 },
        param2: { label: "参数2", type: "number", default: 2 },
      },
    },
  },
};

// ========== 辅助函数 ==========
// 把常用的查询逻辑封装成函数，避免到处重复写

/**
 * 根据节点ID获取节点配置
 * 就是从 nodes 对象里取对应的配置，取不到就返回空对象
 */
export const getNodeConfig = (nodeKey) => {
  return NODE_REGISTRY.nodes[nodeKey] || {};
};

/**
 * 根据节点ID找到它属于哪个分类
 * 遍历所有分类，看哪个分类的 nodes 数组包含这个节点ID
 */
export const findCategoryByNode = (nodeKey) => {
  const categories = NODE_REGISTRY.categories;
  
  for (const catKey of Object.keys(categories)) {
    if (categories[catKey].nodes.includes(nodeKey)) {
      return catKey;
    }
  }
  return null;
};

/**
 * 根据节点ID获取它的主题色
 * 先找到分类，再从分类里取颜色
 */
export const getNodeColor = (nodeKey) => {
  const catKey = findCategoryByNode(nodeKey);
  if (!catKey) return undefined;
  
  return NODE_REGISTRY.categories[catKey].color;
};

/**
 * 获取所有分类（用于渲染节点面板）
 * 返回 [分类ID, 分类数据] 的数组，方便遍历
 */
export const getAllCategories = () => {
  return Object.entries(NODE_REGISTRY.categories);
};
