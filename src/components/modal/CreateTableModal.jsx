import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Modal, Alert, message } from "antd";
import useCallApi from "../../api/useCallApi";
import { TableApi } from "../../api/endpoint";
import { showError } from "../../util/Utility";

const { Option } = Select;

const CreateTableModal = ({ isModalOpen, handleCloseModal }) => {
  const [tableRatings, setTableRatings] = useState([]);
  const { callApi, loading, error } = useCallApi();

  const fetchTableRatings = async () => {
    const response = await callApi(
      `${TableApi.GET_ALL_TABLE_RATING}/1/100`,
      "GET"
    );
    if (response.isSuccess) {
      setTableRatings(response.result.items);
    }
  };
  useEffect(() => {
    fetchTableRatings();
  }, []);

  const handleSubmit = async (values) => {
    console.log("Form Values:", values);
    const dataSend = {
      tableName: values.tableName,
      deviceCode: values.tableName,
      devicePassword: values.devicePassword,
      tableSizeId: values.tableSizeId,
      tableRatingId: values.tableRatingId,
    };
    const response = await callApi(TableApi.CREATE_TABLE, "POST", dataSend);
    if (response.isSuccess) {
      message.success("Tạo bàn mới thành công");
      handleCloseModal();
    } else {
      showError(error);
    }
  };

  return (
    <div>
      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null} // Remove default footer buttons
      >
        <h3 className="text-center uppercase font-bold text-xl text-red-800 my-2">
          Tạo bàn mới
        </h3>
        <Alert
          message="Lưu ý: Sau khi tạo bàn mới thành công vui lòng cập nhật lại sơ đồ bàn trong hệ thống."
          type="warning"
          showIcon
          style={{ marginBottom: "1rem" }}
        />
        <Form
          onFinish={handleSubmit}
          layout="vertical"
          style={{ maxWidth: 400, margin: "auto" }}
        >
          <Form.Item
            label="Tên bàn"
            name="tableName"
            rules={[{ required: true, message: "Please enter the table name" }]}
          >
            <Input placeholder="Nhập tên bàn" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="devicePassword"
            rules={[
              { required: true, message: "Please enter the device password" },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item
            label="Sức chứa"
            name="tableSizeId"
            rules={[
              { required: true, message: "Please select the table size" },
            ]}
          >
            <Select placeholder="Chọn sức chứa">
              {[2, 4, 6, 8, 10].map((size) => (
                <Option key={size} value={size}>
                  {size} người
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Loại phòng"
            name="tableRatingId"
            rules={[
              { required: true, message: "Please select the table rating" },
            ]}
          >
            <Select placeholder="Chọn phòng">
              {/* Replace these options with real IDs if available */}
              {tableRatings.map((rating) => (
                <Option key={rating.tableRatingId} value={rating.tableRatingId}>
                  {rating.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div className="flex justify-center">
            <Form.Item>
              <Button
                loading={loading}
                className="bg-red-800 text-white"
                htmlType="submit"
              >
                Tạo bàn
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateTableModal;
