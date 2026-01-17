/**
 * TopMenu.jsx - 顶部菜单栏组件
 *
 * 独立于画布之外的顶部导航
 * 左中右三栏布局，紫色主题
 */

import "./TopMenu.css";
import userAvatar from "../assets/user-avatar.svg";

/**
 * 顶部菜单栏组件
 * @param {Object} props - 组件属性
 * @param {Function} props.onExport - 导出蓝图的回调函数
 * @param {Function} props.onImport - 导入蓝图的回调函数（接收导入的数据）
 * @param {Function} props.onAutoLayout - 自动整理布局的回调函数
 * @param {Function} props.onGetRegistry - 获取节点注册表的回调函数
 * @param {Function} props.onRunBlueprint - 运行蓝图的回调函数
 * @param {boolean} props.isConnected - WebSocket 连接状态
 * @param {boolean} props.isConnecting - WebSocket 正在连接状态
 */
function TopMenu({ onExport, onImport, onAutoLayout, onGetRegistry, onRunBlueprint, isConnected, isConnecting }) {
  
  // ---------- 处理导出按钮点击 ----------
  const handleExport = () => {
    if (onExport) {
      onExport();
    }
  };

  // ---------- 处理导入文件选择 ----------
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (onImport) {
          onImport(data);
        }
      } catch (error) {
        console.error("导入失败：文件格式不正确", error);
        alert("导入失败：文件格式不正确");
      }
    };
    reader.readAsText(file);
    
    // 清空 input 值，允许再次选择同一文件
    event.target.value = "";
  };

  // ---------- 触发文件选择对话框 ----------
  const handleImportClick = () => {
    document.getElementById("blueprint-import-input").click();
  };

  // ---------- 渲染 ----------
  return (
    <header className="header">
      {/* 左侧区域：Logo */}
      <div className="left-area">
        <h1 className="logo">炼丹蓝图</h1>
      </div>

      {/* 中间区域：蓝图名称输入框 */}
      <div className="middle-area">
        <input 
          type="text" 
          className="blueprint-name-input" 
          placeholder="未命名蓝图"
        />
      </div>

      {/* 右侧区域：操作按钮 + 用户头像 */}
      <div className="right-area">
        {/* 后端通信按钮组 */}
        <div className="btn-group">
          <button
            className={`btn btn-registry ${isConnected ? 'connected' : ''}`}
            onClick={onGetRegistry}
            disabled={isConnecting}
            title={isConnected ? '已连接后端' : '点击连接后端并获取注册表'}
          >
            {isConnecting ? '连接中...' : '获取注册表'}
          </button>
          <button
            className="btn btn-run"
            onClick={onRunBlueprint}
            disabled={isConnecting}
            title="运行当前蓝图"
          >
            运行蓝图
          </button>
        </div>

        {/* 分隔线 */}
        <div className="btn-divider"></div>

        {/* 蓝图操作按钮组 */}
        <div className="btn-group">
          <button className="btn btn-layout" onClick={onAutoLayout}>
            整理布局
          </button>
          <button className="btn btn-import" onClick={handleImportClick}>
            导入蓝图
          </button>
          <button className="btn btn-export" onClick={handleExport}>
            导出蓝图
          </button>
        </div>
        
        {/* 用户头像 */}
        <div className="user-avatar">
          <img src={userAvatar} alt="用户头像" />
        </div>
      </div>

      {/* 隐藏的文件输入框 */}
      <input
        id="blueprint-import-input"
        type="file"
        accept=".json"
        className="hidden-input"
        onChange={handleFileChange}
      />
    </header>
  );
}

export default TopMenu;
