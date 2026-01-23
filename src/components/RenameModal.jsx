import { Button, TextField, Label, Input } from '@heroui/react';
import { useStore, setState } from '../store';
import { useRef } from 'react';
import { hideRenameModal } from '../utils/blueprint/renameModal';
import { renameNode } from '../utils/blueprint/renameNode';
import { getNodeNameById } from '../utils/data/getNodeNameById';

import '../styles/RenameModal.css';

export function RenameModal() {
  const renameModal = useStore(state => state.renameModal); // 从store中获取重命名弹窗状态
  const inputRef = useRef(null); // 创建ref引用输入框

  const handleCancel = () => {
    hideRenameModal(); // 隐藏弹窗
  };

  const handleConfirm = () => {
    const newName = inputRef.current.value; // 通过ref获取输入框的值
    renameNode(newName); // 调用重命名函数
    hideRenameModal(); // 隐藏弹窗
  };
  const onChange = (e) => {
    setState({ renameModal: { ...renameModal, value: e.target.value } }); // 更新重命名弹窗的值
  }

  if (!renameModal.visible) return null; // 如果弹窗不可见，不渲染

  return (
    <div className="rename-modal-overlay" onClick={handleCancel}>
      <div className="rename-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rename-modal-header">
          <h3 className="rename-modal-title">节点重命名</h3>
        </div>
        <div className="rename-modal-body">
          <TextField>
            <Label>节点名称</Label>
            <Input
              ref={inputRef} // 绑定ref到输入框
              value={renameModal.value} // 设置输入框的值为重命名弹窗的值
              placeholder={renameModal.placeholder} // 设置占位符为重命名弹窗的占位符
              onChange={onChange} // 绑定输入框的onChange事件到更新函数
            />
          </TextField>
        </div>
        <div className="rename-modal-footer">
          <Button className="btn-cancel" variant="tertiary" onClick={handleCancel}>取消</Button>
          <Button className="btn-confirm" color="primary" onClick={handleConfirm}>确认</Button>
        </div>
      </div>
    </div>
  );
}
export default RenameModal;