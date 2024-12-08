import { Empty } from "antd";
import StoreCreditHistoryItem from "./StoreCreditHistoryItem";

const StoreCreditHistory = ({ storeCreditHistory }) => {
  console.log(storeCreditHistory);
  return (
    <div className="p-4 max-h-[650px] overflow-auto">
      {storeCreditHistory.length === 0 && <Empty />}
      {storeCreditHistory.length >0 && storeCreditHistory.map((storeCredit, index) => (
        <StoreCreditHistoryItem key={index} storeCredit={storeCredit} />
      ))}
    </div>
  );
};
export default StoreCreditHistory;
