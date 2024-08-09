import React, { useState } from "react";
import { Modal, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";

const OtpConfirmModal = ({ visible, onClose, countdown, resOtp }) => {
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

  const handleSubmit = () => {
    const otpString = otp.join("");
    if (otpString === resOtp.code) {
      // Here you would typically send the OTP to your backend for verification
      console.log("Submitting OTP:", otpString);
      message.success("Đăng nhập thành công");
      navigate("/");
      onClose();
    } else {
      message.error("Vui lòng nhập đuúng mã OTP");
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      className="font-sans"
      bodyStyle={{ backgroundColor: "rgb(192, 29, 46, 0.05)" }}
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
          <p>Thời gian còn lại: {countdown} giây</p>
          <a href="#" className="text-[rgb(192,29,46)] hover:underline">
            Gửi lại OTP
          </a>
        </p>
      </div>
    </Modal>
  );
};

export default OtpConfirmModal;
