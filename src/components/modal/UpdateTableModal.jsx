import { Button, Form, Input, Modal } from "antd";
import { useEffect } from "react";

const UpdateTableModal = ({
  isModalVisible,
  formData,
  handleCancel,
  handleFormSubmit,
  loading,
}) => {
  const [form] = Form.useForm();
  console.log("Form Data:", formData);
  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData]);

  return (
    <Modal open={isModalVisible} onCancel={handleCancel} footer={null}>
      <h3 className="text-center font-bold uppercase text-xl text-red-800">
        Cập nhật thông tin bàn
      </h3>
      <Form
        initialValues={formData}
        onFinish={handleFormSubmit}
        layout="vertical"
        form={form}
      >
        <Form.Item name="tableId" label="Table ID" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name="tableName"
          label="Tên bàn"
          rules={[{ required: true, message: "Please enter Table Name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="deviceCode"
          label="Tên truy cập"
          rules={[{ required: true, message: "Please enter Device Code" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="devicePassword"
          label="Mật khẩu"
          rules={[{ required: true, message: "Please enter Device Password" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button
            loading={loading}
            className="mx-auto bg-red-800 text-white"
            htmlType="submit"
          >
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default UpdateTableModal;
