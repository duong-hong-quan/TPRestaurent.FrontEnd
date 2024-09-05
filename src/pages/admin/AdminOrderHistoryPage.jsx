import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { EyeIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  IconButton,
  Tooltip,
  Chip,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { message, Table } from "antd";
import { getAllOrder, getOrderDetailById } from "../../api/orderApi";
import { formatDateTime } from "../../util/Utility";
import OrderDetailModal from "./order-detail/OrderDetailModal";
import LoadingOverlay from "../../components/loading/LoadingOverlay";

const TABS = [
  {
    label: "Tất cả",
    value: "",
  },
  {
    label: "Chờ xử lý",
    value: "1",
  },
  {
    label: "Đang xử lý",
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

export function AdminOrderHistoryPage() {
  const [activeTab, setActiveTab] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
      render: (text) => <Typography>{text.substring(0, 8)}</Typography>,
    },
    {
      title: "Khách hàng",
      dataIndex: "customerInfo",
      key: "customerInfo",
      render: (customerInfo) => (
        <Typography>
          {customerInfo
            ? `${customerInfo.name} - 0${customerInfo.phoneNumber}`
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
      render: (status) => (
        <Chip
          variant="ghost"
          size="sm"
          className="text-center"
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
      dataIndex: "orderId",
      render: (text) => (
        <Tooltip content="Xem chi tiết">
          <IconButton
            variant="text"
            onClick={async () => {
              await fetchOrderDetail(text);
            }}
          >
            <EyeIcon className="h-4 w-4" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const fetchOrder = async () => {
    setIsLoading(true);
    try {
      const response = await getAllOrder(1, 10, activeTab);
      if (response?.isSuccess) {
        setData(response?.result?.items);
      }
    } catch (error) {
      message.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [activeTab]);

  const filteredData = data.filter((item) => {
    const customerInfo = item.customerInfo || {};
    const searchString = `${customerInfo.name || ""} ${
      customerInfo.phoneNumber || ""
    }`.toLowerCase();
    return searchString.includes(searchQuery.toLowerCase());
  });
  const [orderSelected, setOrderSelected] = useState({});
  const fetchOrderDetail = async (orderId) => {
    try {
      setIsLoading(true);
      const response = await getOrderDetailById(orderId);
      if (response?.isSuccess) {
        setOrderSelected(response?.result);
        handleOpen();
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi tìm kiếm");
    } finally {
      setIsLoading(false);
    }
  };

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
              <Button
                className="flex items-center bg-red-700 gap-3"
                size="sm"
                onClick={fetchOrder}
              >
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-auto h-[550px]">
          <Table columns={columns} dataSource={filteredData} rowKey="orderId" />
        </CardBody>
      </Card>
      <OrderDetailModal
        order={orderSelected}
        handleOpen={handleOpen}
        open={open}
      />
      <LoadingOverlay isLoading={isLoading} />
    </>
  );
}
