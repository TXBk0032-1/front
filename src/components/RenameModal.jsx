/**
 * RenameModal.jsx - 重命名弹窗组件
 * 
 * 用法说明：
 *   在App组件中渲染，当双击节点或点击节点菜单重命名时显示
 *   <RenameModal />
 * 
 * 组件职责：
 *   1. 显示重命名输入弹窗
 *   2. 接收用户输入的新名称
 *   3. 确认后调用重命名命令更新节点名称
 * 
 * 触发时机：
 *   - 双击节点时（开发目标.txt第61-62行：双击节点重命名节点）
 *   - 右键菜单点击重命名时（开发目标.txt第30行：重命名）
 */

import { useRef } from "react"                                    // 导入React的useRef hook
import { Button, TextField, Label, Input } from "@heroui/react"   // 导入HeroUI组件
import { useStore, setState } from "../store"                     // 导入store的hook和状态设置函数
import "../styles/RenameModal.css"                                // 导入重命名弹窗样式

// ========== 隐藏弹窗函数 ==========

/**
 * hideModal - 隐藏重命名弹窗
 * 
 * 用法示例：
 *   hideModal()
 */
const hideModal = () => {                                         // 隐藏重命名弹窗的函数
  setState({                                                      // 设置弹窗状态
    renameModal: {                                                // 重命名弹窗状态对象
      visible: false,                                             // 设置为不可见
      nodeIds: [],                                                // 清空节点id数组
      placeholder: "",                                            // 清空占位符
      value: ""                                                   // 清空输入值
    }
  })
}

// ========== 重命名弹窗主组件 ==========

/**
 * RenameModal - 重命名弹窗组件
 * 
 * 用法示例：
 *   <RenameModal />
 * 
 * 功能说明：
 *   从store读取renameModal状态，当visible为true时显示弹窗
 *   用户输入新名称后点击确认，调用重命名命令更新节点
 */
const RenameModal = () => {                                       // 重命名弹窗主组件

  const renameModal = useStore(s => s.renameModal)                // 从store获取重命名弹窗状态
  const inputRef = useRef(null)                                   // 创建ref引用输入框，用于获取输入值

  if (!renameModal.visible) return null                           // 如果弹窗不可见则不渲染

  // ========== 输入框变化处理 ==========

  const handleChange = (e) => {                                   // 处理输入框值变化
    const newValue = e.target.value                               // 获取新输入值
    setState({                                                    // 更新store中的输入值
      renameModal: { ...renameModal, value: newValue }            // 保持其他属性不变，更新value
    })
  }

  // ========== 取消按钮处理 ==========

  const handleCancel = () => {                                    // 处理取消按钮点击
    hideModal()                                                   // 隐藏弹窗
  }

  // ========== 确认按钮处理 ==========

  const handleConfirm = () => {                                   // 处理确认按钮点击
    const newName = renameModal.value                             // 获取用户输入的新名称
    const nodeIds = renameModal.nodeIds                           // 获取要重命名的节点id数组
    nodeIds.forEach(id => {                                       // 遍历所有要重命名的节点
      window.cmd.renameNode(id, newName)                          // 调用全局命令：重命名节点
    })
    hideModal()                                                   // 隐藏弹窗
  }

  // ========== 遮罩层点击处理 ==========

  const handleOverlayClick = () => {                              // 处理遮罩层点击（点击弹窗外部）
    hideModal()                                                   // 隐藏弹窗
  }

  // ========== 弹窗内部点击处理 ==========

  const handleModalClick = (e) => {                               // 处理弹窗内部点击
    e.stopPropagation()                                           // 阻止事件冒泡，防止触发遮罩层点击
  }

  // ========== 键盘事件处理 ==========

  const handleKeyDown = (e) => {                                  // 处理键盘按键事件
    if (e.key === "Enter") {                                      // 如果按下回车键
      handleConfirm()                                             // 确认重命名
    }
    if (e.key === "Escape") {                                     // 如果按下Escape键
      handleCancel()                                              // 取消重命名
    }
  }

  // ========== 渲染弹窗 ==========

  return (                                                        // 返回重命名弹窗JSX结构
    <div                                                          // 遮罩层
      className="rename-modal-overlay"                            // 样式类
      onClick={handleOverlayClick}                                // 点击遮罩层关闭弹窗
    >
      <div                                                        // 弹窗主体
        className="rename-modal"                                  // 样式类
        onClick={handleModalClick}                                // 阻止点击事件冒泡
      >
        {/* 弹窗头部 */}
        <div className="rename-modal-header">                     
          <h3 className="rename-modal-title">节点重命名</h3>        
        </div>

        {/* 弹窗内容 */}
        <div className="rename-modal-body">                       
          <TextField>                                             
            <Label>节点名称</Label>                                 
            <Input                                                // 输入框
              ref={inputRef}                                      // 绑定ref
              value={renameModal.value}                           // 绑定值
              placeholder={renameModal.placeholder}               // 占位符为原名称
              onChange={handleChange}                             // 值改变处理
              onKeyDown={handleKeyDown}                           // 键盘事件处理
              autoFocus                                           // 自动聚焦
            />
          </TextField>
        </div>

        {/* 弹窗底部 */}
        <div className="rename-modal-footer">                     
          <Button                                                 // 取消按钮
            className="btn-cancel"                                // 样式类
            variant="tertiary"                                    // 次要按钮样式
            onClick={handleCancel}                                // 点击取消
          >
            取消
          </Button>
          <Button                                                 // 确认按钮
            className="btn-confirm"                               // 样式类
            color="primary"                                       // 主色调
            onClick={handleConfirm}                               // 点击确认
          >
            确认
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RenameModal                                        // 导出重命名弹窗组件
