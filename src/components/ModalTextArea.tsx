import { Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";

interface ModalTextAreaProps {
  title?: string;
  defaultText?: string;
  placeholder?: string;
  disabled?: boolean;
  onOk?: (text: string) => void;
  onCancel?: (text: string) => void;
  canselText?: string;
  okText?: string;
}

export const ModalTextArea: React.FC<ModalTextAreaProps> = ({
  title,
  defaultText = "",
  placeholder,
  disabled = false,
  onOk = () => {},
  onCancel = () => {},
  canselText = "Cancel",
  okText = "Save",
}) => {
  const [text, setText] = useState<string>(defaultText);

  return (
    <Modal
      title={title}
      open={true}
      cancelText={canselText}
      okText={okText}
      confirmLoading={false}
      onOk={() => {
        onOk(text);
      }}
      onCancel={() => {
        onCancel(text);
      }}
    >
      <TextArea
        placeholder={placeholder}
        value={text}
        disabled={disabled}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
          setText(event.target.value);
        }}
      />
    </Modal>
  );
};
