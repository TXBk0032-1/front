import { Button, TextField, Label, Input } from '@heroui/react';
import '../styles/RenameModal.css';
export function RenameModal() {
  return (
    <div className="rename-modal-overlay" >
      <div className="rename-modal">
        <div className="rename-modal-header">
          <h3 className="rename-modal-title">节点重命名</h3>
        </div>
        <div className="rename-modal-body">
          <TextField>
            <Label>节点名称</Label>
            <Input
            />
          </TextField>
        </div>
        <div className="rename-modal-footer">
          <Button className="btn-cancel" variant="tertiary">取消</Button>
          <Button className="btn-confirm" color="primary">确认</Button>
        </div>
      </div>
    </div>
  );
}
export default RenameModal;