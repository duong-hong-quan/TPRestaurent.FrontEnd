import React from "react";
import { Tag } from "antd";
import {
  ClockIcon,
  CheckIcon,
  CookingPotIcon,
  AlertTriangleIcon,
  XIcon,
  ListChecksIcon,
} from "lucide-react";

// Status definitions with colors and icons
export const OrderSessionStatus = [
  {
    label: "Đặt trước",
    value: 0,
    color: "default",
    icon: <ClockIcon size={16} />,
  },
  {
    label: "Đã tiếp nhận món",
    value: 1,
    color: "processing",
    icon: <ListChecksIcon size={16} />,
  },
  {
    label: "Đang dùng bữa",
    value: 2,
    color: "warning",
    icon: <CookingPotIcon size={16} />,
  },
  {
    label: "Cảnh báo nấu trễ",
    value: 3,
    color: "error",
    icon: <AlertTriangleIcon size={16} />,
  },
  {
    label: "Đã nấu xong",
    value: 4,
    color: "success",
    icon: <CheckIcon size={16} />,
  },
  {
    label: "Đã hủy",
    value: 5,
    color: "error",
    icon: <XIcon size={16} />,
  },
];

const OrderSessionTag = ({ orderSession }) => {
  const status = OrderSessionStatus.find(
    (status) => status.value === orderSession.orderSessionStatusId
  );

  return (
    <Tag
      color={status.color}
      icon={status.icon}
      className="flex items-center gap-1"
    >
      {status.label}
    </Tag>
  );
};

export default OrderSessionTag;
