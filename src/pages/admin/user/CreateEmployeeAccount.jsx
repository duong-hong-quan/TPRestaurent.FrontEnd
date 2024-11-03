import React from "react";
import { Form, Input, Button, Radio, Alert } from "antd";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useCallApi from "../../../api/useCallApi";
import { AccountApi } from "../../../api/endpoint";
import { showError } from "../../../util/Utility";

const CreateEmployeeAccount = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { callApi, error, loading } = useCallApi();
  const handleFinish = async (values) => {
    const response = await callApi(
      `${AccountApi.CREATE_ACCOUNT_RESTAURANT_EMPLOYEE}`,
      "POST",
      values
    );
    if (response.isSuccess) {
      navigate("/admin/user-management");
    } else {
      showError(error);
    }
  };

  // Custom validation for phone number

  return (
    <div
      className="bg-white rounded-xl "
      style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}
    >
      <h2 className="text-center uppercase text-xl text-red-800 font-bold my-2">
        Tạo tài khoản nhân viên
      </h2>
      <Alert
        message="Lưu ý: tài khoản sau khi được tạo hệ thống sẽ gửi mã OTP về số điện thoại người dùng. Vui lòng nhắc nhở nhân viên kiểm tra tài khoản và đăng nhập, sau đó xác nhận OTP để vào hệ thống."
        type="warning"
        showIcon
        style={{ marginBottom: "1rem" }}
      />
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          gender: true,
          roleName: "shipper",
        }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter the email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item
          label="Tên đệm và tên"
          name="firstName"
          rules={[{ required: true, message: "Please enter the first name" }]}
        >
          <Input placeholder="Tên đệm và tên của nhân viên" />
        </Form.Item>

        <Form.Item
          label="Họ"
          name="lastName"
          rules={[{ required: true, message: "Please enter the last name" }]}
        >
          <Input placeholder="Họ của nhân viên" />
        </Form.Item>

        <Form.Item
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: "Please select a gender" }]}
        >
          <Radio.Group>
            <Radio value={true}>Nam</Radio>
            <Radio value={false}>Nữ</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phoneNumber"
          rules={[
            { required: true, message: "Please enter the phone number" },
            {
              pattern: /^[1-9]\d{8,9}$/,
              message: "Số điện thoại không hợp lệ. Vui lòng kiểm tra lại.",
            },
          ]}
        >
          <Input prefix={"+84"} placeholder="Số điện thoại của nhân viên" />
        </Form.Item>

        <Form.Item
          label="Vai trò của người dùng trong hệ thống"
          name="roleName"
          rules={[{ required: true, message: "Please select a role" }]}
        >
          <Radio.Group>
            <Radio value="shipper">Shipper</Radio>
            <Radio value="chef">Nhân viên nhà bếp</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item>
          <Button
            loading={loading}
            className="bg-red-800 text-white"
            htmlType="submit"
            block
          >
            Tạo tài khoản
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateEmployeeAccount;
