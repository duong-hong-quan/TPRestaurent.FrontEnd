import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Modal, Tabs, message, Button } from "antd";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";

import { getAllDishes } from "../../api/dishApi";
import { getAllCombo, getComboById } from "../../api/comboApi";
import { calculateDeposit, createReservation } from "../../api/reservationApi";
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

import { formatDate, formatPrice, mergeCartData } from "../../util/Utility";

const { TabPane } = Tabs;

const ModalReservation = ({
  visible,
  onCancel,
  information,
  handleOpenOtp,
  handleCloseOtp,
  isOtpSuccess,
}) => {
  const [dishes, setDishes] = useState([]);
  const [combos, setCombos] = useState([]);
  const [activeTab, setActiveTab] = useState("0");
  const [rightSideTab, setRightSideTab] = useState("1");
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
  console.log(cart);
  const caculatorItems = () => {
    let total = 0;
    total += cart.items.length;
    total += cartReservation.length;
    return total;
  };
  useEffect(() => {
    setTotalItems(caculatorItems());
  }, [cart, cartReservation]);
  const fetchData = useCallback(async () => {
    try {
      const [dishesData, combosData] = await Promise.all([
        getAllDishes("", 1, 10),
        getAllCombo("", 1, 10),
      ]);

      if (dishesData?.result?.items && combosData?.result?.items) {
        setDishes(dishesData.result.items);
        setCombos(combosData.result.items);
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
  const handleRightSideTabChange = (key) => setRightSideTab(key);

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
      customerInfoId: information.customerId,
      deposit: deposit,
      numberOfPeople: information.numberOfPeople,
    });

    const responseReservation = await createReservation(data);
    if (responseReservation.isSuccess) {
      message.success("Đặt bàn thành công");
      dispatch(clearCart());
      dispatch(clearCartReservation());
      navigate("/order-history");
    } else {
      responseReservation.messages.forEach((mess) => {
        message.error(mess);
      });
    }
  };

  const handleDeposit = async () => {
    if (cartCombo.length > 0 || cart.length > 0) {
      const data = await calculateDeposit(
        mergeCartData(cart, cartCombo, {
          reservationDate: information.date[0],
          endTime: information.date[1],
          customerInfoId: information.customerId,
          numberOfPeople: information.numberOfPeople,
          deposit: 0,
        })
      );
      if (data.isSuccess) {
        setDeposit(data?.result?.deposit);
      } else {
        message.error("Failed to calculate deposit: " + data.message);
      }
    }
  };

  const renderDishCard = (dish) => (
    <Card
      key={dish?.dish?.dishId}
      className="mt-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <CardHeader color="blue-gray" className="relative h-56">
        <img
          src={dish?.dish?.image}
          alt={dish?.dish?.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute top-2 right-2 bg-red-800 text-white px-2 py-1 rounded-full text-xs">
          {dish.dish?.dishItemType?.name}
        </div>
      </CardHeader>
      <CardBody className="p-4">
        <Typography
          variant="h5"
          className="mb-2 text-center text-red-800 font-bold"
        >
          {dish?.dish?.name}
        </Typography>
        <Typography className="text-gray-600 text-sm text-center">
          {dish?.dish?.description}
        </Typography>
      </CardBody>
      <CardFooter className="pt-0 pb-4">
        <div className="flex justify-center space-x-2 mb-3">
          {dish?.dishSizeDetails?.map((size) => (
            <button
              key={size.dishSizeDetailId}
              onClick={() => handleSizeClick(dish.dish, size)}
              className={`px-2 py-1 rounded-md border ${
                selectedSizes?.size?.dishSizeDetailId === size.dishSizeDetailId
                  ? "bg-red-800 text-white"
                  : "bg-white text-red-800"
              } font-semibold transition-colors duration-300`}
            >
              {size.dishSize?.vietnameseName || size.dishSize?.name}
            </button>
          ))}
        </div>
        <Typography className="text-center text-lg font-semibold mb-3">
          Giá:{" "}
          <span className="text-red-800">
            {getCurrentPrice(dish.dish.dishId) === 0
              ? formatPrice(dish?.dishSizeDetails?.[0].price)
              : formatPrice(getCurrentPrice(dish.dish.dishId))}
          </span>
        </Typography>
        <Button
          onClick={() => {
            handleAddToCart(
              dish.dish,
              selectedSizes?.size || dish.dishSizeDetails[0]
            );
            message.success("Đã thêm vào giỏ hàng");
          }}
          className="w-full mx-auto bg-red-800 text-white"
        >
          Chọn
        </Button>
      </CardFooter>
    </Card>
  );

  const renderComboCard = (combo) => (
    <Card key={combo.comboId} className="m-4">
      <CardHeader color="blue" className="relative h-56">
        <img
          src={combo?.image}
          alt={combo?.name}
          className="h-full w-full object-cover"
        />
      </CardHeader>
      <CardBody>
        <Typography variant="h5" className="mb-2">
          {combo?.name}
        </Typography>
        <Typography>{combo?.description}</Typography>
        <Typography className="mt-4">
          <span className="font-bold">Giá:</span> {formatPrice(combo?.price)}
        </Typography>
        {combo?.discount > 0 && (
          <Typography className="mt-2 text-red-500">
            <span className="font-bold">Giảm:</span> {combo?.discount}%
          </Typography>
        )}
        <Typography className="mt-4">
          <span className="font-bold">Ngày bắt đầu:</span>{" "}
          {formatDate(combo?.startDate)}
        </Typography>
        <Typography className="mt-2">
          <span className="font-bold">Ngày kết thúc:</span>{" "}
          {formatDate(combo?.endDate)}
        </Typography>
      </CardBody>
      <CardFooter className="pt-0 mt-auto">
        <div className="flex justify-center">
          <Button
            className="bg-red-700 text-white py-2 px-4 rounded-md"
            onClick={() => {
              setIsOpenComboDetail(true);
              setSelectedCombos(combo.comboId);
            }}
          >
            Đặt ngay
          </Button>
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <div className="mt-10">
      <div className="grid grid-cols-1 md:grid-cols-4 max-h-[1200px] rounded-2xl shadow-xl pl-6">
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
          <Tabs activeKey={rightSideTab} onChange={handleRightSideTabChange}>
            <TabPane tab="Thông tin" key="1">
              <ReservationInformation reservation={information} />
            </TabPane>
            <TabPane tab={`Giỏ hàng (${totalItems})`} key="2">
              <ReservationCart />
              {cart.length > 0 && (
                <div className="mt-6 w-full flex justify-center items-center flex-col">
                  <Typography
                    variant="h5"
                    className="font-bold text-red-700 text-center"
                  >
                    Tổng cộng: {formatPrice(cartTotal + cartCombo.total)}
                  </Typography>
                  <p>Số tiền cọc dự kiến: {formatPrice(deposit)}</p>
                </div>
              )}
            </TabPane>
          </Tabs>
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
            onClick={handleCheckout}
          >
            Đặt bàn ngay
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalReservation;
