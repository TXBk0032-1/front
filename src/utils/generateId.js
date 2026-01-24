/**
 * generateId.js - 随机ID生成工具
 * 
 * 用法说明：
 *   import { generateId } from './utils/generateId'
 *   
 *   // 生成一个唯一ID
 *   const id = generateId()
 *   
 *   // 生成带前缀的ID
 *   const nodeId = generateId('node')    // 结果类似 "node_abc123..."
 *   const edgeId = generateId('edge')    // 结果类似 "edge_abc123..."
 * 
 * 核心职责：
 *   生成唯一的随机ID，用于节点、连接线等对象的标识
 */

/**
 * generateId - 生成唯一ID
 * 
 * 用法示例：
 *   generateId()                          // 生成纯随机ID
 *   generateId('node')                    // 生成带'node_'前缀的ID
 *   generateId('edge')                    // 生成带'edge_'前缀的ID
 * 
 * @param {string} prefix - ID前缀，可选
 * @returns {string} - 返回唯一ID字符串
 */
export function generateId(prefix) {
  const timestamp = performance.now().toString(36)                  // 使用高精度时间戳转为36进制字符串，保证时间上的唯一性

  const randomArray = new Uint8Array(8)                             // 创建8字节的随机数组
  crypto.getRandomValues(randomArray)                               // 使用加密安全的随机数填充数组

  const randomPart = Array.from(randomArray, byte =>                // 将每个字节转为16进制字符串
    byte.toString(16).padStart(2, '0')                             // 不足2位的前面补0
  ).join('')                                                        // 拼接成完整的随机字符串

  const id = timestamp + randomPart                                 // 时间戳 + 随机数 组成唯一ID

  if (prefix) {                                                     // 如果传入了前缀
    return prefix + '_' + id                                       // 返回 "前缀_ID" 格式
  }

  return id                                                         // 返回纯ID
}

/**
 * generateNodeId - 生成节点ID（便捷方法）
 * 
 * 用法示例：
 *   generateNodeId()                      // 结果类似 "node_abc123..."
 * 
 * @returns {string} - 返回带node前缀的唯一ID
 */
export function generateNodeId() {
  return generateId('node')                                         // 调用generateId并传入'node'前缀
}

/**
 * generateEdgeId - 生成连接线ID（便捷方法）
 * 
 * 用法示例：
 *   generateEdgeId()                      // 结果类似 "edge_abc123..."
 * 
 * @returns {string} - 返回带edge前缀的唯一ID
 */
export function generateEdgeId() {
  return generateId('edge')                                         // 调用generateId并传入'edge'前缀
}
