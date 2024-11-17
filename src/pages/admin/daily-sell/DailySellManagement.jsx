import { useEffect, useState } from "react";
import useCallApi from "../../../api/useCallApi";
import { uniqueId } from "lodash";
import { Button, Card, Input, message, Space, Switch } from "antd";
import { ComboApi, DishApi, DishManagementApi } from "../../../api/endpoint";
import DishTable from "../../../components/table/DishTable";
import ComboTable from "../../../components/table/ComboTable";
import { showError } from "../../../util/Utility";
import TabMananger from "../../../components/tab/TabManager";

const DailySellManagement = () => {
  const MenuTab = [
    {
      label: "Món lẻ",
      value: "1",
    },
    {
      label: "Món Combo",
      value: "2",
    },
  ];
  const [dishes, setDishes] = useState([]);
  const [combos, setCombos] = useState([]);
  const { callApi, error, loading } = useCallApi();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedMenuTab, setSelectedMenuTab] = useState("1");
  const totalItems = 10;
  const [dishSizeDetails, setDishSizeDetails] = useState([]);
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [isAutoUpdate, setIsAutoUpdate] = useState(false);
  const [dailyCountdown, setDailyCountdown] = useState(
    selectedCombo?.dailyCountdown || 0
  );
  const [quantityLeft, setQuantityLeft] = useState(
    selectedCombo?.quantityLeft || 0
  );

  const fetchDishes = async () => {
    if (Number(selectedMenuTab) === 1) {
      const response = await callApi(
        `${DishApi.GET_ALL}/${currentPage}/${totalItems}`,
        "GET"
      );
      if (response?.isSuccess) {
        setDishes(response.result.items);
        setTotalPages(response.result.totalPages);
      }
    } else {
      const response = await callApi(
        `${ComboApi.GET_ALL}/${currentPage}/${totalItems}`,
        "GET"
      );
      if (response?.isSuccess) {
        setCombos(response.result);
        setTotalPages(response.result.totalPages);
      }
    }
  };

  useEffect(() => {
    fetchDishes();
  }, [currentPage, selectedMenuTab]);

  const handleSelectRow = (record) => {
    setDishSizeDetails(record.dishSizeDetails);
    setSelectedCombo(null);
  };
  const handleSelectRowCombo = (record) => {
    console.log(record);
    setSelectedCombo(record);
  };

  const handleInputChange = (id, field, value) => {
    setDishSizeDetails(
      dishSizeDetails.map((detail) =>
        detail.dishSize.id === id
          ? { ...detail, [field]: parseInt(value) }
          : detail
      )
    );
  };
  console.log(dishSizeDetails);
  const handleUpdateQuantityAndCountdown = async () => {
    const updateData = dishSizeDetails.map((detail) => ({
      dishSizeDetailId: detail.dishSizeDetailId,
      quantityLeft: isAutoUpdate ? null : detail.quantityLeft,
      dailyCountdown: isAutoUpdate ? detail.dailyCountdown : null,
    }));

    const response = await callApi(
      `${DishManagementApi.UPDATE_DISH_QUANTITY}`,
      "PUT",
      updateData
    );
    if (response?.isSuccess) {
      message.success("Cập nhật thành công");
      await fetchDishes();
    } else {
      showError(response.messages);
    }
  };
  const handleUpdate = async () => {
    try {
      const response = await callApi(
        `${DishManagementApi.UPDATE_DISH_QUANTITY}`,
        "PUT",
        {
          comboId: selectedCombo.comboId,
        }
      );
      message.success("Cập nhật thành công");
    } catch (error) {
      message.error("Cập nhật thất bại");
    }
  };
  return (
    <div className="p-4 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="col-span-1 border-none">
          <h4 className="text-center font-bold mb-4 text-red-800">
            QUẢN LÝ BÁN HÀNG HÀNG NGÀY
          </h4>
          {!selectedCombo && (
            <Space direction="vertical" className="w-full">
              <Space>
                <h1>Cấu hình tự động:</h1>
                <Switch
                  checked={isAutoUpdate}
                  onChange={(checked) => setIsAutoUpdate(checked)}
                />
              </Space>
              {dishSizeDetails?.map((dishSizeDetail) => (
                <Card
                  key={dishSizeDetail?.dishSize?.id}
                  size="small"
                  className="w-full"
                >
                  <Space direction="vertical" className="w-full">
                    <h1 strong>{dishSizeDetail?.dishSize?.vietnameseName}</h1>
                    {isAutoUpdate ? (
                      <Input
                        type="number"
                        value={dishSizeDetail.dailyCountdown}
                        onChange={(e) =>
                          handleInputChange(
                            dishSizeDetail.dishSize.id,
                            "dailyCountdown",
                            e.target.value
                          )
                        }
                        addonBefore="Số lượng"
                      />
                    ) : (
                      <Input
                        type="number"
                        value={dishSizeDetail.quantityLeft}
                        onChange={(e) =>
                          handleInputChange(
                            dishSizeDetail.dishSize.id,
                            "quantityLeft",
                            e.target.value
                          )
                        }
                        addonBefore="Số lượng"
                      />
                    )}
                  </Space>
                </Card>
              ))}
              <Button
                onClick={handleUpdateQuantityAndCountdown}
                className="mt-4 bg-red-800 text-white"
                loading={loading}
              >
                Cập nhật ngay
              </Button>
            </Space>
          )}

          {selectedCombo && (
            <Space direction="vertical" className="w-full">
              <Space>
                <h1>Cấu hình tự động:</h1>
                <Switch
                  checked={isAutoUpdate}
                  onChange={(checked) => {
                    setIsAutoUpdate(checked);
                    if (!checked) {
                      setDailyCountdown(null);
                    }
                  }}
                />
              </Space>
              <Card size="small" className="w-full">
                <Space direction="vertical" className="w-full">
                  {isAutoUpdate ? (
                    <Input
                      type="number"
                      value={dailyCountdown}
                      addonBefore="Số lượng"
                      onChange={(e) => setDailyCountdown(e.target.value)}
                    />
                  ) : (
                    <Input
                      type="number"
                      value={quantityLeft}
                      addonBefore="Số lượng"
                      onChange={(e) => setQuantityLeft(e.target.value)}
                    />
                  )}
                </Space>
              </Card>
              <Button
                onClick={handleUpdate}
                className="mt-4 bg-red-800 text-white"
                loading={loading}
              >
                Cập nhật ngay
              </Button>
            </Space>
          )}
        </Card>
        <div className="col-span-3">
          <h4 className="text-center font-bold mb-4 text-red-800">
            CHI TIẾT MÓN ĂN
          </h4>
          <Space className="mb-4">
            <TabMananger
              activeTab={selectedMenuTab}
              items={MenuTab}
              setActiveTab={setSelectedMenuTab}
            />
          </Space>

          {Number(selectedMenuTab) === 1 ? (
            <div className="max-h-[700px] overflow-y-scroll">
              <DishTable
                key={uniqueId()}
                dishes={dishes}
                loading={loading}
                handleSelectRow={handleSelectRow}
              />
            </div>
          ) : (
            Number(selectedMenuTab) === 2 && (
              <div className="max-h-[700px] overflow-y-scroll">
                <ComboTable
                  key={uniqueId()}
                  data={combos}
                  loading={loading}
                  handleSelectRow={handleSelectRowCombo}
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DailySellManagement;
