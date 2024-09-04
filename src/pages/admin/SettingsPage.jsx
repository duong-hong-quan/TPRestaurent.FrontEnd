import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  Typography,
  Modal,
  Form,
  Input,
  Button,
  DatePicker,
  TimePicker,
} from "antd";
import { getAllConfig } from "../../api/configApi";
import moment from "moment";

const { Title } = Typography;

const SettingsPage = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    const response = await getAllConfig(1, 100);
    if (response?.isSuccess) {
      setData(response.result?.items);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (record) => {
    setSelectedRecord(record);
    const { activeDate } = record;
    const date = activeDate ? moment(activeDate) : null;
    const time = activeDate ? moment(activeDate) : null;
    form.setFieldsValue({ ...record, activeDate: date, activeTime: time });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const { activeDate, activeTime, ...rest } = values;
      const activeDateTime =
        activeDate && activeTime
          ? activeDate.clone().set({
              hour: activeTime.hour(),
              minute: activeTime.minute(),
            })
          : null;

      // Update the data with the new values
      const updatedData = data.map((item) =>
        item.key === selectedRecord.key
          ? { ...item, ...rest, activeDate: activeDateTime }
          : item
      );
      setData(updatedData);
      setIsModalVisible(false);
      form.resetFields();
    });
  };

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
      render: (text) =>
        text ? moment(text).format("YYYY-MM-DD HH:mm") : "N/A",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          Sửa
        </Button>
      ),
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
      <Modal
        title="Chỉnh sửa cấu hình"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="vietnameseName" label="Tên cấu hình">
            <Input disabled />
          </Form.Item>
          <Form.Item name="preValue" label="Giá trị hiện tại">
            <Input />
          </Form.Item>
          <Form.Item name="activeValue" label="Giá trị sẽ cấu hình">
            <Input />
          </Form.Item>
          <Form.Item label="Ngày cấu hình">
            <div className="flex">
              <Form.Item
                name="activeDate"
                noStyle
                rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                name="activeTime"
                noStyle
                rules={[{ required: true, message: "Vui lòng chọn giờ" }]}
              >
                <TimePicker
                  format="HH:mm"
                  style={{ width: "100%", marginLeft: "2px" }}
                />
              </Form.Item>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default SettingsPage;
