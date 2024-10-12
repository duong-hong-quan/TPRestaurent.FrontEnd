import { CardFooter, CardHeader, Typography } from "@material-tailwind/react";
import { Button, Card, Input } from "antd";
import { color } from "framer-motion";
import {
  AlertTriangle,
  BellRing,
  Check,
  CheckCircle,
  Clock,
  CookingPot,
  Eye,
  Loader,
  TicketIcon,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatDateTime, formatPrice } from "../../../util/Utility";
import useCallApi from "../../../api/useCallApi";
import { OrderSessionApi } from "../../../api/endpoint";
import LoadingOverlay from "../../../components/loading/LoadingOverlay";
const menuItems = [
  { key: "all", label: "Tất cả" },
  { key: "waiting", label: "Đang chờ" },
  { key: "preparing", label: "Đang chuẩn bị" },
  { key: "done", label: "Đã xong" },
  { key: "cancelled", label: "Đã huỷ" },
];

const TabStatusKitchen = ({ selected }) => {
  return (
    <div className="flex flex-wrap justify-start mb-4">
      {menuItems.map((item) => (
        <Button
          key={item.key}
          className={`bg-white text-gray-800 px-4 py-2 rounded-tl-md rounded-tr-md  font-semibold text-base rounded-bl-none rounded-br-none mr-1 min-h-10 min-w-fit shadow-md ${
            selected === item.key ? "text-red-900" : ""
          }`}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
};

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
    3: "#DBDBDB",
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

const OrderCard = ({ orderNumber, date, items, tableNumber }) => {
  return (
    <Card className="w-80 bg-white border-2 border-[#C01D2E] mx-2 my-2 rounded-xl overflow-hidden shadow-md">
      <div className="w-full">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#C01D2E]">
              Đơn số #{orderNumber}
            </h2>
            <p className="text-gray-500">{formatDateTime(date)}</p>
          </div>
          <div className="bg-[#C01D2E] text-white px-3 py-1 rounded-full text-sm font-semibold">
            Bàn {tableNumber}
          </div>
        </div>
      </div>
      <div className="pt-4">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-center mb-4">
            <img
              src={item?.dishSizeDetail?.dish.image || item?.combo?.image}
              alt={item.dishSizeDetail?.dish.name || item.combo?.image}
              className="w-16 h-16 rounded-full mr-4"
            />
            <div className="flex-grow">
              <h3 className="font-semibold">
                {item?.combo?.name || item?.dishSizeDetail.dish?.name}
              </h3>
              <p className="text-sm text-gray-500">
                {item.dishSizeDetail?.dish.description}
              </p>
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

      <div className="flex justify-between p-2 ">
        <Button className="bg-pink-50  border-none">
          <Eye size={24} className="h-6 w-6 text-red-800" />
        </Button>
        <div className="flex gap-1">
          <Button className="bg-[#3a3936] text-white  px-2 py-4">
            <CookingPot size={24} />
          </Button>
          <Button className="bg-[#468764] text-white px-2 py-4">
            <Check size={24} />
          </Button>
          <Button className="bg-[#7F7F7F] text-white  px-2 py-4">
            <X size={24} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

const OrderManagement = () => {
  const [orderSession, setOrderSession] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { callApi, error, loading } = useCallApi();
  const fetchData = async () => {
    const response = await callApi(
      `${OrderSessionApi.GET_ALL_ORDER_SESSION}`,
      "GET"
    );
    if (response.isSuccess) {
      setOrderSession(response.result);
    } else {
      console.log("error", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  if (loading) {
    return <LoadingOverlay isLoading={loading} />;
  }
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <Typography
          variant="h5"
          className="uppercase text-red-900 mb-4 sm:mb-0"
        >
          DANH SÁCH ĐẶT MÓN TẠI BÀN HÔM NAY
        </Typography>
        <Input className="p-2 w-full sm:w-56" placeholder="Tìm đơn đặt món" />
      </div>
      <div className="mt-5 w-full">
        <TabStatusKitchen selected="all" />
        <div className="mb-6">
          <div className=" flex flex-wrap  w-full pb-2">
            {orderSession.map((order, idx) => (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 overflow-y-auto max-h-[calc(100vh-300px)]">
          {orderSession.map((order) => (
            <OrderCard
              orderNumber={order.orderSession?.orderSessionNumber}
              date={
                order.order?.mealTime ||
                order.order?.reservationDate ||
                order.order?.orderDate
              }
              tableNumber={order.table?.tableName}
              items={order.orderDetails}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default OrderManagement;
