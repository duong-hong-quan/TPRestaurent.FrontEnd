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
  const handleIncreaseComboQuantity = (comboId, selectedDishes) => {
    dispatch(increaseComboQuantity({ comboId, selectedDishes }));
  };

  const handleDecreaseComboQuantity = (comboId, selectedDishes) => {
    dispatch(decreaseComboQuantity({ comboId, selectedDishes }));
  };

  const handleRemoveCombo = (comboId, selectedDishes) => {
    dispatch(removeCombo({ comboId, selectedDishes }));
  };
  // Handlers for reservation actions
  const handleIncreaseQuantity = (dish, size) => {
    dispatch(
      increaseQuantity({
        dish,
        size,
      })
    );
  };

  const handleDecreaseQuantity = (dish, size) => {
    dispatch(
      decreaseQuantity({
        dish,
        size,
      })
    );
  };

  const handleRemoveFromCart = (dish, size) => {
    dispatch(
      removeFromCart({
        dish,
        size,
      })
    );
  };

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
              <div
                key={`${item?.dish.dishId}-${item?.size?.dishSizeDetailId}`}
                className="flex items-center mb-4"
              >
                <img
                  src={item?.dish?.image}
                  alt={item?.dish?.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-grow flex flex-col ml-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Typography variant="h6" color="blue-gray">
                        {item?.dish?.name}
                      </Typography>
                      <Typography color="blue-gray" className="text-sm">
                        {item?.size.dishSize?.vietnameseName ||
                          item?.size.dishSize?.name}
                      </Typography>
                      <Typography color="blue-gray" className="font-medium">
                        {formatPrice(item?.size?.price)}
                      </Typography>
                    </div>
                    <Typography color="blue-gray" className="font-medium">
                      x{item?.quantity}
                    </Typography>
                  </div>
                  <div className="flex justify-end items-center gap-2">
                    <IconButton
                      variant="text"
                      color="blue-gray"
                      size="sm"
                      onClick={() =>
                        handleDecreaseQuantity(item?.dish, item?.size)
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
                        handleIncreaseQuantity(item?.dish, item?.size)
                      }
                    >
                      <PlusIcon className="h-4 w-4" />
                    </IconButton>
                    <IconButton
                      variant="text"
                      color="red"
                      size="sm"
                      onClick={() =>
                        handleRemoveFromCart(item?.dish, item?.size)
                      }
                    >
                      <TrashIcon className="h-4 w-4" />
                    </IconButton>
                  </div>
                </div>
              </div>
            ))
          )}
          <hr />
          {cartCombos.items.length === 0 ? (
            <Typography color="blue-gray" className="text-center my-4">
              Chưa có combo nào trong giỏ hàng
            </Typography>
          ) : (
            cartCombos.items.map((item) => (
              <div key={item.comboId} className="mb-4">
                <h3 className="text-center font-bold text-xl my-2">Combo</h3>
                <div className="flex flex-col justify-between items-start mb-4">
                  <div className="w-full flex flex-col md:flex-row justify-between ">
                    <span className="font-semibold">{item.name}</span>
                    <span className="text-black font-bold mx-2">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                  <div className="flex flex-col w-full">
                    {Object.values(item.selectedDishes).map(
                      (dishCombos, dishIndex) =>
                        dishCombos.map((dishCombo, index) => (
                          <div
                            key={`${dishIndex}-${index}`}
                            className="space-y-4"
                          >
                            <div className="flex flex-row items-start justify-between">
                              <img
                                src={dishCombo.dishSizeDetail?.dish?.image}
                                alt={dishCombo.dishSizeDetail?.dish?.name}
                                className="w-20 h-20 object-cover rounded-full border border-gray-200"
                              />
                              <div className="flex-1 ml-4">
                                <p className="font-medium">
                                  {dishCombo.dishSizeDetail?.dish?.name}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                    <div className="w-full mt-4">
                      <div className="flex justify-end items-center">
                        <IconButton
                          variant="text"
                          color="blue-gray"
                          size="sm"
                          onClick={() =>
                            handleDecreaseComboQuantity(
                              item.comboId,
                              item.selectedDishes
                            )
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
                            handleIncreaseComboQuantity(
                              item.comboId,
                              item.selectedDishes
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
                            handleRemoveCombo(item.comboId, item.selectedDishes)
                          }
                        >
                          <TrashIcon className="h-4 w-4" />
                        </IconButton>
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