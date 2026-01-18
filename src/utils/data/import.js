/**
 * import.js - 导入工具函数
 * 
 * 提供蓝图导入功能
 */

import { deserializeBlueprint } from './serialize';
import { validateBlueprint } from './validate';

/**
 * 从文件读取蓝图数据
 * @param {File} file - 文件对象
 * @returns {Promise<Object>} 蓝图数据
 */
export function importBlueprintFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = deserializeBlueprint(e.target.result);
        const validation = validateBlueprint(data);
        
        if (!validation.valid) {
          reject(new Error(`蓝图数据无效: ${validation.errors.join(', ')}`));
          return;
        }
        
        resolve(data);
      } catch (error) {
        reject(new Error('解析蓝图文件失败: ' + error.message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('读取文件失败'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * 从剪贴板读取蓝图数据
 * @returns {Promise<Object>} 蓝图数据
 */
export async function importBlueprintFromClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    const data = deserializeBlueprint(text);
    const validation = validateBlueprint(data);
    
    if (!validation.valid) {
      throw new Error(`蓝图数据无效: ${validation.errors.join(', ')}`);
    }
    
    return data;
  } catch (error) {
    throw new Error('从剪贴板导入失败: ' + error.message);
  }
}

/**
 * 从 Base64 字符串解析蓝图数据
 * @param {string} base64 - Base64 字符串
 * @returns {Object} 蓝图数据
 */
export function importBlueprintFromBase64(base64) {
  try {
    const jsonString = decodeURIComponent(atob(base64));
    const data = deserializeBlueprint(jsonString);
    const validation = validateBlueprint(data);
    
    if (!validation.valid) {
      throw new Error(`蓝图数据无效: ${validation.errors.join(', ')}`);
    }
    
    return data;
  } catch (error) {
    throw new Error('从 Base64 解析失败: ' + error.message);
  }
}

/**
 * 创建文件选择器并导入蓝图
 * @param {Function} onImport - 导入成功回调
 * @param {Function} onError - 导入失败回调
 */
export function openFileAndImport(onImport, onError) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  
  input.onchange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const data = await importBlueprintFromFile(file);
      onImport(data);
    } catch (error) {
      onError?.(error);
    }
  };
  
  input.click();
}
