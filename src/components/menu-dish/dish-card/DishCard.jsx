import React from "react";
import { StarFilled, ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export const DishCard = ({ dish }) => {
  const navigate = useNavigate();
  return (
    <div className="mt-16">
      <div className="relative pt-20 pb-4 px-4 bg-white rounded-lg shadow-2xl my-4 mx-2 text-center">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-32 h-32 rounded-full object-cover border-2 border-white shadow-lg"
          />
        </div>
        <div className="mt-4">
          <h3
            className="font-bold text-red-600 text-lg mb-2 hover:text-red-700 cursor-pointer"
            onClick={() => navigate(`/product/${dish.dishId}`)}
          >
            {dish.name}
          </h3>
          <div className="flex justify-center items-center mb-2">
            <StarFilled className="text-yellow-400 mr-1" />
            <span className="text-gray-700">4.8 (1.2k)</span>
          </div>
          <p className="text-red-600 font-bold text-xl mb-4">{dish.price}</p>
          <button className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors duration-300 flex items-center justify-center w-full">
            <ShoppingCartOutlined className="mr-2" />
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default DishCard;
