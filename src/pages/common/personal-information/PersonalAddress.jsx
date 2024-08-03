import React, { useState } from "react";
import { Table, Button, Switch, Modal, Form, Input } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const PersonalAddress = () => {
  const [addresses, setAddresses] = useState([
    { id: 1, address: "123 Main St", city: "New York", isPrimary: true },
    { id: 2, address: "456 Elm St", city: "Los Angeles", isPrimary: false },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Thành phố",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "Địa chỉ mặc định",
      dataIndex: "isPrimary",
      key: "isPrimary",
      render: (isPrimary, record) => (
        <Switch
          checked={isPrimary}
          onChange={(checked) => handlePrimaryChange(record.id, checked)}
          className="bg-red-900"
        />
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <div className="space-x-2">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="bg-red-800 text-white border-red-800 hover:bg-red-700 hover:border-red-700"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            className="bg-red-800 text-white border-red-800 hover:bg-red-700 hover:border-red-700"
          />
        </div>
      ),
    },
  ];

  const handlePrimaryChange = (id, isPrimary) => {
    setAddresses(
      addresses.map((address) => ({
        ...address,
        isPrimary: address.id === id ? isPrimary : false,
      }))
    );
  };

  const handleEdit = (record) => {
    setEditingAddress(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    setAddresses(addresses.filter((address) => address.id !== id));
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingAddress) {
        setAddresses(
          addresses.map((address) =>
            address.id === editingAddress.id
              ? { ...address, ...values }
              : address
          )
        );
      } else {
        setAddresses([
          ...addresses,
          { id: Date.now(), ...values, isPrimary: false },
        ]);
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingAddress(null);
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-red-900">Địa chỉ của bạn</h1>
      <Table
        dataSource={addresses}
        columns={columns}
        rowKey="id"
        className="mb-6"
        pagination={false}
      />
      <Button
        onClick={() => setIsModalVisible(true)}
        className="bg-red-800 text-white border-red-800 hover:bg-red-700 hover:border-red-700"
      >
        Add Address
      </Button>
      <Modal
        title={editingAddress ? "Edit Address" : "Add Address"}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingAddress(null);
        }}
        okButtonProps={{
          className:
            "bg-red-800 text-white border-red-800 hover:bg-red-700 hover:border-red-700",
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please input the address!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="city"
            label="City"
            rules={[{ required: true, message: "Please input the city!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PersonalAddress;
