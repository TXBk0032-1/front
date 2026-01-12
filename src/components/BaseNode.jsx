import { Handle, Position } from "@xyflow/react";

function BaseNode({ data }) {
  return (
    // 统一通过 styles 对象引用
    <div style={{ ...styles.container, background: data.color || styles.container.background }}>
      {/* 左侧：输入端口 */}
      <div style={styles.portContainer}>
        {data.inputs?.map((input, index) => (
          <div key={`input-${index}`} style={styles.portItem}>
            <Handle
              type="target"
              position={Position.Left}
              id={input.id}
              style={styles.handle}
            />
            <span style={styles.inputLabel}>{input.label}</span>
          </div>
        ))}
      </div>

      {/* 中间：标题 */}
      <div style={styles.titleContainer}>
        <div style={styles.title}>{data.label}</div>
      </div>

      {/* 右侧：输出端口 */}
      <div style={styles.portContainer}>
        {data.outputs?.map((output, index) => (
          <div key={`output-${index}`} style={styles.portItem}>
            <span style={styles.outputLabel}>{output.label}</span>
            <Handle
              type="source"
              position={Position.Right}
              id={output.id}
              style={styles.handle}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "rgb(137, 146, 235)",
    color: "white",
    padding: "10px",
    borderRadius: "10px",
    minWidth: "150px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  portContainer: {
    display: "flex",
    flexDirection: "column",
  },
  portItem: {
    position: "relative",
    marginBottom: "5px",
  },
  handle: {
    top: "50%",
    transform: "translateY(-50%)",
    background: "#ffffffff",
  },
  label: {
    fontSize: "12px",
  },
  inputLabel: {
    fontSize: "12px",
    marginLeft: "10px",
  },
  outputLabel: {
    fontSize: "12px",
    marginRight: "10px",
  },
  titleContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "0 10px",
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
  },
};

export default BaseNode;
