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
  Tabs,
  TabsHeader,
  Tab,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { getAllReservations, suggestTable } from "../../api/reservationApi";
import LoadingOverlay from "../../components/loading/LoadingOverlay";
import { set } from "react-hook-form";
import { formatDateTime, formatPrice } from "../../util/Utility";
import TableSuggestionModal from "./reservation/TableSuggestionModal";

const TABS = [
  {
    label: "Tất cả",
    value: "all",
  },
  {
    label: "Chờ xác nhận",
    value: "pending",
  },
  {
    label: "Đã xác nhận",
    value: "confirmed",
  },
  {
    label: "Đã hoàn thành",
    value: "completed",
  },
  {
    label: "Đã hủy",
    value: "cancelled",
  },
];

const TABLE_HEAD = [
  "Mã đặt bàn",
  "Khách hàng",
  "Số người",
  "Ngày - Giờ",
  "Tiền cọc",
  "Trạng thái",
  "Hành động",
];

const getStatusColor = (status) => {
  switch (status) {
    case 0:
      return "green";
    case 1:
      return "amber";
    case 2:
      return "blue";

    default:
      return "blue-gray";
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 0:
      return "Đang chờ";
    case 1:
      return "Đã xác nhận";
    case 2:
      return "Đã huỷ";

    default:
      return "Không xác định";
  }
};

export function AdminReservationPage() {
  const [activeTab, setActiveTab] = useState("confirmed");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const fetchReservations = async (time, pageNumber, pageSize) => {
    try {
      setLoading(true);
      const response = await getAllReservations(time, pageNumber, pageSize, 0);
      if (response?.isSuccess) {
        setReservations(response?.result?.items);
        setTotalPages(response?.result?.totalPages);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchReservations(1, page, 10);
  }, [page]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tables, setTables] = useState([]);
  const startDate = "2024-08-20";
  const endDate = "2024-08-21";
  const people = 4;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSuggestTable = async (startDate, endDate, people) => {
    openModal();
    try {
      const response = await suggestTable({
        startTime: startDate,
        endTime: endDate,
        numOfPeople: people,
        isPrivate: false,
      });
      if (response?.isSuccess) {
        setTables(response?.result);
      }
    } catch (error) {
    } finally {
    }
  };
  return (
    <Card className="h-full w-full">
      <LoadingOverlay isLoading={loading} />
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Quản lý đặt bàn
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Xem và quản lý tất cả các đơn đặt bàn
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
      <CardBody className="overflow-scroll px-0">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reservations?.map(
              (
                {
                  reservationId,
                  reservationDate,
                  numberOfPeople,
                  endTime,
                  customerInfoId,
                  customerInfo,
                  deposit,
                  statusId,
                  reservationStatus,
                },
                index
              ) => {
                const isLast = index === reservations.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={reservationId}>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {reservationId.substring(0, 8)}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {`${customerInfo?.name} - ${customerInfo?.phoneNumber}`}
                        {}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {numberOfPeople}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {formatDateTime(endTime)}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {formatPrice(deposit)}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <div className="w-max">
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={getStatusText(statusId)}
                          color={getStatusColor(statusId)}
                        />
                      </div>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Xem chi tiết">
                        <IconButton
                          variant="text"
                          onClick={() =>
                            handleSuggestTable(
                              reservationDate,
                              endTime,
                              numberOfPeople
                            )
                          }
                        >
                          <EyeIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Trang 1 / 10
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            size="sm"
            onClick={() => setPage(page - 1)}
          >
            Trước
          </Button>
          <Button
            variant="outlined"
            size="sm"
            onClick={() => setPage(page + 1)}
          >
            Tiếp
          </Button>
        </div>
      </CardFooter>
      <TableSuggestionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        tables={tables}
        startDate={startDate}
        endDate={endDate}
        people={people}
      />
    </Card>
  );
}
