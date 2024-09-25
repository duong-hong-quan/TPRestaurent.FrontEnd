import React, { useEffect, useState } from "react";
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
import {
  formatDate,
  formatPrice,
  isEmptyObject,
  showError,
} from "../../../util/Utility";
import LoadingOverlay from "../../../components/loading/LoadingOverlay";
import { useDispatch } from "react-redux";
import {
  addToCart,
  increaseQuantity,
} from "../../../redux/features/cartReservationSlice";
import { message } from "antd";
import useCallApi from "../../../api/useCallApi";
import { DishApi } from "../../../api/endpoint";
import { ThermometerSun } from "lucide-react";

const useDishData = (id) => {
  const [dish, setDish] = useState({});
  const [dishSizeDetails, setDishSizeDetails] = useState([]);
  const [images, setImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { callApi, error, loading } = useCallApi();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await callApi(`${DishApi.GET_BY_ID}/${id}`, "GET");
        if (response?.isSuccess) {
          const { dish, dishSizeDetails, dishImgs, ratingDish } =
            response?.result;
          setImages(dishImgs.map((img) => img.path));
          setDish(dish?.dish);
          setDishSizeDetails(dish?.dishSizeDetails);
          setReviews(ratingDish);
        } else {
          showError(error);
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi lấy dữ liệu");
      } finally {
        setIsLoading(loading);
      }
    };

    fetchData();
  }, [id]);

  return { dish, dishSizeDetails, images, reviews, isLoading };
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
        <div className="relative">
          <img
            src={images[currentImageIndex]}
            alt={`Product Image ${currentImageIndex + 1}`}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
          <button
            onClick={handlePrevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition duration-300"
          >
            <LeftOutlined className="text-2xl text-gray-800" />
          </button>
          <button
            onClick={handleNextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition duration-300"
          >
            <RightOutlined className="text-2xl text-gray-800" />
          </button>
        </div>
        <div className="flex space-x-2 overflow-x-auto">
          {images?.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className={`w-20 h-20 object-cover rounded-md cursor-pointer transition duration-300 ${
                index === currentImageIndex
                  ? "border-2 border-red-500"
                  : "opacity-60 hover:opacity-100"
              }`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
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
    if (dishSizeDetails && dishSizeDetails.length > 0 && !selectedSize) {
      setSelectedSize(dishSizeDetails[0]);
      setPrice(dishSizeDetails[0].price);
    }
  }, [dishSizeDetails, selectedSize]);

  useEffect(() => {
    window.scrollTo(0, 0);
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
  const dispatch = useDispatch();
  const handleAddToCart = (dish, size) => {
    if (quantity > 1) {
      dispatch(
        increaseQuantity({ dish: dish, size: size, quantity: quantity })
      );
    } else {
      dispatch(addToCart({ dish: dish, size: size }));
    }
  };
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

    if (isLoading) {
      return <LoadingOverlay isLoading={isLoading} />;
    }
    return (
      <div className="mt-8">
        <div className="flex items-start mb-8">
          <div className="text-center mr-8">
            <div className="text-5xl font-bold text-red-600">
              {dish?.averageRating}
            </div>
            <div className="flex justify-center my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarFilled
                  key={star}
                  className={`text-lg ${
                    star <= Math.round(dish?.averageRating)
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
                      src={review?.rating?.createByAccount?.avatar}
                      alt={review?.rating?.createByAccount?.avatar}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold">
                        {review?.rating?.createByAccount?.firstName}
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

                  <p className="text-gray-700 mb-4">
                    {" "}
                    <strong>Đánh giá: </strong>
                    {review?.rating?.title}
                  </p>
                  {review?.ratingImgs?.length > 0 && (
                    <div className="flex items-center space-x-4">
                      {review.ratingImgs.map((img) => (
                        <img
                          key={img.ratingImgId}
                          src={img.path}
                          alt={img.path}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
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
      {!isEmptyObject(dish) && (
        <div className=" container p-10 mx-auto px-4 py-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <ImageGallery
              images={images}
              currentImageIndex={currentImageIndex}
              setCurrentImageIndex={setCurrentImageIndex}
            />
            <div className="space-y-8">
              <div className="flex">
                <h1 className="text-2xl font-bold text-gray-800 uppercase inline-block">
                  {dish?.name}
                </h1>
              </div>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarFilled key={star} className="text-[#FF9F43] text-xl" />
                ))}
                <span className="ml-2 text-gray-600 text-lg">
                  {dish?.dish?.averageRating}
                </span>
              </div>
              <div className="border-t-2  my-2 pt-4">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white  border border-red-800 text-sm">
                  <ThermometerSun className="mx-2 text-red-700" />{" "}
                  {dish?.dishItemType?.name}
                </div>
                <p className="text-red-800 text-4xl  m-4">
                  {formatPrice(price)}
                </p>
              </div>
              <div className="flex md:flex-row flex-col">
                {dishSizeDetails?.map((size) => (
                  <button
                    key={size.dishSizeDetailId}
                    onClick={() => {
                      setSelectedSize(size);
                      setPrice(size.price);
                    }}
                    className={`flex-1 py-3 h-full my-2 md:mx-2  w-full px-6  rounded-lg text-lg transition duration-300 ${
                      selectedSize?.dishSizeDetailId === size.dishSizeDetailId
                        ? "bg-[#F2D2D5] text-[#C01D2E] border border-[#C01D2E]"
                        : "bg-[#EEEEEF] text-[#0F172AA8]"
                    }`}
                  >
                    <p className="">{size.dishSize?.vietnameseName}</p>
                    <p className="font-bold">{formatPrice(size.price)}</p>
                  </button>
                ))}
              </div>
              <p className="text-lg  font-semibold"> Số lượng món:</p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center border-2  border-[#cd5a65] rounded-3xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2transition duration-300"
                  >
                    <MinusOutlined className="text-xl" />
                  </button>
                  <span className="px-6 py-2 text-xl font-semibold text-red-700">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2transition  duration-300"
                  >
                    <PlusOutlined className="text-xl" />
                  </button>
                </div>
                <button
                  onClick={() => {
                    handleAddToCart(dish, selectedSize);
                    message.success("Đã thêm vào giỏ hàng");
                  }}
                  className="flex-1  text-[#E45834] py-3 px-6 rounded-3xl border  border-[#cd5a65] transition duration-300 flex items-center justify-center text-lg font-bold"
                >
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

export default ProductDetail;
