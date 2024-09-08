import { useState, useEffect } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { formatDate } from "../../../util/Utility";
import { useDispatch } from "react-redux";
import { addCombo } from "../../../redux/features/cartSlice";
import { message } from "antd";
const ComboDetail = ({ comboData, handleBack }) => {
  const { combo, dishCombo, imgs } = comboData;

  const restructuredDishCombo = dishCombo?.reduce((acc, item) => {
    const setNumber = item?.comboOptionSet?.optionSetNumber;
    if (!acc[setNumber]) {
      acc[setNumber] = {
        ...item.comboOptionSet,
        dishes: [],
      };
    }
    acc[setNumber].dishes.push(...item?.dishCombo);
    return acc;
  }, {});

  const [selectedDishes, setSelectedDishes] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const handleImageClick = (index) => {
    setMainImageIndex(index);
  };
  useEffect(() => {
    console.log("Lựa chọn hiện tại:", selectedDishes);
  }, [selectedDishes]);

  const handleDishSelection = (setId, dishId) => {
    setSelectedDishes((prev) => {
      const currentSet = prev[setId] || [];
      const maxChoice = restructuredDishCombo[setId].numOfChoice;

      if (currentSet.includes(dishId)) {
        return { ...prev, [setId]: currentSet.filter((id) => id !== dishId) };
      } else if (currentSet.length < maxChoice) {
        return { ...prev, [setId]: [...currentSet, dishId] };
      }
      return prev;
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imgs.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + imgs.length) % imgs.length
    );
  };
  const dispatch = useDispatch();
  const handleAddToCart = () => {
    const selectedCombo = {
      comboId: combo.comboId,
      name: combo.name,
      price: combo.price,
      selectedDishes: Object.entries(selectedDishes).reduce(
        (acc, [setId, dishes]) => {
          acc[setId] = dishes.map(
            (dishIndex) => restructuredDishCombo[setId].dishes[dishIndex]
          );
          return acc;
        },
        {}
      ),
    };
    dispatch(addCombo(selectedCombo));
    message.success("Đã thêm vào giỏ hàng");
  };
  return (
    <div className="max-w-[1200px] mx-auto p-4">
      <button onClick={handleBack} className="text-red-700 font-bold text-lg ">
        Back
      </button>

      <Card className="mb-8 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 relative">
            <img
              src={imgs?.[mainImageIndex] || combo?.image}
              alt={combo?.name}
              className="w-full h-[400px] object-cover"
            />
            <div className="p-4 bg-gray-100">
              <Typography variant="small" color="gray" className="italic">
                {combo?.description}
              </Typography>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {combo?.image.length > 0 &&
                imgs.length > 0 &&
                [combo?.image, ...imgs].map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Hình ảnh ${index}`}
                    className={`w-full h-24 object-cover cursor-pointer ${
                      index === mainImageIndex ? "border-2 border-red-500" : ""
                    }`}
                    onClick={() => handleImageClick(index)}
                  />
                ))}
            </div>
          </div>
          <div className="md:w-1/2 p-6">
            <h5 className="mb-2 font-bold text-xl ">{combo?.name}</h5>
            <p className="mb-4 text-sm font-bold">
              Giá:{" "}
              <span className="text-red-500">
                {combo?.price.toLocaleString()} VND
              </span>
            </p>
            <p className="mb-4 font-bold">Danh mục: {combo?.category?.name}</p>
            <p className="mb-2">
              Thời gian: {formatDate(combo?.startDate)} -
              {formatDate(combo?.endDate)}
            </p>

            <Typography variant="h5" color="blue-gray" className="mb-4 mt-6">
              Chọn món ăn của bạn:
            </Typography>
            {restructuredDishCombo &&
              Object.entries(restructuredDishCombo).map(([setId, set]) => (
                <div key={setId} className="mb-6">
                  <Typography variant="h6" color="blue-gray" className="mb-2">
                    Bộ {set.optionSetNumber} (Chọn {set.numOfChoice})
                  </Typography>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {set.dishes.map((dish, dishIndex) => (
                      <div
                        key={dish.dishComboId}
                        className="relative cursor-pointer"
                        onClick={() => handleDishSelection(setId, dishIndex)}
                      >
                        <img
                          src={dish.dishSizeDetail.dish.image}
                          alt={dish.dishSizeDetail.dish.name}
                          className={`w-full h-32 object-cover rounded-lg ${
                            (selectedDishes[setId] || []).includes(dishIndex)
                              ? "opacity-75 border-4 border-red-500"
                              : ""
                          }`}
                        />
                        {(selectedDishes[setId] || []).includes(dishIndex) && (
                          <CheckCircleIcon className="absolute top-2 right-2 w-6 h-6 text-red-500" />
                        )}
                        <Typography
                          variant="small"
                          className="mt-1 text-center"
                        >
                          {dish.dishSizeDetail.dish.name}
                        </Typography>
                        <Typography
                          variant="tiny"
                          className="text-center text-gray-600"
                        >
                          Giá: {dish.dishSizeDetail.price.toLocaleString()} VND
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

            <Button
              color="red"
              ripple="light"
              className="w-full mt-4"
              onClick={handleAddToCart}
            >
              Thêm vào giỏ hàng
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ComboDetail;
