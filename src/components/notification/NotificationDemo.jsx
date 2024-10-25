import React, { useEffect, useState } from "react";
import { List, Badge, Button, Typography, Space } from "antd";
import { BellOutlined, CheckOutlined } from "@ant-design/icons";
import { NotificationApi } from "../../api/endpoint";
import { useSelector } from "react-redux";
import MenuItem from "antd/es/menu/MenuItem";
import useCallApi from "../../api/useCallApi";

const { Text } = Typography;

const NotificationListDemo = ({ notifications }) => {
  return (
    <div className="p-4">
      <Typography variant="h4" className="text-red-700  text-xl font-bold">
        THÔNG BÁO CỦA BẠN
      </Typography>
      <div className=" h-[400px] overflow-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex flex-col  gap-2 p-2 rounded-md transition-all duration-300 cursor-pointer  hover:bg-red-50`}
          >
            <Typography
              variant="lead"
              className="font-bold text-lg text-gray-700"
            >
              {notification.notificationName}
            </Typography>
            <Typography className="font-normal text-gray-700 text-sm">
              {notification.messages}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationListDemo;
