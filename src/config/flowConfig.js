/**
 * flowConfig.js - React Flow 配置
 * 
 * 存放 React Flow 组件的各种配置
 * 把配置从主组件中抽离出来，让主组件更简洁
 */


// ==================== 连线样式 ====================

/**
 * 连线的默认样式
 */
export const defaultEdgeOptions = {
  style: {
    strokeWidth: 3,                                                              // 线条粗细
    stroke: "#fff",                                                              // 线条颜色（白色）
  },
};


// ==================== 交互配置 ====================

/**
 * 画布拖动配置
 * 数字含义：0=左键, 1=中键, 2=右键
 * 这里设置中键和右键移动画布，左键留给框选
 */
export const panOnDrag = [1, 2];

/**
 * 框选模式
 * "partial" - 碰到就选中
 * "full" - 完全框住才选中
 */
export const selectionMode = "partial";

/**
 * 删除键配置
 */
export const deleteKeyCode = "Delete";

/**
 * 节点原点配置
 * [0.5, 0.5] 表示节点原点在中心
 * 好处：拖拽创建节点时，节点会以鼠标位置为中心
 */
export const nodeOrigin = [0.5, 0.5];


// ==================== 外观配置 ====================

/**
 * 颜色模式
 * "light" - 浅色模式
 * "dark" - 深色模式
 */
export const colorMode = "light";


// ==================== 容器样式 ====================

/**
 * 应用容器样式
 * flex 布局，让节点面板和画布左右并列
 */
export const containerStyle = {
  display: "flex",                                                               // flex 布局
  flexDirection: "row",                                                          // 水平排列
  width: "100vw",                                                                // 宽度占满
  height: "100vh",                                                               // 高度占满
  background: "#e2e9faff",                                                       // 背景色
};
