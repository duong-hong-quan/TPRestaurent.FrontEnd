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
  Button,
} from "@material-tailwind/react";
import { PlusIcon, MinusIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
  decreaseComboQuantity,
  increaseComboQuantity,
  removeCombo,
} from "../../redux/features/cartSlice";

export function ReservationCart() {
  const cartReservation = useSelector((state) => state.cartReservation);
  const cartCombos = useSelector((state) => state.cart);

  const dispatch = useDispatch();

  // Handlers for combo actions
  const handleIncreaseComboQuantity = (comboId) => {
    dispatch(increaseComboQuantity(comboId));
  };

  const handleDecreaseComboQuantity = (comboId) => {
    dispatch(decreaseComboQuantity(comboId));
  };

  const handleRemoveCombo = (comboId) => {
    dispatch(removeCombo(comboId));
  };

  // Handlers for reservation actions
  const handleIncreaseQuantity = (dishId, size) => {
    dispatch(
      increaseQuantity({
        dishId,
        size,
      })
    );
  };

  const handleDecreaseQuantity = (dishId, size) => {
    dispatch(
      decreaseQuantity({
        dishId,
        size,
      })
    );
  };

  const handleRemoveFromCart = (dishId, size) => {
    dispatch(
      removeFromCart({
        dishId,
        size,
      })
    );
  };

  console.log("--------------------------------aa", cartCombos);
  console.log("--------------------------------bb", cartReservation);

  return (
    <div className=" mx-auto my-10 bg-white rounded-lg shadow-lg">
      <Typography variant="h4" className="mb-4 text-center">
        Giỏ hàng
      </Typography>

      {/* Reservation Cart Section */}
      <Card className="w-full shadow-lg mb-8">
        <CardBody className="p-2 max-h-[400px] overflow-y-auto">
          {cartReservation.length === 0 ? (
            <Typography color="blue-gray" className="text-center my-4">
              Giỏ hàng trống
            </Typography>
          ) : (
            cartReservation.map((item) => (
              <div key={`${item.dish.dishId}-${item.size}`} className="">
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
                        handleDecreaseQuantity(item.dish.dishId, item.size)
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
                        handleIncreaseQuantity(item.dish.dishId, item.size)
                      }
                    >
                      <PlusIcon className="h-4 w-4" />
                    </IconButton>
                    <IconButton
                      variant="text"
                      color="red"
                      size="sm"
                      onClick={() =>
                        handleRemoveFromCart(item.dish.dishId, item.size)
                      }
                    >
                      <TrashIcon className="h-4 w-4" />
                    </IconButton>
                  </div>
                </div>
              </div>
            ))
          )}
          {cartCombos.items.length === 0 ? (
            <Typography color="blue-gray" className="text-center my-4">
              No combos in cart
            </Typography>
          ) : (
            cartCombos.items.map((item) => (
              <div key={item.comboId} className=" mb-4">
                <div>
                  <div className="flex flex-col justify-between items-start mb-4">
                    <p className="font-semibold ">{item.name}</p>
                    <p className="text-gray-600 mb-4">
                      Price: {item.price.toLocaleString()} VND
                    </p>
                    <div className="flex flex-col">
                      {Object.values(item.selectedDishes).length > 0 &&
                        Object.values(item.selectedDishes).map((dishCombos) =>
                          dishCombos.map((dishCombo, index) => (
                            <div key={index} className="space-y-4">
                              <div
                                key={`${index}-dish`}
                                className="flex flex-row  items-start justify-between"
                              >
                                <img
                                  src={dishCombo.dishSizeDetail?.dish?.image}
                                  alt={dishCombo.dishSizeDetail?.dish?.name}
                                  className="w-20 h-20 object-cover rounded-full border border-gray-200"
                                />
                                <div className="flex-1">
                                  <p className="font-medium">
                                    {dishCombo.dishSizeDetail?.dish?.name}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      <div className="w-full">
                        <div className=" flex justify-end items-center">
                          <IconButton
                            variant="text"
                            color="blue-gray"
                            size="sm"
                            onClick={() =>
                              handleDecreaseComboQuantity(item.comboId)
                            }
                          >
                            <MinusIcon className="h-4 w-4" />
                          </IconButton>

                          <Typography className="mx-2">
                            {item.quantity}
                          </Typography>
                          <IconButton
                            variant="text"
                            color="blue-gray"
                            size="sm"
                            onClick={() =>
                              handleIncreaseComboQuantity(item.comboId)
                            }
                          >
                            <PlusIcon className="h-4 w-4" />
                          </IconButton>

                          <IconButton
                            variant="text"
                            color="red"
                            size="sm"
                            onClick={() => handleRemoveCombo(item.comboId)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardBody>
      </Card>

      {/* Combo Cart Section */}
    </div>
  );
}
