/**
 * ws.js - WebSocket 通信模块
 * 
 * 封装WebSocket连接和通信逻辑
 * 与Zustand store解耦，通过回调函数更新状态
 */

// WebSocket 服务器地址
const WS_SERVER_URL = 'ws://localhost:8765';

// 请求超时时间（毫秒）
const REQUEST_TIMEOUT = 30000;

/**
 * WebSocket 管理器类
 */
class WebSocketManager {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.isConnecting = false;
    this.messageId = 0;
    this.pendingRequests = new Map();
    this.listeners = {
      onConnect: null,
      onDisconnect: null,
      onMessage: null,
      onError: null
    };
  }

  /**
   * 设置事件监听器
   */
  setListeners(listeners) {
    this.listeners = { ...this.listeners, ...listeners };
  }

  /**
   * 生成消息ID
   */
  generateMessageId() {
    this.messageId += 1;
    return `msg-${this.messageId}-${Date.now()}`;
  }

  /**
   * 处理收到的消息
   */
  handleMessage(data) {
    console.log('📥 收到消息:', data.type, data);

    // 处理注册表响应
    if (data.type === 'registry') {
      const requestId = data.id;
      const pending = this.pendingRequests.get(requestId);
      if (pending) {
        pending.resolve(data.data);
        this.pendingRequests.delete(requestId);
      }
    }
    // 处理节点执行结果
    else if (data.type === 'node_result') {
      const nodeId = data.data.nodeId;
      const output = data.data.output;
      console.log(`📦 节点执行完成: ${nodeId}`);
      if (output) {
        for (const [port, val] of Object.entries(output)) {
          if (typeof val === 'object' && val?.type === 'tensor') {
            console.log(`   ${port}: shape=${JSON.stringify(val.shape)}`);
          } else {
            console.log(`   ${port}:`, val);
          }
        }
      }
    }
    // 处理执行完成
    else if (data.type === 'execution_complete') {
      const requestId = data.id;
      console.log('✅ 蓝图执行完成！');
      console.log(`   成功: ${data.data.success}`);
      const pending = this.pendingRequests.get(requestId);
      if (pending) {
        pending.resolve(data.data);
        this.pendingRequests.delete(requestId);
      }
    }
    // 处理错误
    else if (data.type === 'error') {
      const requestId = data.id;
      console.error('❌ 执行出错:', data.data.message);
      const pending = this.pendingRequests.get(requestId);
      if (pending) {
        pending.reject(new Error(data.data.message));
        this.pendingRequests.delete(requestId);
      }
    }

    // 调用消息回调
    this.listeners.onMessage?.(data);
  }

  /**
   * 连接 WebSocket
   */
  connect() {
    return new Promise((resolve, reject) => {
      // 如果已经连接，直接返回
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      // 如果正在连接中
      if (this.isConnecting) {
        reject(new Error('正在连接中，请稍候'));
        return;
      }

      this.isConnecting = true;
      console.log('🔌 正在连接 WebSocket 服务器...');

      try {
        const ws = new WebSocket(WS_SERVER_URL);

        ws.onopen = () => {
          console.log('✅ WebSocket 连接成功');
          this.isConnected = true;
          this.isConnecting = false;
          this.ws = ws;
          this.listeners.onConnect?.();
          resolve();
        };

        ws.onerror = (error) => {
          console.error('❌ WebSocket 连接错误:', error);
          this.isConnecting = false;
          this.isConnected = false;
          this.listeners.onError?.(error);
          reject(new Error('WebSocket 连接失败，请确保后端服务器已启动'));
        };

        ws.onclose = () => {
          console.log('🔌 WebSocket 连接已关闭');
          this.isConnected = false;
          this.isConnecting = false;
          this.ws = null;
          this.listeners.onDisconnect?.();
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            console.error('解析消息失败:', error);
          }
        };
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  /**
   * 发送消息
   */
  async sendMessage(message) {
    // 确保已连接
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      await this.connect();
    }

    return new Promise((resolve, reject) => {
      const messageId = message.id || this.generateMessageId();
      const fullMessage = { ...message, id: messageId };

      // 设置超时
      const timeout = setTimeout(() => {
        if (this.pendingRequests.has(messageId)) {
          this.pendingRequests.delete(messageId);
          reject(new Error('请求超时'));
        }
      }, REQUEST_TIMEOUT);

      // 存储待处理请求
      this.pendingRequests.set(messageId, {
        resolve: (data) => {
          clearTimeout(timeout);
          resolve(data);
        },
        reject: (error) => {
          clearTimeout(timeout);
          reject(error);
        }
      });

      console.log('📤 发送消息:', fullMessage);
      this.ws.send(JSON.stringify(fullMessage));
    });
  }

  /**
   * 获取节点注册表
   */
  async getRegistry() {
    console.log('\n' + '='.repeat(50));
    console.log('     获取节点注册表');
    console.log('='.repeat(50));

    try {
      const result = await this.sendMessage({
        type: 'get_registry'
      });

      console.log('📥 收到注册表数据:');
      console.log(`   分类数量: ${Object.keys(result.categories || {}).length}`);
      console.log(`   节点数量: ${Object.keys(result.nodes || {}).length}`);
      console.log(`   节点列表: ${Object.keys(result.nodes || {}).join(', ')}`);
      console.log('='.repeat(50) + '\n');

      return result;
    } catch (error) {
      console.error('获取注册表失败:', error.message);
      throw error;
    }
  }

  /**
   * 运行蓝图
   */
  async runBlueprint(blueprint, inputs = {}) {
    console.log('\n' + '='.repeat(50));
    console.log('     运行蓝图');
    console.log('='.repeat(50));
    console.log(`   节点数量: ${blueprint.nodes?.length || 0}`);
    console.log(`   连线数量: ${blueprint.edges?.length || 0}`);

    try {
      const result = await this.sendMessage({
        type: 'run_blueprint',
        data: {
          blueprint: blueprint,
          inputs: inputs
        }
      });

      console.log('='.repeat(50) + '\n');
      return result;
    } catch (error) {
      console.error('运行蓝图失败:', error.message);
      throw error;
    }
  }

  /**
   * 断开连接
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.pendingRequests.clear();
  }

  /**
   * 获取连接状态
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      isConnecting: this.isConnecting
    };
  }
}

// 创建单例实例
const wsManager = new WebSocketManager();

export default wsManager;
