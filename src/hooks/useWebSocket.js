/**
 * useWebSocket.js - WebSocket 通信 Hook
 *
 * 用于与后端 WebSocket 服务器进行通信
 * 支持获取节点注册表和运行蓝图功能
 */

import { useState, useRef, useCallback, useEffect } from "react";

// WebSocket 服务器地址
const WS_SERVER_URL = "ws://localhost:8765";

/**
 * WebSocket 通信 Hook
 * @returns {Object} WebSocket 相关状态和方法
 */
function useWebSocket() {
  // ---------- 状态定义 ----------
  const [isConnected, setIsConnected] = useState(false);           // 连接状态
  const [isConnecting, setIsConnecting] = useState(false);         // 正在连接中
  const [registry, setRegistry] = useState(null);                  // 节点注册表数据
  const wsRef = useRef(null);                                      // WebSocket 实例引用
  const messageIdRef = useRef(0);                                  // 消息 ID 计数器
  const pendingRequestsRef = useRef(new Map());                    // 待处理的请求

  // ---------- 生成消息 ID ----------
  const generateMessageId = useCallback(() => {
    messageIdRef.current += 1;
    return `msg-${messageIdRef.current}-${Date.now()}`;
  }, []);

  // ---------- 处理收到的消息 ----------
  const handleMessage = useCallback((data) => {
    console.log("📥 收到消息:", data.type, data);

    // 处理注册表响应
    if (data.type === "registry") {
      const requestId = data.id;
      const pending = pendingRequestsRef.current.get(requestId);
      if (pending) {
        pending.resolve(data.data);
        pendingRequestsRef.current.delete(requestId);
      }
    }
    // 处理节点执行结果
    else if (data.type === "node_result") {
      const nodeId = data.data.nodeId;
      const output = data.data.output;
      console.log(`📦 节点执行完成: ${nodeId}`);
      if (output) {
        for (const [port, val] of Object.entries(output)) {
          if (typeof val === "object" && val?.type === "tensor") {
            console.log(`   ${port}: shape=${JSON.stringify(val.shape)}`);
          } else {
            console.log(`   ${port}:`, val);
          }
        }
      }
    }
    // 处理执行完成
    else if (data.type === "execution_complete") {
      const requestId = data.id;
      console.log("✅ 蓝图执行完成！");
      console.log(`   成功: ${data.data.success}`);
      const pending = pendingRequestsRef.current.get(requestId);
      if (pending) {
        pending.resolve(data.data);
        pendingRequestsRef.current.delete(requestId);
      }
    }
    // 处理错误
    else if (data.type === "error") {
      const requestId = data.id;
      console.error("❌ 执行出错:", data.data.message);
      const pending = pendingRequestsRef.current.get(requestId);
      if (pending) {
        pending.reject(new Error(data.data.message));
        pendingRequestsRef.current.delete(requestId);
      }
    }
  }, []);

  // ---------- 连接 WebSocket ----------
  const connect = useCallback(() => {
    return new Promise((resolve, reject) => {
      // 如果已经连接，直接返回
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      // 如果正在连接中，等待连接完成
      if (isConnecting) {
        reject(new Error("正在连接中，请稍候"));
        return;
      }

      setIsConnecting(true);
      console.log("🔌 正在连接 WebSocket 服务器...");

      try {
        const ws = new WebSocket(WS_SERVER_URL);

        ws.onopen = () => {
          console.log("✅ WebSocket 连接成功");
          setIsConnected(true);
          setIsConnecting(false);
          wsRef.current = ws;
          resolve();
        };

        ws.onerror = (error) => {
          console.error("❌ WebSocket 连接错误:", error);
          setIsConnecting(false);
          setIsConnected(false);
          reject(new Error("WebSocket 连接失败，请确保后端服务器已启动"));
        };

        ws.onclose = () => {
          console.log("🔌 WebSocket 连接已关闭");
          setIsConnected(false);
          setIsConnecting(false);
          wsRef.current = null;
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            handleMessage(data);
          } catch (error) {
            console.error("解析消息失败:", error);
          }
        };
      } catch (error) {
        setIsConnecting(false);
        reject(error);
      }
    });
  }, [isConnecting, handleMessage]);

  // ---------- 发送消息 ----------
  const sendMessage = useCallback(async (message) => {
    // 确保已连接
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      await connect();
    }

    return new Promise((resolve, reject) => {
      const messageId = message.id || generateMessageId();
      const fullMessage = { ...message, id: messageId };

      // 存储待处理请求
      pendingRequestsRef.current.set(messageId, { resolve, reject });

      // 设置超时
      const timeout = setTimeout(() => {
        if (pendingRequestsRef.current.has(messageId)) {
          pendingRequestsRef.current.delete(messageId);
          reject(new Error("请求超时"));
        }
      }, 30000); // 30 秒超时

      // 存储 timeout 以便清理
      const pending = pendingRequestsRef.current.get(messageId);
      if (pending) {
        pending.timeout = timeout;
        pending.resolve = (data) => {
          clearTimeout(timeout);
          resolve(data);
        };
        pending.reject = (error) => {
          clearTimeout(timeout);
          reject(error);
        };
      }

      console.log("📤 发送消息:", fullMessage);
      wsRef.current.send(JSON.stringify(fullMessage));
    });
  }, [connect, generateMessageId]);

  // ---------- 获取节点注册表 ----------
  const getRegistry = useCallback(async () => {
    console.log("\n" + "=".repeat(50));
    console.log("     获取节点注册表");
    console.log("=".repeat(50));

    try {
      const result = await sendMessage({
        type: "get_registry",
      });

      console.log("📥 收到注册表数据:");
      console.log(`   分类数量: ${Object.keys(result.categories || {}).length}`);
      console.log(`   节点数量: ${Object.keys(result.nodes || {}).length}`);
      console.log(`   节点列表: ${Object.keys(result.nodes || {}).join(", ")}`);
      console.log("=".repeat(50) + "\n");

      // 保存注册表到状态
      setRegistry(result);

      return result;
    } catch (error) {
      console.error("获取注册表失败:", error.message);
      throw error;
    }
  }, [sendMessage]);

  // ---------- 运行蓝图 ----------
  const runBlueprint = useCallback(async (blueprint, inputs = {}) => {
    console.log("\n" + "=".repeat(50));
    console.log("     运行蓝图");
    console.log("=".repeat(50));
    console.log(`   节点数量: ${blueprint.nodes?.length || 0}`);
    console.log(`   连线数量: ${blueprint.edges?.length || 0}`);

    try {
      const result = await sendMessage({
        type: "run_blueprint",
        data: {
          blueprint: blueprint,
          inputs: inputs,
        },
      });

      console.log("=".repeat(50) + "\n");
      return result;
    } catch (error) {
      console.error("运行蓝图失败:", error.message);
      throw error;
    }
  }, [sendMessage]);

  // ---------- 断开连接 ----------
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    pendingRequestsRef.current.clear();
  }, []);

  // ---------- 组件卸载时清理 ----------
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // ---------- 返回接口 ----------
  return {
    isConnected,                // 是否已连接
    isConnecting,               // 是否正在连接
    registry,                   // 节点注册表数据
    connect,                    // 连接方法
    disconnect,                 // 断开连接方法
    getRegistry,                // 获取节点注册表
    runBlueprint,               // 运行蓝图
  };
}

export default useWebSocket;
