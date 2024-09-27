import { Button, message, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { formatPrice, isEmptyObject } from "../../../util/Utility";
import { getTotal } from "../../../redux/features/cartReservationSlice";
import {
  removeCombo,
  increaseComboQuantity,
  decreaseComboQuantity,
} from "../../../redux/features/cartSlice";
import CartCombosTable from "../../../components/cart/CartCombosTable";
import { CartSingleTable } from "../../../components/cart/CartSingleTable.jsx";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import CartSummary from "../../../components/cart/CartSummary.jsx";

const CartPage = () => {
  const cartReservation = useSelector((state) => state.cartReservation);
  const user = useSelector((state) => state.user.user || {});
  const [isSummary, setIsSummary] = useState(false);
  const cart = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartTotal = useSelector(getTotal);

  const handleDecreaseComboQuantity = (comboId, selectedDishes) => {
    dispatch(decreaseComboQuantity({ comboId, selectedDishes }));
  };
  const handleIncreaseComboQuantity = (comboId, selectedDishes) => {
    dispatch(increaseComboQuantity({ comboId, selectedDishes }));
  };
  const handleRemoveCombo = (comboId, selectedDishes) => {
    dispatch(removeCombo({ comboId, selectedDishes }));
  };
  const handleSummary = () => {
    if (isEmptyObject(user)) {
      message.error("Vui lòng đăng nhập để tiếp tục");
      return;
    }
    setIsSummary(true);
  };
  if (isSummary) {
    return <CartSummary handleClose={() => setIsSummary(false)} />;
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Giỏ hàng của bạn
      </h1>
      <>
        <CartSingleTable
          cartItems={cartReservation}
          formatPrice={formatPrice}
          isDisabled={false}
        />
        <div>
          <CartCombosTable
            cartCombos={cart}
            formatPrice={formatPrice}
            handleDecreaseComboQuantity={handleDecreaseComboQuantity}
            handleIncreaseComboQuantity={handleIncreaseComboQuantity}
            handleRemoveCombo={handleRemoveCombo}
            isDisabled={false}
          />
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg">Tạm tính:</span>
            <Typography
              variant="h2"
              className="font-bold text-red-700 text-center"
            >
              {!cart.total && formatPrice(cartTotal)}
              {cart.total && cartTotal && formatPrice(cart.total + cartTotal)}
            </Typography>
          </div>
          <div className="flex justify-center">
            <Button className="bg-red-900 text-white" onClick={handleSummary}>
              Tiến hành thanh toán
            </Button>
          </div>
        </div>
      </>
    </div>
  );
};

export default CartPage;
