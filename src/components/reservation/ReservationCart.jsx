// src/components/Cart.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../../redux/features/cartReservationSlice";
import { formatPrice } from "../../util/Utility";
import {
  Card,
  CardBody,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { PlusIcon, MinusIcon, TrashIcon } from "@heroicons/react/24/solid";

export function ReservationCart() {
  const cart = useSelector((state) => state.cartReservation);
  const dispatch = useDispatch();

  return (
    <Card className="w-full shadow-lg">
      <Typography variant="h4" className="mb-4">
        Giỏ hàng
      </Typography>
      <CardBody className="p-4  h-[400px] overflow-y-scroll">
        {cart.length === 0 ? (
          <Typography color="blue-gray" className="text-center my-4">
            Giỏ hàng trống
          </Typography>
        ) : (
          cart.map((item) => (
            <div
              key={`${item.dish.dishId}-${item.size}`}
              className="flex items-start gap-4 py-4 border-b"
            >
              <img
                src={item.dish.image}
                alt={item.dish.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <Typography variant="h6" color="blue-gray">
                      {item.dish.name}
                    </Typography>
                    <Typography color="blue-gray" className="text-sm">
                      {item.size}
                    </Typography>
                    <Typography color="blue-gray" className="font-medium">
                      {formatPrice(item.price)}
                    </Typography>
                  </div>
                  <Typography color="blue-gray" className="font-medium">
                    x{item.quantity}
                  </Typography>
                </div>
                <div className="flex justify-end items-center gap-2">
                  <IconButton
                    variant="text"
                    color="blue-gray"
                    size="sm"
                    onClick={() =>
                      dispatch(
                        decreaseQuantity({
                          dishId: item.dish.dishId,
                          size: item.size,
                        })
                      )
                    }
                  >
                    <MinusIcon className="h-4 w-4" />
                  </IconButton>
                  <Typography
                    color="blue-gray"
                    className="font-medium w-6 text-center"
                  >
                    {item.quantity}
                  </Typography>
                  <IconButton
                    variant="text"
                    color="blue-gray"
                    size="sm"
                    onClick={() =>
                      dispatch(
                        increaseQuantity({
                          dishId: item.dish.dishId,
                          size: item.size,
                        })
                      )
                    }
                  >
                    <PlusIcon className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    variant="text"
                    color="red"
                    size="sm"
                    onClick={() =>
                      dispatch(
                        removeFromCart({
                          dishId: item.dish.dishId,
                          size: item.size,
                        })
                      )
                    }
                  >
                    <TrashIcon className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>
            </div>
          ))
        )}
      </CardBody>
    </Card>
  );
}
