import React, { useCallback, useEffect, useState } from "react";
import { Modal, Row, Col, Form, Input, message, Tabs } from "antd";
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
  Button,
} from "@material-tailwind/react";
import ReservationInformation from "./ReservationInformation";
export function ModalReservation({ visible, onCancel, information }) {
  const [dishes, setDishes] = useState([]);
  const [combos, setCombos] = useState([]);
  const [activeTab, setActiveTab] = useState("0");
  const [selectedSize, setSelectedSize] = useState("M");
  const sizes = [
    { label: "S", price: 130000 },
    { label: "M", price: 150000 },
    { label: "L", price: 170000 },
  ];
  console.log(information);
  const currentPrice = sizes.find((size) => size.label === selectedSize).price;
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

  return (
    <Modal visible={visible} onCancel={onCancel} width={1200} footer={null}>
      <div className="grid grid-cols-1 md:grid-cols-4">
        <div className="col-span-3">
          <Tabs activeKey={activeTab} onChange={handleTabChange}>
            <TabPane tab="Món ăn" key="0" className="h-[600px] overflow-y-auto">
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {dishes.map((dish) => (
                  <Card
                    key={dish.dishId}
                    className="mt-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <CardHeader
                      color="blue-gray"
                      className="relative h-56 overflow-hidden"
                    >
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                      <div className="absolute top-2 right-2 bg-red-800 text-white px-2 py-1 rounded-full text-xs">
                        {dish.dishItemType?.name}
                      </div>
                    </CardHeader>
                    <CardBody className="p-4">
                      <Typography
                        variant="h5"
                        className="mb-2 text-center text-red-800 font-bold"
                      >
                        {dish.name}
                      </Typography>
                      <Typography className="text-gray-600 text-sm text-center">
                        {dish.description}
                      </Typography>
                    </CardBody>
                    <CardFooter className="pt-0 pb-4">
                      <div className="flex justify-center space-x-2 mb-3">
                        {sizes.map((size) => (
                          <button
                            key={size.label}
                            onClick={() => setSelectedSize(size.label)}
                            className={`w-10 h-10 rounded-full border ${
                              selectedSize === size.label
                                ? "bg-red-800 text-white"
                                : "bg-white text-red-800"
                            } font-semibold transition-colors duration-300`}
                          >
                            {size.label}
                          </button>
                        ))}
                      </div>
                      <Typography className="text-center text-lg font-semibold mb-3">
                        Giá:{" "}
                        <span className="text-red-800">
                          {currentPrice.toLocaleString()}đ
                        </span>
                      </Typography>
                      <div className="flex justify-center">
                        <Button className="bg-red-800 hover:bg-red-900 transition-colors duration-300 text-white font-semibold py-2 px-4 rounded">
                          Đặt món
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabPane>
            <TabPane tab="Combo món" key="1">
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {combos?.map((combo, index) => (
                  <ComboCard key={index} combo={combo} />
                ))}
              </div>
            </TabPane>
          </Tabs>
        </div>
        <div className="col-span-1">
          <ReservationInformation reservation={information} />
        </div>
      </div>
    </Modal>
  );
}
