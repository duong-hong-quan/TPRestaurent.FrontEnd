import React from "react";
import { FaArrowUp, FaArrowDown, FaMoneyBillWave } from "react-icons/fa";

const LoyalPointHistoryItem = ({ transaction }) => {
  const isReceived = transaction.type === "received";

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
            {transaction.description}
          </p>
          <p className="text-gray-500 text-sm">{transaction.date}</p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`font-bold ${
            isReceived ? "text-green-600" : "text-red-600"
          }`}
        >
          {isReceived ? "+" : "-"}
          {transaction.amount.toLocaleString()} đ
        </p>
        <p className="text-gray-600 text-sm">
          Số dư: {transaction.balanceAfter.toLocaleString()} đ
        </p>
      </div>
    </div>
  );
};

const LoyalPointHistoryList = ({ transactions }) => {
  const currentBalance =
    transactions.length > 0 ? transactions[0].balanceAfter : 0;

  return (
    <div className=" p-6 bg-gray-50 border border-gray-100 rounded-md">
      {transactions.map((transaction, index) => (
        <LoyalPointHistoryItem key={index} transaction={transaction} />
      ))}
    </div>
  );
};

export default LoyalPointHistoryList;
