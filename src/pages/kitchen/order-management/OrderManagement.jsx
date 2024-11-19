import { Typography } from "@material-tailwind/react";
import { Button, Card, Input, message, Modal, Skeleton } from "antd";
import {
  AlertTriangle,
  BellRing,
  Check,
  CheckCircle,
  CookingPot,
  Eye,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatDateTime, formatPrice, showError } from "../../../util/Utility";
import useCallApi from "../../../api/useCallApi";
import { OrderSessionApi } from "../../../api/endpoint";
import LoadingOverlay from "../../../components/loading/LoadingOverlay";
import OrderSessionModal from "./OrderSessionModal";
import Pagination from "../../../components/pagination/Pagination";
import * as signalR from "@microsoft/signalr";
import { baseUrl } from "../../../api/config/axios";
import notification_sound from "../../../assets/sound/kitchen.mp3";
import TabMananger from "../../../components/tab/TabManager";
import { SignalRMethod } from "../../../util/GlobalType";

const menuItems = [
  { value: -1, label: "Tất cả" },
  { value: 0, label: "Đặt trước" },
  { value: 1, label: "Đã tiếp nhận" },
  { value: 2, label: "Đang nấu" },
  { value: 3, label: "Cảnh báo nấu trễ" },
  { value: 4, label: "Hoàn thành" },
  { value: 5, label: "Đã huỷ" },
];

const OrderTag = ({ status, index }) => {
  const [textColor, setTextColor] = useState("");

  const baseClass =
    "flex items-center rounded-md border text-sm font-bold shadow-md w-fit px-4 py-2 transition-all duration-300 ease-in-out ";

  const statusColors = {
    0: "#C01D2E",
    1: "#E3B054",
    2: "#468764",
    3: "#545454",
    4: "#2ecc71",
    5: "#95a5a6",
  };

  const statusBgColors = {
    0: "#FFE9EC",
    1: "#FFFCD4",
    2: "#D0FFDD",
    3: "#eed202",
    4: "#D5F5E3",
    5: "#EAEDED",
  };

  const statusIcons = {
    0: <BellRing size={16} className="mr-2" />,
    1: <Check size={16} className="mr-2" />,
    2: <CookingPot size={16} className="mr-2" />,
    3: <AlertTriangle size={16} className="mr-2" />,
    4: <CheckCircle size={16} className="mr-2" />,
    5: <XCircle size={16} className="mr-2" />,
  };

  useEffect(() => {
    const color = statusColors[status];
    setTextColor(color);
  }, [status]);

  const tagStyle = {
    backgroundColor: `${statusBgColors[status]}`,
    borderColor: statusColors[status],
    color: textColor,
  };

  return (
    <div className={`${baseClass} hover:brightness-110`} style={tagStyle}>
      {statusIcons[status]}
      <span>#{index}</span>
    </div>
  );
};

const OrderCard = ({
  id,
  orderNumber,
  date,
  items,
  tableNumber,
  status,
  fetchOrderDetail,
  updateStatus,
}) => {
  const [textColor, setTextColor] = useState("");

  const statusColors = {
    0: "#C01D2E",
    1: "#E3B054",
    2: "#468764",
    3: "#523923",
    4: "#2ecc71",
    5: "#95a5a6",
  };

  const statusBgColors = {
    0: "#FFE9EC",
    1: "#FFFCD4",
    2: "#D0FFDD",
    3: "#eed202",
    4: "#D5F5E3",
    5: "#EAEDED",
  };
  const tagStyle = {
    backgroundColor: `${statusBgColors[status]}`,
    borderColor: statusColors[status],
    color: textColor,
  };
  useEffect(() => {
    const color = statusColors[status];
    setTextColor(color);
  }, [status]);
  const renderStatus = () => {
    switch (status) {
      case 0:
        return "Đặt trước";
      case 1:
        return "Đã xác nhận";
      case 2:
        return "Đang xử lý";
      case 3:
        return "Đang nấu trễ";
      case 4:
        return "Hoàn thành";
      case 5:
        return "Đã huỷ";
      default:
        return "";
    }
  };
  console.log("items", items);
  const renderAction = () => {
    switch (status) {
      case 0:
        return (
          <div className="flex justify-between p-2 ">
            <Button
              className="bg-pink-50  border-none"
              onClick={fetchOrderDetail}
            >
              <Eye size={24} className="h-6 w-6 text-red-800" />
            </Button>
            <div className="flex gap-1">
              <Button
                className="bg-yellow-800 text-white px-2 py-4"
                onClick={() => updateStatus(id, 1)}
              >
                <Check size={24} />
              </Button>
              <Button
                className="bg-[#7F7F7F] text-white  px-2 py-4"
                onClick={() => updateStatus(id, 5)}
              >
                <X size={24} />
              </Button>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="flex justify-between p-2 ">
            <Button
              className="bg-pink-50  border-none"
              onClick={fetchOrderDetail}
            >
              <Eye size={24} className="h-6 w-6 text-red-800" />
            </Button>
            <div className="flex gap-1">
              <Button
                className="bg-[orange] text-white px-2 py-4"
                onClick={() => updateStatus(id, 2)}
              >
                <CookingPot size={24} />
              </Button>
              <Button
                className="bg-[#7F7F7F] text-white  px-2 py-4"
                onClick={() => updateStatus(id, 5)}
              >
                <X size={24} />
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex justify-between p-2 ">
            <Button
              className="bg-pink-50  border-none"
              onClick={fetchOrderDetail}
            >
              <Eye size={24} className="h-6 w-6 text-red-800" />
            </Button>
            <div className="flex gap-1">
              <Button
                className="bg-[#2ecc71] text-white px-2 py-4"
                onClick={() => {
                  Modal.confirm({
                    title: "Xác nhận",
                    content:
                      "Bạn hãy đảm bảo rằng tất cả món ăn đã hoàn thành?",
                    onOk: () => updateStatus(id, 4),
                  });
                }}
              >
                <CheckCircle size={24} />
              </Button>
              <Button
                className="bg-[#7F7F7F] text-white  px-2 py-4"
                onClick={() => updateStatus(id, 5)}
              >
                <X size={24} />
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex justify-between p-2 ">
            <Button
              className="bg-pink-50  border-none"
              onClick={fetchOrderDetail}
            >
              <Eye size={24} className="h-6 w-6 text-red-800" />
            </Button>
            <div className="flex gap-1">
              <Button
                className="bg-[#2ecc71] text-white px-2 py-4"
                onClick={() => {
                  Modal.confirm({
                    title: "Xác nhận",
                    content:
                      "Bạn hãy đảm bảo rằng tất cả món ăn đã hoàn thành?",
                    onOk: () => updateStatus(id, 4),
                  });
                }}
              >
                <CheckCircle size={24} />
              </Button>
              <Button
                className="bg-[#7F7F7F] text-white  px-2 py-4"
                onClick={() => updateStatus(id, 5)}
              >
                <X size={24} />
              </Button>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex justify-between p-2 ">
            <Button
              className="bg-pink-50  border-none"
              onClick={fetchOrderDetail}
            >
              <Eye size={24} className="h-6 w-6 text-red-800" />
            </Button>
          </div>
        );
    }
  };

  return (
    <Card className=" bg-white border-2 border-[#C01D2E] mx-2 my-2 rounded-xl shadow-md">
      <div className="w-full">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#C01D2E]">
              Đơn số #{orderNumber}
            </h2>
            <p className="text-gray-500">{formatDateTime(date)}</p>
            <div style={tagStyle} className="text-center rounded-lg ">
              <span className="text-sm font-semibold">{renderStatus()}</span>
            </div>
          </div>
          {tableNumber && (
            <div className="bg-[#C01D2E] text-white px-3 py-1 text-wrap rounded-full text-sm font-semibold">
              Bàn {tableNumber}
            </div>
          )}
          {!tableNumber && (
            <div className="bg-[#C01D2E] text-white px-3 py-1 text-wrap rounded-full text-sm font-semibold">
              Giao hàng
            </div>
          )}
        </div>
      </div>
      <div className="pt-4">
        {items.slice(0, 2).map((item, index) => (
          <div key={index} className="flex items-center mb-4">
            <img
              src={item?.dishSizeDetail?.dish.image || item?.combo?.image}
              alt={item.dishSizeDetail?.dish.name || item.combo?.image}
              className="w-16 h-16 rounded-full mr-4"
            />
            <div className="flex-grow">
              <h3 className="font-semibold">
                {item?.combo?.name || item?.dishSizeDetail.dish?.name}
              </h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: item.dishSizeDetail?.dish.description,
                }}
              />

              <div className="flex justify-between mt-1">
                <span>{formatPrice(item?.price)}</span>
                <span>Số lượng: {item?.quantity}</span>
              </div>
            </div>
          </div>
        ))}
        {items.length > 2 && (
          <p className="text-gray-600 mt-2 font-bold">
            + {items.length - 2} món khác
          </p>
        )}
      </div>

      {renderAction()}
    </Card>
  );
};

const OrderManagement = () => {
  const [orderSession, setOrderSession] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(-1);
  const { callApi, error, loading } = useCallApi();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderSessionData, setOrderSessionData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;
  const [totalPages, setTotalPages] = useState(1);
  const [connection, setConnection] = useState(null);
  const audioRef = useRef(null);

  const onchangeStatus = (status) => {
    setSelectedStatus(status);
  };
  const onPageChange = (page) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    // Create connection
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}/notifications`) // Replace with your SignalR hub URL
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
            connection.on(SignalRMethod.LOAD_ORDER_SESIONS, async () => {
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
  const fetchData = async () => {
    const url = `${
      OrderSessionApi.GET_ALL_ORDER_SESSION
    }?pageNumber=${currentPage}&pageSize=${pageSize}${
      selectedStatus !== -1 ? `&status=${selectedStatus}` : ""
    }`;
    const response = await callApi(`${url}`, "GET");
    if (response.isSuccess) {
      setOrderSession(response.result.items);

      setTotalPages(response.result?.totalPages);
    } else {
      showError(response.messages);
      setOrderSession([]);
      setTotalPages(0);
    }
  };
  useEffect(() => {
    fetchData();
  }, [currentPage, selectedStatus]);
  const fetchOrderDetail = async (orderSessionId) => {
    const response = await callApi(
      `${OrderSessionApi.GET_ORDER_SESSION_BY_ID}?id=${orderSessionId}`,
      "GET"
    );
    if (response.isSuccess) {
      setOrderSessionData(response.result);
      setIsModalOpen(true);
    }
  };

  const updateOrderSessionStatus = async (orderSessionId, status) => {
    const response = await callApi(
      `${OrderSessionApi.UPDATE_ORDER_SESSION_STATUS}?id=${orderSessionId}&status=${status}`,
      "PUT"
    );
    if (response.isSuccess) {
      fetchData();
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 bg-white p-4 rounded-lg">
      <LoadingOverlay isLoading={loading} />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <audio ref={audioRef}>
          <source src={notification_sound} type="audio/mpeg" />
        </audio>
        <Typography
          variant="h5"
          className="uppercase text-red-900 mb-4 sm:mb-0"
        >
          DANH SÁCH ĐẶT MÓN TẠI BÀN HÔM NAY
        </Typography>
        <Input className="p-2 w-full sm:w-56" placeholder="Tìm đơn đặt món" />
      </div>
      <div className="mt-5 w-full">
        <TabMananger
          activeTab={selectedStatus}
          items={menuItems}
          setActiveTab={onchangeStatus}
          enableCount={false}
        />
        <div className="mb-6">
          <div className=" flex flex-wrap  w-full pb-2">
            {orderSession?.map((order, idx) => (
              <div className="mx-1 my-1">
                <OrderTag
                  key={idx}
                  status={order.orderSession.orderSessionStatusId}
                  index={order.orderSession.orderSessionNumber}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3  gap-1 overflow-y-scroll max-h-[600px]">
          {!loading &&
            orderSession.length > 0 &&
            orderSession.map((order) => (
              <OrderCard
                orderNumber={order.orderSession?.orderSessionNumber}
                date={
                  order.order?.mealTime ||
                  order.order?.reservationDate ||
                  order.order?.orderDate
                }
                tableNumber={order.table?.tableName}
                items={order.orderDetails}
                status={order.orderSession?.orderSessionStatusId}
                fetchOrderDetail={() =>
                  fetchOrderDetail(order?.orderSession?.orderSessionId)
                }
                updateStatus={updateOrderSessionStatus}
                id={order.orderSession?.orderSessionId}
              />
            ))}
        </div>
        <Pagination
          currentPage={1}
          onPageChange={onPageChange}
          totalPages={totalPages}
          key={`pagin`}
        />
      </div>
      <OrderSessionModal
        orderSession={orderSessionData}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
export default OrderManagement;
