/**
 * Header.jsx - 顶部菜单栏组件
 * 
 * 包含：
 * - 左侧：Logo
 * - 中间：蓝图名称输入框
 * - 右侧：操作按钮
 */
import '../styles/Header.css';
import { setState, useStore } from '../store';

// Logo 组件
const Logo = () => (
  <h1 className="logo">炼丹蓝图</h1>
);

// 蓝图名称输入组件
function BlueprintNameInput() {
  const name = useStore(state => state.name);
  return (
    <input
      type="text"
      className="blueprint-name-input"
      placeholder="未命名蓝图"
      value={name}
      onChange={(e) => setState({ name: e.target.value })} />
  );
}

// 按钮组件
const ActionButtons = () => (
  <>
    <button className="btn btn-import">导入蓝图</button>
    <button className="btn btn-export">导出蓝图</button>
  </>
);

// 左侧区域组件
const LeftArea = () => (
  <div className="left-area">
    <Logo />
  </div>
);

// 中间区域组件
const MiddleArea = () => (
  <div className="middle-area">
    <BlueprintNameInput />
  </div>
);

// 右侧区域组件
const RightArea = () => (
  <div className="right-area">
    <ActionButtons />
  </div>
);

// 主 Header 组件
function Header() {
  return (
    <header className="header">
      <LeftArea />
      <MiddleArea />
      <RightArea />
    </header>
  );
}


export default Header;
