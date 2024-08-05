import React from "react";
import { Modal, Button } from "antd";
import {
  ExclamationCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const ErrorModal = ({ isVisible, onClose, messages }) => {
  return (
    <Modal
      title={null}
      open={isVisible}
      onCancel={onClose}
      footer={null}
      className="error-modal"
      width={400}
      centered
      closable={false}
    >
      <div className=" p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-red-600 font-bold text-lg">
            <ExclamationCircleOutlined className="text-2xl mr-2" />
            <span>Có lỗi xảy ra</span>
          </div>
        </div>
        <div className="max-h-60 overflow-y-auto pr-2">
          {messages.map((message, index) => (
            <div key={index} className="flex items-start mb-3 last:mb-0">
              <div className="w-2 h-2 rounded-full bg-red-500 mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-red-700 text-sm">{message}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 text-right">
          <Button type="primary" danger onClick={onClose} className="px-6 h-9">
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ErrorModal;
