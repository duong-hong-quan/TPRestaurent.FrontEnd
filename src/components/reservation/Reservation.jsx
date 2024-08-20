import { Button, Form, Input, DatePicker, message } from "antd";
import { UserOutlined, MailOutlined, TeamOutlined } from "@ant-design/icons";
import { addNewCustomerInfo, sendOtp } from "../../api/acccountApi";
import { useState } from "react";
import OtpConfirmModal from "../../pages/login/OtpConfirmModal";
import { ModalReservation } from "./ModalReservation";
import reservationImage from "../../assets/imgs/reservation.png";
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const Reservation = () => {
  const [form] = Form.useForm();
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [isReservationModalVisible, setIsReservationModalVisible] =
    useState(false);

  const [resOtp, setResOtp] = useState(null);
  const [information, setInformation] = useState({});
  const [isOtpSuccess, setIsOtpSuccess] = useState(false);
  const [otpType, setOtpType] = useState(null);
  const onFinish = async (values) => {
    setInformation(values);
    setIsReservationModalVisible(true);
    debugger;
    const response = await addNewCustomerInfo({
      name: values.name,
      phoneNumber: values.phone.replace(/^\+84/, ""),
      address: null,
      accountId: null,
    });
    if (response?.isSuccess) {
      setIsReservationModalVisible(true);
    } else {
      // setInformation(response.result);
      // setInformation(values);
      console.log(values);

      setInformation({
        name: response.result.items[0].name,
        phone: response.result.items[0].phoneNumber,
        email: values.email,
        numberOfPeople: values.numberOfPeople,
        date: values.date,
        note: values.note,
        customerId: response.result.items[0].customerId,
        isVerified: response.result.items[0].isverified,
      });
    }
  };

  const handleSuccess = async (isSuccess) => {
    if (isSuccess) {
      message.success("Xác thực OTP thành công");
      const response = await addNewCustomerInfo({
        name: information.name,
        phoneNumber: information.phone.replace(/^\+84/, ""),
        address: null,
        accountId: null,
      });
      if (response?.isSuccess) {
        setIsReservationModalVisible(true);
      } else {
        // setInformation(response.result);
        // setInformation(values);

        setInformation({
          name: response.result.items[0].name,
          phone: response.result.items[0].phoneNumber,
          email: information.email,
          numberOfPeople: information.numberOfPeople,
          date: [information.date[0], information.date[1]],
          note: information.note,
          customerId: response.result.items[0].customerId,
          isVerified: response.result.items[0].isVerified,
        });
        console.log(information);
      }
      setIsOtpSuccess(true);
    } else {
      message.error("Xác thực OTP thất bại");
      setIsOtpSuccess(false);
    }
  };
  console.log(information);
  console.log(isReservationModalVisible);

  const handleOpenOtp = () => {
    setIsOtpModalVisible(true);
  };
  const handleCloseOtp = () => {
    setIsOtpModalVisible(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 rounded-2xl shadow-2xl">
      <h1 className="text-2xl font-bold uppercase mb-6 text-center">Đặt bàn</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="hidden md:block">
          <img
            src={reservationImage}
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
          otpType={1}
          handleSuccess={handleSuccess}
        />
      </div>
      <ModalReservation
        visible={isReservationModalVisible}
        onCancel={() => setIsReservationModalVisible(false)} //}
        information={information}
        handleCloseOtp={handleCloseOtp}
        handleOpenOtp={handleOpenOtp}
        isOtpSuccess={isOtpSuccess}
      />
    </div>
  );
};

export default Reservation;
