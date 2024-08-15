import {
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  message,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  TeamOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { loginWithOtp, sendOtp } from "../../api/acccountApi";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import OtpConfirmModal from "../../pages/login/OtpConfirmModal";
import { ModalReservation } from "./ModalReservation";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const Reservation = () => {
  const [form] = Form.useForm();
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [isReservationModalVisible, setIsReservationModalVisible] =
    useState(false);

  const [resOtp, setResOtp] = useState(null);
  const [information, setInformation] = useState({});
  const onFinish = async (values) => {
    setInformation(values);

    const response = await sendOtp(values.phone, 9);
    if (response?.isSuccess) {
      message.success("Mã OTP đã được gửi đến số điện thoại của bạn.");
      setIsOtpModalVisible(true);
      setResOtp(response?.result);
    } else {
      // response?.messages.forEach((item) => message.error(item));
      if (
        response?.messages?.includes(
          "Tài khoản không tồn tại hoặc chưa được xác thực"
        )
      ) {
        const phoneNumberWithoutPrefix = values.phone.replace(/^\+84/, "");
        const data = await sendOtp(phoneNumberWithoutPrefix, 0);
        if (data?.isSuccess) {
          setResOtp(data?.result);
          setIsOtpModalVisible(true);
        }
      }
    }
  };

  const handleSuccess = () => {
    setIsReservationModalVisible(true);
  };

  console.log(isReservationModalVisible);
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 rounded-2xl shadow-2xl">
      <h1 className="text-2xl font-bold uppercase mb-6 text-center">Đặt bàn</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="hidden md:block">
          <img
            src="https://s3-alpha-sig.figma.com/img/87b8/2510/60dce437200ff8b9998e58b286c200b9?Expires=1723420800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Ih6ll0mHCmJMvImd0pFViVGFkSLEWJegzJ5U9VXWcyg8Swz02MUgLsplp0P1XJ5SoF8hygPsJ2uRAy6q0dc8J6~FR4TVhpWRlwmkxAEYrrgS8ioHseR7iBDkoOyQK3k~Fzo~kV6pMz~L1McsxnG~tQ~ON9w38snaEgfF42FEokYL95vXs1UKs-LudFSndda8FnFUzWR-wScOW96XiZcVz0OWsWS9~uu~JXvA7ciNUQkwMYbsEBVXAQ2l2~XXV4S6RbXeVQattQPRNHbom37W0gpz8AGiIbquRwB66mtXC6-8qkg6Psaz29ctvgzAPr0kvbsSluGWBoS97p3ndOtGTg__"
            alt="Restaurant interior"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-[#A31927] mb-4">
            THÔNG TIN KHÁCH HÀNG
          </h2>
          <p className="text-gray-600 mb-6">
            Vui lòng đặt bàn trước giờ dùng ít nhất 1 giờ
          </p>
          <Form
            layout="vertical"
            form={form}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
            </Form.Item>
            <Form.Item
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
              ]}
            >
              <Input prefix={`+84`} placeholder="Số điện thoại" />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[{ type: "email", message: "Email không hợp lệ" }]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="numberOfPeople"
              rules={[
                { required: true, message: "Vui lòng nhập số lượng người" },
              ]}
            >
              <Input
                prefix={<TeamOutlined />}
                type="number"
                min={1}
                placeholder="Số lượng người"
              />
            </Form.Item>
            <Form.Item
              name="date"
              rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
            >
              <RangePicker
                showTime
                className="w-full"
                placeholder="Ngày: giờ"
                format={"DD/MM/YYYY HH:mm:ss"}
              />
            </Form.Item>
            {/* <Form.Item
              name="tableType"
              rules={[{ required: true, message: "Vui lòng chọn loại bàn" }]}
            >
              <Select placeholder="Chọn loại bàn">
                <Select.Option value="1">Bàn 2 người</Select.Option>
                <Select.Option value="2">Bàn 4 người</Select.Option>
                <Select.Option value="3">Bàn 6 người</Select.Option>
                <Select.Option value="4">Bàn 8 người</Select.Option>
              </Select>
            </Form.Item> */}
            <Form.Item name="note">
              <TextArea rows={4} placeholder="Ghi chú" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-[#A31927] hover:bg-[#8B1621]"
              >
                Đặt bàn
              </Button>
            </Form.Item>
          </Form>
        </div>
        <OtpConfirmModal
          visible={isOtpModalVisible}
          onClose={() => setIsOtpModalVisible(false)}
          resOtp={resOtp}
          phoneNumber={form.getFieldValue("phone")}
          otpType={9}
          handleSuccess={handleSuccess}
        />
      </div>
      <ModalReservation
        visible={isReservationModalVisible}
        onCancel={() => setIsReservationModalVisible(false)} //}
        information={information}
      />
    </div>
  );
};

export default Reservation;
