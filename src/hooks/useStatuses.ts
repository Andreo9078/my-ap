import { useCallback, useEffect, useState } from "react";
import { useElectronAPI } from "./useElectronAPI";

const useStatuses = () => {
  const electronAPI = useElectronAPI();
  const [statuses, setStatuses] = useState<Status[]>([]);

  useEffect(() => {
    update();
  }, []);

  const update = useCallback(() => {
    electronAPI.requests.requestStatus.getRequestStatuses().then((statuses) => {
      setStatuses(statuses);
    });
  }, []);

  return { statuses, update };
};

export default useStatuses;
