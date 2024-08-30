import {
  Button,
  Form,
  Input,
  DatePicker,
  message,
  Select,
  Checkbox,
} from "antd";
import { UserOutlined, MailOutlined, TeamOutlined } from "@ant-design/icons";
import { addNewCustomerInfo } from "../../api/acccountApi";
import { useState, useEffect } from "react";
import OtpConfirmModal from "../../pages/login/OtpConfirmModal";
import { ModalReservation } from "./ModalReservation";
import reservationImage from "../../assets/imgs/reservation.png";
import moment from "moment";
import { convertToISOString, formatPhoneNumber } from "../../util/Utility";
import { suggestTable } from "../../api/reservationApi";
const { TextArea } = Input;

const Reservation = () => {
  const [form] = Form.useForm();
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [isReservationModalVisible, setIsReservationModalVisible] =
    useState(false);
  const [isValid, setIsValid] = useState(false);
  const [information, setInformation] = useState({});
  const [isOtpSuccess, setIsOtpSuccess] = useState(false);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [endTimeSlots, setEndTimeSlots] = useState([]);
  const [isValidatePhone, setIsValidatePhone] = useState(false);
  useEffect(() => {
    const now = moment();
    const roundedStartTime = now
      .clone()
      .minute(Math.ceil(now.minute() / 30) * 30)
      .second(0);
    const initialStartTime = roundedStartTime.isBefore(now)
      ? roundedStartTime.add(30, "minutes")
      : roundedStartTime;
    const initialEndTime = initialStartTime
      .clone()
      .add(1, "hour")
      .format("HH:mm");
    form.setFieldsValue({
      startTime: initialStartTime.format("HH:mm"),
      endTime: initialEndTime,
    });
    setSelectedEndTime(initialEndTime);
    setEndTimeSlots(generateEndTimeSlots(initialStartTime));
  }, [form]);

  const handlePhoneChange = (e) => {
    const cleanedPhone = e.target.value.replace(/\s+/g, "");
    form.setFieldsValue({ phone: cleanedPhone });
    if (form.getFieldValue("phone") && isValidatePhone) {
      setIsValid(false);
    }
  };

  const handlePhoneBlur = async (e) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    form.setFieldsValue({ phone: formattedPhone });
  };
  const onFinish = async (values) => {
    // message.error("Hiện tại các bàn dành cho 2 người đã đầy");
    // const combinedDate = [values.date, values.startTime, values.endTime];
    // setInformation({ ...values, date: combinedDate });
    // setIsReservationModalVisible(true);
    // const response = await addNewCustomerInfo({
    //   name: values.name,
    //   phoneNumber: values.phone.replace(/^\+84/, ""),
    //   address: null,
    //   accountId: null,
    // });
    // if (response?.isSuccess) {
    //   setIsReservationModalVisible(true);
    // } else {
    //   setInformation({
    //     name: response.result.items[0].name,
    //     phone: response.result.items[0].phoneNumber,
    //     email: values.email,
    //     numberOfPeople: values.numberOfPeople,
    //     date: combinedDate,
    //     note: values.note,
    //     customerId: response.result.items[0].customerId,
    //     isVerified: response.result.items[0].isverified,
    //   });
    // }
    const combinedDate = [
      form.getFieldValue("date"),
      form.getFieldValue("startTime"),
      form.getFieldValue("endTime"),
    ];
    console.log(convertToISOString(combinedDate));
    const responseSuggessTable = await suggestTable({
      startTime: convertToISOString(combinedDate)[0],
      endTime: convertToISOString(combinedDate)[1],
      numOfPeople: form.getFieldValue("numberOfPeople"),
      isPrivate: form.getFieldValue("isPrivate"),
    });
    if (responseSuggessTable?.isSuccess) {
      if (responseSuggessTable?.result?.length > 0) {
        setInformation({
          ...information,
          date: convertToISOString(combinedDate),
          numberOfPeople: form.getFieldValue("numberOfPeople"),
          note: form.getFieldValue("note"),
        });
        message.success("Hệ thống chúng tôi đã tìm ra bàn phù hợp với bạn");
        setIsReservationModalVisible(true);
      } else if (responseSuggessTable?.result === null) {
        message.error("Hiện tại không còn bàn trống");
      }
    }
  };

  const handleSuccess = async (isSuccess) => {
    if (isSuccess) {
      message.success("Xác thực thành công");
      setIsValidatePhone(true);
      setIsValid(true);
    } else {
      message.error("Xác thực thất bại");
    }
  };

  const handleOpenOtp = () => {
    setIsOtpModalVisible(true);
  };
  const handleCloseOtp = () => {
    setIsOtpModalVisible(false);
  };

  const disabledDate = (current) => {
    return current && current < moment().startOf("day");
  };

  const generateTimeSlots = () => {
    const times = [];
    const start = moment().startOf("day").hour(10); // Start at 10:00
    const end = moment().startOf("day").hour(22); // End at 22:00
    while (start <= end) {
      times.push(start.format("HH:mm"));
      start.add(30, "minutes");
    }
    return times;
  };

  const generateEndTimeSlots = (startTime) => {
    const times = generateTimeSlots();
    const startMoment = moment(startTime, "HH:mm");
    return times.filter((time) => moment(time, "HH:mm").isAfter(startMoment));
  };

  const timeSlots = generateTimeSlots();

  const handleStartTimeChange = (value) => {
    const newEndTime = moment(value, "HH:mm").add(1, "hour").format("HH:mm");
    setSelectedEndTime(newEndTime);
    form.setFieldsValue({ endTime: newEndTime });
    setEndTimeSlots(generateEndTimeSlots(value));
  };

  const filteredTimeSlots = timeSlots.filter((time) =>
    moment(time, "HH:mm").isAfter(moment())
  );
  const handleValidatePhone = async () => {
    debugger;
    const response = await addNewCustomerInfo({
      name: form.getFieldValue("name"),
      phoneNumber: form.getFieldValue("phone").replace(/\s+/g, ""),
      address: null,
      accountId: null,
    });
    if (response !== null) {
      setInformation({
        name: response?.result?.name,
        phone: response?.result?.phoneNumber,
        email: form.getFieldValue("email"),
        numberOfPeople: form.getFieldValue("numberOfPeople"),
        date: null,
        note: form.getFieldValue("note"),
        customerId: response?.result?.customerId,
        isVerified: response?.result?.isVerified,
      });
      if (response?.isSuccess) {
        setIsOtpModalVisible(true);
      } else {
        setIsValid(true);
        setIsValidatePhone(true);
      }
    }
  };
  if (isReservationModalVisible) {
    return (
      <ModalReservation
        visible={isReservationModalVisible}
        onCancel={() => setIsReservationModalVisible(false)}
        information={information}
        handleCloseOtp={handleCloseOtp}
        handleOpenOtp={handleOpenOtp}
        isOtpSuccess={isOtpSuccess}
      />
    );
  }
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
              label="Họ và tên"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
              ]}
            >
              <Input
                prefix={`+84`}
                placeholder="Số điện thoại"
                onChange={handlePhoneChange}
                onBlur={handlePhoneBlur}
              />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ type: "email", message: "Email không hợp lệ" }]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>

            {!isValid && (
              <Button
                onClick={handleValidatePhone}
                className="bg-red-800 text-white mb-4"
              >
                Xác thực số điện thoại{" "}
              </Button>
            )}

            <Form.Item
              label="Số lượng người"
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
                disabled={!isValidatePhone}
              />
            </Form.Item>
            <div className="flex flex-col md:flex-row">
              <Form.Item
                label="Ngày"
                name="date"
                rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
              >
                <DatePicker
                  className="w-full"
                  format={"DD/MM/YYYY"}
                  disabledDate={disabledDate}
                  placeholder="Chọn ngày"
                  disabled={!isValidatePhone}
                />
              </Form.Item>
              <Form.Item
                label="Giờ bắt đầu"
                name="startTime"
                rules={[
                  { required: true, message: "Vui lòng nhập giờ bắt đầu" },
                ]}
                className="md:mx-4"
              >
                <Select
                  className="w-full"
                  placeholder="Chọn giờ bắt đầu"
                  onChange={handleStartTimeChange}
                  disabled={!isValidatePhone}
                >
                  {filteredTimeSlots.map((time) => (
                    <Select.Option key={time} value={time}>
                      {time}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Giờ kết thúc"
                name="endTime"
                rules={[
                  { required: true, message: "Vui lòng nhập giờ kết thúc" },
                ]}
              >
                <Select
                  className="w-full"
                  placeholder="Chọn giờ kết thúc"
                  value={selectedEndTime}
                  disabled={!isValidatePhone}
                >
                  {endTimeSlots.map((time) => (
                    <Select.Option key={time} value={time}>
                      {time}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <Form.Item name="isPrivate" valuePropName="checked">
              <Checkbox disabled={!isValidatePhone}>Đặt bàn riêng tư</Checkbox>
            </Form.Item>
            <Form.Item name="note" label="Ghi chú">
              <TextArea
                rows={4}
                placeholder="Ghi chú"
                disabled={!isValidatePhone}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-[#A31927] hover:bg-[#8B1621] text-white hover:text-white"
                disabled={!isValidatePhone}
              >
                Đặt bàn
              </Button>
            </Form.Item>
          </Form>
        </div>
        <OtpConfirmModal
          visible={isOtpModalVisible}
          onClose={() => setIsOtpModalVisible(false)}
          resOtp={null}
          phoneNumber={form.getFieldValue("phone")?.replace(/\s+/g, "")}
          otpType={1}
          handleSuccess={handleSuccess}
        />
      </div>
    </div>
  );
};

export default Reservation;
