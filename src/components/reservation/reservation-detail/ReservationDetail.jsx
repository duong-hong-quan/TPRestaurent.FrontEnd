import React from "react";
import {
  Card,
  CardBody,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Chip,
} from "@material-tailwind/react";
import { formatDateTime, formatPrice } from "../../../util/Utility";
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
          Ngày đặt: {formatDateTime(reservation?.reservationDate)}
        </Typography>
        <Typography color="blue-gray" className="font-medium" textGradient>
          Tiền đặt cọc: {formatPrice(reservation?.deposit)}
        </Typography>

        <List>
          {reservationDishes?.length > 0 &&
            reservationDishes.map((dish) => (
              <React.Fragment key={dish.reservationDishId}>
                <ListItem>
                  <ListItemPrefix>
                    <img
                      src={
                        dish.dishSizeDetail?.dish?.image ||
                        dish.comboDish?.combo?.image
                      }
                      alt={
                        dish.dishSizeDetail?.dish?.name ||
                        dish.comboDish?.combo?.name
                      }
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </ListItemPrefix>
                  <div>
                    {dish.comboDish ? (
                      <>
                        <NavLink to={`/combo/${dish.comboDish.combo.comboId}`}>
                          <Typography variant="h6" color="blue-gray">
                            {dish.comboDish.combo.name}
                          </Typography>
                        </NavLink>
                        <Typography
                          variant="small"
                          color="gray"
                          className="font-normal"
                        >
                          Combo
                        </Typography>
                      </>
                    ) : (
                      <>
                        <NavLink
                          to={`/product/${dish.dishSizeDetail.dish.dishId}`}
                        >
                          <Typography variant="h6" color="blue-gray">
                            {dish.dishSizeDetail.dish.name}
                          </Typography>
                        </NavLink>
                        <Typography
                          variant="small"
                          color="gray"
                          className="font-normal"
                        >
                          Size: {dish.dishSizeDetail.dishSize.vietnameseName}
                        </Typography>
                      </>
                    )}
                  </div>
                  <Chip
                    value={formatPrice(
                      dish.dishSizeDetail?.price || dish.comboDish?.combo?.price
                    )}
                    className="ml-auto"
                  />
                </ListItem>

                {dish.comboDish && (
                  <List className="pl-8">
                    {dish.comboDish?.dishCombos?.map((comboDish) => (
                      <ListItem key={comboDish.dishComboId}>
                        <ListItemPrefix>
                          <img
                            src={comboDish.dishSizeDetail?.dish?.image}
                            alt={comboDish.dishSizeDetail?.dish?.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        </ListItemPrefix>
                        <div>
                          <Typography variant="small" color="blue-gray">
                            {comboDish.dishSizeDetail?.dish?.name}
                          </Typography>
                          <Typography
                            variant="small"
                            color="gray"
                            className="font-normal"
                          >
                            Size:{" "}
                            {comboDish.dishSizeDetail?.dishSize?.vietnameseName.toLowerCase()}
                            , Số lượng: {comboDish.quantity}
                          </Typography>
                        </div>
                      </ListItem>
                    ))}
                  </List>
                )}
              </React.Fragment>
            ))}
        </List>
      </CardBody>
    </Card>
  );
};

export default ReservationDetail;