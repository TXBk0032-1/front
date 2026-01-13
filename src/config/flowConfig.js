/**
 * flowConfig.js - React Flow 配置常量
 * 
 * 这个文件存放 React Flow 组件的各种配置
 * 把配置从主组件中抽离出来，让主组件更简洁
 * 
 * 好处：
 * 1. 配置集中管理，方便查找和修改
 * 2. 可以根据不同场景切换配置（比如只读模式、编辑模式）
 * 3. 配置可以复用（比如多个画布共用同一套配置）
 */

// ========== 连线样式 ==========

/**
 * 连线的默认样式
 * 所有新创建的连线都会应用这个样式
 */
export const defaultEdgeOptions = {
  style: { 
    strokeWidth: 3,    // 线条粗细
    stroke: "#fff",    // 线条颜色（白色）
  },
};

// ========== 交互配置 ==========

/**
 * 画布拖动配置
 * 
 * panOnDrag 指定哪些鼠标按键用于移动画布
 * 数字含义：0=左键, 1=中键, 2=右键
 * 
 * 这里设置中键和右键移动画布
 * 左键留给框选功能
 */
export const panOnDrag = [1, 2];

/**
 * 框选模式
 * 
 * "partial" - 只要框选框碰到节点就算选中
 * "full" - 必须完全框住节点才算选中
 */
export const selectionMode = "partial";

/**
 * 删除键配置
 * 
 * React Flow 内置支持按键删除
 * 这里设置为 Delete 键
 */
export const deleteKeyCode = "Delete";

/**
 * 节点原点配置
 * 
 * [0.5, 0.5] 表示节点的原点在中心
 * 默认是 [0, 0]，即左上角
 * 
 * 设置为中心的好处：
 * - 拖拽创建节点时，节点会以鼠标位置为中心
 * - 不需要手动计算偏移量来让节点居中
 */
export const nodeOrigin = [0.5, 0.5];

// ========== 外观配置 ==========

/**
 * 颜色模式
 * 
 * "light" - 浅色模式
 * "dark" - 深色模式
 */
export const colorMode = "light";

// ========== 容器样式 ==========

/**
 * 应用容器的样式
 * 撑满整个屏幕
 */
export const containerStyle = {
  width: "100vw",
  height: "100vh",
  background: "#e2e9faff",
};
