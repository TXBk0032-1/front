/**
 * Header.jsx - 顶部菜单栏组件
 * 
 * 包含：
 * - 左侧：Logo
 * - 中间：蓝图名称输入框
 * - 右侧：操作按钮（导入、导出、运行等）
 */

import { useState } from 'react';
import useStore from '../store';
import wsManager from '../ws';
import { exportBlueprintToFile } from '../utils/data/export';
import { importBlueprintFromFile } from '../utils/data/import';
import { getLayoutedElements, DEFAULT_ELK_OPTIONS } from '../utils/canvas/layout';
import { updateNodeRegistry } from '../constants/nodeRegistry';
import userAvatar from '../assets/user-avatar.svg';
import '../styles/Header.css';

function Header() {
  const [blueprintName, setBlueprintName] = useState('');
  
  // 从 store 获取状态和方法
  const { 
    nodes, 
    edges, 
    nodeIdCounter,
    setNodes, 
    setEdges, 
    setBlueprint,
    wsConnected,
    wsConnecting,
    setWsConnected,
    setWsConnecting,
    setRegistry
  } = useStore();

  // ---------- 导出蓝图 ----------
  const handleExport = () => {
    const blueprint = { nodes, edges, nodeIdCounter };
    const filename = blueprintName ? `${blueprintName}.json` : `blueprint-${Date.now()}.json`;
    exportBlueprintToFile(blueprint, filename);
  };

  // ---------- 导入蓝图 ----------
  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await importBlueprintFromFile(file);
      setBlueprint(data);
    } catch (error) {
      console.error('导入失败:', error);
      alert('导入失败：' + error.message);
    }

    event.target.value = '';
  };

  const handleImportClick = () => {
    document.getElementById('blueprint-import-input').click();
  };

  // ---------- 自动布局 ----------
  const handleAutoLayout = async () => {
    const layouted = await getLayoutedElements(nodes, edges, DEFAULT_ELK_OPTIONS);
    if (layouted) {
      setNodes(layouted.nodes);
      setEdges(layouted.edges);
    }
  };

  // ---------- 获取节点注册表 ----------
  const handleGetRegistry = async () => {
    try {
      setWsConnecting(true);
      const registry = await wsManager.getRegistry();
      console.log('✅ 成功获取节点注册表:', registry);
      updateNodeRegistry(registry);
      setRegistry(registry);
      setWsConnected(true);
    } catch (error) {
      console.error('❌ 获取节点注册表失败:', error.message);
      alert('获取节点注册表失败：' + error.message);
    } finally {
      setWsConnecting(false);
    }
  };

  // ---------- 运行蓝图 ----------
  const handleRunBlueprint = async () => {
    if (nodes.length === 0) {
      alert('蓝图中没有节点');
      return;
    }

    try {
      const blueprint = { nodes, edges, nodeIdCounter };
      const result = await wsManager.runBlueprint(blueprint, {});
      console.log('✅ 蓝图运行结果:', result);
    } catch (error) {
      console.error('❌ 运行蓝图失败:', error.message);
      alert('运行蓝图失败：' + error.message);
    }
  };

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
          value={blueprintName}
          onChange={(e) => setBlueprintName(e.target.value)}
        />
      </div>

      {/* 右侧区域：操作按钮 + 用户头像 */}
      <div className="right-area">
        {/* 后端通信按钮组 */}
        <div className="btn-group">
          <button
            className={`btn btn-registry ${wsConnected ? 'connected' : ''}`}
            onClick={handleGetRegistry}
            disabled={wsConnecting}
            title={wsConnected ? '已连接后端' : '点击连接后端并获取注册表'}
          >
            {wsConnecting ? '连接中...' : '获取注册表'}
          </button>
          <button
            className="btn btn-run"
            onClick={handleRunBlueprint}
            disabled={wsConnecting}
            title="运行当前蓝图"
          >
            运行蓝图
          </button>
        </div>

        {/* 分隔线 */}
        <div className="btn-divider"></div>

        {/* 蓝图操作按钮组 */}
        <div className="btn-group">
          <button className="btn btn-layout" onClick={handleAutoLayout}>
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

export default Header;
