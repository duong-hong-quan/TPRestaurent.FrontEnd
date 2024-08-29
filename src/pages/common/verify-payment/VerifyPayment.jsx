import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { HomePage } from "../home-page/HomePage";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { updateReservationStatus } from "../../../api/reservationApi";
import { set } from "react-hook-form";
import { changeOrderStatus } from "../../../api/orderApi";
import { addToStoreCredit } from "../../../api/storeCreditApi";
import { message } from "antd";
import { decodeHashing } from "../../../api/hashingApi";

const VerifyPayment = () => {
  const location = useLocation();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVNPAY, setIsVNPAY] = useState(false);

  const handleUrl = async () => {
    debugger;
    setModalIsOpen(true);
    const searchParams = new URLSearchParams(location.search);
    const vnpResponseCode = searchParams.get("vnp_ResponseCode");
    const partnerCode = searchParams.get("partnerCode");
    const resultCode = searchParams.get("resultCode");
    const orderInfo = searchParams.get("vnp_OrderInfo");
    const id = searchParams.get("vnp_TxnRef");
    const typeData = await decodeHashing(
      orderInfo,
      "tprestauranttprestauranttprestau"
    );

    if (vnpResponseCode) {
      setIsVNPAY(true);
      const vnpOrderInfo = decodeURIComponent(
        searchParams.get("vnp_OrderInfo")
      );
      if (vnpResponseCode === "00") {
        if (typeData.includes("CR")) {
          const parts = typeData.split("_");
          const id = parts[1];
          const data = await addToStoreCredit(id, parts[2]);
          if (data?.isSuccess) {
            setModalMessage("Nạp tiền vào ví thành công");
          } else {
            data?.messages.forEach((message) => {
              setModalMessage(message);
            });
          }
        } else {
          switch (typeData) {
            case "RE":
              const data = await updateReservationStatus(id, 2);
              if (data?.isSuccess) {
                setModalMessage("Thanh toán thành công");
              } else {
                setModalMessage("Thanh toán thất bại");
              }
              break;
            case "OR":
              const dataOr = await changeOrderStatus(id, true);
              if (dataOr?.isSuccess) {
                setModalMessage("Thanh toán thành công");
              } else {
                setModalMessage("Thanh toán thất bại");
              }
              break;
          }
        }

        setIsSuccess(true);
      } else {
        setModalMessage(
          `Thanh toán VNPay thất bại cho đơn hàng: ${vnpOrderInfo}. Vui lòng thanh toán lại`
        );
        setIsSuccess(false);
      }
      setModalIsOpen(true);
    } else if (partnerCode === "MOMO") {
      const orderInfo = decodeURIComponent(searchParams.get("orderInfo"));
      if (resultCode === "0") {
        setModalMessage(`${orderInfo}`);
        setIsSuccess(true);
      } else {
        setModalMessage(
          `Thanh toán Momo thất bại cho đơn hàng: ${orderInfo}. Vui lòng thanh toán lại`
        );
        setIsSuccess(false);
      }
      setModalIsOpen(true);
    }
  };
  useEffect(() => {
    handleUrl();
  }, [location]);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <HomePage />
      {modalIsOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Card className="w-96 shadow-xl">
            <CardHeader
              variant="gradient"
              color={isSuccess ? "green" : "red"}
              className="mb-4 grid h-28 place-items-center"
            >
              <Typography variant="h3" color="white">
                Thông báo
              </Typography>
            </CardHeader>
            <CardBody className="flex flex-col items-center text-center px-6">
              {isSuccess ? (
                <CheckCircleIcon className="w-20 h-20 text-green-500 mb-4" />
              ) : (
                <XCircleIcon className="w-20 h-20 text-red-500 mb-4" />
              )}
              <Typography
                variant="h5"
                color={isSuccess ? "green" : "red"}
                className="mb-2 font-bold"
              >
                Thanh toán {isSuccess ? "Thành công" : "Thất bại"}
              </Typography>
              <Typography
                variant="h5"
                color={isSuccess ? "green" : "red"}
                className="mb-4 font-bold"
              >
                với {isVNPAY ? "VNPAY" : "MOMO"}
              </Typography>
              <Typography className="font-normal text-blue-gray-600">
                {modalMessage}
              </Typography>
            </CardBody>
            <CardFooter className="pt-0">
              <Button
                variant="gradient"
                color={isSuccess ? "green" : "red"}
                onClick={closeModal}
                fullWidth
                className="shadow-md hover:shadow-lg transition-all duration-300"
              >
                Đóng
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};

export default VerifyPayment;
