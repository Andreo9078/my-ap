export const useElectronAPI = () => {
  if (window.electronAPI) {
    return window.electronAPI;
  }
  throw new Error("Electron API is not available");
};
