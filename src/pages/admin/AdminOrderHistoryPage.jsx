import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { EyeIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { Table } from "antd";
import { getAllOrder } from "../../api/orderApi";
import { formatDateTime } from "../../util/Utility";

const TABS = [
  {
    label: "Tất cả",
    value: "",
  },
  {
    label: "Chờ xác nhận",
    value: "0",
  },
  {
    label: "Đang xử lý",
    value: "1",
  },
  {
    label: "Đã hoàn thành",
    value: "2",
  },
  {
    label: "Đã giao hàng",
    value: "4",
  },
  {
    label: "Đã hủy",
    value: "3",
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "0":
      return "green";
    case "1":
      return "blue";
    case "2":
      return "red";
    default:
      return "blue-gray";
  }
};

const getStatusText = (status) => {
  switch (status) {
    case "0":
      return "Chờ xác nhận";
    case "1":
      return "Đang xử lý";
    case "2":
      return "Đã hoàn thành";
    case "3":
      return "Đã hủy";
    case "4":
      return "Đã giao hàng";

    default:
      return "Không xác định";
  }
};

export function AdminOrderHistoryPage() {
  const [activeTab, setActiveTab] = useState("");

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
      render: (text) => <Typography>{text}</Typography>,
    },
    {
      title: "Khách hàng",
      dataIndex: "customerInfo",
      key: "customerInfo",
      render: (customerInfo) => (
        <Typography>
          {customerInfo
            ? `${customerInfo.name} - ${customerInfo.phoneNumber}`
            : "N/A"}
        </Typography>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (totalAmount) => (
        <Typography>{totalAmount.toLocaleString()} VND</Typography>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "CHỜ XỬ LÝ", value: "Pending" },
        { text: "ĐANG XỬ LÝ", value: "Processing" },
        { text: "ĐÃ GIAO HÀNG", value: "Delivered" },
      ],
      onFilter: (value, record) => record.status.name === value,
      render: (status) => (
        <Chip
          variant="ghost"
          size="sm"
          value={status.vietnameseName}
          color={
            status.name === "Pending"
              ? "amber"
              : status.name === "Processing"
              ? "blue"
              : "green"
          }
        />
      ),
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (orderDate) => (
        <Typography>{formatDateTime(orderDate)}</Typography>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Tooltip content="Xem chi tiết">
          <IconButton variant="text">
            <EyeIcon className="h-4 w-4" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];
  const [data, setData] = useState([]);
  const fetchOrder = async () => {
    const response = await getAllOrder(1, 10, activeTab);
    if (response?.isSuccess) {
      setData(response?.result?.items);
    }
  };
  useEffect(() => {
    fetchOrder();
  }, [activeTab]);
  return (
    <>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Lịch sử đơn hàng
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Xem và quản lý tất cả các đơn hàng
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button variant="outlined" size="sm">
                Xuất báo cáo
              </Button>
              <Button className="flex items-center bg-red-700 gap-3" size="sm">
                <ArrowPathIcon strokeWidth={2} className="h-4 w-4" /> Làm mới
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="mb-4">
              <div className="flex border-b border-gray-200">
                {TABS.map((tab) => (
                  <button
                    key={tab.value}
                    className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                      activeTab === tab.value
                        ? "border-b-2 border-red-700 text-red-700"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab(tab.value)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-full md:w-72">
              <Input
                label="Tìm kiếm"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-auto h-[550px]">
          <Table columns={columns} dataSource={data} rowKey="id" />
        </CardBody>
      </Card>
    </>
  );
}
