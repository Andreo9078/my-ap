import { useState, useEffect, useCallback } from "react";
import { useElectronAPI } from "./useElectronAPI";

const useRequests = (filters: RequestFiltes) => {
  const electronAPI = useElectronAPI();

  const [requests, setRequests] = useState<Request[]>([]);

  const update = useCallback(() => {
    const fetchRequests = async () => {
      try {
        const userRequests = await electronAPI.requests.request.getRequests(
          filters
        );
        setRequests(userRequests.map((value) => value.dataValues)); // Исправлено
      } catch (error) {
        console.error("Ошибка при загрузке заявок:", error);
      }
    };
    fetchRequests();
  }, [filters]);

  useEffect(() => {
    update();
  }, []);

  return { requests, update };
};

export default useRequests;
