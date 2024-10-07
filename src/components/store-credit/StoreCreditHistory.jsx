import StoreCreditHistoryItem from "./StoreCreditHistoryItem";

const StoreCreditHistory = ({ storeCreditHistory }) => {
  console.log(storeCreditHistory);
  return (
    <div className="p-4 h-[650px] overflow-auto">
      {storeCreditHistory.map((storeCredit, index) => (
        <StoreCreditHistoryItem key={index} storeCredit={storeCredit} />
      ))}
    </div>
  );
};
export default StoreCreditHistory;
