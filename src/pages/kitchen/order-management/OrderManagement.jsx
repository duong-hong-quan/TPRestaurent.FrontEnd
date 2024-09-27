import { CardFooter, CardHeader, Typography } from "@material-tailwind/react";
import { Button, Card, Input } from "antd";
import { color } from "framer-motion";
import {
  BellRing,
  Check,
  CheckCircle,
  Clock,
  CookingPot,
  Eye,
  Loader,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatDateTime } from "../../../util/Utility";
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
    waiting: "#C01D2E",
    preparing: "#E3B054",
    done: "#468764",
    cancelled: "#545454",
  };

  const statusBgColors = {
    waiting: "#FFE9EC",
    preparing: "#FFFCD4",
    done: "#D0FFDD",
    cancelled: "#DBDBDB",
  };

  const statusIcons = {
    waiting: <BellRing size={16} className="mr-2" />,
    preparing: <CookingPot size={16} className="mr-2" />,
    done: <CheckCircle size={16} className="mr-2" />,
    cancelled: <XCircle size={16} className="mr-2" />,
  };

  useEffect(() => {
    const color = statusColors[status];
    setTextColor(color);
  }, [status]);

  const tagStyle = {
    backgroundColor: `${statusBgColors[status]}`, // 80 is 50% opacity in hex
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
export const orderData = {
  orderNumber: 351,
  date: "05 Feb 2023, 08:28 PM",
  tableNumber: 1,
  items: [
    {
      id: 1,
      name: "Vegetable Mixups",
      description: "Vegetable Fritters with Egg",
      price: 5.3,
      quantity: 1,
      image:
        "https://s3-alpha-sig.figma.com/img/cede/f2fa/0a35c8a1d8f399032cceab7502d20d6e?Expires=1728259200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=EQ99YZl85afRTgMJdgfHOdP6fZD0F5qjs0kA-X51P-rr5dmTi1jRF1vtoobwu1JKOKR5VMeV2HTbA3pTo9GooTtuP0BbK1ytNde0UMQWzQa6nwToyHJ-X3LPKCmodj4391A0-t70OivGlSsKu6z~LuzLlXcwWIt~XcbxG5IyGiFjXWYpiMfG5j1tL9ObE1oT9dza9epR484hU1Ipm~f9F43neg7QkGUFHzj~0SYhVigY6Pet4DP-qOaSAKJVJnDaa11j2ZtsgBnMsYTXAUSxl-a3MZQuYIcFP8QtfuQYpb2HUvag9gimV7PhxT-KM65mXnkV75PscfY-URT1wTHPCQ__",
    },
    {
      id: 2,
      name: "Chinese Takeout Disj",
      description: "Fresh Prawn mix salad",
      price: 5.3,
      quantity: 1,
      image:
        "https://s3-alpha-sig.figma.com/img/cede/f2fa/0a35c8a1d8f399032cceab7502d20d6e?Expires=1728259200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=EQ99YZl85afRTgMJdgfHOdP6fZD0F5qjs0kA-X51P-rr5dmTi1jRF1vtoobwu1JKOKR5VMeV2HTbA3pTo9GooTtuP0BbK1ytNde0UMQWzQa6nwToyHJ-X3LPKCmodj4391A0-t70OivGlSsKu6z~LuzLlXcwWIt~XcbxG5IyGiFjXWYpiMfG5j1tL9ObE1oT9dza9epR484hU1Ipm~f9F43neg7QkGUFHzj~0SYhVigY6Pet4DP-qOaSAKJVJnDaa11j2ZtsgBnMsYTXAUSxl-a3MZQuYIcFP8QtfuQYpb2HUvag9gimV7PhxT-KM65mXnkV75PscfY-URT1wTHPCQ__",
    },
    {
      id: 3,
      name: "Chinese Takeout Disj",
      description: "Fresh Prawn mix salad",
      price: 5.3,
      quantity: 1,
      image:
        "https://s3-alpha-sig.figma.com/img/cede/f2fa/0a35c8a1d8f399032cceab7502d20d6e?Expires=1728259200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=EQ99YZl85afRTgMJdgfHOdP6fZD0F5qjs0kA-X51P-rr5dmTi1jRF1vtoobwu1JKOKR5VMeV2HTbA3pTo9GooTtuP0BbK1ytNde0UMQWzQa6nwToyHJ-X3LPKCmodj4391A0-t70OivGlSsKu6z~LuzLlXcwWIt~XcbxG5IyGiFjXWYpiMfG5j1tL9ObE1oT9dza9epR484hU1Ipm~f9F43neg7QkGUFHzj~0SYhVigY6Pet4DP-qOaSAKJVJnDaa11j2ZtsgBnMsYTXAUSxl-a3MZQuYIcFP8QtfuQYpb2HUvag9gimV7PhxT-KM65mXnkV75PscfY-URT1wTHPCQ__",
    },
  ],
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
            Bàn số {tableNumber}
          </div>
        </div>
      </div>
      <div className="pt-4">
        {items.slice(0, 2).map((item, index) => (
          <div key={item.id} className="flex items-center mb-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 rounded-full mr-4"
            />
            <div className="flex-grow">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.description}</p>
              <div className="flex justify-between mt-1">
                <span>${item.price.toFixed(2)}</span>
                <span>Số lượng: {item.quantity}</span>
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

      <div className="flex justify-between p-2">
        <Button className="bg-pink-50  border-none">
          <Eye size={24} className="h-6 w-6 text-red-800" />
        </Button>
        <div className="flex gap-1">
          <Button className="bg-[#E3B054] text-white  px-2 py-4">
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
const fakeData = [
  { status: "waiting", index: 1 },
  { status: "preparing", index: 2 },
  { status: "done", index: 3 },
  { status: "cancelled", index: 4 },
  { status: "waiting", index: 5 },
  { status: "preparing", index: 6 },
  { status: "preparing", index: 6 },
  { status: "preparing", index: 6 },
  { status: "preparing", index: 6 },
  { status: "preparing", index: 6 },
  { status: "preparing", index: 6 },
  { status: "preparing", index: 6 },
  { status: "preparing", index: 6 },
  { status: "preparing", index: 6 },
  { status: "preparing", index: 6 },
  { status: "preparing", index: 6 },
  { status: "preparing", index: 6 },
  { status: "preparing", index: 6 },
  { status: "preparing", index: 6 },
];

const OrderManagement = () => {
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
            {fakeData.map((order, idx) => (
              <div className="mx-1 my-1">
                <OrderTag key={idx} status={order.status} index={order.index} />
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[calc(100vh-300px)]">
          <OrderCard
            orderNumber={orderData.orderNumber}
            date={orderData.date}
            tableNumber={orderData.tableNumber}
            items={orderData.items}
          />
          <OrderCard
            orderNumber={orderData.orderNumber}
            date={orderData.date}
            tableNumber={orderData.tableNumber}
            items={orderData.items}
          />
          {/* Add more OrderCard components as needed */}
        </div>
      </div>
    </div>
  );
};
export default OrderManagement;
