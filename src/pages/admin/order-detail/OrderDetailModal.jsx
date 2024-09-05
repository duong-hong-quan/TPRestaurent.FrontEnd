import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  Typography,
  Card,
  CardBody,
  CardFooter,
  Chip,
} from "@material-tailwind/react";

const OrderDetailModal = ({ order, handleOpen, open }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "CHỜ XỬ LÝ":
        return "red";
      case "ĐANG GIAO":
        return "amber";
      case "HOÀN THÀNH":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <>
      <Dialog open={open} handler={handleOpen} size="xl">
        <DialogBody className="h-[calc(100vh-10rem)] overflow-y-auto">
          <h3 className="text-2xl text-center font-bold mb-4">
            Chi Tiết Đơn Hàng
          </h3>
          <div className="w-full ">
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Typography
                    variant="h6"
                    color="red"
                    className="mb-4 font-bold"
                  >
                    Thông Tin Đơn Hàng
                  </Typography>
                  <Typography className="mb-2">
                    <span className="font-semibold">Mã Đơn Hàng:</span>{" "}
                    {order?.order?.orderId}
                  </Typography>
                  <Typography className="mb-2">
                    <span className="font-semibold">Ngày Đặt Hàng:</span>{" "}
                    {formatDate(order?.order?.orderDate)}
                  </Typography>
                  <Typography className="mb-2">
                    <span className="font-semibold">Tổng Tiền:</span>{" "}
                    {formatCurrency(order?.order?.totalAmount)}
                  </Typography>
                  <Typography className="mb-2 flex">
                    <span className="font-semibold">Trạng Thái:</span>{" "}
                    <Chip
                      value={order?.order?.status?.vietnameseName}
                      color={getStatusColor(
                        order?.order?.status?.vietnameseName
                      )}
                    />
                  </Typography>
                  <Typography className="mb-2">
                    <span className="font-semibold">
                      Phương Thức Thanh Toán:
                    </span>{" "}
                    {order?.order?.paymentMethod?.name}
                  </Typography>
                  <Typography className="mb-2">
                    <span className="font-semibold">Giao Hàng:</span>{" "}
                    {order?.order?.isDelivering ? "Có" : "Không"}
                  </Typography>
                </div>
                <div>
                  <Typography
                    variant="h6"
                    color="red"
                    className="mb-4 font-bold"
                  >
                    Thông Tin Khách Hàng
                  </Typography>
                  <Typography className="mb-2">
                    <span className="font-semibold">Tên:</span>{" "}
                    {order?.order?.customerInfo?.name}
                  </Typography>
                  <Typography className="mb-2">
                    <span className="font-semibold">Số Điện Thoại:</span>{" "}
                    {order?.order?.customerInfo?.phoneNumber}
                  </Typography>
                  <Typography className="mb-2">
                    <span className="font-semibold">Địa Chỉ:</span>{" "}
                    {order?.order?.customerInfo?.address}
                  </Typography>
                </div>
              </div>

              <Typography
                variant="h6"
                color="red"
                className="mt-8 mb-4 font-bold"
              >
                Chi Tiết Món Ăn
              </Typography>
              <div className="space-y-4">
                {order?.orderDetails?.map((item, index) => (
                  <Card key={index} className="mb-4 shadow-md">
                    <CardBody>
                      <div className="flex justify-between ">
                        <div className="flex">
                          <img
                            src={item.orderDetail?.dishSizeDetail?.dish?.image}
                            alt=""
                            className="w-20 h-20 object-cover rounded-lg mr-2"
                          />
                          <div>
                            <Typography variant="h6" color="red-gray">
                              {item.orderDetail?.dishSizeDetail?.dish?.name}
                            </Typography>
                            <Typography className="text-sm text-gray-600 mt-2">
                              Số Lượng: {item?.orderDetail?.quantity}
                            </Typography>
                            {item.orderDetail?.note && (
                              <Typography className="text-sm text-gray-600 mt-1">
                                Ghi Chú: {item.orderDetail?.note}
                              </Typography>
                            )}
                          </div>
                        </div>
                        <Typography className="font-bold">
                          {formatCurrency(item.orderDetail?.price)}
                        </Typography>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
            <CardFooter className="pt-0">
              <Typography variant="h5" color="red" className="font-bold">
                Tổng Cộng: {formatCurrency(order?.order?.totalAmount)}
              </Typography>
            </CardFooter>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Đóng</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default OrderDetailModal;
