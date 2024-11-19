import { useEffect, useRef, useState } from "react";
import {
  Typography,
  Table,
  message,
  Tag,
  Badge,
  Skeleton,
  Space,
  Button,
  Image,
} from "antd";
import useCallApi from "../../../api/useCallApi";
import { GroupedDishCraftApi, OrderApi } from "../../../api/endpoint";
import * as signalR from "@microsoft/signalr";
import { baseUrl } from "../../../api/config/axios";
import notification_sound from "../../../assets/sound/kitchen.mp3";
import styled from "styled-components";
import { EyeOutlined } from "@ant-design/icons";
import OrderDetailModal from "./OrderDetailModal";
import { combineTimes, showError } from "../../../util/Utility";
import { SignalRMethod } from "../../../util/GlobalType";

const { Title, Text } = Typography;

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    text-align: center;
    vertical-align: middle;
    border-bottom: none;
  }
  .ant-table-tbody > tr > td {
    text-align: center;
    vertical-align: middle;
    border-bottom: none;
  }
`;

const QuantityBadge = ({ label, count, color }) => (
  <div className="flex items-center space-x-2">
    <Badge
      count={count}
      showZero
      className="flex items-center"
      style={{ backgroundColor: color }}
    >
      <Tag color={color} className="px-3 py-1 text-sm font-medium">
        {label}
      </Tag>
    </Badge>
  </div>
);

const DishSizeInfo = ({
  sizeData,
  dishData,
  groupedDishId,
  fetchDetail,
  type,
  setType,
  setSelectedGroupedDishId,
}) => (
  <div
    className={`flex w-full items-center justify-start rounded-lg p-4 my-1 ${
      dishData.IsLate ? "bg-yellow-700 bg-opacity-40" : "bg-white"
    }`}
    style={{
      border: "1px solid #ccc",
    }}
  >
    <Text strong className="text-wrap  w-[150px]">
      {dishData?.Dish?.Name}
    </Text>
    <div>
      {sizeData.map((item, index) => (
        <div key={index} className="grid grid-cols-5 p-2 rounded">
          <Image
            src={dishData.Dish.Image}
            width={50}
            height={50}
            className="rounded-full"
          />
          <Text strong className="text-wrap max-w-[150px] my-auto">
            {item.DishSize.VietnameseName}:
          </Text>
          <Space>
            <QuantityBadge
              label="Chưa đọc"
              count={item.UncheckedQuantity}
              color="#a8181c"
            />
            <QuantityBadge
              label="Đang nấu"
              count={item.ProcessingQuantity}
              color="#1890ff"
            />
          </Space>
        </div>
      ))}
    </div>
    <Button
      className="ml-4"
      onClick={async () => {
        setType(type);
        setSelectedGroupedDishId(groupedDishId);
        await fetchDetail(groupedDishId, dishData?.Dish.DishId, type);
      }}
    >
      <EyeOutlined />
    </Button>
  </div>
);

const OptimizeProcess = () => {
  const [connection, setConnection] = useState(null);
  const audioRef = useRef(null);
  const [groupedDishCraft, setGroupedDishCraft] = useState([]);
  const { callApi, error, loading } = useCallApi();
  const [selectedDish, setSelectedDish] = useState(null);
  const [selectedGroupedDishId, setSelectedGroupedDishId] = useState(null);
  const [type, setType] = useState(true);
  const [isRefresh, setIsRefresh] = useState(false);
  const columns = [
    {
      dataIndex: "id",
      key: "id",
      title: "STT",
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      dataIndex: "timeGrouped",
      key: "timeGrouped",
      title: "Thời gian gom món",
      width: 200,
      render: (_, record) => (
        <span className="text-nowrap">
          {combineTimes(record.startTime, record.endTime)}
        </span>
      ),
    },
    {
      title: "MÓN ĂN",
      dataIndex: "groupedDishJson",
      key: "name",

      render: (_, record) => {
        const dishes = JSON.parse(record.groupedDishJson).MutualOrderDishes;
        return (
          dishes.length > 0 &&
          dishes.map((dishItem, index) => (
            <DishSizeInfo
              key={index}
              dishData={dishItem}
              sizeData={dishItem.Dish?.Total || []}
              groupedDishId={record.groupedDishCraftId}
              fetchDetail={fetchDetail}
              type={true}
              setType={setType}
              setSelectedGroupedDishId={setSelectedGroupedDishId}
            />
          ))
        );
      },
    },
  ];

  const columnSingle = [
    {
      dataIndex: "id",
      key: "id",
      title: "STT",
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      dataIndex: "timeGrouped",
      key: "timeGrouped",
      title: "Thời gian gom món",
      width: 200,
      render: (_, record) => (
        <span className="text-nowrap">
          {combineTimes(record.startTime, record.endTime)}
        </span>
      ),
    },
    {
      title: "MÓN ĂN",
      dataIndex: "groupedDishJson",
      key: "name",

      render: (_, record) => {
        const dishes = JSON.parse(record.groupedDishJson).SingleOrderDishes;
        return (
          dishes.length > 0 &&
          dishes.map((dishItem, index) => (
            <DishSizeInfo
              key={index}
              dishData={dishItem}
              sizeData={dishItem.Dish?.Total || []}
              groupedDishId={record.groupedDishCraftId}
              fetchDetail={fetchDetail}
              type={false}
              setSelectedGroupedDishId={setSelectedGroupedDishId}
              setType={setType}
            />
          ))
        );
      },
    },
  ];
  const fetchData = async () => {
    const result = await callApi(`${GroupedDishCraftApi.GET_ALL}`, "GET");
    if (result.isSuccess) {
      setGroupedDishCraft(result.result.items);
    }
  };
  const fetchDetail = async (groupedDishId, dishId, type) => {
    const result = await callApi(
      `${GroupedDishCraftApi.GET_BY_ID}/${groupedDishId}?dishId=${dishId}&isMutual=${type}`,
      "GET"
    );
    if (result.isSuccess) {
      setSelectedDish(result.result);
    }
  };
  const fetchAfterHandle = async () => {
    await fetchData();
    const response = await fetchDetail(
      selectedGroupedDishId,
      selectedDish.dish.dishId,
      type
    );
    if (response.isSuccess) {
      setSelectedDish(response.result);
    }
  };

  const handleUpdateStatus = async (selectedOrderDetail) => {
    const result = await callApi(
      `${OrderApi.UPDATE_ORDER_DETAIL_STATUS}`,
      "PUT",
      selectedOrderDetail
    );
    if (result.isSuccess) {
      setSelectedDish(null);
      message.success("Cập nhật trạng thái thành công");
      await fetchData();
    } else {
      showError(response.messages);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}/notifications`)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    let retryCount = 0;
    const MAX_RETRIES = 5;
    const RETRY_DELAY = 3000; // 3 seconds
    const startConnection = async () => {
      if (connection) {
        connection
          .start()
          .then(() => {
            message.success("Connected to SignalR");
            connection.on(SignalRMethod.LOAD_ORDER, async () => {
              await fetchData();
            });
          })
          .catch((error) => {
            if (retryCount < MAX_RETRIES) {
              retryCount++;
              setTimeout(startConnection, RETRY_DELAY);
            } else {
              console.log("Max retries reached. Could not connect to SignalR.");
            }
          });
      }
    };
    startConnection();
    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [connection]);

  const filteredData = groupedDishCraft.filter((item) => {
    const dishes = JSON.parse(item.groupedDishJson).MutualOrderDishes;
    return dishes.length > 0;
  });

  const filteredSingleData = groupedDishCraft.filter((item) => {
    const dishes = JSON.parse(item.groupedDishJson).SingleOrderDishes;
    return dishes.length > 0;
  });
  const handleTriggerGroupedDish = async () => {
    await callApi(`${GroupedDishCraftApi.ADD_GROUPED_DISH}`, "POST");
    await fetchData();
    message.success("Gom món thành công");
  };

  return (
    <div className="px-10 bg-white rounded-lg py-4 shadow-lg">
      <h5 className="text-center text-red-800 font-bold text-2xl">
        TỐI ƯU HOÁ CHẾ BIẾN MÓN
      </h5>
      <audio ref={audioRef}>
        <source src={notification_sound} type="audio/mpeg" />
      </audio>

      <div>
        <Text type="danger" style={{ display: "block", margin: "16px 0" }}>
          Note: Sau 3 phút, hệ thống sẽ tự động kiểm tra đơn và tối ưu món liên
          tục trên list.
        </Text>

        <div className="flex justify-between items-center">
          <Title level={3}>BẢNG ƯU TIÊN MÓN CẦN CHẾ BIẾN</Title>
          <Button
            className="bg-red-800 text-white"
            loading={loading}
            onClick={async () => await handleTriggerGroupedDish()}
          >
            Gom món ngay
          </Button>
        </div>
        <div className="grid  grid-cols-1 xl:grid-cols-2 gap-4 ">
          <div className="">
            <h3 className="bg-[#E3B054] text-white px-4 py-6 text-center rounded-lg shadow-lg uppercase font-bold">
              Món trùng đơn
            </h3>
            <div className="w-full">
              <StyledTable
                dataSource={filteredData}
                columns={columns}
                pagination={false}
                rowKey={(record) => record.id}
                scroll={{ x: 600, y: 500 }}
                loading={loading}
              />
            </div>
          </div>
          <div className="">
            <h3 className="bg-[#C40519] text-white px-4 py-6 text-center rounded-lg shadow-lg uppercase font-bold">
              Món lẻ đơn
            </h3>
            <div className="w-full ">
              <StyledTable
                dataSource={filteredSingleData}
                columns={columnSingle}
                pagination={false}
                scroll={{ x: 600, y: 500 }}
                rowKey={(record) => record.id}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
      <OrderDetailModal
        handleUpdateStatus={handleUpdateStatus}
        loading={loading}
        selectedDish={selectedDish}
        setSelectedDish={setSelectedDish}
        isRefresh={isRefresh}
      />
    </div>
  );
};

export default OptimizeProcess;
