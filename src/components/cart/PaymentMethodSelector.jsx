import { useState } from "react";
import { Card, CardBody, Typography, Radio } from "@material-tailwind/react";

export const PaymentMethod = {
  CASH: 1,
  VNPAY: 2,
  MOMO: 3,
  ZALOPAY: 4,
};

const PaymentMethodSelector = ({ handleChange }) => {
  const [selectedMethod, setSelectedMethod] = useState(PaymentMethod.CASH);

  const handleMethodChange = (value) => {
    setSelectedMethod(parseInt(value));
    handleChange(parseInt(value));
  };
  const mapLanguage = (key) => {
    console.log(key);
    switch (key) {
      case 1:
        return "Tiền mặt";
      case 2:
        return "VNPay";
      case 3:
        return "Momo";
      case 4:
        return "Zalo Pay";
      default:
        return "Chưa chọn phương thức";
    }
  };
  return (
    <Card className="mt-6">
      <CardBody className="flex flex-col gap-4">
        <Typography variant="h5" color="black">
          Chọn phương thức thanh toán
        </Typography>
        {Object.entries(PaymentMethod).map(([key, value]) => (
          <div key={key} className="flex items-center">
            <Radio
              name="payment-method"
              color="red"
              checked={selectedMethod === value}
              onChange={() => handleMethodChange(value)}
            />
            <Typography className="ml-2 font-bold">
              {mapLanguage(value)}
            </Typography>
            {getMethodIcon(key)}
          </div>
        ))}
      </CardBody>
    </Card>
  );
};

const getMethodIcon = (method) => {
  switch (method) {
    case "CASH":
      return <i className="fas fa-money-bill-wave ml-auto text-green-500"></i>;
    case "VNPAY":
      return <i className="fab fa-cc-visa ml-auto text-blue-500"></i>;
    case "MOMO":
      return <i className="fas fa-mobile-alt ml-auto text-pink-500"></i>;
    case "ZALOPAY":
      return <i className="fas fa-wallet ml-auto text-indigo-500"></i>;
    default:
      return null;
  }
};

export default PaymentMethodSelector;
