import React, { useState, useEffect } from "react";
import { Switch, Button, List, Modal, Typography, Space } from "antd";
import { requestPermission } from "../../../App";
import {
  Bell,
  Smartphone,
  Laptop,
  Tablet,
  LogOut,
  AlertTriangle,
} from "lucide-react";

const { Title, Text } = Typography;

const PersonalSetting = () => {
  const [devices, setDevices] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    // Giả lập việc lấy danh sách thiết bị
    const fetchDevices = async () => {
      // Thay thế bằng cuộc gọi API thực tế
      const mockDevices = [
        {
          id: 1,
          name: "iPhone 12",
          lastLogin: "2023-10-13 14:30",
          type: "phone",
        },
        {
          id: 2,
          name: "MacBook Pro",
          lastLogin: "2023-10-12 09:15",
          type: "laptop",
        },
        {
          id: 3,
          name: "iPad Air",
          lastLogin: "2023-10-11 18:45",
          type: "tablet",
        },
      ];
      setDevices(mockDevices);
    };

    fetchDevices();
  }, []);

  const handleNotificationChange = async (checked) => {
    if (checked) {
      const permission = await requestPermission();
      if (permission) {
        localStorage.setItem("device_token", permission);
        setNotificationsEnabled(true);
      }
    } else {
      localStorage.removeItem("device_token");
      setNotificationsEnabled(false);
    }
  };

  const handleLogoutDevice = (deviceId) => {
    // Thực hiện đăng xuất thiết bị
    setDevices(devices.filter((device) => device.id !== deviceId));
  };

  const handleLogoutAllDevices = () => {
    Modal.confirm({
      title: "Đăng xuất tất cả thiết bị",
      content: "Bạn có chắc chắn muốn đăng xuất khỏi tất cả thiết bị?",
      onOk: () => {
        // Thực hiện đăng xuất tất cả thiết bị
        setDevices([]);
      },
    });
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case "phone":
        return <Smartphone size={20} />;
      case "laptop":
        return <Laptop size={20} />;
      case "tablet":
        return <Tablet size={20} />;
      default:
        return <Smartphone size={20} />;
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
      <Title level={2}>Các thiết bị gần đây bạn đã đăng nhập</Title>

      <Space style={{ marginBottom: "24px" }}>
        <Bell size={20} />
        <Text>Cho phép thông báo</Text>
        <Switch
          checked={notificationsEnabled}
          onChange={handleNotificationChange}
        />
      </Space>

      <List
        itemLayout="horizontal"
        dataSource={devices}
        renderItem={(device) => (
          <List.Item
            actions={[
              <Button
                key="logout"
                type="link"
                danger
                onClick={() => handleLogoutDevice(device.id)}
                icon={<LogOut size={16} />}
              >
                Đăng xuất
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={getDeviceIcon(device.type)}
              title={device.name}
              description={`Đăng nhập lần cuối: ${device.lastLogin}`}
            />
          </List.Item>
        )}
      />

      {devices.length > 0 && (
        <Button
          type="primary"
          danger
          icon={<AlertTriangle size={16} />}
          onClick={handleLogoutAllDevices}
          style={{ marginTop: "24px" }}
        >
          Đăng xuất tất cả thiết bị
        </Button>
      )}
    </div>
  );
};

export default PersonalSetting;
