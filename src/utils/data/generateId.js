// 生成唯一ID
export function generateId() {
  // 使用高精度时间戳
  const timestamp = performance.now().toString(36);
  // 使用更安全的随机数
  const randomArray = new Uint8Array(8);
  crypto.getRandomValues(randomArray);
  const randomPart = Array.from(randomArray, byte => byte.toString(16).padStart(2, '0')).join('');
  return timestamp + randomPart;
}
