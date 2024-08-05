import React from "react";
import { FaArrowUp, FaArrowDown, FaMoneyBillWave } from "react-icons/fa";

const TransactionItem = ({ transaction }) => {
  const isReceived = transaction.type === "received";

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-3 flex items-center justify-between">
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
          <p className="font-semibold">{transaction.description}</p>
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

const TransactionList = ({ transactions }) => {
  const currentBalance =
    transactions.length > 0 ? transactions[0].balanceAfter : 0;

  return (
    <div className=" p-6 rounded-lg">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaMoneyBillWave className="text-green-600 text-3xl mr-4" />
            <div>
              <p className="text-gray-600">Số dư hiện tại</p>
              <p className="text-2xl font-bold">
                {currentBalance.toLocaleString()} đ
              </p>
            </div>
          </div>
          <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105">
            Xem chi tiết
          </button>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Lịch sử giao dịch</h2>
      {transactions.map((transaction, index) => (
        <TransactionItem key={index} transaction={transaction} />
      ))}
    </div>
  );
};

export default TransactionList;
