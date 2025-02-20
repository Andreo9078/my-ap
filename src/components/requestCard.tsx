import { Button, Card, Flex, Space, theme } from "antd";
import React, { useState } from "react";

interface RequestCardProps {
  requestId: string;
  status: string;
  techType: string;
  modelName: string;
  description: string;
  maxDescriptionLength?: number;
  children?:
    | React.ReactElement<any, typeof Button>
    | React.ReactElement<any, typeof Button>[];
}

export const RequestCard: React.FC<RequestCardProps> = ({
  requestId,
  status,
  techType,
  modelName,
  description,
  maxDescriptionLength = 100,
  children,
}) => {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const {
    token: { colorBgBase },
  } = theme.useToken();

  let edited_description = description;
  if (!isOpened && description.length > maxDescriptionLength) {
    edited_description = description.slice(0, maxDescriptionLength) + "...";
  }

  return (
    <Card
      style={{ background: colorBgBase }}
      title={`Номер запроса: ${requestId}`}
    >
      <p>
        {techType}: {modelName}
      </p>

      <p>Статус запроса: {status}</p>
      <p style={{ marginBottom: "5px" }}>
        Описание запроса: {edited_description}
      </p>

      {description.length > maxDescriptionLength && (
        <Flex
          justify={"flex-end"}
          style={{ marginBottom: "20px", marginTop: "0" }}
        >
          {!isOpened ? (
            <Button
              type="link"
              onClick={() => {
                setIsOpened(true);
              }}
            >
              Развернуть
            </Button>
          ) : (
            <Button
              type="link"
              onClick={() => {
                setIsOpened(false);
              }}
            >
              Свернуть
            </Button>
          )}
        </Flex>
      )}
      <Flex
        style={{ margin: "3px", marginTop: "30px" }}
        align={"flex-end"}
        justify="flex-end"
      >
        <Space
          wrap
          align="end"
          style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
        >
          <>{children}</>
        </Space>
      </Flex>
    </Card>
  );
};
