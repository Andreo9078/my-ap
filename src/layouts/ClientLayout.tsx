import { useState } from "react";
import { CustomLayout } from "./CustomLayout";
import { ScheduleOutlined, FormOutlined } from "@ant-design/icons";

export const ClientLayout = ({
  pages,
}: {
  pages: Map<string, React.ReactNode>;
}) => {
  const [currentPage, setCurrentPage] = useState<string>("my_requests");

  return (
    <CustomLayout
      defaultSelectedKey={currentPage}
      onMenuClick={(key) => setCurrentPage(key)}
      menuItems={[
        {
          key: "my_requests",
          icon: <ScheduleOutlined />,
          label: "Мои заявки",
        },
        {
          key: "create_request",
          icon: <FormOutlined />,
          label: "Создать заявку",
        },
      ]}
    >
      {pages.get(currentPage)}
    </CustomLayout>
  );
};
