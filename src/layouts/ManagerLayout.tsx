import { useState } from "react";
import { CustomLayout } from "./CustomLayout";
import {
  AuditOutlined,
  CarryOutOutlined,
  ClockCircleOutlined,
  CloseSquareOutlined,
} from "@ant-design/icons";

export const ManagerLayout = ({
  pages,
}: {
  pages: Map<string, React.ReactNode>;
}) => {
  const [currentPage, setCurrentPage] = useState<string>("new_requests");

  return (
    <CustomLayout
      defaultSelectedKey={currentPage}
      onMenuClick={(key) => setCurrentPage(key)}
      menuItems={[
        {
          key: "new_requests",
          icon: <AuditOutlined />,
          label: "Новые заявки",
        },
        {
          key: "active_requests",
          icon: <ClockCircleOutlined />,
          label: "Заявки в процессе",
        },
        {
          key: "done_requests",
          icon: <CarryOutOutlined />,
          label: "Готовые заявки",
        },
        {
          key: "rejected_requests",
          icon: <CloseSquareOutlined />,
          label: "Отклоненные заявки",
        },
      ]}
    >
      {pages.get(currentPage)}
    </CustomLayout>
  );
};
