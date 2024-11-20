import { useState, useEffect } from "react";
import { formatPrice } from "../../util/Utility";
import DishCard from "./dish-card/DishCard";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cartReservationSlice";
import useCallApi from "../../api/useCallApi";
import { DishApi } from "../../api/endpoint";
import { NavLink } from "react-router-dom";
import { Input, message, Select } from "antd";
import styled from "styled-components";
import { FilterIcon } from "lucide-react";

const MenuDish = ({ dishes, handleAddItem, fetchDishes }) => {
  const [selectedSizes, setSelectedSizes] = useState({});
  const [dishType, setDishType] = useState([]);
  const { callApi } = useCallApi();
  const dispatch = useDispatch();
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [minPrice, setMinPrice] = useState(50000);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchData = async () => {
    const response = await callApi(`${DishApi.GET_ALL_DISH_TYPE}/1/100`, "GET");
    if (response?.isSuccess) {
      setDishType(response?.result.items);
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

  const handleTypeChange = (value) => {
    setSelectedCategory(value);
    fetchDishes(minPrice, maxPrice, value, "");
  };

  const handleMinPriceChange = (e) => {
    const value = e.target.value;
    setMinPrice(value);
    fetchDishes(value, maxPrice, selectedCategory, "");
  };

  const handleMaxPriceChange = (e) => {
    const value = e.target.value;
    setMaxPrice(value);
    fetchDishes(minPrice, value, selectedCategory, "");
  };

  const WrapperSearch = styled.div`
    width: 100%;
    .ant-btn-variant-solid {
      background-color: #a31927;
      color: #fff;
      border-color: #a31927;
    }
    .ant-btn-variant-solid:hover {
      background-color: #a31927 !important;
      color: #fff;
      border-color: #a31927;
    }
  `;

  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchDishes(minPrice, maxPrice, selectedCategory, "");
    }
  }, [selectedCategory, minPrice, maxPrice]);

  return (
    <div className="bg-[#A31927] py-6 px-4">
      <div className="container mx-auto">
        <h1 className="text-white text-center text-2xl font-bold mb-4">
          KHÁM PHÁ THỰC ĐƠN
        </h1>
        <div className="xl:flex xl:flex-row flex-col justify-between mb-4">
          <div className="p-4">
            <h3
              className="bg-white bg-opacity-20 rounded-tl-lg rounded-tr-lg p-4 uppercase text-white font-bold flex items-center gap-2 cursor-pointer"
              onClick={toggleFilterVisibility}
            >
              Bộ lọc <FilterIcon size={22} />
            </h3>
            <div
              className={`bg-white bg-opacity-20 p-4 rounded-bl-lg rounded-br-lg rounded-tl-none rounded-tr-none transition-all duration-500 ease-in-out overflow-hidden ${
                isFilterVisible
                  ? "max-h-screen opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="flex mb-4">
                <WrapperSearch>
                  <Input.Search
                    placeholder="Tìm kiếm món ăn"
                    onSearch={(value) =>
                      fetchDishes(minPrice, maxPrice, selectedCategory, value)
                    }
                    enterButton
                  />
                </WrapperSearch>
              </div>
              <div className="flex mb-4">
                <Input
                  type="number"
                  placeholder="Gía tối thiểu"
                  min={50000}
                  value={minPrice}
                  onChange={handleMinPriceChange}
                />
                <span className="mx-2">-</span>
                <Input
                  type="number"
                  placeholder="Gía tối đa"
                  max={maxPrice}
                  value={maxPrice}
                  onChange={handleMaxPriceChange}
                />
              </div>
              <Select
                placeholder="Chọn loại món ăn"
                onChange={handleTypeChange}
                className="w-full mb-4"
              >
                {dishType.map((type) => (
                  <Select.Option key={type.id} value={type.id}>
                    {type.vietnameseName}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
          <NavLink
            className="text-[#F2D2D5] text-md hover:underline block"
            to={`/search`}
          >
            Xem tất cả
          </NavLink>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
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
