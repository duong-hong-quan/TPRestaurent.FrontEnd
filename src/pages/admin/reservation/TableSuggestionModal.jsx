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

const TableSuggestionModal = ({
  startDate,
  endDate,
  people,
  tables,
  isOpen,
  onClose,
}) => {
  const [selectedTable, setSelectedTable] = useState(null);

  const handleTableSelect = (table) => {
    setSelectedTable(table);
  };

  const handleConfirm = () => {
    // Handle confirmation logic here
    onClose();
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
              selectedTable?.tableId === table.tableId
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
                  selectedTable?.tableId === table.tableId
                    ? "filled"
                    : "outlined"
                }
                fullWidth
                className="bg-red-800 text-white"
              >
                {selectedTable?.tableId === table.tableId ? "Đã chọn" : "Chọn"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </DialogBody>
      <DialogFooter>
        <div className="flex flex-col md:flex-row justify-between items-center w-full">
          <div className="mb-4 md:mb-0">
            <Typography variant="small" color="gray">
              Yêu cầu đặt bàn cho {people} người
            </Typography>
            <Typography variant="small" color="gray">
              Từ: {formatDate(startDate)} đến: {formatDate(endDate)}
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
              disabled={!selectedTable}
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
