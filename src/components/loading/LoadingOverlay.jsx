import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="text-center">
        <Spin
          indicator={
            <LoadingOutlined style={{ fontSize: 60, color: "#9B2C2C" }} spin />
          }
        />
        <div className="mt-4 text-red-800 text-xl font-semibold">
          Dữ liệu đang được tải...
        </div>
        <div className="mt-2 text-red-600">Xin vui lòng đợi trong giây lát</div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
