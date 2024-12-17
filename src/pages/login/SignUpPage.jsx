import React, { useState } from "react";
import { Button, Input, Form, Select } from "antd";
import useCallApi from "../../api/useCallApi";
import { showError } from "../../util/Utility";
import { NavLink, useNavigate } from "react-router-dom";
import { AccountApi } from "../../api/endpoint";

const SignupPage = () => {
  const [form] = Form.useForm();
  const { callApi, loading } = useCallApi();
  const navigate = useNavigate();

  const handleSignup = async (values) => {
    try {
      // Prepare signup payload
      const signupPayload = {
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        gender: values.gender,
        phoneNumber: values.phoneNumber,
      };

      const response = await callApi(
        `${AccountApi.CREATE_ACCOUNT}`,
        "POST",
        signupPayload
      );

      if (response?.isSuccess) {
        // Redirect to login or show success message
        navigate("/login?phoneNumber=" + values.phoneNumber);
      } else {
        showError(response?.messages);
      }
    } catch (error) {
      showError("Đăng ký không thành công. Vui lòng thử lại.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 overflow-hidden">
      <div className="flex flex-col md:flex-row max-w-6xl bg-white rounded-lg shadow-lg w-full relative ">
        {/* Animated Image Container */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-center ">
          <h1 className="text-2xl font-bold text-center text-red-700 mb-4">
            Đăng Ký Tài Khoản
          </h1>
          <Form
            form={form}
            className="flex flex-col gap-4"
            onFinish={handleSignup}
            layout="vertical"
          >
            <div className="flex gap-4">
              <Form.Item
                name="firstName"
                label="Họ"
                className="flex-1"
                rules={[{ required: true, message: "Vui lòng nhập họ" }]}
              >
                <Input placeholder="Nhập họ" />
              </Form.Item>
              <Form.Item
                name="lastName"
                label="Tên"
                className="flex-1"
                rules={[{ required: true, message: "Vui lòng nhập tên" }]}
              >
                <Input placeholder="Nhập tên" />
              </Form.Item>
            </div>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input placeholder="Nhập địa chỉ email" />
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
                {
                  pattern: /^[1-9]\d{8,9}$/,
                  message: "Số điện thoại không hợp lệ. Vui lòng kiểm tra lại.",
                },
              ]}
            >
              <Input
                prefix="+84"
                placeholder="Nhập số điện thoại"
                className="border border-gray-300 rounded"
              />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Giới tính"
              rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
            >
              <Select placeholder="Chọn giới tính">
                <Select.Option value={true}>Nam</Select.Option>
                <Select.Option value={false}>Nữ</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-red-700 hover:bg-red-800 w-full"
                loading={loading}
              >
                Đăng Ký
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div
          className="w-full md:w-1/2 p-6 absolute md:relative top-0 left-0
       animate-fadeIn"
        >
          <img
            src="https://firebasestorage.googleapis.com/v0/b/hcqs-project.appspot.com/o/dish%2F3c771bba-0fd0-4fa5-8905-29e7a4be739d.jpg.png?alt=media&token=cad2f33d-bf71-479a-be6a-d6dec49a8c39&fbclid=IwY2xjawHJJm9leHRuA2FlbQIxMAABHSYoP-MTcwdq7faGJDo0OXHitbt57z7TdpShIzLKHgFFH0PvPlv9cYnafw_aem_cFI7Wh5oBc54r5LZ50JcWw"
            alt="Signup"
            className="w-full h-auto rounded-lg"
          />
          <NavLink
            className="block text-center my-2 text-xl text-red-800 animate-pulse "
            to={"/login"}
          >
            Trở về đăng nhập
          </NavLink>
        </div>
        {/* Signup Form Container */}
      </div>
    </div>
  );
};

export default SignupPage;
