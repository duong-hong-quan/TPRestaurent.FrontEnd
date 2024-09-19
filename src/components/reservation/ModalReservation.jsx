import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Tabs, message, Button, Modal } from "antd";
import { Typography } from "@material-tailwind/react";

import { getComboById } from "../../api/comboApi";
import { createReservation } from "../../api/reservationApi";
import { sendCustomerInfoOtp } from "../../api/acccountApi";

import {
  addToCart,
  clearCart,
  getTotal,
} from "../../redux/features/cartReservationSlice";
import { clearCartReservation } from "../../redux/features/cartSlice";

import ReservationInformation from "./ReservationInformation";
import { ReservationCart } from "./ReservationCart";
import ComboDetail2 from "../../pages/common/menu-page/ComboDetail";

import {
  formatDate,
  formatPrice,
  mergeCartData,
  showError,
} from "../../util/Utility";
import useCallApi from "../../api/useCallApi";
import { ComboApi, DishApi, OrderApi } from "../../api/endpoint";
import DishCard from "../dish/DishCard";
import ComboCard from "../combo/ComboCard";
import OrderSummary from "./reservation-list/OrderSummary";

const { TabPane } = Tabs;

const ModalReservation = ({
  visible,
  onCancel,
  information,
  handleOpenOtp,
}) => {
  const [dishes, setDishes] = useState([]);
  const [combos, setCombos] = useState([]);
  const [activeTab, setActiveTab] = useState("0");
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedCombos, setSelectedCombos] = useState(null);
  const [combo, setCombo] = useState({});
  const [isOpenComboDetail, setIsOpenComboDetail] = useState(false);
  const [deposit, setDeposit] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cartReservation);
  const cartCombo = useSelector((state) => state.cart);
  const cartTotal = useSelector(getTotal);
  const cartReservation = useSelector((state) => state.cartReservation);
  const [totalItems, setTotalItems] = useState(0);
  const { callApi, error, loading } = useCallApi();
  const [isSummary, setIsSummary] = useState(false);
  const [dataSend, setDataSend] = useState({});

  console.log(cart);
  const caculatorItems = () => {
    let total = 0;
    total += cart?.items?.length;
    total += cartReservation?.length;
    return total;
  };
  useEffect(() => {
    setTotalItems(caculatorItems());
  }, [cart, cartReservation]);
  const fetchData = useCallback(async () => {
    try {
      const dishesData = await callApi(`${DishApi.GET_ALL}/${1}/${10}`, "GET");
      const combosData = await callApi(`${ComboApi.GET_ALL}/${1}/${10}`, "GET");
      if (dishesData?.result?.items && combosData?.result) {
        setDishes(dishesData.result.items);
        setCombos(combosData.result);
      } else {
        throw new Error("Failed to load products");
      }
    } catch (error) {
      message.error("Failed to load products: " + error.message);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      fetchData();
    }
    handleDeposit();
  }, [visible, fetchData]);

  useEffect(() => {
    if (selectedCombos) {
      fetchComboDetail();
    }
  }, [selectedCombos, isOpenComboDetail]);

  useEffect(() => {
    handleDeposit();
  }, [cartCombo, cart]);

  const handleAddToCart = (dish, size) => {
    dispatch(addToCart({ dish, size, quantity: 1 }));
  };

  const handleTabChange = (key) => setActiveTab(key);

  const handleSizeClick = (dish, size) => {
    setSelectedSizes((prevSizes) => ({
      ...prevSizes,
      dish: dish,
      size: size,
    }));
  };

  const getCurrentPrice = (dishId) => {
    const dish = dishes.find((dish) => dish.dish.dishId === dishId);
    if (dish && selectedSizes) {
      const sizeDetail = dish.dishSizeDetails.find(
        (size) => size === selectedSizes.size
      );
      return sizeDetail ? sizeDetail.price : 0;
    }
    return 0;
  };

  const fetchComboDetail = async () => {
    const response = await getComboById(selectedCombos);
    if (response.isSuccess) {
      setCombo(response.result);
    }
  };
  const handleCheckout = async () => {
    if (!information.customerId || information.isVerified === false) {
      const response = await sendCustomerInfoOtp(information.phone, 1);
      if (response?.isSuccess) {
        handleOpenOtp();
        return;
      } else {
        message.error("Failed to send OTP");
      }
    }

    const data = mergeCartData(cart, cartCombo, {
      reservationDate: information?.date?.[0],
      endTime: information?.date?.[1],
      customerId: information.customerId,
      deposit: deposit,
      numberOfPeople: information.numberOfPeople,
    });
    const { reservationDishDtos } = data;
    setDataSend({
      customerId: information.customerId,
      orderType: 1,
      note: information.note,
      orderDetailsDtos: reservationDishDtos,
      reservationOrder: {
        numberOfPeople: information.numberOfPeople,
        mealTime: information.date[0],
        endTime: information.date[1],
        isPrivate: information.isPrivate,
        deposit: deposit,
      },
    });
    console.log(dataSend);
  };

  const handleDeposit = async () => {
    if (cartCombo.length > 0 || cart.length > 0) {
      const data = await callApi(
        `${OrderApi.CALCULATE_RESERVATION}`,
        "POST",
        mergeCartData(cart, cartCombo, {
          reservationDate: information.date[0],
          endTime: information.date[1],
          customerInfoId: information.customerId,
          numberOfPeople: information.numberOfPeople,
          deposit: 0,
        })
      );
      if (data.isSuccess) {
        setDeposit(data?.result);
      } else {
        showError(data.messages);
      }
    }
  };

  const renderDishCard = (dish) => (
    <DishCard
      dish={dish}
      formatPrice={formatPrice}
      getCurrentPrice={getCurrentPrice}
      handleAddToCart={handleAddToCart}
      handleSizeClick={handleSizeClick}
      selectedSizes={selectedSizes}
      key={"card"}
    />
  );

  const renderComboCard = (combo) => (
    <ComboCard
      formatDate={formatDate}
      formatPrice={formatPrice}
      onClick={() => {
        setIsOpenComboDetail(true);
        setSelectedCombos(combo.comboId);
      }}
      combo={combo}
      key={"cardcombo"}
    />
  );
  return (
    <div className="mt-10">
      <Modal
        open={visible}
        width={1700}
        // style={{ height: "calc(100vh - 100px)" }}
        footer={null}
        onCancel={onCancel}
      >
        {!isSummary && (
          <div className="grid grid-cols-1 md:grid-cols-4 max-h-[80vh] overflow-auto rounded-2xl pl-6">
            <div className="col-span-3">
              <Tabs activeKey={activeTab} onChange={handleTabChange}>
                <TabPane
                  tab="Món ăn"
                  key="0"
                  style={{ overflow: "auto", maxHeight: "600px" }}
                >
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 mt-2">
                    {dishes.map(renderDishCard)}
                  </div>
                </TabPane>
                <TabPane
                  tab="Combo món"
                  key="1"
                  style={{ overflow: "auto", maxHeight: "600px" }}
                >
                  {isOpenComboDetail ? (
                    <ComboDetail2
                      comboData={combo}
                      handleBack={() => setIsOpenComboDetail(false)}
                    />
                  ) : (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                      {combos?.map(renderComboCard)}
                    </div>
                  )}
                </TabPane>
              </Tabs>
            </div>
            <div className="col-span-1">
              <ReservationInformation reservation={information} />
              <ReservationCart />
              {cart.length > 0 && (
                <div className=" w-full flex justify-center items-center flex-col">
                  <Typography
                    variant="h5"
                    className="font-bold text-red-700 text-center"
                  >
                    Tổng cộng: {formatPrice(cartTotal + cartCombo.total)}
                  </Typography>
                  <p>Số tiền cọc dự kiến: {formatPrice(deposit)}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end col-span-4 gap-2 m-3">
              <Button
                className="bg-red-800 rounded-md text-white mt-10"
                onClick={onCancel}
              >
                Back
              </Button>
              <Button
                className="bg-red-800 rounded-md text-white mt-10"
                onClick={() => {
                  setIsSummary(true);
                  handleCheckout();
                }}
              >
                Đặt bàn ngay
              </Button>
            </div>
          </div>
        )}
        {isSummary && (
          <OrderSummary
            data={dataSend}
            information={information}
            back={() => setIsSummary(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default ModalReservation;
