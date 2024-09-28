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
import { formatDateTime } from "../../util/Utility";
import OrderDetailModal from "./order-detail/OrderDetailModal";
import useCallApi from "../../api/useCallApi";
import Pagination from "../../components/pagination/Pagination";
import TabMananger from "../../components/tab/TabManager";
import { OrderApi } from "../../api/endpoint";

const TABS = [
  {
    label: "Đang chờ thanh toán",
    value: "4",
  },
  {
    label: "Đang xử lý",
    value: "5",
  },
  {
    label: "Đang giao hàng",
    value: "6",
  },
  {
    label: "Hoàn thành",
    value: "7",
  },
  {
    label: "Huỷ đơn",
    value: "8",
  },
];

export function AdminOrderHistoryPage() {
  const [activeTab, setActiveTab] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const [selectedOrderType, setSelectedOrderType] = useState(1);
  const { callApi, error, loading } = useCallApi();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const totalItems = 10;
  const handleCurrentPageChange = (page) => {
    setCurrentPage(page);
  };
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
      render: (_, record) => (
        <Typography>
          {`${record.account?.firstName} ${record.account?.lastName}`}
        </Typography>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (_, record) => (
        <Typography>{record.totalAmount.toLocaleString()} VND</Typography>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <Chip
          variant="ghost"
          size="sm"
          className="text-center"
          value={`${record.status.vietnameseName} - ${record.orderType.name}`}
        />
      ),
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (_, record) => (
        <Typography>{formatDateTime(record.orderDate)}</Typography>
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
    const response = await callApi(
      `order/get-all-order-by-status/${currentPage}/${totalItems}?status=${activeTab}&orderType=${2}`,
      "GET"
    );
    if (response?.isSuccess) {
      setData(response?.result?.items);
      setTotalPages(response?.result?.totalPages);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [activeTab, selectedOrderType, currentPage]);

  const [orderSelected, setOrderSelected] = useState({});
  const fetchOrderDetail = async (orderId) => {
    try {
      setIsLoading(true);
      const response = await callApi(
        `${OrderApi.GET_DETAIL}/${orderId}`,
        "GET"
      );
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
              <TabMananger
                items={TABS}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
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
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            rowKey="orderId"
            loading={loading}
          />
        </CardBody>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handleCurrentPageChange}
        />
      </Card>
      <OrderDetailModal
        order={orderSelected}
        handleOpen={handleOpen}
        open={open}
      />
    </>
  );
}
