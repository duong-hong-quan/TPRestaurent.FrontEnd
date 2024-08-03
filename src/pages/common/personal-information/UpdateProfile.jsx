import React from "react";
import { Form, Input, DatePicker, Select, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";

const { Option } = Select;

const UpdateProfile = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Form values:", values);
    message.success("Profile updated successfully");
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <div className=" min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="w-full lg:w-2/3">
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                  gender: "male",
                  birthday: moment("2000-01-01"),
                }}
                className="space-y-6"
              >
                <Form.Item
                  name="fullName"
                  label="Họ và tên"
                  rules={[
                    { required: true, message: "Please input your full name!" },
                  ]}
                >
                  <Input className="w-full rounded-md" />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="Điện thoại"
                  rules={[
                    {
                      required: true,
                      message: "Please input your phone number!",
                    },
                  ]}
                >
                  <Input className="w-full rounded-md" />
                </Form.Item>

                <Form.Item
                  name="birthday"
                  label="Ngày sinh"
                  rules={[
                    { required: true, message: "Please select your birthday!" },
                  ]}
                >
                  <DatePicker
                    className="w-full rounded-md"
                    format={"DD/MM/YYYY"}
                  />
                </Form.Item>

                <Form.Item
                  name="gender"
                  label="Giới tính"
                  rules={[
                    { required: true, message: "Please select your gender!" },
                  ]}
                >
                  <Select className="w-full rounded-md">
                    <Option value="male">Nam</Option>
                    <Option value="female">Nữ</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Please input your email!" },
                    { type: "email", message: "Please enter a valid email!" },
                  ]}
                >
                  <Input className="w-full rounded-md" />
                </Form.Item>

                <Form.Item
                  name="address"
                  label="Địa chỉ"
                  rules={[
                    { required: true, message: "Please input your address!" },
                  ]}
                >
                  <Input.TextArea className="w-full rounded-md" rows={4} />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full bg-red-800 hover:bg-red-600 rounded-md"
                  >
                    Cập nhật thông tin
                  </Button>
                </Form.Item>
              </Form>
            </div>

            <div className="w-full lg:w-1/3">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Profile Picture
              </h2>
              <Form.Item
                name="avatar"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  beforeUpload={(file) => {
                    const isJpgOrPng =
                      file.type === "image/jpeg" || file.type === "image/png";
                    if (!isJpgOrPng) {
                      message.error("You can only upload JPG/PNG file!");
                    }
                    const isLt2M = file.size / 1024 / 1024 < 2;
                    if (!isLt2M) {
                      message.error("Image must smaller than 2MB!");
                    }
                    return isJpgOrPng && isLt2M;
                  }}
                >
                  <div className="flex flex-col items-center justify-center p-8 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-200 transition duration-300">
                    <UploadOutlined className="text-4xl text-gray-400 mb-2" />
                    <div className="text-sm text-gray-600">Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
