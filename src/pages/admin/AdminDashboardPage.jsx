import { useEffect, useState, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { BanknotesIcon } from "@heroicons/react/24/solid";
import { ExternalLink, EyeIcon, MapPin, UserIcon, Users } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import useCallApi from "../../api/useCallApi";
import { InvoiceApi, OrderApi, StatisticApi } from "../../api/endpoint";
import dayjs from "dayjs";
import { formatDate, formatDateTime, formatPrice } from "../../util/Utility";
import OrderTag from "../../components/tag/OrderTag";
import ModalOrderDetailAdmin from "../../components/order/modal/ModalOrderDetailAdmin";
import LoadingOverlay from "../../components/loading/LoadingOverlay";
import { StyledTable } from "../../components/custom-ui/StyledTable";
import { Button, DatePicker, Select } from "antd";
import { configCalendar } from "./AdminMealHistoryPage";
import { OrderStatus } from "../../util/GlobalType";
import TabMananger from "../../components/tab/TabManager";
const { RangePicker } = DatePicker;

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AdminDashboardPage = ({}) => {
  const [reservations, setReservations] = useState([]);
  const { error, loading, callMultipleApis, callApi, loadingPromise } =
    useCallApi();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const [ordersData, setOrdersData] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [statisticChart, setStatisticChart] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [dateChoose, setDateChoose] = useState([
    dayjs().subtract(1, "month"),
    dayjs(),
  ]);
  const [selectedOrderType, setSelectedOrderType] = useState(0);
  const fetchDetail = async (id) => {
    const response = await callApi(`${OrderApi.GET_DETAIL}/${id}`, "GET");
    if (response?.isSuccess) {
      setOrderDetail(response?.result);
      setIsModalOpen(true);
    }
  };
  const tabs = OrderStatus.filter(
    (item) => item.value !== 1 && item.value != 2
  );
  tabs.unshift({ label: "Tất cả", value: 0 });
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
        <Typography>{formatPrice(record.totalAmount)} </Typography>
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
      dataIndex: "action",
      render: (_, record) => (
        <IconButton
          variant="text"
          onClick={async () => await fetchDetail(record.orderId)}
        >
          <EyeIcon className="h-4 w-4 text-black" />
        </IconButton>
      ),
    },
  ];

  const fetchAllData = async () => {
    try {
      const responses = await callMultipleApis([
        {
          endpoint: OrderApi.GET_ORDER_WITH_FILTER,
          method: "POST",
          data: {
            startDate: dateChoose[0].format("YYYY-MM-DD"),
            endDate: dateChoose[1].format("YYYY-MM-DD"),
            type: 1 || 3,
          },
        },
        {
          endpoint: OrderApi.GET_ORDER_WITH_FILTER,
          method: "POST",
          data: {
            startDate: dateChoose[0].format("YYYY-MM-DD"),
            endDate: dateChoose[1].format("YYYY-MM-DD"),
            status: activeTab === 0 ? undefined : activeTab,
            type: 2,
          },
        },
        {
          endpoint: `${
            StatisticApi.GET_STATISTIC_FOR_NUMBER_REPORT
          }?startDate=${dateChoose[0].format(
            "YYYY-MM-DD"
          )}&endDate=${dateChoose[1].format("YYYY-MM-DD")}`,
          method: "GET",
        },
        {
          endpoint: `${
            StatisticApi.GET_STATISTIC_FOR_DASHBOARD_REPORT
          }?startDate=${dateChoose[0].format(
            "YYYY-MM-DD"
          )}&endDate=${dateChoose[1].format("YYYY-MM-DD")}`,
          method: "GET",
        },
      ]);

      const [
        reservationsResponse,
        ordersResponse,
        statisticsResponse,
        statisticsChartResponse,
      ] = responses;

      if (reservationsResponse?.isSuccess)
        setReservations(reservationsResponse?.result?.items);
      if (ordersResponse?.isSuccess)
        setOrdersData(ordersResponse?.result?.items);
      if (statisticsResponse?.isSuccess)
        setStatistics(statisticsResponse?.result);
      if (statisticsChartResponse?.isSuccess)
        setStatisticChart(statisticsChartResponse?.result);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [dateChoose]);
  const fetchOrderShipping = async () => {
    const response = await callApi(
      `${OrderApi.GET_ORDER_WITH_FILTER}`,
      "POST",
      {
        startDate: dateChoose[0].format("YYYY-MM-DD"),
        endDate: dateChoose[1].format("YYYY-MM-DD"),
        status: activeTab === 0 ? undefined : activeTab,
        type: 2,
      }
    );
    if (response?.isSuccess) {
      setOrdersData(response?.result?.items);
    }
  };

  useEffect(() => {
    fetchOrderShipping();
  }, [activeTab]);
  const monthlyRevenueData = statisticChart?.monthlyRevenue
    ? Object.keys(statisticChart.monthlyRevenue).map((month) => ({
        name: month,
        revenue: statisticChart.monthlyRevenue[month],
      }))
    : [];
  const orderStatusData = [
    {
      status: "Thành công",
      count: statisticChart?.orderStatusReportResponse?.successfullyOrderNumber,
    },
    {
      status: "Hủy",
      count: statisticChart?.orderStatusReportResponse?.cancellingOrderNumber,
    },
    {
      status: "Chờ thanh toán",
      count: statisticChart?.orderStatusReportResponse?.pendingOrderNumber,
    },
  ];
  const handleExportReport = async () => {
    const response = await callApi(
      `${InvoiceApi.GENERATE_GENERAL_INVOICE}`,
      "POST",
      {
        startTime: dateChoose[0].format("YYYY-MM-DD"),
        endTime: dateChoose[1].format("YYYY-MM-DD"),
        orderType: selectedOrderType,
        pageNumber: 1,
        pageSize: 100,
      }
    );
    if (response?.isSuccess) {
      window.open(response?.result);
    }
  };
  const chartRef = useRef(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        const height = width * 0.7; // Adjust the height as needed
        setChartDimensions({ width, height });
      }
    });

    if (chartRef.current) {
      resizeObserver.observe(chartRef.current);
    }

    return () => {
      if (chartRef.current) {
        resizeObserver.unobserve(chartRef.current);
      }
    };
  }, []);

  const [chartDimensions, setChartDimensions] = useState({
    width: 0,
    height: 0,
  });

  return (
    <div className="grid   grid-cols-1 xl:grid-cols-12">
      <LoadingOverlay isLoading={loadingPromise || loading} />
      <div className="p-6  bg-white col-span-1 xl:col-span-9  h-[900px] overflow-auto   ">
        <Typography className="mr-2 text-red-800 font-semibold text-2xl">
          TRANG THỐNG KÊ TỔNG QUAN HỆ THỐNG
        </Typography>
        <div className="flex xl:flex-row flex-col items-center  justify-between my-10">
          <div className="flex bg-white px-2 py-4 rounded-xl items-center">
            <Typography className="mr-2 text-red-800 font-semibold">
              Chọn khoảng ngày
            </Typography>
            <RangePicker
              locale={configCalendar}
              format="DD/MM/YYYY"
              onChange={(value) => {
                setDateChoose(value);
              }}
              value={dateChoose}
              size="large"
            />
            <Select
              onChange={(value) => setSelectedOrderType(value)}
              value={selectedOrderType}
              className="mx-4"
            >
              <Select.Option value={0}>Đặt bàn trước</Select.Option>
              <Select.Option value={1}>Ăn tại quán</Select.Option>
              <Select.Option value={2}>Đơn online</Select.Option>
            </Select>
            <Button
              className="bg-red-800 text-white px-4 py-2 mx-4"
              onClick={handleExportReport}
            >
              Xuất báo cáo
            </Button>
          </div>
        </div>
        <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
          <Card key={"Lợi nhuận"}>
            <CardHeader
              variant="gradient"
              className="bg-red-900 absolute -mt-4 grid h-16 w-16 place-items-center"
            >
              <BanknotesIcon className="w-6 h-6 text-white" />
            </CardHeader>
            <CardBody className="p-4 text-right">
              <Typography
                variant="small"
                className="font-normal text-red-gray-600"
              >
                Lợi nhuận
              </Typography>
              <Typography variant="h4" color="red-gray">
                {formatPrice(statistics?.profitReportResponse?.profit)}
              </Typography>
            </CardBody>
          </Card>
          <Card key={"Tổng số khách hàng"}>
            <CardHeader
              variant="gradient"
              className="bg-red-900 absolute -mt-4 grid h-16 w-16 place-items-center"
            >
              <UserIcon className="w-6 h-6 text-white" />
            </CardHeader>
            <CardBody className="p-4 text-right">
              <Typography
                variant="small"
                className="font-normal text-red-gray-600"
              >
                Tổng số khách hàng
              </Typography>
              <Typography variant="h4" color="red-gray">
                {statistics?.customerStasticResponse?.numberOfCustomer}
              </Typography>
            </CardBody>
          </Card>
          <Card key={`Đơn hàng`}>
            <CardHeader
              variant="gradient"
              className="bg-red-900 absolute -mt-4 grid h-16 w-16 place-items-center"
            >
              <UserIcon className="w-6 h-6 text-white" />
            </CardHeader>
            <CardBody className="p-4 text-right">
              <Typography
                variant="small"
                className="font-normal text-red-gray-600"
              >
                Tổng số đơn hàng
              </Typography>
              <Typography variant="h4" color="red-gray">
                {statistics?.totalDeliveringOrderNumber}
              </Typography>
            </CardBody>

            <CardBody className="border-t border-red-gray-50 p-4">
              <Typography className="font-normal text-red-gray-600"></Typography>
            </CardBody>
          </Card>
          <Card key={"Lịch đặt bàn"}>
            <CardHeader
              variant="gradient"
              className="bg-red-900 absolute -mt-4 grid h-16 w-16 place-items-center"
            >
              <UserIcon className="w-6 h-6 text-white" />
            </CardHeader>
            <CardBody className="p-4 text-right">
              <Typography
                variant="small"
                className="font-normal text-red-gray-600"
              >
                Tổng lượt đặt bàn
              </Typography>
              <Typography variant="h4" color="red-gray">
                {statistics?.totalReservationNumber}
              </Typography>
            </CardBody>

            <CardBody className="border-t border-red-gray-50 p-4">
              <Typography className="font-normal text-red-gray-600"></Typography>
            </CardBody>
          </Card>
          <Card key={"Nhân viên nhà bếp"}>
            <CardHeader
              variant="gradient"
              className="bg-red-900 absolute -mt-4 grid h-16 w-16 place-items-center"
            >
              <UserIcon className="w-6 h-6 text-white" />
            </CardHeader>
            <CardBody className="p-4 text-right">
              <Typography
                variant="small"
                className="font-normal text-red-gray-600"
              >
                Nhân viên nhà bếp
              </Typography>
              <Typography variant="h4" color="red-gray">
                {statistics?.totalChefNumber}
              </Typography>
            </CardBody>

            <CardBody className="border-t border-red-gray-50 p-4">
              <Typography className="font-normal text-red-gray-600"></Typography>
            </CardBody>
          </Card>
          <Card key={"Tổng số shipper"}>
            <CardHeader
              variant="gradient"
              className="bg-red-900 absolute -mt-4 grid h-16 w-16 place-items-center"
            >
              <UserIcon className="w-6 h-6 text-white" />
            </CardHeader>
            <CardBody className="p-4 text-right">
              <Typography
                variant="small"
                className="font-normal text-red-gray-600"
              >
                Tổng số shipper
              </Typography>
              <Typography variant="h4" color="red-gray">
                {statistics?.shipperStatisticResponse?.numberOfShipper}
              </Typography>
            </CardBody>

            <CardBody className="border-t border-red-gray-50 p-4">
              <Typography className="font-normal text-red-gray-600">
                {`${statistics?.shipperStatisticResponse?.numberOfShipperIsWorking} shipper đang đi giao`}
              </Typography>
            </CardBody>
          </Card>
        </div>

        {/* Biểu đồ doanh thu theo ngày */}

        <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2">
          <Card>
            <CardHeader variant="gradient" className="mb-8 p-6 bg-red-900">
              <Typography variant="h6" color="white">
                Doanh thu theo tháng
              </Typography>
            </CardHeader>
            <CardBody>
              <div ref={chartRef} className="w-full">
                <LineChart
                  height={chartDimensions.height}
                  width={chartDimensions.width}
                  data={monthlyRevenueData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                </LineChart>
              </div>
            </CardBody>
          </Card>
          {/* Biểu đồ trạng thái đơn hàng */}
          <Card>
            <CardHeader
              variant="gradient"
              className="mb-8 p-6 text-center bg-red-900"
            >
              <Typography variant="h6" color="white">
                Trạng thái đơn hàng
              </Typography>
            </CardHeader>
            <CardBody>
              <div ref={chartRef} className="w-full">
                <BarChart
                  width={chartDimensions.width}
                  height={chartDimensions.height}
                  data={orderStatusData}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8">
                    {orderStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </div>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader
            variant="gradient"
            className="mb-8 p-6 text-center bg-red-900"
          >
            <Typography variant="h6" color="white">
              Đơn hàng gần đây
            </Typography>
          </CardHeader>
          <CardBody className="pb-2">
            <TabMananger
              activeTab={activeTab}
              items={tabs}
              setActiveTab={setActiveTab}
            />
            <StyledTable
              columns={columns}
              dataSource={ordersData}
              pagination={false}
              rowKey="orderId"
              loading={loading}
              scroll={{ x: 768, y: 700 }}
            />
          </CardBody>
        </Card>
      </div>
      <div className="col-span-1 xl:col-span-3 p-4 h-[900px] overflow-auto  bg-gray-50">
        <Typography className="text-lg uppercase text-red-800 font-semibold my-2">
          Lịch đặt bàn
        </Typography>
        {reservations?.map((item, index) => (
          <div
            key={index}
            className="my-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4"
          >
            {/* Header Section */}
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-800">
                  {formatDate(item?.mealTime)}
                </span>
              </div>
              <button
                onClick={async () => await fetchDetail(item.orderId)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <ExternalLink className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Content Section */}
            <div className="flex items-center space-x-4 relative ">
              {/* Time Indicator */}
              <span className="bg-white z-10 px-3 py-1 rounded-full text-lg font-semibold text-gray-700 border border-gray-200">
                {dayjs(item?.mealTime).format("HH:mm")}
              </span>
              <div className="">
                <div
                  className={`w-1 h-full absolute top-0 rounded-full ${
                    item.statusId === 4
                      ? "bg-blue-500"
                      : item.statusId === 10
                      ? "bg-red-700"
                      : "bg-green-800"
                  }`}
                />
              </div>

              {/* Booking Details */}
              <div className="flex-1 ">
                <div className="space-y-3">
                  {/* Customer Name */}
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-800">{`${item.account?.firstName} ${item.account.lastName}`}</span>
                  </div>

                  {/* Table Information */}
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {item.tables?.map((item) => (
                      <span className="text-sm font-bold mx-2 block">
                        {item.table.tableName}
                      </span>
                    ))}
                  </div>

                  {/* Guest Count */}
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{item.numOfPeople} người</span>
                  </div>
                </div>

                {/* Status Tag */}
                <div className="mt-4">
                  <OrderTag orderStatusId={item.statusId} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ModalOrderDetailAdmin
        onClose={() => setIsModalOpen(false)}
        reservation={orderDetail}
        visible={isModalOpen}
        key={`MODAL`}
      />
    </div>
  );
};

export default AdminDashboardPage;
