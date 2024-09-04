import { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";
import {
  getCurrentTableSession,
  getTableSessionById,
  updatePrelistOrderStatus,
} from "../../api/tableSessionApi";
import TableCard from "./TableCard";
import OrderDialog from "./OrderDialog";

const TableView = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [data, setData] = useState({});
  const [activeTab, setActiveTab] = useState("read");
  const [selectedUnchecked, setSelectedUnchecked] = useState([]);
  const [selectedRead, setSelectedRead] = useState([]);
  const [selectedReady, setSelectedReady] = useState([]);

  const fetchData = async () => {
    const data = await getCurrentTableSession();
    if (data?.isSuccess) {
      setTables(data?.result);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleTableClick = async (table) => {
    setSelectedTable(table);
    const response = await getTableSessionById(table);
    if (response?.isSuccess) {
      setData(response?.result);
      setShowDialog(true);
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
  };

  const handleSelectAll = (listType) => {
    switch (listType) {
      case "unchecked":
        const allUncheckedIds = data?.uncheckedPrelistOrderDetails?.map(
          (order) => order.prelistOrder.prelistOrderId
        );
        setSelectedUnchecked(
          selectedUnchecked?.length === allUncheckedIds?.length
            ? []
            : allUncheckedIds
        );
        break;
      case "read":
        const allReadIds = data?.readPrelistOrderDetails?.map(
          (order) => order.prelistOrder.prelistOrderId
        );
        setSelectedRead(
          selectedRead?.length === allReadIds?.length ? [] : allReadIds
        );
        break;
      case "ready":
        const allReadyIds = data?.readyToServePrelistOrderDetails?.map(
          (order) => order.prelistOrder.prelistOrderId
        );
        setSelectedReady(
          selectedReady?.length === allReadyIds?.length ? [] : allReadyIds
        );
        break;
    }
  };

  const handleCheckboxChange = (id, listType) => {
    switch (listType) {
      case "unchecked":
        setSelectedUnchecked((prev) =>
          prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
        break;
      case "read":
        setSelectedRead((prev) =>
          prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
        break;
      case "ready":
        setSelectedReady((prev) =>
          prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
        break;
    }
  };

  const handleChangeStatus = async (status) => {
    switch (status) {
      case "unchecked":
        const response = await updatePrelistOrderStatus(selectedUnchecked);
        if (response?.isSuccess) {
          setSelectedUnchecked([]);
          setShowDialog(false);
          await fetchData();
        }
        break;
      case "read":
        const response2 = await updatePrelistOrderStatus(selectedRead);
        if (response2?.isSuccess) {
          setSelectedRead([]);
          setShowDialog(false);
          await fetchData();
        }
        break;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Typography variant="h3" className="text-center mb-6 text-blue-gray-800">
        Quản lý bàn
      </Typography>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tables?.map((table) => (
          <TableCard
            key={table.tableId}
            table={table}
            onClick={handleTableClick}
          />
        ))}
      </div>

      <OrderDialog
        open={showDialog}
        onClose={handleDialogClose}
        selectedTable={selectedTable}
        data={data}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedUnchecked={selectedUnchecked}
        selectedRead={selectedRead}
        selectedReady={selectedReady}
        handleSelectAll={handleSelectAll}
        handleCheckboxChange={handleCheckboxChange}
        handleChangeStatus={handleChangeStatus}
      />
    </div>
  );
};

export default TableView;
