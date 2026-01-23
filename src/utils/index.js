// 导入节点菜单和节点面板的显示和隐藏，统一用一个函数来调用
import { showNodeMenu, hideNodeMenu, bindNodeMenuToNode } from "./blueprint/nodeMenu";
import { showNodePanel, hideNodePanel, bindNodePanelToNode } from "./blueprint/nodePanel";
export function bindNodeMenuAndPanelToNode(nodeId) {
  bindNodeMenuToNode(nodeId);
  bindNodePanelToNode(nodeId);
}
export function showNodeMenuAndPanel(nodeId) {
  showNodeMenu();
  showNodePanel();
}
export function hideNodeMenuAndPanel() {
  bindNodeMenuToNode();
  bindNodePanelToNode();
}
