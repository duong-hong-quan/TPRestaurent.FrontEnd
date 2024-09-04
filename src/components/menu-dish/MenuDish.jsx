import { useState } from "react";
import { formatPrice } from "../../util/Utility";
import DishCard from "./dish-card/DishCard";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cartReservationSlice";

const menuCategories = [
  { icon: "fa-martini-glass", label: "Gợi ý" },
  { icon: "fa-temperature-high", label: "Chiên nướng" },
  { icon: "fa-fire-burner", label: "Nướng" },
  { icon: "fa-lemon", label: "Xào" },
  { icon: "fa-martini-glass", label: "Tráng miệng" },
  { icon: "fa-scroll", label: "Cuốn/ cháo" },
  { icon: "fa-martini-glass", label: "Khác" },
];

const MenuDish = ({ dishes }) => {
  const handleSizeClick = (dish, size) => {
    setSelectedSizes((prevSizes) => ({
      ...prevSizes,
      dish: dish,
      size: size,
    }));
  };
  const [selectedSizes, setSelectedSizes] = useState({});
  const dispatch = useDispatch();
  const handleAddToCart = (dish, size) => {
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
          <a className="text-[#F2D2D5] text-md hover:underline" href="#">
            Xem tất cả
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          {menuCategories.map((category, index) => (
            <div
              key={index}
              className="rounded-lg text-red-600 p-2 font-bold bg-white shadow-2xl text-center flex flex-col justify-center items-center"
            >
              <div>
                <i className={`fa-solid ${category.icon}`}></i>
              </div>
              <p>{category.label}</p>
            </div>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3  gap-4 mb-6">
          {/* {[...Array(4)].map((_, index) => (
            <DishCard key={index} />
          ))} */}

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
          <button className="btn rounded-md shadow-md text-center bg-white text-red-600 px-4 py-2 hover:bg-red-100 transition-colors">
            Xem thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuDish;
