import React from "react";
import { useEffect, useState } from "react";
import { ConfigurationApi } from "../../api/endpoint";
import useCallApi from "../../api/useCallApi";
import { formatPrice } from "../../util/Utility";
import LoadingOverlay from "../loading/LoadingOverlay";

const PolicyBooking = () => {
  const { callMultipleApis, loadingPromise } = useCallApi();
  const [configData, setConfigData] = useState({
    refundPercentageAsCustomer: 0,
    refundPercentageAsAdmin: 0,
    timeToReservationWithDishesLast: 0,
    depositPercent: 0,
    refundApplyingTimeForReservationCancelation: 0,
    timeToKeepReservation: 0,
    depositForNormalTable: 0,
    depositForPrivateTable: 0,

  });

  const fetchData = async () => {
    const [
      customerRefundResponse,
      dishesTimeResponse,
      depositResponse,
      refundTimeResponse,
      keepReservationResponse,
      adminRefundResponse,
      depositForNormalTableResponse,
      depositForPrivateTableResponse,
    ] = await callMultipleApis([
      {
        endpoint: `${ConfigurationApi.GET_CONFIG_BY_NAME}/REFUND_PERCENTAGE_AS_CUSTOMER`,
        method: "GET",
        data: undefined,
      },
      {
        endpoint: `${ConfigurationApi.GET_CONFIG_BY_NAME}/TIME_TO_RESERVATION_WITH_DISHES_LAST`,
        method: "GET",
        data: undefined,
      },
      {
        endpoint: `${ConfigurationApi.GET_CONFIG_BY_NAME}/DEPOSIT_PERCENT`,
        method: "GET",
        data: undefined,
      },
      {
        endpoint: `${ConfigurationApi.GET_CONFIG_BY_NAME}/REFUND_APPLYING_TIME_FOR_RESEVATION_CANCELATION`,
        method: "GET",
        data: undefined,
      },
      {
        endpoint: `${ConfigurationApi.GET_CONFIG_BY_NAME}/TIME_TO_KEEP_RESERVATION`,
        method: "GET",
        data: undefined,
      },
      {
        endpoint: `${ConfigurationApi.GET_CONFIG_BY_NAME}/REFUND_PERCENTAGE_AS_ADMIN`,
        method: "GET",
        data: undefined,
      },
      {
        endpoint: `${ConfigurationApi.GET_CONFIG_BY_NAME}/DEPOSIT_FOR_NORMAL_TABLE`,
        method: "GET",
        data: undefined,
      },
      {
        endpoint: `${ConfigurationApi.GET_CONFIG_BY_NAME}/DEPOSIT_FOR_PRIVATE_TABLE`,
        method: "GET",
        data: undefined,
      },
    ]);

    setConfigData({
      refundPercentageAsCustomer: customerRefundResponse.result.currentValue,
      timeToReservationWithDishesLast: dishesTimeResponse.result.currentValue,
      depositPercent: depositResponse.result.currentValue,
      refundApplyingTimeForReservationCancelation:
        refundTimeResponse.result.currentValue,
      timeToKeepReservation: keepReservationResponse.result.currentValue,
      refundPercentageAsAdmin: adminRefundResponse.result.currentValue,
      depositForNormalTable: depositForNormalTableResponse.result.currentValue,
      depositForPrivateTable: depositForPrivateTableResponse.result.currentValue,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-2xl">
      <LoadingOverlay isLoading={loadingPromise} />
      <div className="py-4">
        <h2 className="text-lg font-bold text-red-800 uppercase">
          Chính sách đặt bàn
        </h2>
      </div>
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold mb-2 text-gray-700 uppercase">
            Đặt chỗ
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            Nếu bạn chỉ đặt chỗ không kèm đồ ăn thì bạn chỉ cần cọc
            <li>
              Bàn thường:{" "}
              {formatPrice(Number(configData.depositForNormalTable))}
            </li>
            <li>
              Bàn vip: {formatPrice(Number(configData.depositForPrivateTable))}
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2 text-gray-700 uppercase">
            Chính sách hoàn tiền
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>
              Hoàn tiền {configData.refundPercentageAsCustomer * 100}% khi khách
              hàng tự hủy đặt chỗ
            </li>
            <li>
              Hoàn tiền {configData.refundPercentageAsAdmin * 100}% khi nhà hàng
              hủy đặt chỗ
            </li>
            <li>
              Thời gian áp dụng hoàn tiền:{" "}
              {configData.refundApplyingTimeForReservationCancelation} tiếng
              trước giờ đặt
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2 text-gray-700 uppercase">
            Đặt kèm đồ ăn
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>
              Thanh toán tiền cọc = {configData.depositPercent * 100}% giá trị
              đơn đặt đồ ăn + Tiền giữ chỗ (
              {`Bàn thường: ${formatPrice(
                Number(configData.depositForNormalTable)
              )} - Bàn vip: ${formatPrice(
                Number(configData.depositForPrivateTable)
              )}`}
              )
            </li>

            <li>Sau khi ăn, tiền cọc sẽ được trừ vào hóa đơn</li>
            <li>Bữa ăn sẽ được nấu sẵn sàng trước khi bạn đến quán</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2 text-gray-700 uppercase">
            Thời gian giữ chỗ
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>
              Thời gian tối đa giữ chỗ nếu bạn đi trễ:{" "}
              {configData.timeToKeepReservation} phút
            </li>
          </ul>
        </section>

        <p className="italic text-sm text-gray-500">
          Lưu ý: Chính sách này áp dụng cho tất cả các đơn đặt bàn. Để biết thêm
          chi tiết, vui lòng liên hệ với nhân viên nhà hàng.
        </p>
      </div>
    </div>
  );
};

export default PolicyBooking;
