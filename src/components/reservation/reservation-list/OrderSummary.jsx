import { useSelector } from "react-redux";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { formatPrice, showError } from "../../../util/Utility";
import ReservationInformation from "../ReservationInformation";
import { Button, message } from "antd";
import PaymentMethodSelector from "../../cart/PaymentMethodSelector";
import { useState } from "react";
import useCallApi from "../../../api/useCallApi";
import LoadingOverlay from "../../loading/LoadingOverlay";
import { OrderApi } from "../../../api/endpoint";
import { useNavigate } from "react-router-dom";

const OrderSummary = ({ back, data, information }) => {
  console.log(data);
  const cartReservation = useSelector((state) => state.cartReservation);
  const cartCombos = useSelector((state) => state.cart);
  const [selectedMethod, setSelectedMethod] = useState(2);
  const { callApi, error, loading } = useCallApi();
  const navigate = useNavigate();
  const calculateTotalPrice = () => {
    const reservationTotal = cartReservation.reduce((total, item) => {
      return total + item.quantity * item.size.price;
    }, 0);

    const comboTotal = cartCombos.items.reduce((total, item) => {
      return total + item.quantity * item.combo.price;
    }, 0);

    return reservationTotal + comboTotal;
  };

  console.log(information);
  const handleChangeMethod = (data) => {
    setSelectedMethod(data);
  };
  const handleCheckOut = async () => {
    const updatedData = {
      ...data,
      reservationOrder: {
        ...data.reservationOrder,
        paymentMethod: selectedMethod,
      },
    };
    console.log(updatedData);
    const response = await callApi(
      `${OrderApi.CREATE_ORDER}`,
      "POST",
      updatedData
    );
    if (response.isSuccess) {
      message.success(`Đặt thành công`);
      navigate(`/order-history?phoneNumber=${information.phoneNumber}`);
    } else {
      showError(error);
    }
  };
  if (loading) {
    return <LoadingOverlay isLoading={loading} />;
  }
  return (
    <div className="grid grid-cols-2  h-[75vh] overflow-y-scroll">
      <div>
        <ReservationInformation reservation={information} />
        <PaymentMethodSelector handleChange={handleChangeMethod} />
      </div>
      <Card className="w-full max-w-md mx-auto">
        <CardBody>
          <div className="space-y-4">
            <div>
              <Typography variant="h6" className="mb-2">
                Món lẻ:
              </Typography>
              {cartReservation.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center mb-2"
                >
                  <Typography>
                    {item.dish.name} (
                    {item.size.dishSize?.vietnameseName ||
                      item.size.dishSize?.name}
                    ) x {item.quantity}
                  </Typography>
                  <Typography>
                    {formatPrice(item.quantity * item.size.price)}
                  </Typography>
                </div>
              ))}
            </div>

            <div>
              <Typography variant="h6" className="mb-2">
                Món combo:
              </Typography>
              {cartCombos.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center mb-2"
                >
                  <Typography>
                    {item.combo.name} x {item.quantity}
                  </Typography>
                  <Typography>
                    {formatPrice(item.quantity * item.combo.price)}
                  </Typography>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <Typography variant="h6">Tổng tiền phải cọc:</Typography>
                <Typography variant="h6" className="font-bold">
                  {formatPrice(data.reservationOrder.deposit)}
                </Typography>
              </div>
              <div className="flex justify-between items-center">
                <Typography variant="h6">Tổng cộng:</Typography>
                <Typography variant="h6" className="font-bold">
                  {formatPrice(calculateTotalPrice())}
                </Typography>
              </div>
            </div>
          </div>
        </CardBody>
        <div className="flex justify-end w-full mt-10">
          <Button onClick={handleCheckOut}>Check out</Button>
          <Button className="mx-2" onClick={back}>
            Back
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default OrderSummary;
