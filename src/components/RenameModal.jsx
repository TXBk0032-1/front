/**
 * RenameModal.jsx - 重命名弹窗
 * 
 * 用于修改节点名称的弹窗
 * 居中显示，带遮罩层
 * 
 * 单选模式：标题"节点重命名"，输入框显示当前名称
 * 多选模式：标题"批量节点重命名"，输入框为空，placeholder显示"多值"
 * 
 * 触发方式：
 * 1. 右键菜单点击"重命名"
 * 2. 双击节点
 */

import { useState, useEffect, useRef } from "react";                             // React hooks
import { Button, Input, Label, TextField } from "@heroui/react";                 // UI 组件
import "./RenameModal.css";                                                      // 样式


const RenameModal = ({ isOpen, onClose, currentName, isMultiple, onConfirm }) => {
  
  const [inputValue, setInputValue] = useState("");                              // 输入框的值
  const inputRef = useRef(null);                                                 // 输入框引用（用于聚焦）
  const prevIsOpenRef = useRef(false);                                           // 上一次的 isOpen 状态


  // ========== 弹窗打开时初始化 ==========

  useEffect(() => {
    const justOpened = isOpen && !prevIsOpenRef.current;                         // 判断是否刚打开
    prevIsOpenRef.current = isOpen;                                              // 更新上一次状态
    if (!justOpened) return;                                                     // 不是刚打开，不处理
    
    setTimeout(() => {                                                           // 延迟执行（等DOM渲染完）
      setInputValue(isMultiple ? "" : currentName);                              // 多选时为空，单选时为当前名称
      inputRef.current?.focus();                                                 // 聚焦输入框
      if (!isMultiple) inputRef.current?.select();                               // 单选时选中文字
    }, 50);
  }, [isOpen, currentName, isMultiple]);


  // ========== 确认重命名 ==========

  const handleConfirm = () => {
    const trimmedValue = inputValue.trim();                                      // 去除首尾空格
    if (!trimmedValue) { onClose(); return; }                                    // 为空则直接关闭
    if (!isMultiple && trimmedValue === currentName) { onClose(); return; }      // 单选模式下没变化则直接关闭
    onConfirm(trimmedValue);                                                     // 调用确认回调
    onClose();                                                                   // 关闭弹窗
  };


  // ========== 键盘事件 ==========

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleConfirm();                                      // 回车确认
    if (e.key === "Escape") onClose();                                           // ESC关闭
  };


  // ========== 点击遮罩关闭 ==========

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();                                 // 只有点击遮罩本身才关闭
  };


  // ========== 渲染 ==========

  if (!isOpen) return null;                                                      // 弹窗未打开，不渲染

  const title = isMultiple ? "批量节点重命名" : "节点重命名";                      // 标题
  const placeholder = isMultiple ? "多值" : currentName;                         // placeholder

  return (
    <div className="rename-modal-overlay" onClick={handleOverlayClick}>          {/* 遮罩层 */}
      <div className="rename-modal">                                             {/* 弹窗主体 */}
        
        {/* 标题 */}
        <div className="rename-modal-header">
          <h3 className="rename-modal-title">{title}</h3>
        </div>
        
        {/* 输入框 */}
        <div className="rename-modal-body">
          <TextField>
            <Label>节点名称</Label>
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}                    // 输入时更新值
              onKeyDown={handleKeyDown}                                          // 键盘事件
              placeholder={placeholder}
            />
          </TextField>
        </div>
        
        {/* 按钮 */}
        <div className="rename-modal-footer">
          <Button variant="flat" onPress={onClose}>取消</Button>                 {/* 取消按钮 */}
          <Button color="primary" onPress={handleConfirm}>确认</Button>          {/* 确认按钮 */}
        </div>
        
      </div>
    </div>
  );
};


export default RenameModal;
