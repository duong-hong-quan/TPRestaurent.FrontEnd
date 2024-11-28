import { Card, CardBody, Typography } from "@material-tailwind/react";
import { Button, Image, Modal } from "antd";
import moment from "moment/moment";
import Momo_logo from "../../../assets/imgs/payment-icon/MoMo_Logo.png";
import VNPAY_logo from "../../../assets/imgs/payment-icon/VNpay_Logo.png";
import { PaymentMethod } from "../../../util/GlobalType";
import { formatDateTime, formatPrice } from "../../../util/Utility";
import { StyledTable } from "../../custom-ui/StyledTable";
import { WarningOutlined } from "@ant-design/icons";
import useCallApi from "../../../api/useCallApi";
import {
  ConfigurationApi,
  OrderApi,
  TransactionApi,
} from "../../../api/endpoint";
import dayjs from "dayjs";
import OrderTag from "../../tag/OrderTag";
import { useSelector } from "react-redux";
import OrderSessionTag from "../../tag/OrderSessionTag";
import { useState } from "react";
import { Clock, ListChecks, TagIcon, Timer } from "lucide-react";

const OrderDetail = ({ reservationData, fetchData }) => {
  const { order, orderDishes, orderTables, orderSessions } = reservationData;
  const { callApi, error, loading } = useCallApi();
  const [selectedOrderSession, setSelectedOrderSession] = useState(
    orderDishes?.[0]?.orderSession?.orderSessionId
  );
  const user = useSelector((state) => state.user.user || {});
  const [orderSessionData, setOrderSessionData] = useState([]);

  const renderPaymentMethod = () => {
    switch (order?.transaction?.paymentMethodId) {
      case PaymentMethod.MOMO:
        return (
          <div className="flex items-center">
            <img src={Momo_logo} className="h-6 w-6 mr-2" alt="Momo" />
            <span className="text-pink-600 font-semibold">Momo</span>
          </div>
        );
      case PaymentMethod.VNPAY:
        return (
          <div className="flex items-center">
            <img src={VNPAY_logo} className="h-6 w-6 mr-2" alt="VNPAY" />
            <span className="text-blue-600 font-semibold">VNPAY</span>
          </div>
        );
      default:
        return <span className="text-gray-600">Không xác định</span>;
    }
  };
  console.log(reservationData);
  const renderOrderTime = () => {
    switch (order?.orderTypeId) {
      case 1:
        return formatDateTime(order.reservationDate);
      case 2:
        return formatDateTime(order.orderDate);
      case 3:
        return formatDateTime(order.mealTime);
    }
  };
  const columns = [
    {
      title: "Tên món",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center">
          <img
            src={record.image}
            alt=""
            className="w-12 h-12 rounded-full object-cover mr-3"
          />
          <div>
            <p className="font-semibold">{text}</p>
            {record.comboDishes && (
              <ul className="text-sm text-gray-600 mt-1">
                {record.comboDishes.map((dish) => (
                  <li key={dish.dishComboId}>
                    + {dish.name} ({dish.size})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => <span className="font-medium">{quantity}</span>,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <span className="font-medium">{formatPrice(price)} </span>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (note) => (
        <span className="text-gray-600">{note || "Không có ghi chú"}</span>
      ),
    },
    {
      title: "Thời gian đặt",
      dataIndex: "orderTime",
      key: "orderTime",
      render: (orderTime) => (
        <span className="text-gray-600">
          {moment(orderTime).format("DD/MM/YYYY HH:mm")}
        </span>
      ),
    },
  ];

  const dataSource = orderDishes?.flatMap((order) => {
    if (order.comboDish) {
      return {
        key: order.orderDetailsId,
        name: order.comboDish.combo.name,
        quantity: order.quantity,
        price: order.comboDish.combo.price,
        note: order.note,
        image: order.comboDish.combo.image,
        orderTime: order.orderTime,
        comboDishes: order.comboDish.dishCombos.map((comboDish) => ({
          dishComboId: comboDish.dishComboId,
          name: comboDish.dishSizeDetail.dish.name,
          size: comboDish.dishSizeDetail.dishSize.vietnameseName,
          image: comboDish.dishSizeDetail.dish.image,
        })),
      };
    } else {
      return {
        key: order.orderDetailsId,
        name: `${order.dishSizeDetail.dish.name} (${order.dishSizeDetail.dishSize.vietnameseName})`,
        quantity: order.quantity,
        price: order.dishSizeDetail.price,
        note: order.note,
        orderTime: order.orderTime,
        image: order.dishSizeDetail.dish.image,
      };
    }
  });
  const renderIsPayment = () => {
    switch (order?.orderTypeId) {
      case 1:
        if (order?.statusId == 1) {
          return true;
        } else {
          return false;
        }
      case 2:
        if (order?.statusId == 4) {
          return true;
        } else {
          return false;
        }
      case 3:
        if (order?.statusId == 3) {
          return true;
        } else {
          return false;
        }
    }
  };
  const handleCancelOrder = async (orderId) => {
    const response = await callApi(
      `${ConfigurationApi.GET_CONFIG_BY_NAME}/TIME_TO_RESERVATION_WITH_DISHES_LAST`,
      "GET"
    );
    let time = response?.result?.currentValue;

    const currentTime = dayjs();

    switch (order?.orderTypeId) {
      case 1:
        const reservationDate = dayjs(order?.reservationDate.split(".")[0]);
        const targetTime = reservationDate.add(time, "hour");

        if (currentTime.isAfter(targetTime)) {
          Modal.error({
            title: "Hủy đơn hàng",
            content: (
              <div>
                <p>
                  Đơn hàng đã được tạo trong thời gian quy định không thể hủy
                </p>
              </div>
            ),
          });
          return;
        }
        break;
      case 2:
        const orderDate = dayjs(order?.orderDate.split(".")[0]);
        const targetTimeOrder = orderDate.add(time, "hour");

        if (currentTime.isAfter(targetTimeOrder)) {
          Modal.error({
            title: "Hủy đơn hàng",
            content: (
              <div>
                <p>
                  Đơn hàng đã được tạo trong thời gian quy định không thể hủy
                </p>
              </div>
            ),
          });
          return;
        }
        break;
      case 3:
        const mealTime = dayjs(order?.mealTime.split(".")[0]);
        const targetMealTime = mealTime.add(time, "hour");

        if (currentTime.isAfter(targetMealTime)) {
          Modal.error({
            title: "Hủy đơn hàng",
            content: (
              <div>
                <p>
                  Đơn hàng đã được tạo trong thời gian quy định không thể hủy
                </p>
              </div>
            ),
          });
          return;
        }
    }

    Modal.confirm({
      title: "Hủy đơn hàng",
      content: (
        <div>
          <p>Bạn có chắc chắn muốn hủy đơn hàng này không?</p>
          <p> </p>
          <p className="text-red-600 font-semibold">
            Lưu ý: Hủy đơn hàng sẽ không thể khôi phục lại
          </p>
        </div>
      ),
      async onOk() {
        const response = await callApi(
          `${OrderApi.UPDATE_ORDER_STATUS}/${order.orderId}?isSuccessful=false`,
          "PUT"
        );
        if (response?.isSuccess) {
          await fetchData(order.orderId);
          Modal.success({
            title: "Hủy đơn hàng",
            content: (
              <div>
                <p>Hủy đơn hàng thành công</p>
              </div>
            ),
          });
        }
      },
      onCancel() {},
    });
  };

  return (
    <Card className="w-full shadow-none border-none max-h-[550px] overflow-auto">
      <CardBody className="p-6">
        <Typography
          variant="h4"
          color="blue-gray"
          className="mb-6 text-center font-bold"
        >
          Thông Tin Đơn Hàng
        </Typography>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <Typography
              variant="h5"
              color="blue-gray"
              className="mb-4 font-semibold"
            >
              Thông Tin Đặt Bàn
            </Typography>
            <InfoItem
              label="Mã đơn đặt hàng"
              value={order?.orderId.substring(0, 8)}
            />
            <InfoItem label="Thời gian tạo" value={renderOrderTime()} />
            {order?.account && (
              <>
                <InfoItem
                  label="Họ và tên"
                  value={`${order?.account?.lastName} ${order?.account?.firstName}`}
                />
                <InfoItem
                  label="Điện thoại"
                  value={`0${order?.account?.phoneNumber}`}
                />
                {order?.orderTypeId != 2 && (
                  <InfoItem
                    label="Số lượng khách"
                    value={
                      orderTables && orderTables.length > 0
                        ? orderTables
                            .map(
                              (item, index) => `Bàn ${item.table?.tableName}`
                            )
                            .join(", ")
                        : "Chưa có thông tin"
                    }
                  />
                )}
              </>
            )}
            <InfoItem
              label="Ghi chú"
              value={order?.note || "Không có ghi chú"}
            />
            {order?.orderTypeId != 2 && (
              <InfoItem
                label="Loại bàn"
                value={
                  orderTables && orderTables.length > 0
                    ? orderTables
                        .map(
                          (item, index) =>
                            `Bàn ${item.table?.tableSizeId} người - ${item.table?.room?.name}`
                        )
                        .join(", ")
                    : "Chưa có thông tin"
                }
              />
            )}
            {order?.orderTypeId != 2 && (
              <InfoItem
                label="Bàn"
                value={
                  orderTables && orderTables.length > 0
                    ? orderTables
                        .map((item, index) => `Bàn ${item.table?.tableName}`)
                        .join(", ")
                    : "Chưa có thông tin"
                }
              />
            )}
            <InfoItem
              label="Ghi chú"
              value={order?.note || "Không có ghi chú"}
            />
            <InfoItem
              label="Tổng giá trị đơn hàng"
              value={formatPrice(order?.totalAmount)}
            />
            <InfoItem
              label="Trạng thái đơn"
              value={<OrderTag orderStatusId={order?.statusId} />}
            />
            {order?.shipper && (
              <InfoItem
                label="Shipper đảm nhận giao"
                value={`${order.shipper.lastName} ${order.shipper.firstName} - 0${order.shipper.phoneNumber}`}
              />
            )}
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <Typography
              variant="h5"
              color="blue-gray"
              className="mb-4 font-semibold"
            >
              Thông Tin Giao Dịch
            </Typography>
            <InfoItem
              label={
                order?.orderTypeId === 1
                  ? "Số tiền cọc"
                  : "Tổng tiền thanh toán"
              }
              value={
                order?.orderTypeId === 1
                  ? `${formatPrice(order?.deposit)} `
                  : `${formatPrice(order?.totalAmount)}`
              }
            />
            <>
              <InfoItem
                label="Phương thức thanh toán"
                value={renderPaymentMethod()}
                isComponent
              />
              {order?.transaction?.transactionTypeId == 4 ? (
                <InfoItem
                  label={"Đã hoàn lại tiền vào lúc"}
                  value={moment(order?.transaction?.paidDate).format(
                    "DD/MM/YYYY HH:mm"
                  )}
                />
              ) : (
                <InfoItem
                  label={
                    order?.orderTypeId === 1
                      ? "Đã đặt cọc lúc"
                      : "Đã thanh toán lúc"
                  }
                  value={
                    order?.orderTypeId === 1
                      ? moment(order?.depositDate).format("DD/MM/YYYY HH:mm")
                      : moment(order?.transaction?.paidDate).format(
                          "DD/MM/YYYY HH:mm"
                        )
                  }
                />
              )}
            </>
          </div>
        </div>

        {user.id === order?.accountId ? (
          <>
            <Typography
              variant="h5"
              color="blue-gray"
              className="mb-4 font-semibold"
            >
              Chi Tiết Đơn Hàng
            </Typography>
            <StyledTable
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              className="border border-gray-200 rounded-lg overflow-hidden"
            />
            {order?.validatingImg && (
              <div className="flex flex-col items-start ">
                <Typography className="font-bold my-2">
                  Ảnh shipper xác nhận giao hàng:
                </Typography>
                <div className="w-20 h-20 overflow-hidden rounded-lg shadow-sm ">
                  <Image
                    src={order?.validatingImg}
                    alt="Validating Image"
                    className="object-cover w-20 h-20"
                  />
                </div>
              </div>
            )}

            {renderIsPayment() && user.id === order.accountId && (
              <div className="flex justify-center my-4">
                <Button
                  className="bg-red-900 text-white mx-auto"
                  loading={loading}
                  onClick={async () => {
                    const response = await callApi(
                      `${TransactionApi.CREATE_PAYMENT}`,
                      "POST",
                      {
                        orderId: order?.orderId,
                        paymentMethod: order?.transaction?.paymentMethodId,
                      }
                    );
                    if (response?.isSuccess) {
                      window.location.href = response.result;
                    }
                  }}
                >
                  Thanh toán ngay
                </Button>
              </div>
            )}
            {order?.statusId == 2 && (
              <div
                className="p-4 flex items-center gap-1 cursor-pointer"
                onClick={() => handleCancelOrder(order?.orderId)}
              >
                <WarningOutlined className="text-yellow-800 text-2xl " />
                <Typography
                  variant="h6"
                  className="font-semibold text-yellow-800"
                >
                  Tôi muốn hủy đơn hàng
                </Typography>
              </div>
            )}
          </>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-1 max-h-[300px] overflow-auto">
              {orderSessions?.length > 0 &&
                orderSessions?.map((session) => (
                  <div
                    onClick={() =>
                      setSelectedOrderSession(session.orderSessionId)
                    }
                    className={`
                              group
                              relative
                              border 
                              rounded-lg 
                              p-4 
                              transition-all 
                              duration-300 
                              ease-in-out 
                              cursor-pointer 
                              hover:shadow-md
                              ${
                                selectedOrderSession === session.orderSessionId
                                  ? "border-red-500 bg-red-50 shadow-md"
                                  : "border-gray-200 hover:border-red-300 bg-white"
                              }
                     `}
                  >
                    {/* Decorative corner accent */}
                    <div
                      className={`
                        absolute 
                        top-0 
                        right-0 
                        w-0 
                        h-0 
                        border-t-[24px] 
                        border-l-[24px] 
                        border-t-transparent 
                        transition-colors 
                        duration-300
                        ${
                          selectedOrderSession === session.orderSessionId
                            ? "border-l-red-500"
                            : "border-l-transparent group-hover:border-l-red-300"
                        }`}
                    />

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-700">
                        <ListChecks size={16} className="text-gray-500" />
                        <span className="font-semibold">
                          Phiên số: {session.orderSessionNumber}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={16} className="text-gray-500" />
                        <span>
                          Tạo lúc: {formatDateTime(session.orderSessionTime)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <Timer size={16} className="text-gray-500" />
                        <span>
                          Thời gian chuẩn bị: {session.preparationTime} phút
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <TagIcon size={16} className="text-gray-500" />
                        <span className="flex items-center gap-2">
                          Trạng thái: <OrderSessionTag orderSession={session} />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className={`${orderSessions ? "col-span-3" : "col-span-4 "} `}>
              <h3 className="text-center uppercase text-red-800 my-1 font-semibold">
                Các món ăn trong phiên gọi món
              </h3>
              <div className=" max-h-[300px] overflow-auto">
                {orderDishes?.length > 0 &&
                  orderDishes
                    .filter(
                      (dish) =>
                        dish.orderSession?.orderSessionId ===
                        selectedOrderSession
                    )
                    .map((dish) => (
                      <div className="bg-gray-100 mb-2 px-2 rounded-lg">
                        <div className="flex items-center gap-2 p-2 border-b border-gray-200">
                          <img
                            src={
                              dish.dishSizeDetail?.dish?.image ||
                              dish.comboDish?.combo?.image
                            }
                            alt=""
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <div>
                            <p className="font-semibold">
                              {dish.dishSizeDetail?.dish?.name ||
                                dish.comboDish?.combo?.name}
                            </p>
                            {dish.comboDish &&
                              dish.comboDish?.dishCombos?.length > 0 && (
                                <ul className="text-sm text-gray-600 my-1">
                                  {dish.comboDish?.dishCombos.map(
                                    (comboDish) => (
                                      <li key={comboDish.dishComboId}>
                                        + {comboDish.dishSizeDetail.dish.name} (
                                        {
                                          comboDish.dishSizeDetail.dishSize
                                            .vietnameseName
                                        }
                                        )
                                      </li>
                                    )
                                  )}
                                </ul>
                              )}
                            <p className="text-gray-600">
                              {`Số lượng: ${dish.quantity}`}
                            </p>
                            <p className="text-gray-800 font-medium">
                              {formatPrice(
                                dish.dishSizeDetail?.price ||
                                  dish.comboDish?.combo?.price
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

const InfoItem = ({ label, value, isComponent = false }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
    <span className="text-gray-600 font-medium">{label}:</span>
    {isComponent ? value : <span className="font-semibold">{value}</span>}
  </div>
);

export default OrderDetail;
