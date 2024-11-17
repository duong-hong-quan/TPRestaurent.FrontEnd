import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import useCallApi from "../../../api/useCallApi";
import { TableApi } from "../../../api/endpoint";
import LoadingOverlay from "../../../components/loading/LoadingOverlay";
import { Alert, Button, message, Modal } from "antd";
import { showError } from "../../../util/Utility";

const TABLE_SIZES = {
  2: { width: 70, height: 70 }, // 1 cell with padding
  4: { width: 150, height: 70 }, // 2 cells with padding
  8: { width: 150, height: 150 }, // 4 cells with padding
  6: { width: 230, height: 70 }, // Custom size for 6 tableSizeId with padding
  10: { width: 310, height: 150 }, // Custom size for 10 tableSizeId with padding
};
const getContrastingTextColor = (hexColor) => {
  // Convert the hex color to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calculate the perceived brightness of the color
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Determine the text color based on the brightness
  return brightness > 128 ? "black" : "white";
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
  const { callApi, loading, error } = useCallApi();
  const fetchData = async () => {
    const response = await callApi(`${TableApi.GET_ALL}/1/100`, "GET");
    if (response.isSuccess) {
      setTables(response.result.items);
    }
  };
  useEffect(() => {
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
  const isWarning = tables?.some((table) => table.tableStatusId === 0);
  return (
    <>
      <LoadingOverlay isLoading={loading} />
      <div className="bg-white rounded-lg shadow-lg container min-h-screen mx-auto p-8">
        <h3 className="text-red-800 uppercase font-bold mb-6">
          Khu vực bàn ăn
        </h3>
        <div className="flex flex-col justify-end items-end ">
          <div
            style={{
              border: "1px solid #ccc",
            }}
            className="p-4 rounded-lg"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  marginRight: "10px",
                }}
                className="bg-yellow-200"
              ></div>
              <span>Mới tạo</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  marginRight: "10px",
                }}
                className="bg-green-500"
              ></div>
              <span>Bàn đang trống</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  marginRight: "10px",
                }}
                className="bg-red-500"
              ></div>
              <span>Đang sử dụng</span>
            </div>
          </div>
        </div>
        {isWarning && (
          <Alert
            message="Cảnh báo"
            description="Có ít nhất một bàn ăn chưa được sắp xếp hoặc chưa được gán vị trí trên sơ đồ. Vui lòng kiểm tra lại."
            type="warning"
            showIcon
            className="my-4"
          />
        )}
        <div className="grid grid-cols-1 xl:grid-cols-3 xl:gap-8">
          {/* Left side: Drag location with grid */}
          <div
            className="col-span-1 xl:col-span-2 relative border-r-2 overflow-scroll min-h-[650px]  border-gray-300 p-6 rounded-lg"
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
                    className={`absolute flex flex-col items-center justify-center border border-gray-400 rounded-lg shadow-md p-4 cursor-pointer hover:shadow-xl transition-shadow duration-300 ${
                      table.tableStatusId === 0
                        ? "bg-yellow-200 "
                        : table.tableStatusId === 1
                        ? "bg-green-500"
                        : "bg-red-300 "
                    } text-${getContrastingTextColor(
                      table.tableStatusId === 0
                        ? "#fde68a" // Yellow-200
                        : table.tableStatusId === 1
                        ? "#16a34a" // Green-500
                        : "#f87171" // Red-300
                    )}`}
                    style={{
                      width: tableSize.width,
                      height: tableSize.height,
                    }}
                  >
                    <span className="text-sm block text-nowrap">
                      {table.name}
                    </span>
                    <span className="text-xs block">
                      Bàn {table.tableSizeId} người
                    </span>
                  </div>
                </Draggable>
              );
            })}
          </div>
          {/* Right side: List of tables */}
          <div className="col-span-1 shadow-lg px-2 py-1">
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
                    </div>
                  </li>
                ))}
              </ul>

              <div className="flex justify-center mt-4">
                <Button
                  className="bg-red-800 text-white my-2 mx-auto"
                  onClick={async () => {
                    Modal.confirm({
                      title: "Xác nhận",
                      content:
                        "Bạn có chắc chắn muốn lưu thay đổi sơ đồ bàn? Nếu có, bạn sẽ chịu toàn bộ trách nhiệm cho những hậu quả từ thay đổi này gây ra !",
                      onOk: async () => {
                        const response = await callApi(
                          `${TableApi.UPDATE_TABLE_COORDINATE}?isForce=false`,
                          "POST",
                          tables
                        );
                        if (response.isSuccess) {
                          message.success("Lưu thay đổi sơ đồ bàn thành công");
                        } else {
                          Modal.confirm({
                            title: "Xác nhận",
                            content: response.messages.join("\n"),
                            onOk: async () => {
                              const response = await callApi(
                                `${TableApi.UPDATE_TABLE_COORDINATE}?isForce=true`,
                                "POST",
                                tables
                              );
                              if (response.isSuccess) {
                                message.success(
                                  "Lưu thay đổi sơ đồ bàn thành công"
                                );
                              } else {
                                showError(response.messages);
                              }
                            },
                            onCancel: async () => {
                              await fetchData();
                            },
                          });
                        }
                      },
                      onCancel: async () => {
                        message.info("Hủy lưu thay đổi sơ đồ bàn");
                        await fetchData();
                      },
                    });
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
