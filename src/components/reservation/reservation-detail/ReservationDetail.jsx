import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Chip,
} from "@material-tailwind/react";
import { formatPrice } from "../../../util/Utility";
import { NavLink } from "react-router-dom";

const ReservationDetail = ({ reservationData }) => {
  const { reservation, reservationDishes } = reservationData;

  return (
    <Card>
      <CardBody className="text-center">
        <Typography variant="h4" color="blue-gray" className="mb-2">
          Chi tiết đặt chỗ
        </Typography>
        <Typography color="blue-gray" className="font-medium" textGradient>
          Mã đặt chỗ: {reservation?.reservationId.substring(0, 8)}
        </Typography>
        <Typography color="blue-gray" className="font-medium" textGradient>
          Ngày đặt:{" "}
          {new Date(reservation?.reservationDate).toLocaleString("vi-VN")}
        </Typography>
        <Typography color="blue-gray" className="font-medium" textGradient>
          Tiền đặt cọc: {reservation?.deposit.toLocaleString("vi-VN")} VNĐ
        </Typography>

        <List>
          {reservationDishes?.length > 0 &&
            reservationDishes.map((dish) => (
              <ListItem key={dish.reservationDishId}>
                <ListItemPrefix>
                  <img
                    src={dish.dishSizeDetail?.dish?.image || dish.combo?.image}
                    alt={dish.dishSizeDetail?.dish?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </ListItemPrefix>
                <div>
                  {dish.dishSizeDetail === null ? (
                    <>
                      <NavLink to={`/combo/${dish.combo?.comboId}`}>
                        {dish.combo?.name}
                      </NavLink>
                    </>
                  ) : (
                    <>
                      <NavLink
                        to={`/product/${dish.dishSizeDetail?.dish?.dishId}`}
                      >
                        <Typography variant="h6" color="blue-gray">
                          {dish.dishSizeDetail?.dish?.name || dish.combo?.name}
                        </Typography>
                      </NavLink>
                    </>
                  )}

                  <Typography
                    variant="small"
                    color="gray"
                    className="font-normal"
                  >
                    Số lượng: {dish.quantity}
                  </Typography>
                </div>
                <Chip
                  value={`${formatPrice(
                    dish.dishSizeDetail?.price || dish.combo?.price
                  )}`}
                  className="ml-auto"
                />
              </ListItem>
            ))}
        </List>
      </CardBody>
    </Card>
  );
};

export default ReservationDetail;
