import React, { useState } from "react";
import { List, Badge, Button, Typography, Space } from "antd";
import { BellOutlined, CheckOutlined } from "@ant-design/icons";

const { Text } = Typography;

const NotificationListDemo = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New message received", read: false },
    { id: 2, message: "Your order has been shipped", read: false },
    { id: 3, message: "Payment successful", read: true },
    { id: 4, message: "New friend request", read: false },
    { id: 5, message: "System update available", read: true },
  ]);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Space direction="vertical" style={{ width: "100%", padding: "20px" }}>
      <List
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                icon={<CheckOutlined />}
                onClick={() => markAsRead(item.id)}
                disabled={item.read}
              >
                Mark as Read
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={
                <Text strong={!item.read}>
                  {item.read ? (
                    item.message
                  ) : (
                    <Badge status="processing" text={item.message} />
                  )}
                </Text>
              }
            />
          </List.Item>
        )}
      />
    </Space>
  );
};

export default NotificationListDemo;
