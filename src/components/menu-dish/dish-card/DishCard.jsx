import React from "react";
import { StarFilled, ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Button, message, Typography } from "antd";
import { CardFooter } from "@material-tailwind/react";

export const DishCard = ({
  dish,
  getCurrentPrice,
  formatPrice,
  handleSizeClick,
  selectedSizes,
  handleAddToCart,
  isYellow,
}) => {
  const navigate = useNavigate();
  return (
    <div className="mt-16">
      <div
        className={`relative pt-20 pb-4 px-4 ${
          isYellow ? "bg-[#FFC682A8]" : "bg-white"
        } rounded-lg  my-4 mx-2 text-center`}
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img
            src={dish?.dish.image}
            alt={dish?.dish.name}
            className="w-32 h-32 rounded-full object-cover border-2 border-white shadow-lg"
          />
        </div>
        <div className="mt-4">
          <h3
            className="font-bold text-red-600 text-lg mb-2 hover:text-red-700 cursor-pointer"
            onClick={() => navigate(`/product/${dish?.dish.dishId}`)}
          >
            {dish?.dish.name}
          </h3>

          {dish?.dish?.averageRating > 0 && (
            <div className="flex justify-center items-center mb-2">
              <StarFilled className="text-yellow-400 mr-1" />
              <span className="text-gray-700">
                {dish?.dish?.averageRating} ({dish?.dish?.numberOfRating})
              </span>
            </div>
          )}

          <CardFooter className="pt-0 pb-4">
            <div className="flex justify-center space-x-2 mb-3">
              {dish?.dishSizeDetails?.map((size) => (
                <button
                  key={size.dishSizeDetailId}
                  onClick={() => handleSizeClick(dish.dish, size)}
                  className={`px-2 py-1 rounded-md border ${
                    selectedSizes?.size?.dishSizeDetailId ===
                    size.dishSizeDetailId
                      ? "bg-red-800 text-white"
                      : "bg-white text-red-800"
                  } font-semibold transition-colors duration-300 ${
                    !size.isAvailable
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={size.isAvailable === false}
                >
                  {size.dishSize?.vietnameseName || size.dishSize?.name}
                </button>
              ))}
            </div>
            <Typography className="text-center text-lg font-semibold mb-3">
              Giá:{" "}
              <span className="text-red-800">
                {getCurrentPrice(dish.dish.dishId) === 0
                  ? formatPrice(dish?.dishSizeDetails?.[0]?.price)
                  : formatPrice(getCurrentPrice(dish.dish.dishId))}
              </span>
            </Typography>
            <Button
              onClick={() => {
                handleAddToCart(
                  dish.dish,
                  selectedSizes?.size || dish.dishSizeDetails[0]
                );
              }}
              className="w-full mx-auto bg-red-800 text-white"
            >
              <ShoppingCartOutlined className="mr-2" />
              Thêm vào giỏ hàng{" "}
            </Button>
          </CardFooter>
          <p className="text-red-600 font-bold text-xl mb-4">{dish.price}</p>
        </div>
      </div>
    </div>
  );
};

export default DishCard;
