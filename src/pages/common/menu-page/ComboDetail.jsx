import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getComboById } from "../../../api/comboApi";
import { formatPrice } from "../../../util/Utility";
import {
  LeftOutlined,
  LoadingOutlined,
  MinusOutlined,
  PlusOutlined,
  RightOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import LoadingOverlay from "../../../components/loading/LoadingOverlay";
import DishComboCard from "../../../components/menu-dish/DishComboCard";
import { Typography } from "antd";
const useDishData = (id) => {
  const [combo, setCombo] = useState({});
  const [dishCombo, setDishCombo] = useState([]);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getComboById(id);
        if (response?.isSuccess) {
          const { combo, dishCombo, imgs } = response?.result;
          setImages(imgs);
          setCombo(combo);
          setDishCombo(dishCombo);
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi lấy dữ liệu");
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
      }
    };

    fetchData();
  }, [id]);

  return { combo, dishCombo, images, isLoading };
};
const ImageGallery = React.memo(
  ({ images, currentImageIndex, setCurrentImageIndex }) => {
    const handlePrevImage = () => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    };

    const handleNextImage = () => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    };

    return (
      <div className="space-y-4">
        <img
          src={images[currentImageIndex]}
          alt={`Product Image ${currentImageIndex + 1}`}
          className="w-full h-auto rounded-lg shadow-lg object-cover"
        />
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevImage}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l"
          >
            <LeftOutlined />
          </button>
          <div className="flex space-x-2 overflow-x-auto">
            {images?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className={`w-16 h-16 object-cover rounded cursor-pointer ${
                  index === currentImageIndex ? "border-2 border-red-500" : ""
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
          <button
            onClick={handleNextImage}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-r"
          >
            <RightOutlined />
          </button>
        </div>
      </div>
    );
  }
);

export function ComboDetail() {
  const { id } = useParams();
  const { combo, dishCombo, images, isLoading } = useDishData(id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  return (
    <div>
      <LoadingOverlay isLoading={isLoading} />
      <div className=" container p-10 mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <ImageGallery
            images={images}
            currentImageIndex={currentImageIndex}
            setCurrentImageIndex={setCurrentImageIndex}
          />
          <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-800">{combo?.name}</h1>

            <div className="border-b-2 pb-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
                {combo?.category?.name}
              </div>
              <div className="flex items-center">
                <p className="mt-4 text-xl text-red-800 line-through  font-bold mx-2">
                  {dishCombo?.length > 0 &&
                    dishCombo
                      .reduce(
                        (total, item) =>
                          total + item.dishSizeDetail?.price * item.quantity,
                        0
                      )
                      .toLocaleString()}{" "}
                  VND
                </p>
                <p className="text-red-700 text-3xl font-bold mt-4">
                  {formatPrice(combo?.price)}
                </p>
              </div>
            </div>
            <DishComboCard dishCombo={dishCombo} />

            <div className="flex items-center space-x-6">
              <div className="flex items-center border-2 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition duration-300"
                >
                  <MinusOutlined className="text-xl" />
                </button>
                <span className="px-6 py-2 text-xl font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition duration-300"
                >
                  <PlusOutlined className="text-xl" />
                </button>
              </div>

              <button className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition duration-300 flex items-center justify-center text-lg font-semibold">
                <ShoppingCartOutlined className="mr-2 text-2xl" />
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
