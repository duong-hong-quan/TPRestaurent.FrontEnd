import React from "react";
import { FaArrowUp, FaArrowDown, FaMoneyBillWave } from "react-icons/fa";
import { formatDateTime } from "../../util/Utility";
import { Empty } from "antd";

const LoyalPointHistoryItem = ({ transaction }) => {
  const isReceived = Number(transaction.pointChanged) > 0;
  const balanceAfter =
    Number(transaction.newBalance) - Number(transaction.pointChanged);

  return (
    <div
      className={`${
        isReceived ? "bg-green-50" : "bg-red-100"
      } p-4 mb-3 flex items-center justify-between rounded-xl`}
    >
      <div className="flex items-center">
        <div
          className={`p-3 rounded-full mr-4 ${
            isReceived ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {isReceived ? (
            <FaArrowDown className="text-green-600 text-xl" />
          ) : (
            <FaArrowUp className="text-red-600 text-xl" />
          )}
        </div>
        <div>
          <p
            className={`font-semibold ${
              isReceived ? "text-green-600" : "text-red-600"
            }`}
          >
            {isReceived ? "Nhận" : "Trừ"}{" "}
            {transaction.pointChanged.toLocaleString()} điểm
          </p>
          <p className="text-gray-500 text-sm">
            {formatDateTime(transaction.transactionDate)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`font-bold ${
            isReceived ? "text-green-600" : "text-red-600"
          }`}
        >
          {isReceived && "+"}
          {transaction.pointChanged.toLocaleString()}
        </p>
        {/* <p className="text-gray-600 text-sm">
          Điểm tích luỹ: {balanceAfter.toLocaleString()}
        </p> */}
      </div>
    </div>
  );
};

const LoyalPointHistoryList = ({ transactions }) => {
  return (
    <div className=" p-6 bg-gray-50 border border-gray-100 rounded-md max-h-[650px] overflow-y-scroll">
      {transactions.length === 0 && <Empty />}
      {transactions.length > 0 &&
        transactions.map((transaction, index) => (
          <LoyalPointHistoryItem key={index} transaction={transaction} />
        ))}
    </div>
  );
};

export default LoyalPointHistoryList;
