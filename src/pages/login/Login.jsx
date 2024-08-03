import { PhoneOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useState, useEffect } from "react";
import OtpConfirmModal from "./OtpConfirmModal";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login success
    setIsOtpModalVisible(true);
    setCountdown(60); // Reset countdown
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
      <div className="flex max-w-4xl bg-white rounded-lg shadow-lg w-full">
        {/* Image section */}
        <div className="w-1/2 p-6">
          <img
            src="https://s3-alpha-sig.figma.com/img/b4f8/1dba/8a5eebe699e56d7734b4528f374f435b?Expires=1723420800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=lMn5S3O8VLHhPWzdwI0uk4l-eiN-BbsSkFokCOj7OgaH1ONw20rFnsuN7-5wsz6O5O0hrlKt~Gbc~QmvAPUS~WlBrtpn0e0beaQr0JzUOVpn1oYFlWAZY6TGIm2HU6NqMC3oJIYKsaaj~qw~txzTkYHR7clorH2p~W6NvKE-GLMlmCa1OZvmNkPrNJ3-PzUdKVymFi44Q~-JeDiOlj60bGBZ3o46G58IfMNEn6TrBelcX9S58CY27xgdIPN3MINyuwi1RLzfQ7uR2xSXlZpDsPbm1z-X1oH5na4rIeF-Vj826d-V8aQ94sr0G3q6qO9IZ5f4vW984asskjB3TQqwGg__"
            alt="Login"
            className="w-full h-auto rounded-lg"
          />
        </div>

        {/* Form section */}
        <div className="w-1/2 p-6">
          <h1 className="text-2xl font-bold text-center text-red-700 mb-4">
            Đăng nhập
          </h1>
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <label htmlFor="phone" className="text-gray-700">
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
      />
    </div>
  );
};

export default LoginPage;
