import Title from "antd/es/skeleton/Title";
import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import useCallApi from "../../../api/useCallApi";
import { TableApi } from "../../../api/endpoint";
import LoadingOverlay from "../../../components/loading/LoadingOverlay";
import { Button, message } from "antd";
import { showError } from "../../../util/Utility";

const TABLE_SIZES = {
  2: { width: 80, height: 80 }, // 1 cell
  4: { width: 160, height: 80 }, // 2 cells
  8: { width: 160, height: 160 }, // 4 cells
  6: { width: 240, height: 80 }, // Custom size for 6 tableSizeId
  10: { width: 320, height: 160 }, // Custom size for 10 tableSizeId
};

const GRID_SIZE = 80;
const GRID_COLUMNS = 12;
const GRID_ROWS = 12;

const snapToGrid = (x, y) => {
  const snappedX = Math.round(x / GRID_SIZE) * GRID_SIZE;
  const snappedY = Math.round(y / GRID_SIZE) * GRID_SIZE;
  return { x: snappedX, y: snappedY };
};

const isCollision = (newPosition, tableSize, tables, currentIndex) => {
  const newLeft = newPosition.x;
  const newRight = newPosition.x + tableSize.width;
  const newTop = newPosition.y;
  const newBottom = newPosition.y + tableSize.height;

  return tables.some((table, index) => {
    if (index === currentIndex) return false;

    const existingTableSize = TABLE_SIZES[table.tableSizeId];
    const existingLeft = table.position.x * GRID_SIZE;
    const existingRight = existingLeft + existingTableSize.width;
    const existingTop = table.position.y * GRID_SIZE;
    const existingBottom = existingTop + existingTableSize.height;

    return !(
      newRight <= existingLeft ||
      newLeft >= existingRight ||
      newBottom <= existingTop ||
      newTop >= existingBottom
    );
  });
};

const DiningArea = () => {
  const [tables, setTables] = useState([]);
  const { callApi, loading, error } = useCallApi(); // Removed unused error and loading variables

  useEffect(() => {
    const fetchData = async () => {
      const response = await callApi(`${TableApi.GET_ALL}/1/100`, "GET");
      if (response.isSuccess) {
        setTables(response.result.items);
      }
    };
    fetchData();
  }, []);
  console.log(tables);
  const handleDrag = (index, data) => {
    const snappedPosition = snapToGrid(data.x, data.y);
    const tableSize = TABLE_SIZES[tables[index].tableSizeId];

    if (!isCollision(snappedPosition, tableSize, tables, index)) {
      setTables((prevTables) =>
        prevTables.map((table, i) =>
          i === index
            ? {
                ...table,
                position: {
                  x: snappedPosition.x / GRID_SIZE,
                  y: snappedPosition.y / GRID_SIZE,
                },
              }
            : table
        )
      );
    }
  };
  console.log(tables);
  return (
    <>
      <LoadingOverlay isLoading={loading} />
      <div className="bg-white rounded-lg shadow-lg container min-h-screen mx-auto p-8">
        <h3 className="text-red-800 uppercase font-bold mb-6">
          Khu vực bàn ăn
        </h3>
        <div className="flex gap-8">
          {/* Left side: Drag location with grid */}
          <div
            className="w-2/3 relative border-r-2 overflow-scroll  border-gray-300 p-6 rounded-lg"
            style={{
              border: "2px solid #e5e7eb",
            }}
          >
            {[...Array(GRID_ROWS)].map((_, y) =>
              [...Array(GRID_COLUMNS)].map((_, x) => (
                <div
                  key={`grid-${x}-${y}`}
                  className="absolute border-b border-r border-gray-300 flex items-center justify-center text-xs text-gray-500"
                  style={{
                    left: x * GRID_SIZE,
                    top: y * GRID_SIZE,
                    width: GRID_SIZE,
                    height: GRID_SIZE,
                  }}
                >
                  {x},{y}
                </div>
              ))
            )}
            {tables.map((table, index) => {
              const tableSize = TABLE_SIZES[table.tableSizeId];
              const bounds = {
                left: 0,
                top: 0,
                right: GRID_COLUMNS * GRID_SIZE - tableSize.width,
                bottom: GRID_ROWS * GRID_SIZE - tableSize.height,
              };

              return (
                <Draggable
                  key={table.id}
                  position={{
                    x: table.position.x * GRID_SIZE,
                    y: table.position.y * GRID_SIZE,
                  }}
                  onStop={(e, data) => handleDrag(index, data)}
                  bounds={bounds}
                  grid={[GRID_SIZE, GRID_SIZE]}
                >
                  <div
                    className="absolute flex flex-col items-center justify-center bg-white border border-gray-400 rounded-lg shadow-md p-4 cursor-pointer hover:shadow-xl transition-shadow duration-300"
                    style={{
                      width: tableSize.width,
                      height: tableSize.height,
                    }}
                  >
                    <span className="text-sm block">{table.name}</span>
                    <span className="text-sm block">
                      Bàn {table.tableSizeId} người
                    </span>
                  </div>
                </Draggable>
              );
            })}
          </div>
          {/* Right side: List of tables */}
          <div className="w-1/3 shadow-lg px-2 py-1">
            <div className="">
              <h3 className="mb-4 text-red-800 font-bold uppercase">
                Danh sách bàn
              </h3>
              <ul className="space-y-2  max-h-[550px] overflow-y-auto">
                {tables.map((table) => (
                  <li
                    key={table.id}
                    className="bg-white p-4 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{table.name}</span>
                      <span className="text-gray-500">
                        {TABLE_SIZES[table.tableSizeId].width}x
                        {TABLE_SIZES[table.tableSizeId].height}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="flex justify-center mt-4">
                <Button
                  className="bg-red-800 text-white my-2 mx-auto"
                  onClick={async () => {
                    const response = await callApi(
                      `${TableApi.UPDATE_TABLE_COORDINATE}`,
                      "POST",
                      tables
                    );
                    if (response.isSuccess) {
                      message.success("Lưu thay đổi sơ đồ bàn thành công");
                    } else {
                      showError(error);
                    }
                  }}
                  loading={loading}
                >
                  Lưu thay đổi sơ đồ bàn
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DiningArea;
