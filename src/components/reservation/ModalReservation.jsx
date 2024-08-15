import React, { useCallback, useEffect, useState } from "react";
import { Modal, Tabs, message, Button, Badge } from "antd";
import { getAllDishes } from "../../api/dishApi";
import { getAllCombo } from "../../api/comboApi";
import DishCard from "../menu-dish/dish-card/DishCard";
import ComboCard from "../menu-dish/ComboCard";
const { TabPane } = Tabs;
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import ReservationInformation from "./ReservationInformation";
import { formatPrice } from "../../util/Utility";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "../../redux/features/cartReservationSlice";
import { ReservationCart } from "./ReservationCart";

export function ModalReservation({ visible, onCancel, information }) {
  const [dishes, setDishes] = useState([]);
  const [combos, setCombos] = useState([]);
  const [activeTab, setActiveTab] = useState("0");
  const [selectedSizes, setSelectedSizes] = useState({});
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cartReservation);

  const handleAddToCart = (dish, size, price) => {
    dispatch(addToCart({ dish, size, price }));
  };

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
  }, [visible, fetchData]);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleSizeClick = (dishId, size) => {
    setSelectedSizes((prevSizes) => ({
      ...prevSizes,
      [dishId]: size.dishSize.name,
    }));
  };
  const getCurrentPrice = (dishId) => {
    const dish = dishes.find((dish) => dish.dish.dishId === dishId);
    const selectedSize = selectedSizes[dishId];
    if (dish && selectedSize) {
      const sizeDetail = dish.dishSizeDetails.find(
        (size) => size.dishSize.name === selectedSize
      );
      return sizeDetail ? sizeDetail.price : 0;
    }
    return 0;
  };
  const [rightSideTab, setRightSideTab] = useState("1");

  const handleRightSideTabChange = (key) => {
    setRightSideTab(key);
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      width="90vw"
      style={{ top: 20 }}
      bodyStyle={{
        height: "calc(100vh - 110px)",
        overflow: "hidden",
      }}
      footer={null}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 overflow-hidden">
        <div className="col-span-3 p-4 overflow-y-scroll">
          <Tabs activeKey={activeTab} onChange={handleTabChange}>
            <TabPane tab="Món ăn" key="0" className="h-screen ">
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 mt-2">
                {dishes.map((dish) => (
                  <Card
                    key={dish?.dish?.dishId}
                    className="mt-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <CardHeader
                      color="blue-gray"
                      className="relative h-56 overflow-hidden"
                    >
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
                            onClick={() =>
                              handleSizeClick(dish.dish.dishId, size)
                            }
                            className={`px-2 py-1 rounded-md border ${
                              selectedSizes[dish.dish.dishId] ===
                              size.dishSize.name
                                ? "bg-red-800 text-white"
                                : "bg-white text-red-800"
                            } font-semibold transition-colors duration-300`}
                          >
                            {size.dishSize?.name}
                          </button>
                        ))}
                      </div>
                      <Typography className="text-center text-lg font-semibold mb-3">
                        Giá:{" "}
                        <span className="text-red-800">
                          {getCurrentPrice(dish.dish.dishId).toLocaleString() ==
                          0
                            ? formatPrice(dish?.dishSizeDetails?.[0].price)
                            : formatPrice(getCurrentPrice(dish.dish.dishId))}
                        </span>
                      </Typography>
                      {/* ... rest of the CardFooter content ... */}
                      <Button
                        onClick={() =>
                          handleAddToCart(
                            dish.dish,
                            selectedSizes[dish.dish.dishId] ||
                              dish.dishSizeDetails[0].dishSize.name,
                            getCurrentPrice(dish.dish.dishId) ||
                              dish.dishSizeDetails[0].price
                          )
                        }
                        className="w-full mx-auto bg-red-800 text-white"
                      >
                        Chọn
                      </Button>{" "}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabPane>
            <TabPane tab="Combo món" key="1" className="h-screen">
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {combos?.map((combo, index) => (
                  <ComboCard key={index} combo={combo} />
                ))}
              </div>
            </TabPane>
          </Tabs>
        </div>
        <div className="col-span-1 overflow-y-scroll">
          <Tabs activeKey={rightSideTab} onChange={handleRightSideTabChange}>
            <TabPane tab="Thông tin" key="1">
              <ReservationInformation reservation={information} />
            </TabPane>
            <TabPane tab={`Giỏ hàng (${cart.length})`} key="2">
              <ReservationCart />
              {cart.length > 0 && (
                <div className="mt-6">
                  <Typography
                    variant="h5"
                    className="font-bold text-red-700 text-center"
                  >
                    Tổng cộng:{" "}
                    {formatPrice(
                      cart.reduce(
                        (total, item) => total + item.price * item.quantity,
                        0
                      )
                    )}
                  </Typography>
                </div>
              )}
            </TabPane>
          </Tabs>{" "}
        </div>
      </div>
    </Modal>
  );
}
