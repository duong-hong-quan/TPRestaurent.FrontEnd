import React from "react";
import { Tag } from "antd";
import {
  TableOutlined,
  DollarCircleOutlined,
  CoffeeOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const OrderTag = ({ orderStatusId }) => {
  const getTagInfo = (statusId) => {
    switch (statusId) {
      case 1:
        return { color: "blue", text: "Đã phân bàn", icon: <TableOutlined /> };
      case 2:
        return {
          color: "cyan",
          text: "Đã đặt cọc",
          icon: <DollarCircleOutlined />,
        };
      case 3:
        return {
          color: "geekblue",
          text: "Đang dùng bữa",
          icon: <CoffeeOutlined />,
        };
      case 4:
        return {
          color: "purple",
          text: "Đang chờ",
          icon: <ClockCircleOutlined />,
        };
      case 5:
        return {
          color: "processing",
          text: "Đang xử lý",
          icon: <SyncOutlined spin />,
        };
      case 6:
        return {
          color: "orange",
          text: "Đang giao hàng",
          icon: <CarOutlined />,
        };
      case 7:
        return {
          color: "success",
          text: "Hoàn thành",
          icon: <CheckCircleOutlined />,
        };
      case 8:
        return {
          color: "error",
          text: "Đã hủy",
          icon: <CloseCircleOutlined />,
        };
      default:
        return { color: "default", text: "Không xác định", icon: null };
    }
  };

  const { color, text, icon } = getTagInfo(orderStatusId);

  return (
    <Tag color={color} icon={icon}>
      {text}
    </Tag>
  );
};

export default OrderTag;
