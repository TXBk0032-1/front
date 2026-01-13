/**
 * RenameModal - 重命名弹窗组件
 * 
 * 用于修改节点名称的弹窗
 * 自定义实现，居中显示，带遮罩层
 * 
 * 触发方式：
 * 1. 右键菜单点击"重命名"
 * 2. 双击节点
 */

import { useState, useEffect, useRef } from "react";
import { Button, Input, Label, TextField } from "@heroui/react";
import "./RenameModal.css";

/**
 * RenameModal - 重命名弹窗
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - 弹窗是否打开
 * @param {Function} props.onClose - 关闭弹窗的回调
 * @param {string} props.currentName - 当前节点名称
 * @param {Function} props.onConfirm - 确认修改的回调，参数为新名称
 */
const RenameModal = ({ isOpen, onClose, currentName, onConfirm }) => {
  // 输入框的值
  const [inputValue, setInputValue] = useState("");
  
  // 输入框引用，用于自动聚焦
  const inputRef = useRef(null);
  
  // 记录上一次的 isOpen 状态，用于检测弹窗刚打开的时机
  const prevIsOpenRef = useRef(false);

  // 当弹窗刚打开时，重置输入框的值并聚焦
  useEffect(() => {
    // 检测弹窗从关闭变为打开
    if (isOpen && !prevIsOpenRef.current) {
      // 使用 setTimeout 来避免在 effect 中同步调用 setState
      setTimeout(() => {
        setInputValue(currentName);
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, currentName]);

  // 处理确认
  const handleConfirm = () => {
    // 如果名称没变或者为空，直接关闭
    if (!inputValue.trim() || inputValue === currentName) {
      onClose();
      return;
    }
    onConfirm(inputValue.trim());
    onClose();
  };

  // 处理键盘事件
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleConfirm();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  // 点击遮罩层关闭弹窗
  const handleOverlayClick = (e) => {
    // 只有点击遮罩层本身才关闭，点击弹窗内容不关闭
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 如果弹窗未打开，不渲染任何内容
  if (!isOpen) return null;

  return (
    <div className="rename-modal-overlay" onClick={handleOverlayClick}>
      <div className="rename-modal">
        <div className="rename-modal-header">
          <h3 className="rename-modal-title">重命名节点</h3>
        </div>
        
        <div className="rename-modal-body">
          <TextField>
            <Label>节点名称</Label>
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="请输入节点名称"
            />
          </TextField>
        </div>
        
        <div className="rename-modal-footer">
          <Button variant="flat" onPress={onClose}>
            取消
          </Button>
          <Button color="primary" onPress={handleConfirm}>
            确认
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RenameModal;
