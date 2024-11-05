import { useState, useEffect } from "react";
import { formatPrice } from "../../util/Utility";
import DishCard from "./dish-card/DishCard";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cartReservationSlice";
import useCallApi from "../../api/useCallApi";
import { DishApi } from "../../api/endpoint";
import { NavLink } from "react-router-dom";
import { message } from "antd";

const MenuDish = ({
  dishes,
  handleAddItem,
  fetchDishes,
  setSelectedCategory,
  selectedCategory,
  menuCategories,
}) => {
  const [selectedSizes, setSelectedSizes] = useState({});
  const { callApi, error, loading } = useCallApi();
  const dispatch = useDispatch();
  const fetchData = async () => {
    const response = await callApi(`${DishApi.GET_ALL_DISH_TYPE}/1/100`);
    if (response?.isSuccess) {
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleSizeClick = (dish, size) => {
    setSelectedSizes((prevSizes) => ({
      ...prevSizes,
      dish: dish,
      size: size,
    }));
  };

  const handleAddToCart = (dish, size) => {
    if (!size.isAvailable) {
      message.error("Sản phẩm với size này đã hết hàng");
      return;
    }
    dispatch(addToCart({ dish, size, quantity: 1 }));
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

  return (
    <div className="bg-[#A31927] py-6 px-4">
      <div className="container mx-auto">
        <h1 className="text-white text-center text-2xl font-bold mb-4">
          KHÁM PHÁ THỰC ĐƠN
        </h1>
        <div className="flex justify-end mb-4">
          <NavLink
            className="text-[#F2D2D5] text-md hover:underline"
            to={`/search`}
          >
            Xem tất cả
          </NavLink>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3  gap-4 mb-6">
          {dishes.map((dish, index) => (
            <DishCard
              key={index}
              dish={dish}
              formatPrice={formatPrice}
              getCurrentPrice={getCurrentPrice}
              handleSizeClick={handleSizeClick}
              selectedSizes={selectedSizes}
              handleAddToCart={handleAddToCart}
            />
          ))}
        </div>
        <div className="flex justify-center">
          <button
            className="btn rounded-md shadow-md text-center bg-white text-red-600 px-4 py-2 hover:bg-red-100 transition-colors"
            onClick={handleAddItem}
          >
            Xem thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuDish;
