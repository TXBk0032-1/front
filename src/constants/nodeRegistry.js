export const NODE_REGISTRY = {
  // 按分类组织
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
    // ...
  },
  // 节点配置映射
  nodes: {
    node1: {
      label: "节点1",
      inputs: [{ id: "in", label: "输入" }],
      outputs: [{ id: "out", label: "输出" }],
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
    // ...
  },
};
