import { useState } from "react";
import { CustomLayout } from "./CustomLayout";
import { AuditOutlined, CarryOutOutlined } from "@ant-design/icons";

export const MasterLayout = ({
  pages,
}: {
  pages: Map<string, React.ReactNode>;
}) => {
  const [currentPage, setCurrentPage] = useState<string>("active_requests");

  return (
    <CustomLayout
      defaultSelectedKey={currentPage}
      onMenuClick={(key) => setCurrentPage(key)}
      menuItems={[
        {
          key: "active_requests",
          icon: <AuditOutlined />,
          label: "Активные заявки",
        },
        {
          key: "done_requests",
          icon: <CarryOutOutlined />,
          label: "Готовые заявки",
        },
      ]}
    >
      {pages.get(currentPage)}
    </CustomLayout>
  );
};
