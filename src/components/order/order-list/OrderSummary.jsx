import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody } from "@material-tailwind/react";
import {
  caculateFinalPrice,
  formatPrice,
  showError,
} from "../../../util/Utility";
import ReservationInformation from "../reservation/ReservationInformation";
import { Button, message, Modal, Tag, Typography } from "antd";
import PaymentMethodSelector from "../../cart/PaymentMethodSelector";
import { useState } from "react";
import useCallApi from "../../../api/useCallApi";
import LoadingOverlay from "../../loading/LoadingOverlay";
import { CouponApi, OrderApi } from "../../../api/endpoint";
import { useNavigate } from "react-router-dom";
import {
  clearCart,
  getTotal,
} from "../../../redux/features/cartReservationSlice";
import {
  clearCartReservation,
  decreaseComboQuantity,
  increaseComboQuantity,
  removeCombo,
} from "../../../redux/features/cartSlice";
import Card_Logo from "../../../assets/imgs/payment-icon/Cash_Logo.png";
import MoMo_Logo from "../../../assets/imgs/payment-icon/MoMo_Logo.png";
import Cash_Logo from "../../../assets/imgs/payment-icon/Cash_Logo.png";

import VNpay_Logo from "../../../assets/imgs/payment-icon/VNpay_Logo.png";
import CartCombosTable from "../../cart/CartCombosTable";
import { CartSingleTable } from "../../cart/CartSingleTable";
import CouponSelectionModal from "../../coupon/CouponSelectionModal";
const OrderSummary = ({ back, data, information, dateDeposit, deposit }) => {
  const cartReservation = useSelector((state) => state.cartReservation);
  const cartCombos = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [selectedMethod, setSelectedMethod] = useState(2);
  const { callApi, error, loading } = useCallApi();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isModalCouponVisible, setIsModalCouponVisible] = useState(false);
  const [couponsData, setCouponsData] = useState([]);
  const [selectedCoupons, setSelectedCoupons] = useState([]);
  const cartTotal = useSelector(getTotal);

  const user = useSelector((state) => state.user.user || {});
  const handleSelectCoupons = (coupons) => {
    setSelectedCoupons(coupons);
  };

  const totalPercentDiscount = () => {
    return couponsData
      .filter((coupon) => selectedCoupons.includes(coupon.couponId))
      .reduce((acc, coupon) => {
        return acc + coupon.couponProgram.discountPercent;
      }, 0);
  };
  const renderPreviewCoupon = () => {
    return couponsData
      .filter((coupon) => selectedCoupons.includes(coupon.couponId))
      .map((coupon) => (
        <Tag className="bg-red-800 text-white" key={coupon.couponId}>
          {`Giảm ${coupon.couponProgram.discountPercent}% `}
        </Tag>
      ));
  };

  const renderAfterPrice = () => {
    let totalBefore = cartCombos.total
      ? cartCombos.total + (cartTotal || 0)
      : cartTotal;
    return caculateFinalPrice(
      totalBefore,
      totalPercentDiscount(),
      0,
      0,
      deposit
    );
  };
  const handleCoupons = async () => {
    setIsModalCouponVisible(true);
    const response = await callApi(
      `${CouponApi.GET_AVAILABLE_COUPON_BY_ACCOUNT_ID}/${user.id}/1/100`,
      "GET"
    );
    if (response.isSuccess) {
      setCouponsData(response.result?.items);
    } else {
      showError(response.messages);
    }
  };
  const handleDecreaseComboQuantity = (comboId, selectedDishes) => {
    dispatch(decreaseComboQuantity({ comboId, selectedDishes }));
  };
  const handleIncreaseComboQuantity = (comboId, selectedDishes) => {
    dispatch(increaseComboQuantity({ comboId, selectedDishes }));
  };
  const handleRemoveCombo = (comboId, selectedDishes) => {
    dispatch(removeCombo({ comboId, selectedDishes }));
  };
  const total = useSelector(getTotal) + cartCombos.total;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeMethod = (data) => {
    setSelectedMethod(data);
    handleClose();
  };

  const handleCheckOut = async () => {
    const updatedData = {
      ...data,
      reservationOrder: {
        ...data.reservationOrder,
        paymentMethod: selectedMethod,
      },
    };
    const response = await callApi(
      `${OrderApi.CREATE_ORDER}`,
      "POST",
      updatedData
    );
    if (response.isSuccess) {
      message.success(`Đặt thành công`);
      dispatch(clearCart());
      dispatch(clearCartReservation());
      if (selectedMethod === 3 || selectedMethod === 2) {
        if (response.result.paymentLink) {
          window.location.href = response.result.paymentLink;
        }
      } else {
        navigate(`/order-history?phoneNumber=${information.phoneNumber}`);
      }
    } else {
      showError(response.messages);
    }
  };

  const selectedPaymentMethodIcon = () => {
    switch (selectedMethod) {
      case 1:
        return <img src={Card_Logo} alt="" className="w-10 h-10" />;
      case 2:
        return <img src={VNpay_Logo} alt="" className="w-10 h-10" />;
      case 3:
        return <img src={MoMo_Logo} alt="" className="w-10 h-10" />;
      case 5:
        return <img src={Cash_Logo} alt="" className="w-10 h-10" />;

      default:
        return null;
    }
  };

  return (
    <div className="container">
      <Typography className="text-xl text-red-900 text-center font-bold my-2">
        KIỂM TRA THÔNG TIN ĐẶT BÀN VÀ TIẾN HÀNH ĐẶT CỌC
      </Typography>
      <div className="px-10 my-2 gap-4 grid grid-cols-1 md:grid-cols-2 ">
        <ReservationInformation reservation={information} />
        <Card className="w-full  shadow-none border-none">
          <CardBody>
            <Typography className="text-xl font-semibold">
              Thông tin đặt cọc
            </Typography>
            <div className="flex justify-between my-4">
              <Typography className="text-[#333333] ">
                Số tiền đặt cọc (đã kèm tiền đặt bàn và tiền cọc cho đồ ăn):
              </Typography>
              <Typography className="text-base font-bold">
                {formatPrice(data.reservationOrder.deposit) ||
                  formatPrice(deposit)}
              </Typography>
            </div>
            <div className="flex justify-between items-center my-4">
              <Typography className="text-[#333333] ">
                Chọn phương thức thanh toán:
              </Typography>
              <div className="flex items-center">
                <span className="mx-2"> {selectedPaymentMethodIcon()}</span>
                <Button
                  className="bg-red-800 text-white hover:bg-red-600"
                  onClick={handleClickOpen}
                >
                  Chọn
                </Button>
              </div>
            </div>
            {/* <div className="flex justify-between items-center my-4">
              <Typography className="text-[#333333] ">Voucher</Typography>
              <div className="flex items-center">
                {renderPreviewCoupon()}
                <button
                  className="bg-red-800 hover:bg-red-800 text-white px-4 py-1 rounded-md transition duration-300"
                  onClick={() => handleCoupons()}
                >
                  Chọn
                </button>
              </div>
            </div> */}

            <div className="flex justify-between my-4">
              <Typography className="text-red-800 font-bold ">
                Tổng tiền sau khi trừ cọc và khuyến mãi:{" "}
              </Typography>
              <Typography className="text-base">
                {formatPrice(renderAfterPrice())}
              </Typography>
            </div>
            <div className="flex justify-between items-center my-4">
              <Typography className="text-red-800 font-bold ">
                Hạn đặt cọc: {dateDeposit}
              </Typography>
              <Typography className="text-base"></Typography>
            </div>
            <p className="font-bold">
              <i className="fas fa-exclamation-circle"></i> Số tiền đặt cọc sẽ
              được trừ vào bill thanh toán sau khi dùng bữa tại nhà hàng!. Nếu
              sau thời gian này bạn không thanh toán, số tiền đặt cọc sẽ không
              được hoàn lại.
            </p>
          </CardBody>
        </Card>
      </div>
      <div className="px-10">
        <div className="flex justify-end">
          <Button
            className="bg-red-800 my-2 text-white hover:bg-red-600"
            onClick={back}
          >
            Sửa đặt món
          </Button>
        </div>
        <CartSingleTable
          cartItems={cartReservation}
          isDisabled={true}
          key={cartReservation.length}
        />
        <CartCombosTable
          cartCombos={cartCombos}
          formatPrice={formatPrice}
          handleDecreaseComboQuantity={handleDecreaseComboQuantity}
          handleIncreaseComboQuantity={handleIncreaseComboQuantity}
          handleRemoveCombo={handleRemoveCombo}
          isDisabled={true}
        />
        <div className="flex justify-center w-full mt-10">
          <Button
            className="bg-red-800 my-2 text-white hover:bg-red-600"
            onClick={handleCheckOut}
            loading={loading}
          >
            Tiến hành thanh toán
          </Button>
        </div>
      </div>
      <div>
        <Modal
          open={open}
          onCancel={handleClose}
          footer={[
            <Button key="cancel" onClick={handleClose}>
              Cancel
            </Button>,
          ]}
        >
          <PaymentMethodSelector handleChange={handleChangeMethod} />
        </Modal>
      </div>
      <CouponSelectionModal
        visible={isModalCouponVisible}
        onClose={() => setIsModalCouponVisible(false)}
        coupons={couponsData}
        onSelectCoupons={handleSelectCoupons}
        totalPrice={renderAfterPrice()}
      />
    </div>
  );
};

export default OrderSummary;
