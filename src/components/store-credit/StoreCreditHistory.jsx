import StoreCreditHistoryItem from "./StoreCreditHistoryItem";

const StoreCreditHistory = ({ storeCreditHistory }) => {
  return (
    <div>
      {storeCreditHistory.map((storeCredit, index) => (
        <StoreCreditHistoryItem key={index} storeCredit={storeCredit} />
      ))}
    </div>
  );
};
export default StoreCreditHistory;
