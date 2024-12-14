import { useState } from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { Button, Image, Input, message, Modal, Radio, Select } from "antd";
import moment from "moment/moment";
import Momo_logo from "../../../assets/imgs/payment-icon/MoMo_Logo.png";
import VNPAY_logo from "../../../assets/imgs/payment-icon/VNpay_Logo.png";
import Cash_Logo from "../../../assets/imgs/payment-icon/Cash_Logo.png";
import { PaymentMethod } from "../../../util/GlobalType";
import {
  formatDateTime,
  formatPrice,
  getDomain,
  showError,
} from "../../../util/Utility";
import { StyledTable } from "../../custom-ui/StyledTable";
import { DollarOutlined, WalletOutlined } from "@ant-design/icons";
import useCallApi from "../../../api/useCallApi";
import { AccountApi, ConfigurationApi, OrderApi } from "../../../api/endpoint";
import dayjs from "dayjs";
import { DollarSign, HandCoins, PhoneCall, UndoDot } from "lucide-react";
import LoadingOverlay from "../../loading/LoadingOverlay";
import OrderTag from "../../tag/OrderTag";
import { debounce } from "lodash";

const OrderDetailAdmin = ({ reservationData, fetchData, onClose }) => {
  const { order, orderDishes, orderTables } = reservationData;
  const { callApi, error, loading } = useCallApi();
  const [amount, setAmount] = useState("");
  const totalAmount = order?.totalAmount;
  const [refundType, setRefundType] = useState("cash"); // 'cash' or 'wallet'
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [listAccount, setListAccount] = useState([]);
  const handlePayment = async () => {
    if (!amount) {
      message.error("Vui lòng nhập số tiền khách đưa");
      return;
    }
    if (amount < totalAmount) {
      message.error("Số tiền khách đưa không đủ");
      return;
    }
    const response = await callApi(
      `${OrderApi.MAKE_DINE_IN_ORDER_BILL}`,
      "POST",
      {
        accountId: selectedAccount || undefined,
        orderId: order.orderId,
        paymentMethod: 1,
        couponIds: [],
        loyalPointsToUse: 0,
        cashReceived: amount,
        changeReturned: amount - totalAmount,
        chooseCashRefund: refundType === "cash" ? true : false,
        returnUrl: `${getDomain()}/payment`,
      }
    );
    if (response?.isSuccess) {
      message.success("Thanh toán thành công");
      fetchData();
      onClose();
    } else {
      showError(response.messages);
    }
  };

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
      case PaymentMethod.STORE_CREDIT:
        return (
          <div className="flex items-center">
            <img src={Cash_Logo} className="h-6 w-6 mr-2" alt="VNPAY" />
            <span className="text-yellow-800 font-semibold">
              Tài khoản Thiên Phú
            </span>
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
        if (order?.statusId == 3 || order?.statusId == 5) {
          return true;
        } else {
          return false;
        }
      case 2:
        return false;
      case 3:
        if (order?.statusId == 3 || order?.statusId == 5) {
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

  const handleSearchAccount = async (value) => {
    const response = await callApi(
      `${AccountApi.GET_ACCOUNT_BY_PHONENUMBER_KEYWORD}/1/1000?phoneNumber=${value}`,
      "GET"
    );
    if (response?.isSuccess) {
      setListAccount(response?.result.items);
    } else {
      setListAccount([]);
    }
  };
  const debouncedHandleSearchAccount = debounce(handleSearchAccount, 800);

  return (
    <Card className="w-full shadow-none border-none">
      <LoadingOverlay isLoading={loading} />
      <CardBody className="p-6">
        <Typography
          variant="h4"
          color="blue-gray"
          className="mb-6 text-center font-bold"
        >
          Thông Tin Đơn Hàng
        </Typography>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="max-h-[550px] overflow-y-scroll">
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
                {order?.transaction?.transactionTypeId === 4 ? (
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
          <div className="max-h-[550px] overflow-y-scroll">
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
                <div className="w-20 h-20 rounded-lg shadow-sm ">
                  <Image
                    src={order.validatingImg}
                    alt="Validating Image"
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}

            {renderIsPayment() && (
              <Card className="max-w-md mx-auto p-6 bg-white shadow-lg">
                <div className="flex flex-col space-y-6">
                  {/* Amount Input Section */}
                  <div className="relative">
                    <div>
                      <label className="flex items-center gap-2" htmlFor="">
                        <PhoneCall size={16} /> Số điện thoại
                      </label>
                      <Select
                        key={listAccount?.length} // Add a key prop to force re-render
                        onChange={(value) => setSelectedAccount(value)}
                        className="my-2 h-12 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        showSearch
                        onSearch={debouncedHandleSearchAccount}
                        loading={loading}
                        placeholder="Nhập số điện thoại"
                      >
                        {listAccount?.length > 0 &&
                          listAccount.map((account) => (
                            <Select.Option key={account.id} value={account.id}>
                              {`${account.lastName} ${account.firstName} - 0${account.phoneNumber}`}
                            </Select.Option>
                          ))}
                      </Select>
                    </div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <HandCoins size={16} className="text-gray-500" />
                      Tiền khách đưa
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <DollarSign className="text-gray-500" size={16} />
                      </div>
                      <Input
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        type="number"
                        placeholder="Nhập số tiền"
                        className="pl-10 h-12 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Change Amount Section */}
                  {amount - totalAmount && (
                    <div className="flex items-center gap-2 p-4 rounded-lg bg-gray-50">
                      <UndoDot
                        className={
                          amount - totalAmount >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }
                        size={20}
                      />
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Trả lại:</span>
                        <span
                          className={`font-bold ${
                            amount - totalAmount >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {formatPrice(amount - totalAmount)}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <Typography className="block mb-3">
                          Hình thức hoàn tiền
                        </Typography>
                        <Radio.Group
                          value={refundType}
                          onChange={(e) => setRefundType(e.target.value)}
                          className="flex flex-col space-y-3"
                        >
                          <Radio value="cash">
                            <div className="flex items-center gap-2">
                              <DollarOutlined />
                              <span>Hoàn tiền mặt</span>
                            </div>
                          </Radio>
                          <Radio value="wallet">
                            <div className="flex items-center gap-2">
                              <WalletOutlined />
                              <span>Hoàn vào ví</span>
                            </div>
                          </Radio>
                        </Radio.Group>
                      </div>
                    </div>
                  )}

                  {/* Payment Button */}
                  <Button
                    onClick={handlePayment}
                    className="w-full h-12 bg-red-800 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <DollarSign size={18} />
                    Thanh toán bằng tiền mặt
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
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

export default OrderDetailAdmin;
