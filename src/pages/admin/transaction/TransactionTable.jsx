import React, { useState } from "react";
import { Table, Tag, Space, Input, Button, DatePicker } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

const statusMap = {
  0: { text: "Đang xử lý", color: "blue" },
  1: { text: "Thất bại", color: "red" },
  2: { text: "Thành công", color: "green" },
  3: { text: "Đã áp dụng", color: "purple" },
};

const TransactionTable = ({ data }) => {
  const columns = [
    {
      title: "Mã giao dịch",
      dataIndex: "id",
      key: "id",
      render: (text) => <a>{text.substring(0, 8)}</a>,
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `${amount.toLocaleString()} VND`,
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: ["paymentMethod", "vietnameseName"],
      key: "paymentMethod",
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: ["transationStatus", "id"],
      render: (statusId) => (
        <Tag color={statusMap[statusId].color}>{statusMap[statusId].text}</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a>Xem chi tiết</a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={data} rowKey="id" />
    </div>
  );
};

export default TransactionTable;
