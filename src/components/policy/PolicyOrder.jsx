import { useEffect, useState } from "react";
import { ConfigurationApi } from "../../api/endpoint";
import useCallApi from "../../api/useCallApi";
import LoadingOverlay from "../loading/LoadingOverlay";
import { formatPrice } from "../../util/Utility";

const PolicyOrder = () => {
const  {callMultipleApis,loadingPromise}= useCallApi();
const [configData, setConfigData] = useState({
  refundPercentageAsCustomer: 0,
  distanceStepFee: 0,
  distanceOrder: 0,
  maxDistance: 0,
  refundPercentageAsAdmin: 0,
});
const fetchData = async () => {
const [response1, response2, response3, response4, response5] =
  await callMultipleApis([
    {
      endpoint: `${ConfigurationApi.GET_CONFIG_BY_NAME}/REFUND_PERCENTAGE_AS_CUSTOMER`,
      method: "GET",
      data: undefined,
    },
    {
      endpoint: `${ConfigurationApi.GET_CONFIG_BY_NAME}/DISTANCE_STEP_FEE`,
      method: "GET",
      data: undefined,
    },
    {
      endpoint: `${ConfigurationApi.GET_CONFIG_BY_NAME}/DISTANCE_ORDER`,
      method: "GET",
      data: undefined,
    },
    {
      endpoint: `${ConfigurationApi.GET_CONFIG_BY_NAME}/MAX_DISTANCE`,
      method: "GET",
      data: undefined,
    },
    {
      endpoint: `${ConfigurationApi.GET_CONFIG_BY_NAME}/REFUND_PERCENTAGE_AS_ADMIN`,
      method: "GET",
      data: undefined,
    },
  ]);
setConfigData({
  refundPercentageAsCustomer: response1.result.currentValue,
  distanceStepFee: response2.result.currentValue,
  distanceOrder: response3.result.currentValue,
  maxDistance: response4.result.currentValue,
  refundPercentageAsAdmin: response5.result.currentValue,
});

}
useEffect(() => {
fetchData();
},[]);

  return (
    <div className="max-w-2xl bg-white my-2">
      <LoadingOverlay isLoading={loadingPromise} />
      <h2 className="text-lg font-bold mb-6 text-red-800  uppercase pb-2">
        Chính Sách Mua Hàng
      </h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-700">ĐƠN HÀNG:</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Đồ ăn đã mua không được đổi trả.</li>

          <li>Vui lòng kiểm tra kỹ trước khi nhận hàng.</li>
          <li>
            Khách hàng vui lòng thanh toán 100% online qua các cổng thanh toán
            MOMO, VNPAY.
          </li>

          <li>
            Đối với trường hợp huỷ đơn hàng bạn sẽ nhận lại được{" "}
            <strong> {configData.refundPercentageAsCustomer * 100}%</strong> số
            tiền đã thanh toán.
          </li>
          <li>
            Đối với trường hợp đơn hàng bị huỷ do về phía chúng tôi bạn sẽ nhận
            lại được{" "}
            <strong> {configData.refundPercentageAsAdmin * 100}%</strong> số
            tiền đã thanh toán.
          </li>
          <li>
            <strong className="text-red-800">
              Chỉ giao hàng trong thành phố Đà Lạt
            </strong>
            .
          </li>
          <li>Mọi sự khiếu nại vui lòng gọi hotline +84 919 782 444</li>
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-3 text-gray-700">
          PHÍ GIAO HÀNG:
        </h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>
            Phí giao hàng sẽ được tính{" "}
            {formatPrice(Number(configData.distanceStepFee))}
            /km
          </li>
          <li>
          Khoảng cách giao hàng trong vòng bán kính {configData.maxDistance} km
          </li>
        </ul>
      </div>
    </div>
  );
};
export default PolicyOrder;
