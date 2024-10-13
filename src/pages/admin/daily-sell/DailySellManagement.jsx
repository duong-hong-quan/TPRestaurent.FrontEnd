import { useEffect, useState } from "react";
import useCallApi from "../../../api/useCallApi";
import { uniqueId } from "lodash";
import { Button, Card, Input, message, Space, Switch } from "antd";
import { ComboApi, DishApi, DishManagementApi } from "../../../api/endpoint";
import DishTable from "../../../components/table/DishTable";
import ComboTable from "../../../components/table/ComboTable";
import { showError } from "../../../util/Utility";

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
  const [selectedComboId, setSelectedComboId] = useState(null);
  const [isAutoUpdate, setIsAutoUpdate] = useState(false);

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
    setSelectedComboId(record.id);
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

  const handleUpdateQuantityAndCountdown = async () => {
    const updateData = dishSizeDetails.map((detail) => ({
      comboId: selectedComboId,
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
      showError(error);
    }
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h4 className="text-center font-bold mb-4">
            QUẢN LÝ BÁN HÀNG HÀNG NGÀY
          </h4>
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
              type="primary"
              onClick={handleUpdateQuantityAndCountdown}
              className="mt-4"
              loading={loading}
            >
              Cập nhật ngay
            </Button>
          </Space>
        </Card>
        <div className="">
          <h4 className="text-center font-bold mb-4">CHI TIẾT MÓN ĂN</h4>
          <Space className="mb-4">
            {MenuTab.map((tab) => (
              <Button
                key={uniqueId()}
                type={
                  Number(selectedMenuTab) === Number(tab.value)
                    ? "primary"
                    : "default"
                }
                onClick={() => setSelectedMenuTab(tab.value)}
              >
                {tab.label}
              </Button>
            ))}
          </Space>

          {Number(selectedMenuTab) === 1 ? (
            <DishTable
              key={uniqueId()}
              dishes={dishes}
              loading={loading}
              handleSelectRow={handleSelectRow}
            />
          ) : (
            Number(selectedMenuTab) === 2 && (
              <ComboTable key={uniqueId()} data={combos} loading={loading} />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DailySellManagement;
