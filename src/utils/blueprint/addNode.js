import { useStore } from "../../store"; // setState 通常是 useStore 的属性
import { generateId } from "../data/generateId";

export function addNode(nodeOpcode, position, customProps = {}) {
    const { registry } = useStore.getState(); // 这一步躲不掉，因为要拿模板
    const nodeTemplate = registry.nodes[nodeOpcode];

    if (!nodeTemplate) return;

    const newNode = { ...nodeTemplate, type: 'baseNode', id: generateId(), ...position, ...customProps };

    // 直接在回调里拿最新的 nodes 数组
    useStore.setState((state) => ({
        nodes: [...state.nodes, newNode]
    }));
    console.log(`添加节点：${newNode.id}`);

    return newNode;
}

