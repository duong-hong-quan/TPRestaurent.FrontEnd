import React, { useState } from "react";
import { Modal, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import {
  loginWithOtp,
  verifyCustomerInfoOTP,
  verifyForReservation,
} from "../../api/acccountApi";

const OtpConfirmModal = ({
  visible,
  onClose,
  resOtp,
  phoneNumber,
  otpType,
  handleSuccess,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const navigate = useNavigate();
  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleSubmit = async () => {
    const otpString = otp.join("");
    switch (otpType) {
      case 0:
        const resposne = await loginWithOtp({
          phoneNumber: phoneNumber,
          otp: otpString,
        });
        if (resposne?.isSuccess) {
          localStorage.setItem("token", resposne?.result?.token);
          localStorage.setItem("refreshToken", resposne?.result?.refreshToken);
          message.success("Đăng nhập thành công");
          navigate("/");
          onClose();
        } else {
          message.error("Đăng nhập thất bại");
        }
        break;
      case 1:
        // Send OTP to your backend for verification
        break;
      case 9:
        // Send OTP to your backend for verification
        const data = await verifyCustomerInfoOTP(phoneNumber, otpString, 1);
        if (data?.isSuccess) {
          handleSuccess();
          onClose();
        } else {
          message.error("Đã xảy ra lỗi, vui lòng thử lại sau");
        }
        break;
      default:
        message.error("Đã xảy ra loi, vui lòng thử lại sau");
        break;
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      className="font-sans"
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-[rgb(192,29,46)]">
          Nhập mã xác thực OTP
        </h2>
        <p className="text-center mb-8 text-gray-600">
          Vui lòng điền mã OTP được gửi đến số điện thoại của bạn.
        </p>
        <div className="flex justify-center space-x-2 mb-8">
          {otp.map((digit, index) => (
            <Input
              key={index}
              id={`otp-${index}`}
              className="w-12 h-12 text-center text-xl border-2 border-[rgb(192,29,46)] rounded-lg focus:border-[rgb(192,29,46)] focus:ring-2 focus:ring-[rgb(192,29,46,0.5)]"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              maxLength={1}
            />
          ))}
        </div>
        <Button
          onClick={handleSubmit}
          className="w-full h-12 bg-[rgb(192,29,46)] hover:bg-[rgb(172,26,41)] focus:bg-[rgb(172,26,41)] border-none text-white text-lg font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Xác nhận
        </Button>

        <p className="text-center mt-4 text-gray-600">
          Không nhận được mã OTP?
          <p>Vui lòng nhập mã OTP được gửi đến số điện thoại của bạn.</p>
          <a href="#" className="text-[rgb(192,29,46)] hover:underline">
            Gửi lại OTP
          </a>
        </p>
      </div>
    </Modal>
  );
};

export default OtpConfirmModal;
