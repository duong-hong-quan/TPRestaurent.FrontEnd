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
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import {
  message,
  Table,
  Checkbox,
  Select,
  DatePicker,
  Calendar,
  Tag,
  Modal,
} from "antd";
import { formatDateTime, formatPrice, showError } from "../../../util/Utility";
import useCallApi from "../../../api/useCallApi";
import Pagination from "../../../components/pagination/Pagination";
import TabMananger from "../../../components/tab/TabManager";
import { AccountApi, OrderApi } from "../../../api/endpoint";
import OrderTag from "../../../components/tag/OrderTag";
import ModalReservationDetail from "../../../components/order/modal/ModalReservationDetail";
import { StyledTable } from "../../../components/custom-ui/StyledTable";
import { OrderStatus } from "../../../util/GlobalType";
import dayjs from "dayjs";
import { configCalendar } from "../AdminMealHistoryPage";
import ModalOrderDetailAdmin from "../../../components/order/modal/ModalOrderDetailAdmin";
import { X, XCircle } from "lucide-react";

const TABS = OrderStatus.filter((item) => item.value > 3 && item.value < 10);
TABS.unshift({ value: 0, label: "Tất cả" });

const { RangePicker } = DatePicker;
const AdminOrderOverview = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const { callApi, loading, error } = useCallApi();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const totalItems = 10;
  const [orderSelected, setOrderSelected] = useState({});
  const [shipperAvailable, setShipperAvailable] = useState([]);
  const [selectedShipper, setSelectedShipper] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedRange, setSelectedRange] = useState([dayjs(), dayjs()]);
  const [showCalendar, setShowCalendar] = useState(true);
  const handleRangeChange = (dates) => {
    setSelectedRange(dates);
  };
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };
  const handleCurrentPageChange = (page) => {
    setCurrentPage(page);
  };

  const fetchShipperAvailable = async () => {
    const response = await callApi(
      `${AccountApi.LOAD_AVAILABLE_SHIPPER}`,
      "GET"
    );
    if (response?.isSuccess) {
      setShipperAvailable(response?.result?.items);
    } else {
      showError(error);
    }
  };

  const handleSubmitShipper = async () => {
    if (!selectedShipper) {
      message.error("Vui lòng chọn shipper");
      return;
    }
    if (selectedOrders.length === 0) {
      message.error("Vui lòng chọn ít nhất một đơn hàng");
      return;
    }
    const response = await callApi(
      `${OrderApi.ASSIGN_ORDER_TO_SHIPPER}?shipperId=${selectedShipper}`,
      "POST",
      selectedOrders
    );
    if (response?.isSuccess) {
      message.success("Đã cập nhật shipper thành công");
      await fetchOrder();
      setSelectedOrders([]);
    } else {
      showError(error);
    }
  };

  const handleOrderSelection = (orderId, checked) => {
    setSelectedOrders((prev) =>
      checked ? [...prev, orderId] : prev.filter((id) => id !== orderId)
    );
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
      render: (text) => (
        <Typography className="text-blue-600 hover:underline cursor-pointer">
          {text.substring(0, 8)}
        </Typography>
      ),
    },
    {
      title: "Khách hàng",
      dataIndex: "customerInfo",
      key: "customerInfo",
      render: (_, record) => (
        <Typography>
          {record.account
            ? ` ${record.account?.firstName} ${record.account?.lastName}`
            : "Khách hàng vãng lai"}
        </Typography>
      ),
    },

    {
      title: "Ngày đặt bàn/ đặt hàng",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (_, record) => (
        <Typography>
          {record.orderTypeId === 1
            ? formatDateTime(record.reservationDate)
            : record.orderTypeId === 2
            ? formatDateTime(record.orderDate)
            : "N/A"}
        </Typography>
      ),
    },
    {
      title: "Ngày dùng bữa",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (_, record) => (
        <Typography>{formatDateTime(record.mealTime)}</Typography>
      ),
    },
    {
      title: "Mã bàn",
      dataIndex: "tableName",
      key: "tableName",
      render: (_, record) => (
        <div className="space-y-1">
          {record.tables.map((table) => (
            <Tag color="magenta" key={table.table?.tableName}>
              {table.table?.tableName}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "right",
      render: (_, record) => (
        <Typography className="text-green-600">
          {formatPrice(record.totalAmount)}
        </Typography>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, record) => <OrderTag orderStatusId={record.statusId} />,
    },
    {
      title: "Hành động",
      key: "action",
      dataIndex: "action",
      render: (_, record) => (
        <div className="flex justify-center items-center gap-1">
          <Tooltip content="Xem chi tiết">
            <IconButton
              variant="text"
              onClick={() => fetchOrderDetail(record.orderId)}
            >
              <EyeIcon className="h-4 w-4 text-blue-600" />
            </IconButton>
          </Tooltip>
          <Tooltip content="Hủy">
            <IconButton
              variant="text"
              onClick={() => {
                Modal.confirm({
                  title: "Xác nhận hủy đơn hàng",
                  content: "Bạn có chắc chắn muốn hủy đơn hàng này?",
                  onOk: async () => {
                    const response = await callApi(
                      `${OrderApi.UPDATE_ORDER_STATUS}/${record.orderId}?isSuccessful=true&status=10&asCustomer=false`,
                      "PUT"
                    );
                    if (response?.isSuccess) {
                      message.success("Hủy đơn hàng thành công");
                      await fetchOrder();
                    } else {
                      showError(error);
                    }
                  },
                  onCancel: async () => {
                    await fetchOrder();
                  },
                });
              }}
            >
              <XCircle className="h-4 w-4 text-red-600" />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];
  if (activeTab === 6) {
    columns.unshift({
      title: "Chọn",
      key: "select",
      render: (_, record) => (
        <Checkbox
          checked={selectedOrders.includes(record.orderId)}
          onChange={(e) =>
            handleOrderSelection(record.orderId, e.target.checked)
          }
        />
      ),
    });
  }
  if ([7, 8, 9].includes(activeTab)) {
    columns.splice(columns.length - 1, 0, {
      title: "Shipper",
      dataIndex: "shipper",
      key: "shipper",
      render: (_, record) => (
        <Typography>
          {record.shipper?.firstName} {record.shipper?.lastName}
        </Typography>
      ),
    });
  }
  const fetchOrder = async () => {
    const response = await callApi(
      `${OrderApi.GET_ORDER_WITH_FILTER}`,
      "POST",
      {
        startDate: !showCalendar
          ? selectedRange[0].format("YYYY-MM-DD")
          : selectedDate.format("YYYY-MM-DD"),
        endDate: !showCalendar
          ? selectedRange[1].format("YYYY-MM-DD")
          : selectedDate.format("YYYY-MM-DD"),
        status: activeTab || undefined,
      }
    );
    if (response?.isSuccess) {
      setData(response?.result?.items);
      setTotalPages(response?.result?.totalPages);
    }
  };

  useEffect(() => {
    fetchOrder();
    if (activeTab === 6) {
      fetchShipperAvailable();
    }
  }, [activeTab, currentPage, selectedShipper, selectedDate, selectedRange]);

  const fetchOrderDetail = async (orderId) => {
    const response = await callApi(`${OrderApi.GET_DETAIL}/${orderId}`, "GET");
    if (response?.isSuccess) {
      setOrderSelected(response?.result);
      handleOpen();
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
              <Button
                className="flex items-center bg-red-700 text-white hover:bg-red-800 gap-3"
                size="sm"
                onClick={fetchOrder}
              >
                <ArrowPathIcon strokeWidth={2} className="h-4 w-4" /> Làm mới
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="col-span-1 xl:col-span-2 max-h-[650px] overflow-y-auto">
            <div className="flex items-center ">
              <div className="flex flex-col my-2">
                <span className="inline-block font-bold text-red-800 py-2">
                  Chọn ngày
                </span>
                <RangePicker
                  locale={configCalendar}
                  onChange={handleRangeChange}
                  format={"DD-MM-YYYY"}
                  value={selectedRange}
                  label="Chọn khoảng thời gian"
                  showNow={true}
                />
              </div>
              <div className="flex flex-col my-2 ml-10">
                <span className="inline-block font-bold text-red-800 py-2">
                  Chọn trạng thái
                </span>
                <Select
                  onChange={(value) => setActiveTab(value)}
                  className="min-w-60"
                >
                  {TABS.map((tab) => (
                    <Select.Option key={tab.value} value={Number(tab.value)}>
                      {tab.label}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4">
              {activeTab === 6 && (
                <div className="col-span-3">
                  <div className="flex flex-col mb-4">
                    <Typography
                      variant="h6"
                      color="blue-gray"
                      className="uppercase text-red-800 text-xl my-4"
                    >
                      Chọn shipper để giao hàng
                    </Typography>
                    <Select
                      value={selectedShipper}
                      onChange={(value) => setSelectedShipper(value)}
                      className="mb-4"
                    >
                      {shipperAvailable.map((shipper) => (
                        <Option key={shipper.id} value={shipper.id}>
                          {shipper.firstName} {shipper.lastName}
                        </Option>
                      ))}
                    </Select>
                    <Button
                      className="bg-red-700 text-white hover:bg-red-800"
                      onClick={handleSubmitShipper}
                    >
                      Xác nhận shipper
                    </Button>
                  </div>
                </div>
              )}
              <div
                className={`${
                  activeTab == 6 ? `col-span-9` : `col-span-12`
                } shadow-lg h-[550px] overflow-y-scroll`}
              >
                <StyledTable
                  columns={columns}
                  dataSource={data}
                  pagination={false}
                  rowKey="orderId"
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </CardBody>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handleCurrentPageChange}
        />
      </Card>
      <ModalOrderDetailAdmin
        visible={open}
        onClose={() => setOpen(!open)}
        reservation={orderSelected}
        fetchData={fetchOrder}
      />
    </>
  );
};
export default AdminOrderOverview;
