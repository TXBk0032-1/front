export const FLOW_CONFIG = {

    // ----- 拖拽配置 -----
    panOnDrag: [1, 2],                                                             // 中键和右键拖拽画布，左键留给框选

    // ----- 框选配置 -----
    selectionOnDrag: true,                                                         // 启用拖拽框选
    selectionMode: "partial",                                                      // 碰到就选中（另一个选项是 "full" 完全框住才选中）

    // ----- 删除配置 -----
    deleteKeyCode: "Delete",                                                       // 按 Delete 键删除选中的节点

    // ----- 节点原点配置 -----
    nodeOrigin: [0.5, 0.5],                                                        // 节点原点在中心（拖拽创建时鼠标在节点中心）

    // ----- 外观配置 -----
    colorMode: "light",                                                            // 浅色模式
    fitView: true,                                                                 // 自动适应视图

    // ----- 连线样式 -----
    defaultEdgeOptions: {                                                          // 连线的默认样式
        style: {
            strokeWidth: 3,                                                            // 线条粗细
            stroke: "#fff",                                                            // 线条颜色（白色）
        },
    },
    connectionLineStyle: {                                                         // 拖拽连线时的样式
        strokeWidth: 3,                                                              // 线条粗细
        stroke: "#fff",                                                              // 线条颜色（白色）
    },
};