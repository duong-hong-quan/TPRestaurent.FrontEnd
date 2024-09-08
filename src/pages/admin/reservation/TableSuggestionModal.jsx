import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Card,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";
import { formatDate } from "../../../util/Utility";
import { addTableToReservation } from "../../../api/reservationApi";
import { message } from "antd";

const TableSuggestionModal = ({
  tables,
  isOpen,
  onClose,
  selectedReservation,
}) => {
  const [selectedTables, setSelectedTables] = useState([]);

  const handleTableSelect = (table) => {
    setSelectedTables((prevSelectedTables) => {
      if (prevSelectedTables.some((t) => t.tableId === table.tableId)) {
        // If the table is already selected, remove it
        return prevSelectedTables.filter((t) => t.tableId !== table.tableId);
      } else {
        // Otherwise, add the table to the selection
        return [...prevSelectedTables, table];
      }
    });
  };

  const handleConfirm = async () => {
    console.log(selectedReservation);
    // onClose();
    console.log(selectedTables);
    const data = selectedTables.map((item) => item.tableId);
    console.log(data);
    const response = await addTableToReservation(
      selectedReservation.reservationId,
      data
    );
    if (response?.isSuccess) {
      message.success("Chọn bàn thành công");
      onClose();
    } else {
      response.messages.forEach((item) => {
        message.error(item);
      });
    }
  };

  return (
    <Dialog open={isOpen} handler={onClose} size="xl">
      <DialogHeader className="bg-red-800 text-white">
        <Typography variant="h4">Gợi ý chọn bàn</Typography>
      </DialogHeader>
      <DialogBody
        divider
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {tables.map((table) => (
          <Card
            key={table.tableId}
            className={`cursor-pointer transition-all ${
              selectedTables.some((t) => t.tableId === table.tableId)
                ? "border-2 border-red-500"
                : ""
            }`}
            onClick={() => handleTableSelect(table)}
          >
            <CardBody>
              <Typography variant="h5" className="mb-2">
                {table.tableName}
              </Typography>
              <Typography>Bàn: {table.tableSizeId} người</Typography>
              <Typography>Loại: {table.tableRating?.name}</Typography>
            </CardBody>
            <CardFooter className="pt-0">
              <Button
                size="sm"
                variant={
                  selectedTables.some((t) => t.tableId === table.tableId)
                    ? "filled"
                    : "outlined"
                }
                fullWidth
                className="bg-red-800 text-white"
              >
                {selectedTables.some((t) => t.tableId === table.tableId)
                  ? "Đã chọn"
                  : "Chọn"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </DialogBody>
      <DialogFooter>
        <div className="flex flex-col md:flex-row justify-between items-center w-full">
          <div className="mb-4 md:mb-0">
            <Typography variant="small" color="gray">
              Yêu cầu đặt bàn cho {selectedReservation?.people} người
            </Typography>
            <Typography variant="small" color="gray">
              Từ: {formatDate(selectedReservation?.startDate)} đến:{" "}
              {formatDate(selectedReservation?.endDate)}
            </Typography>
          </div>
          <div className="flex gap-2">
            <Button variant="outlined" color="red" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="filled"
              color="red"
              onClick={handleConfirm}
              disabled={selectedTables.length === 0}
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </DialogFooter>
    </Dialog>
  );
};

export default TableSuggestionModal;
