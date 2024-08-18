import { PhoneOutlined } from "@ant-design/icons";
import { Button, Input, Tooltip } from "antd";
import { useState, useEffect } from "react";
import OtpConfirmModal from "./OtpConfirmModal";
import { toast } from "react-toastify";
import LoadingOverlay from "../../components/loading/LoadingOverlay";
import { sendOtp } from "../../api/acccountApi";
import loginImage from "../../assets/imgs/login.png";
const LoginPage = () => {
  const [phone, setPhone] = useState("+84");
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [resOtp, setResOtp] = useState(null);

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\+84\d{9}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      if (!validatePhoneNumber(phone)) {
        toast.error("Số điện thoại không hợp lệ. Vui lòng nhập lại.");
        return;
      }
      setIsLoading(true);
      const phoneNumberWithoutPrefix = phone.replace(/^\+84/, "");
      const data = await sendOtp(phoneNumberWithoutPrefix, 0);
      if (data?.isSuccess) {
        setResOtp(data?.result);
        setIsOtpModalVisible(true);
        setCountdown(60);
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let timer;
    if (isOtpModalVisible && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsOtpModalVisible(false);
    }
    return () => clearInterval(timer);
  }, [isOtpModalVisible, countdown]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <LoadingOverlay isLoading={isLoading} />
      <div className="flex flex-col md:flex-row max-w-6xl bg-white rounded-lg shadow-lg w-full">
        {/* Image section */}
        <div className="w-full md:w-1/2 p-6">
          <img
            src={loginImage}
            alt="Login"
            className="w-full h-auto rounded-lg"
          />
        </div>

        {/* Form section */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-center text-red-700 mb-4">
            Đăng nhập
          </h1>
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <label htmlFor="phone" className="text-red-700">
              Số điện thoại
            </label>
            <Input
              id="phone"
              placeholder="Nhập số điện thoại"
              prefix={<PhoneOutlined />}
              className="border border-gray-300 rounded"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Button
              type="primary"
              className="bg-red-700 hover:bg-red-800 w-full"
              htmlType="submit"
            >
              Đăng nhập ngay
            </Button>
          </form>
        </div>
      </div>
      <OtpConfirmModal
        visible={isOtpModalVisible}
        countdown={countdown}
        onClose={() => setIsOtpModalVisible(false)}
        resOtp={resOtp}
        phoneNumber={`0${phone.replace(/^\+84/, "")}`}
        otpType={0}
      />
    </div>
  );
};

export default LoginPage;
