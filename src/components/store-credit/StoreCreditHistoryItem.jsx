const StoreCreditHistoryItem = ({ historyItem }) => {
  return (
    <div>
      <div className="flex items-center">
        {/* <div className={`p-3 rounded-full mr-4 ${historyItem.isReceived ? "bg-green-100" : "bg-red-100"}`}>
        {historyItem.isReceived ? <FaArrowDown className="text-green-600 text-xl" /> : <FaArrowUp className="text-red-600 text-xl" />}
      </div>
      <div>
        <p className={`font-semibold ${historyItem.isReceived ? "text-green-600" : "text-red-600"}`}>
          {historyItem.isReceived ? "Nhận" : "Trừ"} {historyItem.amount.toLocaleString()} điểm
        </p>
        <p className="text-gray-500 text-sm">
          {formatDateTime(historyItem.transactionDate)}
        </p>
      </div>
    </div>
    <div className="text-right">
      <p className={`font-bold ${historyItem.isReceived ? "text-green-600" : "text-red-600"}`}>
        {historyItem.isReceived && "+"}
        {historyItem.amount.toLocaleString()}
      </p>
      <p className="text-gray-600 text-sm">
        Điểm tích luỹ: {historyItem.balanceAfter.toLocaleString()}
      </p> */}
      </div>
    </div>
  );
};
export default StoreCreditHistoryItem;
