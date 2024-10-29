// eslint-disable-next-line no-unused-vars
import React from "react";

const OrderProgressBar = ({
  unProcessingOrders,
  processingOrders,
  doneOrders,
  cancelOrders,
  totalOrdersCount,
}) => {
  // Calculate percentages
  const unProcessingPercentage = Math.round(
    (unProcessingOrders.length / totalOrdersCount) * 100
  );
  const processingPercentage = Math.round(
    (processingOrders.length / totalOrdersCount) * 100
  );
  const donePercentage = Math.round(
    (doneOrders.length / totalOrdersCount) * 100
  );
  const cancelPercentage = Math.round(
    (cancelOrders.length / totalOrdersCount) * 100
  );

  // Combine all percentages for accurate stacking
  const totalPercentage =
    unProcessingPercentage +
    processingPercentage +
    donePercentage +
    cancelPercentage;

  return (
    <div className="mt-4 w-[80%] mx-auto">
      {/* Stacked Progress Bar */}
      <div className="relative h-4 w-full bg-gray-200 ">
        <div
          className="absolute h-4 bg-yellow-400 rounded-l"
          style={{ width: `${unProcessingPercentage}%` }}
        ></div>
        <div
          className="absolute h-4 bg-orange-500"
          style={{
            width: `${processingPercentage}%`,
            left: `${unProcessingPercentage}%`,
          }}
        ></div>
        <div
          className="absolute h-4 bg-green-500"
          style={{
            width: `${donePercentage}%`,
            left: `${unProcessingPercentage + processingPercentage}%`,
          }}
        ></div>
        <div
          className="absolute h-4 bg-red-500 rounded-r"
          style={{
            width: `${cancelPercentage}%`,
            left: `${
              unProcessingPercentage + processingPercentage + donePercentage
            }%`,
          }}
        ></div>
      </div>

      {/* Legend */}
      <div className="flex justify-between mt-6 text-sm ">
        <div className=" items-center font-semibold">
          <div className="w-4 h-4  mb-2 bg-yellow-500 mr-2"></div>
          Chờ xác nhận: {unProcessingPercentage}% ({unProcessingOrders.length}{" "}
          món)
        </div>
        <div className=" items-center font-semibold">
          <div className="w-4 h-4  mb-2 bg-orange-400 mr-2"></div>
          Đang chế biến: {processingPercentage}% ({processingOrders.length} món)
        </div>
        <div className=" items-center font-semibold">
          <div className="w-4 h-4  mb-2 bg-green-500 mr-2"></div>
          Đã chế biến: {donePercentage}% ({doneOrders.length} món)
        </div>
        <div className=" items-center font-semibold">
          <div className="w-4 h-4  mb-2 bg-red-500 mr-2"></div>
          Đã huỷ: {cancelPercentage}% ({cancelOrders.length} món)
        </div>
      </div>
    </div>
  );
};

export default OrderProgressBar;
