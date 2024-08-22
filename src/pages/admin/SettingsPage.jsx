import React, { useEffect, useState } from "react";
import { Table, Card, Typography } from "antd";
import { getAllConfig } from "../../api/configApi";

const { Title } = Typography;

const SettingsPage = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const response = await getAllConfig(1, 100);
    if (response?.isSuccess) {
      setData(response.result?.items);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  console.log(data);
  const columns = [
    {
      title: "Tên cấu hình",
      dataIndex: "name",
      key: "name",
      render(_, record) {
        return <span>{record.vietnameseName}</span>;
      },
    },
    {
      title: "Giá trị hiện tại",
      dataIndex: "preValue",
      key: "preValue",
    },
    {
      title: "Giá trị sẽ cấu hình",
      dataIndex: "activeValue",
      key: "activeValue",
      render: (text) => text || "N/A",
    },
    {
      title: "Ngày cấu hình",
      dataIndex: "activeDate",
      key: "activeDate",
      render: (text) => text || "N/A",
    },
  ];

  return (
    <Card
      className="max-w-4xl mx-auto my-8"
      title={
        <div>
          <Title level={4} style={{ color: "black", margin: 0 }}>
            Cấu hình hệ thống
          </Title>
        </div>
      }
    >
      <Table columns={columns} dataSource={data} pagination={false} />
    </Card>
  );
};

export default SettingsPage;
