/**
 * main.jsx - 应用入口文件
 * 
 * 注意：HeroUI v3 beta 版本的 Provider API 可能与稳定版不同
 * 暂时不使用 Provider，如需要后续可添加
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/Global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
