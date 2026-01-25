/**
 * store.js - 全局状态存储
 * 
 * 用法说明：
 *   import { useStore, getState, setState } from './store'
 *   
 *   // 在组件中使用hook获取状态
 *   const nodes = useStore(s => s.nodes)
 *   
 *   // 在任意位置直接获取状态
 *   const currentNodes = getState().nodes
 *   
 *   // 在任意位置直接修改状态
 *   setState({ nodes: [...] })
 * 
 * 核心职责：
 *   存储全局数据，所有自定义命令均调节该数据实现自动更新
 *   所有组件绑定这个store，store被修改时组件自动更新渲染
 */

import { create } from "zustand"                              // 导入zustand状态管理库的create函数，用于创建全局状态
import { subscribeWithSelector } from "zustand/middleware"    // 导入订阅中间件，支持选择性订阅状态变化

export const useStore = create(                               // 创建全局状态store，导出useStore hook供组件使用
  subscribeWithSelector(() => ({                              // 使用subscribeWithSelector中间件包装，支持精确订阅

    // ========== 蓝图基础数据 ==========
    blueprintName: "我的架构",                                // 蓝图名称，顶部栏的架构重命名输入框默认内容
    nodes: [],                                                // 节点数组，存储所有节点数据
    edges: [],                                                // 连接线数组，存储所有连接线数据

    // ========== 选择状态 ==========
    selectedIds: [],                                          // 选中的节点id数组，支持多选
    selectedCategory: "all",                                  // 当前选中的分类，用于侧边栏节点列表过滤

    // ========== 视口状态 ==========
    viewport: { x: 0, y: 0, zoom: 1 },                        // 视口状态，x/y是平移偏移，zoom是缩放比例

    // ========== 悬浮组件状态 ==========
    nodeMenu: { visible: false, nodeId: null },               // 节点菜单状态，visible控制显示，nodeId绑定跟随的节点
    nodePanel: { visible: false, nodeId: null },              // 节点面板状态，visible控制显示，nodeId绑定跟随的节点
    renameModal: {                                            // 重命名弹窗状态
      visible: false,                                         // 是否显示弹窗
      nodeIds: [],                                            // 要重命名的节点id数组
      placeholder: "",                                        // 输入框占位符
      value: ""                                               // 输入框当前值
    },

    // ========== 历史记录 ==========
    history: [],                                              // 历史记录数组，存储每次操作的快照
    historyIndex: -1,                                         // 当前历史索引，-1表示没有历史

    // ========== 剪贴板 ==========
    clipboard: { nodes: [], edges: [] },                      // 剪贴板数据，存储复制的节点和连接线

    // ========== 节点注册表（后端提供）==========
    registry: { categories: {}, nodes: {} }                         // 节点定义注册表，从后端获取所有可用节点类型
  }))
)

export const getState = useStore.getState                     // 导出getState函数，用于在任意位置直接获取当前状态
export const setState = useStore.setState                     // 导出setState函数，用于在任意位置直接修改状态
