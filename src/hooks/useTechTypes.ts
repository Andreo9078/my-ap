import { useCallback, useEffect, useState } from "react";
import { useElectronAPI } from "./useElectronAPI";

const useTechTypes = () => {
  const electronAPI = useElectronAPI();

  const [techTypes, setTechTypes] = useState<TechType[]>([]);

  useEffect(() => {
    update();
  }, []);

  const update = useCallback(() => {
    electronAPI.requests.techType.getTechTypes().then((techTypes) => {
      setTechTypes(techTypes);
    });
  }, []);

  return { techTypes, update };
};

export default useTechTypes;
