import { contextBridge, ipcRenderer } from "electron";
import path from "path";

const electronAPI: any = {};
const initAPI = async () => {
  console.log(path.join(__dirname, "./services/index.cjs"));
  const servicesModule = await import("./services/index.cjs");

  const services = servicesModule.services;

  for (const namespace of Object.keys(services)) {
    electronAPI[namespace] = {};
    for (const service_name of Object.keys(services[namespace])) {
      electronAPI[namespace][service_name] = {};
      for (const method of Object.keys(services[namespace][service_name])) {
        console.log(`${namespace} ${service_name} ${method}`);
        electronAPI[namespace][service_name][method] = (...args: any[]) => {
          console.log(
            `IPC Call: ${namespace}:${service_name}:${method}`,
            "Args:",
            args
          );
          return ipcRenderer.invoke(
            `${namespace}:${service_name}:${method}`,
            ...args
          );
        };
      }
    }
  }
  console.log(electronAPI);
  contextBridge.exposeInMainWorld("electronAPI", electronAPI);
};
initAPI().catch(console.error);
