import { useEffect, useState } from "react";
import { useElectronAPI } from "../../hooks/useElectronAPI";
import { parse } from "date-fns";
import { Card } from "antd";
import useRequests from "../../hooks/useRequests";

interface MidTime {
  days: number;
  hours: number;
}

export const Statistic = () => {
  const electronAPI = useElectronAPI();
  const { requests, update } = useRequests({ statusId: 3 });
  const [requestsCount, setRequestsCount] = useState<number>(0);
  const [midTime, setMidTime] = useState<MidTime>();

  useEffect(() => {
    setRequestsCount(requests.length);
    console.log(requests);

    let counter = 0;
    let timeSum = 0;
    if (requests !== undefined) {
      for (const request of requests) {
        console.log(request);
        if (request.end_date !== undefined) {
          const startDate = new Date(request.start_date);
          const endDate = new Date(request.end_date);
          timeSum += endDate.getTime() - startDate.getTime();
          counter++;
        }

        console.log(timeSum);
        setMidTime(convertMillisecondsToDaysAndHours(timeSum / counter));
      }
    }
  }, [requests]);

  function convertMillisecondsToDaysAndHours(milliseconds: number): {
    days: number;
    hours: number;
  } {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24)); // Целые дни
    const hours = Math.floor(
      (milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    ); // Остаток в часах

    return { days, hours };
  }

  return (
    <Card>
      <p>Количество выполненых заявок: {requests.length}</p>
      <p>
        Среднее время выполнения заявок: {midTime?.days} дней, {midTime?.hours}{" "}
        часов
      </p>
    </Card>
  );
};
