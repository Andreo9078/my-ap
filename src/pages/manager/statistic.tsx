import { useEffect, useState } from "react";
import { useElectronAPI } from "../../hooks/useElectronAPI";
import { parse } from "date-fns";
import { Card, Select, theme } from "antd";
import useRequests from "../../hooks/useRequests";
import DonutChart from "../../components/DonutChart";

interface MidTime {
  days: number;
  hours: number;
}

export const Statistic = () => {
  const electronAPI = useElectronAPI();
  const [masterID, setMasterId] = useState<number | undefined>(undefined);
  const [masters, setMasters] = useState<User[]>([]);
  const { requests, update } = useRequests({ statusId: 3, masterId: masterID });
  const [midTime, setMidTime] = useState<MidTime>({ days: 0, hours: 0 });
  const [faultStat, setFaultStat] = useState<Map<string, number>>(new Map());
  const {
    token: { colorBgBase },
  } = theme.useToken();

  useEffect(() => {
    const fetchStatsByFaultType = async () => {
      const faultTypes = await electronAPI.requests.faultType.getFaultTypes();

      const faultStat = new Map();

      for (const faultType of faultTypes) {
        const filteredRequests = requests.filter(
          (request) => request.fault_type_id === faultType.dataValues.id
        );

        faultStat.set(faultType.dataValues.name, filteredRequests.length);
      }
      console.log(faultStat);
      console.log(Array.from(faultStat));
      setFaultStat(faultStat);
    };
    const fetchMasters = async () => {
      const masters = await electronAPI.auth.user.getUsers({ roleId: 2 });
      setMasters(masters);
    };
    console.log(requests);
    const getMidTime = async () => {
      let counter = 0;
      let timeSum = 0;
      if (requests.length > 0) {
        for (const request of requests) {
          console.log(request);
          if (request.end_date !== undefined) {
            const startDate = new Date(request.start_date);
            const endDate = new Date(request.end_date);
            timeSum += endDate.getTime() - startDate.getTime();

            console.log(timeSum, counter);
          }

          console.log(timeSum);
        }
        if (timeSum > 0) {
          setMidTime(
            convertMillisecondsToDaysAndHours(timeSum / requests.length)
          );
        }
      } else {
        setMidTime({ days: 0, hours: 0 });
      }
    };

    fetchStatsByFaultType();
    fetchMasters();
    getMidTime();
  }, [requests]);

  useEffect(() => {
    update();
  }, [masterID]);

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
    <Card
      style={{
        background: colorBgBase,
        margin: "16px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <Select
        showSearch
        allowClear
        placeholder="Select a person"
        style={{ width: "100%", marginBottom: "20px" }}
        onChange={(value) => {
          setMasterId(value);
        }}
        filterOption={(input, option) => {
          // Преобразуем только если label — строка
          const label = option?.label;
          return (
            typeof label === "string" &&
            label.toLowerCase().includes(input.toLowerCase())
          );
        }}
        options={masters.map((master) => ({
          value: master.dataValues.id, // ID, который сохраняется при выборе
          label: `${master.dataValues.name} ${master.dataValues.last_name} ${master.dataValues.patronymic}`, // ФИО, по которому идёт поиск
        }))}
      />

      <p>Количество выполненных заявок: {requests.length}</p>
      {(midTime?.days > 0 || midTime?.hours > 0) && (
        <p>
          Среднее время выполнения заявок: {midTime?.days} дней,{" "}
          {midTime?.hours} часов
        </p>
      )}

      <DonutChart faultStat={faultStat} />
    </Card>
  );
};
