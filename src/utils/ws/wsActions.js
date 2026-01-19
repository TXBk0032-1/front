/**
 * wsActions.js - WebSocket 操作方法
 */

export const wsActions = (set) => ({
  setWsConnected: (connected) => set({ wsConnected: connected }),
  setWsConnecting: (connecting) => set({ wsConnecting: connecting }),
  setRegistry: (registry) => set({ registry }),
});
