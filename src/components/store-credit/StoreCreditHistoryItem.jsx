import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { formatDateTime, formatPrice } from "../../util/Utility";
import { useEffect, useState } from "react";

const StoreCreditHistoryItem = ({ storeCredit }) => {
  const [isRecieved, setIsRecieved] = useState(false);
  useEffect(() => {
    switch (storeCredit.transactionTypeId) {
      case 1:
        setIsRecieved(false);
        break;
      case 2:
        setIsRecieved(false);
        break;
      case 3:
        setIsRecieved(true);
        break;
      case 4:
        setIsRecieved(true);
        break;
    }
  }, [storeCredit]);

  return (
    <div
      className={
        isRecieved ? "bg-green-50 p-2 my-1 rounded-lg" : "bg-red-50 p-2 my-1"
      }
    >
      <div className="flex items-center">
        <div
          className={`p-3 rounded-full mr-4 ${
            isRecieved ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {isRecieved ? (
            <FaArrowDown className="text-green-600 text-xl" />
          ) : (
            <FaArrowUp className="text-red-600 text-xl" />
          )}
        </div>
        <div>
          <p
            className={`font-semibold ${
              isRecieved ? "text-green-600" : "text-red-600"
            }`}
          >
            {isRecieved ? "Nhận" : "Trừ"}{" "}
            {formatPrice(Number(storeCredit?.amount))}
          </p>
          <p className="text-gray-500 text-sm">
            {formatDateTime(storeCredit?.paidDate || storeCredit.date)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`font-bold ${
            isRecieved ? "text-green-600" : "text-red-600"
          }`}
        >
          {isRecieved && "+"}
          {formatPrice(Number(storeCredit?.amount))}
        </p>
      </div>
    </div>
  );
};
export default StoreCreditHistoryItem;
