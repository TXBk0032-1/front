/**
 * App.jsx - 应用入口组件
 * 
 * 布局结构：
 * - Header（顶部菜单栏）
 * - Sidebar（侧边栏）
 * - Blueprint（蓝图画布）
 */
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Blueprint from './components/Blueprint';
import './styles/Global.css';

function App() {
  return (
    <div id="editor">
      <Header />
      <main id="workspace">
        <Sidebar />
        <Blueprint />
      </main>
    </div>
  );
}

export default App;
