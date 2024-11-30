import { EyeIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { act, useEffect, useState } from "react";
import { message, Checkbox, Select, DatePicker, Tag, Modal, Input } from "antd";
import { formatDateTime, formatPrice, showError } from "../../../util/Utility";
import useCallApi from "../../../api/useCallApi";
import Pagination from "../../../components/pagination/Pagination";
import { AccountApi, OrderApi } from "../../../api/endpoint";
import OrderTag from "../../../components/tag/OrderTag";
import { StyledTable } from "../../../components/custom-ui/StyledTable";
import { OrderStatus, OrderType } from "../../../util/GlobalType";
import dayjs from "dayjs";
import { configCalendar } from "../AdminMealHistoryPage";
import ModalOrderDetailAdmin from "../../../components/order/modal/ModalOrderDetailAdmin";
import { XCircle } from "lucide-react";
import { uniqueId } from "lodash";
import ModalWarningRefund from "../../../components/modal/ModalWarningRefund";
import { warning } from "framer-motion";

const { RangePicker } = DatePicker;
const AdminOrderOverview = () => {
  const TABS = OrderStatus.filter((item) => item.value > 3 && item.value < 10);

  TABS.unshift({ value: 0, label: "Tất cả" });
  TABS.push({
    value: 11,
    label: "Cảnh báo thanh toán hai lần",
  });
  const [activeTab, setActiveTab] = useState(0);
  const [selectedType, setSelectedType] = useState(0);
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
  const [selectedRange, setSelectedRange] = useState([dayjs(), dayjs()]);
  const [showWarningRefund, setShowWarningRefund] = useState(false);
  const [selectedWarningRefund, setSelectedWarningRefund] = useState(null);
  const handleRangeChange = (dates) => {
    setSelectedRange(dates);
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
      showError(response.messages);
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
      showError(response.messages);
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
      title: "Loại đơn",
      dataIndex: "orderTypeId",
      key: "orderTypeId",
      render: (_, record) => (
        <Typography className=" cursor-pointer">
          {record.orderType?.vietnameseName}
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
        <Typography>
          {record.orderTypeId !== 2 ? formatDateTime(record.mealTime) : "N/A"}
        </Typography>
      ),
    },
    {
      title: "Mã bàn",
      dataIndex: "tableName",
      key: "tableName",
      render: (_, record) => (
        <div className="space-y-1">
          {record.tables?.map((table) => (
            <Tag color="magenta" key={table.table?.tableName}>
              {table.table?.tableName}
            </Tag>
          ))}
          {record.orderTypeId === 2 && "N/A"}
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
      width: 250,
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
              onClick={() => {
                if (activeTab != 11) {
                  fetchOrderDetail(record.orderId);
                } else {
                  setSelectedWarningRefund(record);
                  setShowWarningRefund(true);
                }
              }}
            >
              <EyeIcon className="h-4 w-4 text-blue-600" />
            </IconButton>
          </Tooltip>
          {record.statusId != 10 && record.statusId != 9 && (
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
                        showError(response.messages);
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
          )}
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
  const fetchOrderRequireRefund = async () => {
    debugger;
    const response = await callApi(
      `${OrderApi.GET_ALL_ORDER_REQUIRE_REFUND}`,
      "GET"
    );
    if (response?.isSuccess) {
      setData(response?.result);
      // setTotalPages(response?.result?.totalPages);
    }
  };
  const fetchOrder = async () => {
    const response = await callApi(
      `${OrderApi.GET_ORDER_WITH_FILTER}`,
      "POST",
      {
        startDate: selectedRange[0].format("YYYY-MM-DD"),
        endDate: selectedRange[1].format("YYYY-MM-DD"),
        status: activeTab || undefined,
        type: selectedType || undefined,
        phoneNumber: searchQuery || undefined,
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
    if (activeTab === 11) {
      fetchOrderRequireRefund();
    }
  }, [
    activeTab,
    currentPage,
    selectedShipper,
    selectedRange,
    selectedType,
    searchQuery,
  ]);

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
          <div className="col-span-1 xl:col-span-2">
            <div className="xl:flex-row flex flex-col items-center justify-end">
              <div className="flex flex-col my-2">
                <span className="inline-block font-bold text-red-800 py-2">
                  Tìm kiếm
                </span>
                <Input
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm theo số điện thoại"
                  className="min-w-60  px-2"
                  prefix={"+84"}
                />
              </div>
              <div className="flex flex-col my-2 md:mx-4">
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
              <div className="flex flex-col xl:mx-2 my-2">
                <span className="inline-block font-bold text-red-800 py-2">
                  Chọn trạng thái
                </span>
                <Select
                  value={activeTab}
                  onChange={(value) => {
                    setActiveTab(value);
                  }}
                  className="min-w-60"
                >
                  {TABS.map((tab) => (
                    <Select.Option key={tab.value} value={Number(tab.value)}>
                      {tab.label}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <div className="flex flex-col my-2">
                <span className="inline-block font-bold text-red-800 py-2">
                  Chọn loại đơn
                </span>
                <Select
                  value={selectedType}
                  onChange={(value) => {
                    setSelectedType(value);
                  }}
                  className="min-w-60"
                >
                  {OrderType.map((tab) => (
                    <Select.Option key={uniqueId()} value={Number(tab.value)}>
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
                } shadow-lg`}
              >
                <StyledTable
                  columns={
                    activeTab === 11
                      ? columns.filter((column) => column.key !== "tableName")
                      : columns
                  }
                  dataSource={data}
                  pagination={false}
                  rowKey="orderId"
                  loading={loading}
                  scroll={{ y: 700 }}
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
      <ModalWarningRefund
        show={showWarningRefund}
        payments={selectedWarningRefund?.paymentHistories}
        handleClose={() => showWarningRefund(false)}
      />
    </>
  );
};
export default AdminOrderOverview;
