/**
 * zoom.js - 缩放工具函数
 * 
 * 提供画布缩放相关的辅助函数
 */

/**
 * 限制缩放范围
 * @param {number} scale - 当前缩放值
 * @param {number} min - 最小缩放值
 * @param {number} max - 最大缩放值
 * @returns {number} 限制后的缩放值
 */
export function clampScale(scale, min = 0.5, max = 1.5) {
  return Math.max(min, Math.min(max, scale));
}

/**
 * 计算缩放后的尺寸
 * @param {number} size - 原始尺寸
 * @param {number} scale - 缩放比例
 * @returns {number} 缩放后的尺寸
 */
export function scaleSize(size, scale) {
  return size * scale;
}

/**
 * 计算缩放步进
 * @param {number} currentZoom - 当前缩放值
 * @param {number} step - 步进值
 * @param {string} direction - 方向 'in' | 'out'
 * @returns {number} 新的缩放值
 */
export function calculateZoomStep(currentZoom, step = 0.1, direction = 'in') {
  if (direction === 'in') {
    return Math.min(2, currentZoom + step);
  } else {
    return Math.max(0.25, currentZoom - step);
  }
}
