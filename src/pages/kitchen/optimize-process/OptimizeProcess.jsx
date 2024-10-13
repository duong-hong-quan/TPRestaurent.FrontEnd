import { useEffect, useState } from "react";
import { Typography, Card, Table, Space, message, Image } from "antd";
import useCallApi from "../../../api/useCallApi";
import { OrderApi, OrderSessionApi } from "../../../api/endpoint";
import { IconButton } from "@material-tailwind/react";
import { Eye } from "lucide-react";
import { uniqueId } from "lodash";
import { showError } from "../../../util/Utility";
import OrderCard from "./OrderCard";
import OrderDetailModal from "./OrderDetailModal";

const { Title, Text } = Typography;

const OptimizeProcess = () => {
  const orders = Array(8).fill("#351");
  const [mutualOrderDishes, setMutualOrderDishes] = useState([]);
  const [filterMutualOrderDishes, setFilterMutualOrderDishes] = useState([]);
  const [singleOrderDishes, setSingleOrderDishes] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);

  const { callApi, error, loading } = useCallApi();

  const fetchData = async () => {
    const result = await callApi(`${OrderSessionApi.GET_GROUPED_DISH}`, "GET");
    if (result.isSuccess) {
      setMutualOrderDishes(result.result?.mutualOrderDishes);
      setSingleOrderDishes(result.result?.singleOrderDishes);
      setFilterMutualOrderDishes(
        selectedDish.dishFromTableOrders.filter(
          (item) => item.orderDetail.orderDetailStatusId === 1
        )
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      dataIndex: "id",
      key: "id",
      title: "STT",
      render: (_, __, index) => index + 1,
      align: "center",
    },
    {
      title: "MÓN ĂN",
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (_, record) => (
        <div className="flex items-center justify-center">
          <Image
            className="rounded-md"
            src={record.dish?.image}
            alt="Food"
            width={100}
            height={100}
          />
          <p className="ml-10 font-semibold uppercase">{record.dish?.name}</p>
        </div>
      ),
    },
    {
      title: "SỐ LƯỢNG",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (_, record) => (
        <div>
          {record.total.map((item, index) => (
            <div key={index}>
              <span className="font-bold text-xl"> {item.quantity}</span>{" "}
              <span className="text-xl"> {item.dishSize.vietnameseName}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Xem chi tiết",
      dataIndex: "detail",
      key: "detail",
      align: "center",
      render: (_, record) => (
        <div>
          <IconButton
            onClick={() => {
              setSelectedDish(record);
              setFilterMutualOrderDishes(
                record.dishFromTableOrders.filter(
                  (item) => item.orderDetail.orderDetailStatusId === 1
                )
              );
            }}
            className="cursor-pointer bg-white shadow-none text-black hover:shadow-none hover:bg-white"
          >
            <Eye />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleUpdateStatus = async () => {
    const response = await callApi(
      `${OrderApi.UPDATE_ORDER_DETAIL_STATUS}?isSuccessful=true`,
      "PUT",
      selectedRows
    );
    if (response.isSuccess) {
      message.success("Cập nhật trạng thái thành công");
      await fetchData();
    } else {
      showError(error);
    }
  };

  return (
    <div className="container">
      <div>
        <Card style={{ marginTop: 16 }}>
          <Title level={3}>THANH PHỤC VỤ</Title>
          <Space wrap>
            {orders.map((order, index) => (
              <OrderCard key={index} order={order} index={index} />
            ))}
          </Space>
        </Card>

        <Text type="danger" style={{ display: "block", margin: "16px 0" }}>
          Note: Sau 3 phút, hệ thống sẽ tự động kiểm tra đơn và tối ưu món liên
          tục trên list.
        </Text>

        <Title level={3}>BẢNG ƯU TIÊN MÓN CẦN CHẾ BIẾN</Title>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="shadow-md rounded-md">
              <h3 className="bg-[#E3B054] text-white px-4 py-6 text-center rounded-lg shadow-lg uppercase font-bold">
                Món trùng đơn
              </h3>
              <div className="w-full">
                <Table
                  dataSource={mutualOrderDishes}
                  columns={columns}
                  pagination={false}
                  rowKey={uniqueId()}
                  size="small"
                  loading={loading}
                />
              </div>
            </div>
          </div>
          <div>
            <div className="shadow-md rounded-md">
              <h3 className="bg-[#C40519] text-white px-4 py-6 text-center rounded-lg shadow-lg uppercase font-bold">
                Món lẻ đơn
              </h3>
              <div className="overflow-x-auto w-full">
                <Table
                  dataSource={singleOrderDishes}
                  columns={columns}
                  pagination={false}
                  rowKey="id"
                  size="small"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedDish && (
        <OrderDetailModal
          selectedDish={selectedDish}
          filterMutualOrderDishes={filterMutualOrderDishes}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          handleUpdateStatus={handleUpdateStatus}
          loading={loading}
          setSelectedDish={setSelectedDish}
        />
      )}
    </div>
  );
};

export default OptimizeProcess;
