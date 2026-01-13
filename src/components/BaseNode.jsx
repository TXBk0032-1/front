import { Handle, Position } from "@xyflow/react";
import "./BaseNode.css";
const PortHandle = ({ type, position, id, label }) => (
  <div className="port-item">
    {type === 'target' && (
      <>
        <Handle type={type} position={position} id={id} className="handle" />
        <span className="input-label">{label}</span>
      </>
    )}
    {type === 'source' && (
      <>
        <span className="output-label">{label}</span>
        <Handle type={type} position={position} id={id} className="handle" />
      </>
    )}
  </div>
);

const BaseNode = ({ data: { color = "rgb(137, 146, 235)", label, inputs = [], outputs = [] } }) => (
  <div className="container" style={{ background: color }}>
    <div className="port-container">
      {inputs.map(({ id, label }, i) => (
        <PortHandle key={`input-${i}`} type="target" position={Position.Left} id={id} label={label} />
      ))}
    </div>
    <div className="title-container">
      <div className="title">{label}</div>
    </div>
    <div className="port-container">
      {outputs.map(({ id, label }, i) => (
        <PortHandle key={`output-${i}`} type="source" position={Position.Right} id={id} label={label} />
      ))}
    </div>
  </div>
);


export default BaseNode;
