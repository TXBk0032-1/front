/**
 * export.js - 导出工具函数
 * 
 * 提供蓝图导出功能
 */

import { serializeBlueprint } from './serialize';

/**
 * 导出蓝图为 JSON 文件
 * @param {Object} blueprint - 蓝图数据
 * @param {string} filename - 文件名（可选）
 */
export function exportBlueprintToFile(blueprint, filename) {
  const jsonString = serializeBlueprint(blueprint);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const defaultFilename = filename || `blueprint-${Date.now()}.json`;
  
  const a = document.createElement('a');
  a.href = url;
  a.download = defaultFilename;
  a.click();
  
  URL.revokeObjectURL(url);
}

/**
 * 将蓝图数据复制到剪贴板
 * @param {Object} blueprint - 蓝图数据
 * @returns {Promise<boolean>} 是否成功
 */
export async function copyBlueprintToClipboard(blueprint) {
  try {
    const jsonString = serializeBlueprint(blueprint);
    await navigator.clipboard.writeText(jsonString);
    return true;
  } catch (error) {
    console.error('复制到剪贴板失败:', error);
    return false;
  }
}

/**
 * 将蓝图转换为 Base64 字符串（用于URL分享）
 * @param {Object} blueprint - 蓝图数据
 * @returns {string} Base64 字符串
 */
export function blueprintToBase64(blueprint) {
  const jsonString = serializeBlueprint(blueprint);
  return btoa(encodeURIComponent(jsonString));
}
