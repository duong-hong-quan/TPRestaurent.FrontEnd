import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Upload,
  message,
  DatePicker,
  Modal,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import useCallApi from "../../../api/useCallApi";
import { AccountApi } from "../../../api/endpoint";
import { showError } from "../../../util/Utility";
import { login } from "../../../redux/features/authSlice";
import { set } from "lodash";
import { useNavigate } from "react-router-dom";
import PersonalInformation from "./PersonalInformation";
import OTP from "antd/es/input/OTP";
import OTPInput from "react-otp-input";
import dayjs from "dayjs";

const { Option } = Select;

const UpdateProfile = () => {
  const [form] = Form.useForm();
  const user = useSelector((state) => state.user.user || {});
  console.log(user);
  const { callApi, error, loading } = useCallApi();
  const [previewImage, setPreviewImage] = useState(null);
  const [file, setFile] = useState(null); // State to store the file object
  const [isDisabled, setIsDisabled] = useState(true);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(""); // State to store the OTP input

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fetchUser = async () => {
    const response = await callApi(
      `${AccountApi.GET_BY_PHONE}?phoneNumber=${user.phoneNumber}`,
      "GET"
    );
    if (response.isSuccess) {
      dispatch(login(response.result));
      if (user.isManuallyCreated) {
        message.warning(
          "Bạn cần cập nhật địa chỉ mua hàng tại đây, chúng tôi sẽ chuyển bạn trong vòng 3s tiếp theo"
        );
        setTimeout(() => {
          navigate("/user/address");
        }, 3000);
      }
    }
  };
  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("accountId", user.id);
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("dob", dayjs(values.dob).format("YYYY-MM-DD"));
    formData.append("gender", values.gender);
    if (file) {
      formData.append("Image", file);
    }
    const response = await callApi(
      `${AccountApi.UPDATE_ACCOUNT}`,
      "PUT",
      formData
    );
    if (response.isSuccess) {
      await fetchUser();
      message.success("Đã cập nhật thông tin thành công!");
    } else {
      showError(response.messages);
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleAvatarChange = (info) => {
    getBase64(info.file.originFileObj, (imageUrl) => setPreviewImage(imageUrl));
    setFile(info.file.originFileObj);
  };

  const getBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    form.setFieldsValue({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phoneNumber,
      dob: dayjs(user.dob),
      gender: user.gender,
      email: user.email,
    });
    setPreviewImage(user.avatar);
  }, [form, user]);
  const handleActiveTab = (tab) => {
    console.log("tab", tab);
    switch (tab) {
      case "0":
        navigate("/user");
        return;
      case "1":
        navigate("/user/address");
        break;
      case "2":
        navigate("/user/settings");
        break;

      default:
        navigate("/user");
        return;
    }
  };
  const handleChangeEmailRequest = async () => {
    const response = await callApi(
      `${AccountApi.CHANGE_EMAIL_REQUEST}?accountId=${
        user.id
      }&newEmail=${form.getFieldValue("email")}`,
      "POST"
    );
    if (response.isSuccess) {
      message.success("Đã gửi yêu cầu xác nhận email!");
      setShowOtpModal(true);
    } else {
      showError(response.messages);
    }
  };
  const handleOtpSubmit = async () => {
    const response = await callApi(
      `${AccountApi.VERIFY_CHANGE_EMAIL}?accountId=${
        user.id
      }&otpCode=${otp}&email=${form.getFieldValue("email")}`,
      "POST"
    );
    if (response.isSuccess) {
      await fetchUser();
      message.success("Email đã được xác nhận!");
      setShowOtpModal(false);
    } else {
      showError(response.messages);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="w-full lg:w-2/3">
              <PersonalInformation
                activeTab={0}
                setActiveTab={handleActiveTab}
              />

              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="space-y-6"
              >
                <Form.Item name="phone" label="Điện thoại">
                  <Input
                    prefix={"+84"}
                    disabled
                    className="w-full rounded-md"
                  />
                </Form.Item>
                <Form.Item name="email" label="Email">
                  <Input className="w-full rounded-md" />
                </Form.Item>
                {isDisabled && (
                  <Button
                    className="bg-red-900 text-white"
                    onClick={() => handleChangeEmailRequest()}
                    loading={loading}
                  >
                    Xác nhận email
                  </Button>
                )}

                <div className="lg:flex flex-1 gap-1">
                  <Form.Item
                    name="lastName"
                    label="Họ"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập họ của bạn!",
                      },
                    ]}
                  >
                    <Input className="w-full rounded-md" />
                  </Form.Item>
                  <Form.Item
                    name="firstName"
                    label="Tên"
                    rules={[
                      { required: true, message: "Vui lòng nhập tên của bạn!" },
                    ]}
                  >
                    <Input className="w-full rounded-md" />
                  </Form.Item>
                </div>
                <div className="flex">
                  <Form.Item
                    name="gender"
                    label="Giới tính"
                    rules={[
                      { required: true, message: "Vui lòng chọn giới tính!" },
                    ]}
                    className="mr-2"
                  >
                    <Select className="w-full rounded-md">
                      <Option value={true}>Nam</Option>
                      <Option value={false}>Nữ</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name="dob" label="Ngày sinh">
                    <DatePicker format={"DD-MM-YYYY"} />
                  </Form.Item>
                </div>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full bg-red-800 hover:bg-red-600 rounded-md"
                    loading={loading}
                  >
                    Cập nhật thông tin
                  </Button>
                </Form.Item>
              </Form>
            </div>

            <div className="w-full lg:w-1/3">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Ảnh đại diện
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
                  beforeUpload={(file) => {
                    const isJpgOrPng =
                      file.type === "image/jpeg" || file.type === "image/png";
                    if (!isJpgOrPng) {
                      message.error("Hệ thống chỉ nhận file JPG/PNG !");
                    }
                    const isLt2M = file.size / 1024 / 1024 < 2;
                    if (!isLt2M) {
                      message.error("Hệ thống chỉ cho phép tải ảnh dưới 2MB!");
                    }
                    return isJpgOrPng && isLt2M;
                  }}
                  onChange={handleAvatarChange}
                >
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="avatar"
                      style={{ width: "100%" }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-200 transition duration-300">
                      <UploadOutlined className="text-4xl text-gray-400 mb-2" />
                      <div className="text-sm text-gray-600">Upload</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={showOtpModal}
        onCancel={() => setShowOtpModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowOtpModal(false)}>
            Huỷ
          </Button>,
          <Button
            key="submit"
            className="bg-red-800 text-white"
            onClick={handleOtpSubmit}
            loading={loading}
          >
            Xác nhận
          </Button>,
        ]}
      >
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-xl font-bold mb-4">
            Nhập mã OTP đã được gửi đến email của bạn
          </h2>
          <OTP
            value={otp}
            onChange={(value) => {
              setOtp(value);
            }}
            placeholder="Enter OTP"
          />
        </div>
      </Modal>
    </div>
  );
};

export default UpdateProfile;
