import React, { useState, useEffect } from "react";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { formatDate, isEmptyObject } from "../../../util/Utility";
import { useDispatch } from "react-redux";
import { addCombo } from "../../../redux/features/cartSlice";
const ComboDetail2 = ({ comboData, handleBack }) => {
  // const comboData = {
  //   result: {
  //     combo: {
  //       comboId: "bab61cc3-822a-4192-8ca5-ac9a4c3a2260",
  //       name: "Set nướng Trung Bộ",
  //       description: "Set nướng Trung Bộ đậm đà hương vị",
  //       image:
  //         "https://firebasestorage.googleapis.com/v0/b/hcqs-project.appspot.com/o/combo%2Fbab61cc3-822a-4192-8ca5-ac9a4c3a2260_main.jpg.png?alt=media&token=f1b9c17d-23e7-4f50-bee8-57a9575cc5c6",
  //       price: 500000,
  //       discount: 0,
  //       categoryId: 0,
  //       category: {
  //         id: 0,
  //         name: "HOTPOT",
  //         vietnameseName: null,
  //       },
  //       startDate: "2024-06-17T04:34:53.58",
  //       endDate: "2024-12-30T04:34:53.58",
  //     },
  //     dishCombo: [
  //       {
  //         comboOptionSet: {
  //           comboOptionSetId: "e8bff246-a700-4f23-bde3-e8c0569baff4",
  //           optionSetNumber: 1,
  //           numOfChoice: 1,
  //           dishItemTypeId: 0,
  //           dishItemType: null,
  //           comboId: "bab61cc3-822a-4192-8ca5-ac9a4c3a2260",
  //           combo: null,
  //         },
  //         dishCombo: [
  //           {
  //             dishComboId: "b166c487-ddc8-43c7-a669-35d7ea039dc8",
  //             quantity: 1,
  //             dishSizeDetailId: "03096bba-7740-485e-bf1e-1cf8e93e98c8",
  //             dishSizeDetail: {
  //               dishSizeDetailId: "03096bba-7740-485e-bf1e-1cf8e93e98c8",
  //               isAvailable: true,
  //               price: 90000,
  //               discount: 0,
  //               dishId: "cd64ce88-dbe8-4d26-9c37-4edc502ed87c",
  //               dish: {
  //                 dishId: "cd64ce88-dbe8-4d26-9c37-4edc502ed87c",
  //                 name: "Gỏi cuốn chay",
  //                 description: "Gỏi cuốn chay.",
  //                 image:
  //                   "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRODdAuEUrk9bJUPQNxlaBhQYq79Et5HF04HA&s",
  //                 dishItemTypeId: 0,
  //                 dishItemType: null,
  //                 isAvailable: true,
  //               },
  //               dishSizeId: 0,
  //               dishSize: null,
  //             },
  //             comboOptionSetId: "e8bff246-a700-4f23-bde3-e8c0569baff4",
  //             comboOptionSet: {
  //               comboOptionSetId: "e8bff246-a700-4f23-bde3-e8c0569baff4",
  //               optionSetNumber: 1,
  //               numOfChoice: 1,
  //               dishItemTypeId: 0,
  //               dishItemType: null,
  //               comboId: "bab61cc3-822a-4192-8ca5-ac9a4c3a2260",
  //               combo: null,
  //             },
  //           },
  //         ],
  //       },
  //       {
  //         comboOptionSet: {
  //           comboOptionSetId: "e8bff246-a700-4f23-bde3-e8c0569baff4",
  //           optionSetNumber: 1,
  //           numOfChoice: 1,
  //           dishItemTypeId: 0,
  //           dishItemType: null,
  //           comboId: "bab61cc3-822a-4192-8ca5-ac9a4c3a2260",
  //           combo: null,
  //         },
  //         dishCombo: [
  //           {
  //             dishComboId: "92db0dfe-fbb3-4385-918c-efbdf13c3472",
  //             quantity: 1,
  //             dishSizeDetailId: "54a5cb84-6a4d-4acc-84a7-a62d70ec19e2",
  //             dishSizeDetail: {
  //               dishSizeDetailId: "54a5cb84-6a4d-4acc-84a7-a62d70ec19e2",
  //               isAvailable: true,
  //               price: 90000,
  //               discount: 0,
  //               dishId: "675c4108-4000-4151-8946-1755bec19e6a",
  //               dish: {
  //                 dishId: "675c4108-4000-4151-8946-1755bec19e6a",
  //                 name: "Gỏi cuốn tôm thịt",
  //                 description: "Gỏi cuốn tôm và thịt heo.",
  //                 image:
  //                   "https://netspace.edu.vn/app_assets/images/2020/04/25/cach-lam-goi-cuon-tom-thit-cuc-ki-hap-dan-245587-800.jpg",
  //                 dishItemTypeId: 0,
  //                 dishItemType: null,
  //                 isAvailable: true,
  //               },
  //               dishSizeId: 0,
  //               dishSize: null,
  //             },
  //             comboOptionSetId: "e8bff246-a700-4f23-bde3-e8c0569baff4",
  //             comboOptionSet: {
  //               comboOptionSetId: "e8bff246-a700-4f23-bde3-e8c0569baff4",
  //               optionSetNumber: 1,
  //               numOfChoice: 1,
  //               dishItemTypeId: 0,
  //               dishItemType: null,
  //               comboId: "bab61cc3-822a-4192-8ca5-ac9a4c3a2260",
  //               combo: null,
  //             },
  //           },
  //         ],
  //       },
  //       {
  //         comboOptionSet: {
  //           comboOptionSetId: "229a0109-2510-43f4-a610-1ae8ecfad6a6",
  //           optionSetNumber: 2,
  //           numOfChoice: 2,
  //           dishItemTypeId: 2,
  //           dishItemType: null,
  //           comboId: "bab61cc3-822a-4192-8ca5-ac9a4c3a2260",
  //           combo: null,
  //         },
  //         dishCombo: [
  //           {
  //             dishComboId: "20b76ecc-c19c-4fbc-8897-a36455288bc2",
  //             quantity: 1,
  //             dishSizeDetailId: "74eaac64-4c2f-438f-81ef-1901103a66a2",
  //             dishSizeDetail: {
  //               dishSizeDetailId: "74eaac64-4c2f-438f-81ef-1901103a66a2",
  //               isAvailable: true,
  //               price: 170000,
  //               discount: 0,
  //               dishId: "6c7e3f85-b6c9-4163-9faa-3fcacab8c9e4",
  //               dish: {
  //                 dishId: "6c7e3f85-b6c9-4163-9faa-3fcacab8c9e4",
  //                 name: "Lẩu gà nấm hương",
  //                 description: "Lẩu gà với nấm hương.",
  //                 image:
  //                   "https://firebasestorage.googleapis.com/v0/b/hcqs-project.appspot.com/o/dish%2F36fcb2d0-b200-489c-9241-f81ff6ef680e.jpg.png?alt=media&token=4190a718-3d60-4c54-b592-9a88099a3fd6",
  //                 dishItemTypeId: 2,
  //                 dishItemType: null,
  //                 isAvailable: true,
  //               },
  //               dishSizeId: 0,
  //               dishSize: null,
  //             },
  //             comboOptionSetId: "229a0109-2510-43f4-a610-1ae8ecfad6a6",
  //             comboOptionSet: {
  //               comboOptionSetId: "229a0109-2510-43f4-a610-1ae8ecfad6a6",
  //               optionSetNumber: 2,
  //               numOfChoice: 2,
  //               dishItemTypeId: 2,
  //               dishItemType: null,
  //               comboId: "bab61cc3-822a-4192-8ca5-ac9a4c3a2260",
  //               combo: null,
  //             },
  //           },
  //         ],
  //       },
  //       {
  //         comboOptionSet: {
  //           comboOptionSetId: "229a0109-2510-43f4-a610-1ae8ecfad6a6",
  //           optionSetNumber: 2,
  //           numOfChoice: 2,
  //           dishItemTypeId: 2,
  //           dishItemType: null,
  //           comboId: "bab61cc3-822a-4192-8ca5-ac9a4c3a2260",
  //           combo: null,
  //         },
  //         dishCombo: [
  //           {
  //             dishComboId: "cdf16167-d525-4bda-8f76-b254f3e79caf",
  //             quantity: 1,
  //             dishSizeDetailId: "fb480e9a-37b0-47fb-a124-9ddba31c8d69",
  //             dishSizeDetail: {
  //               dishSizeDetailId: "fb480e9a-37b0-47fb-a124-9ddba31c8d69",
  //               isAvailable: true,
  //               price: 160000,
  //               discount: 0,
  //               dishId: "f1ea24a4-d1a0-4a0f-bc4a-487983ef6788",
  //               dish: {
  //                 dishId: "f1ea24a4-d1a0-4a0f-bc4a-487983ef6788",
  //                 name: "Lẩu đu đủ",
  //                 description: "Lẩu đu đủ với thịt.",
  //                 image:
  //                   "https://file.baothuathienhue.vn/data2/image/fckeditor/upload/2018/20180302/images/duoi%20bo.jpg?dpi=150&quality=100&w=1920",
  //                 dishItemTypeId: 2,
  //                 dishItemType: null,
  //                 isAvailable: true,
  //               },
  //               dishSizeId: 0,
  //               dishSize: null,
  //             },
  //             comboOptionSetId: "229a0109-2510-43f4-a610-1ae8ecfad6a6",
  //             comboOptionSet: {
  //               comboOptionSetId: "229a0109-2510-43f4-a610-1ae8ecfad6a6",
  //               optionSetNumber: 2,
  //               numOfChoice: 2,
  //               dishItemTypeId: 2,
  //               dishItemType: null,
  //               comboId: "bab61cc3-822a-4192-8ca5-ac9a4c3a2260",
  //               combo: null,
  //             },
  //           },
  //         ],
  //       },
  //       {
  //         comboOptionSet: {
  //           comboOptionSetId: "229a0109-2510-43f4-a610-1ae8ecfad6a6",
  //           optionSetNumber: 2,
  //           numOfChoice: 2,
  //           dishItemTypeId: 2,
  //           dishItemType: null,
  //           comboId: "bab61cc3-822a-4192-8ca5-ac9a4c3a2260",
  //           combo: null,
  //         },
  //         dishCombo: [
  //           {
  //             dishComboId: "dfc02d03-0247-4ed7-9b4a-b7371bd50fb1",
  //             quantity: 1,
  //             dishSizeDetailId: "8fda33b6-78c1-4f70-bfcb-abfffd76dd07",
  //             dishSizeDetail: {
  //               dishSizeDetailId: "8fda33b6-78c1-4f70-bfcb-abfffd76dd07",
  //               isAvailable: true,
  //               price: 170000,
  //               discount: 0,
  //               dishId: "3c4b02be-6469-4c7b-8f5d-195c80b09793",
  //               dish: {
  //                 dishId: "3c4b02be-6469-4c7b-8f5d-195c80b09793",
  //                 name: "Lẩu gà xả",
  //                 description: "Lẩu gà với sả.",
  //                 image:
  //                   "https://cdn.tgdd.vn/Files/2020/03/10/1241190/cach-nau-lau-ga-ham-sa-thom-ngon-ga-dai-dam-vi-202003101132302752.jpg",
  //                 dishItemTypeId: 2,
  //                 dishItemType: null,
  //                 isAvailable: true,
  //               },
  //               dishSizeId: 0,
  //               dishSize: null,
  //             },
  //             comboOptionSetId: "229a0109-2510-43f4-a610-1ae8ecfad6a6",
  //             comboOptionSet: {
  //               comboOptionSetId: "229a0109-2510-43f4-a610-1ae8ecfad6a6",
  //               optionSetNumber: 2,
  //               numOfChoice: 2,
  //               dishItemTypeId: 2,
  //               dishItemType: null,
  //               comboId: "bab61cc3-822a-4192-8ca5-ac9a4c3a2260",
  //               combo: null,
  //             },
  //           },
  //         ],
  //       },
  //       {
  //         comboOptionSet: {
  //           comboOptionSetId: "dc70ac80-39dd-4234-ad57-32bb3a465ff0",
  //           optionSetNumber: 3,
  //           numOfChoice: 1,
  //           dishItemTypeId: 3,
  //           dishItemType: null,
  //           comboId: "bab61cc3-822a-4192-8ca5-ac9a4c3a2260",
  //           combo: null,
  //         },
  //         dishCombo: [
  //           {
  //             dishComboId: "05cee1be-ee44-4cfc-8687-62e1fe68ef43",
  //             quantity: 1,
  //             dishSizeDetailId: "a2f96930-befe-4671-a57f-44c62459f5c9",
  //             dishSizeDetail: {
  //               dishSizeDetailId: "a2f96930-befe-4671-a57f-44c62459f5c9",
  //               isAvailable: true,
  //               price: 350000,
  //               discount: 0,
  //               dishId: "a83cf625-65f9-4cfd-aab3-005827d9371e",
  //               dish: {
  //                 dishId: "a83cf625-65f9-4cfd-aab3-005827d9371e",
  //                 name: "Sườn nướng BBQ",
  //                 description: "Sườn heo nướng BBQ.",
  //                 image:
  //                   "https://cdn.tgdd.vn/Files/2022/04/07/1424410/bo-tui-cach-lam-suon-heo-nuong-bbq-chuan-vi-cho-cuoi-tuan-202211221345442766.jpg",
  //                 dishItemTypeId: 3,
  //                 dishItemType: null,
  //                 isAvailable: true,
  //               },
  //               dishSizeId: 2,
  //               dishSize: null,
  //             },
  //             comboOptionSetId: "dc70ac80-39dd-4234-ad57-32bb3a465ff0",
  //             comboOptionSet: {
  //               comboOptionSetId: "dc70ac80-39dd-4234-ad57-32bb3a465ff0",
  //               optionSetNumber: 3,
  //               numOfChoice: 1,
  //               dishItemTypeId: 3,
  //               dishItemType: null,
  //               comboId: "bab61cc3-822a-4192-8ca5-ac9a4c3a2260",
  //               combo: null,
  //             },
  //           },
  //         ],
  //       },
  //       {
  //         comboOptionSet: {
  //           comboOptionSetId: "dc70ac80-39dd-4234-ad57-32bb3a465ff0",
  //           optionSetNumber: 3,
  //           numOfChoice: 1,
  //           dishItemTypeId: 3,
  //           dishItemType: null,
  //           comboId: "bab61cc3-822a-4192-8ca5-ac9a4c3a2260",
  //           combo: null,
  //         },
  //         dishCombo: [
  //           {
  //             dishComboId: "b9aa5d01-dd41-4011-a3e1-fdfd42d76256",
  //             quantity: 1,
  //             dishSizeDetailId: "08e1da74-3fc3-491d-abae-a7777d4bdaa7",
  //             dishSizeDetail: {
  //               dishSizeDetailId: "08e1da74-3fc3-491d-abae-a7777d4bdaa7",
  //               isAvailable: true,
  //               price: 350000,
  //               discount: 0,
  //               dishId: "b5789254-5469-48f7-96bc-465d799da0f8",
  //               dish: {
  //                 dishId: "b5789254-5469-48f7-96bc-465d799da0f8",
  //                 name: "Sườn nướng tỏi",
  //                 description: "Sườn nướng BBQ với tỏi.",
  //                 image:
  //                   "https://afamilycdn.com/2018/9/29/6-15381991194621744852195.jpg",
  //                 dishItemTypeId: 3,
  //                 dishItemType: null,
  //                 isAvailable: true,
  //               },
  //               dishSizeId: 2,
  //               dishSize: null,
  //             },
  //             comboOptionSetId: "dc70ac80-39dd-4234-ad57-32bb3a465ff0",
  //             comboOptionSet: {
  //               comboOptionSetId: "dc70ac80-39dd-4234-ad57-32bb3a465ff0",
  //               optionSetNumber: 3,
  //               numOfChoice: 1,
  //               dishItemTypeId: 3,
  //               dishItemType: null,
  //               comboId: "bab61cc3-822a-4192-8ca5-ac9a4c3a2260",
  //               combo: null,
  //             },
  //           },
  //         ],
  //       },
  //     ],
  //     imgs: [
  //       "https://firebasestorage.googleapis.com/v0/b/hcqs-project.appspot.com/o/combo%2Fbab61cc3-822a-4192-8ca5-ac9a4c3a226001449422-72a5-4a23-9911-c8781261dea3.jpg.png?alt=media&token=e576d078-78fc-4a70-a8ba-c273c0aafd50",
  //     ],
  //   },
  //   isSuccess: true,
  //   messages: [],
  // };
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

export default ComboDetail2;
