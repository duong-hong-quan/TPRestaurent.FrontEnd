import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  StarFilled,
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  LeftOutlined,
  RightOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { getDishById } from "../../../api/dishApi";
import { formatDate, formatPrice } from "../../../util/Utility";
import LoadingOverlay from "../../../components/loading/LoadingOverlay";

// Custom hooks
const useDishData = (id) => {
  const [dish, setDish] = useState({});
  const [dishSizeDetails, setDishSizeDetails] = useState([]);
  const [images, setImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDishById(id);
        if (response?.isSuccess) {
          const { dish, dishSizeDetails, dishImgs, ratingDish } =
            response?.result;
          setImages(dishImgs.map((img) => img.path));
          setDish(dish);
          setDishSizeDetails(dishSizeDetails);
          setReviews(ratingDish);
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

  return { dish, dishSizeDetails, images, reviews };
};

// Extracted components
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

const ProductDetail = () => {
  const { id } = useParams();
  const { dish, dishSizeDetails, images, reviews, isLoading } = useDishData(id);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [price, setPrice] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedStarFilter, setSelectedStarFilter] = useState(null);
  useEffect(() => {
    if (dishSizeDetails.length > 0) {
      setPrice(dishSizeDetails[0].price);
      setSelectedSize(dishSizeDetails[0].dishSizeDetailId);
    }
  }, [dishSizeDetails]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const averageRating = useMemo(() => {
    return (
      reviews?.reduce((sum, review) => sum + review?.rating?.pointId, 0) /
      reviews?.length
    ).toFixed(1);
  }, [reviews]);

  const handleSizeChange = useCallback((size) => {
    setSelectedSize(size.dishSizeDetailId);
    setPrice(size.price);
  }, []);

  const renderDescriptionTab = () => (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Mô tả sản phẩm</h2>
      <p className="text-gray-700">{dish?.description}</p>
      <ul className="list-disc list-inside mt-4 text-gray-700">
        <li>Nguyên liệu tươi sạch, được chọn lọc kỹ càng</li>
        <li>Thịt bò mềm, nhiều dinh dưỡng</li>
        <li>Rau xanh giòn ngọt, đa dạng loại</li>
        <li>Nước sốt đặc biệt, tạo nên hương vị độc đáo</li>
      </ul>
    </div>
  );

  const renderRatingTab = () => {
    const totalReviews = reviews?.length;
    const starCounts = [5, 4, 3, 2, 1].map(
      (star) =>
        reviews.filter((review) => review?.rating?.pointId === star).length
    );

    const filteredReviews = selectedStarFilter
      ? reviews.filter(
          (review) => review?.rating.pointId === selectedStarFilter
        )
      : reviews;

    return (
      <div className="mt-8">
        <div className="flex items-start mb-8">
          <div className="text-center mr-8">
            <div className="text-5xl font-bold text-red-600">
              {averageRating}
            </div>
            <div className="flex justify-center my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarFilled
                  key={star}
                  className={`text-lg ${
                    star <= Math.round(averageRating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-500">{totalReviews} đánh giá</div>
          </div>
          <div className="flex-grow">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center mb-1">
                <span className="w-12 text-sm">{star} sao</span>
                <div className="flex-grow mx-2 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${(starCounts[5 - star] / totalReviews) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="w-12 text-right text-sm">
                  {starCounts[5 - star]}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <span className="mr-2 font-semibold">Lọc đánh giá:</span>
          {[null, 5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              onClick={() => setSelectedStarFilter(star)}
              className={`mr-2 px-3 py-1 rounded ${
                selectedStarFilter === star
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {star === null ? "Tất cả" : `${star} sao`}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review?.rating?.ratingId}
              className="bg-white p-6 rounded-lg"
            >
              {filteredReviews.map((review) => (
                <div
                  key={review?.rating?.ratingId}
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
                >
                  <div className="flex items-start mb-4">
                    <img
                      src={review?.avatar}
                      alt={review?.author}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold">
                        {review?.author}
                      </h3>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <StarFilled
                            key={i}
                            className={`text-lg ${
                              i < review?.rating?.pointId
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {formatDate(review?.rating?.createDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">{review?.rating?.title}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button className="bg-red-600 text-white py-2 px-6 rounded-full hover:bg-red-700 transition duration-300 flex items-center justify-center mx-auto">
            <MessageOutlined className="mr-2" />
            Viết đánh giá
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />
      {dish && (
        <div className=" container p-10 mx-auto px-4 py-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <ImageGallery
              images={images}
              currentImageIndex={currentImageIndex}
              setCurrentImageIndex={setCurrentImageIndex}
            />
            <div className="space-y-8">
              <h1 className="text-2xl font-bold text-gray-800">{dish?.name}</h1>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarFilled key={star} className="text-yellow-400 text-md" />
                ))}
                <span className="ml-2 text-gray-600 text-lg">
                  ({averageRating})
                </span>
              </div>
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
                  {dish?.dishItemType?.name}
                </div>
                <p className="text-red-700 text-3xl font-bold mt-4">
                  {formatPrice(price)}
                </p>
              </div>
              <div className="flex space-x-6">
                {dishSizeDetails?.map((size) => (
                  <button
                    key={size.dishSizeDetailId}
                    onClick={() => {
                      setSelectedSize(size.dishSizeDetailId);
                      setPrice(size.price);
                    }}
                    className={`flex-1 py-3 px-6 rounded-lg text-lg transition duration-300 ${
                      selectedSize === size.dishSizeDetailId
                        ? "bg-red-600 text-white"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    <p className="font-semibold">{size.dishSize?.name}</p>
                    <p className="font-bold">{formatPrice(size.price)}</p>
                  </button>
                ))}
              </div>
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
          <div className="mt-16">
            <div className="flex border-b">
              <button
                className={`py-2 px-4 font-semibold ${
                  activeTab === "description"
                    ? "text-red-600 border-b-2 border-red-600"
                    : "text-gray-500 hover:text-red-600"
                }`}
                onClick={() => setActiveTab("description")}
              >
                Mô tả
              </button>
              <button
                className={`py-2 px-4 font-semibold ${
                  activeTab === "rating"
                    ? "text-red-600 border-b-2 border-red-600"
                    : "text-gray-500 hover:text-red-600"
                }`}
                onClick={() => setActiveTab("rating")}
              >
                Đánh giá
              </button>
            </div>
            <div>
              {activeTab === "rating"
                ? renderRatingTab()
                : renderDescriptionTab()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(ProductDetail);
