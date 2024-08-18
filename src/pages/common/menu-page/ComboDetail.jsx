import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import ComboDetail2 from "./ComboDetail2";
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
  const [comboData, setComboData] = useState({});
  const fetchData = async () => {
    try {
      const response = await getComboById(id);
      if (response?.isSuccess) {
        setComboData(response?.result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [id]);
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div>
      <LoadingOverlay isLoading={isLoading} />
      <ComboDetail2
        comboData={comboData}
        key={`combodetail`}
        handleBack={handleBack}
      />
    </div>
  );
}
