// eslint-disable-next-line no-unused-vars
import { FieldTimeOutlined } from "@ant-design/icons";
import { size } from "lodash";
import React, { useEffect, useState } from "react";

const Header = () => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    // Hàm cập nhật thời gian
    const updateTime = () => {
      const vnTime = new Date().toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        hour12: false,
      });
      setCurrentTime(vnTime);
    };

    // Gọi hàm cập nhật mỗi giây
    const timer = setInterval(updateTime, 1000);

    // Dọn dẹp timer khi component unmount
    return () => clearInterval(timer);
  }, []);

  return (
    <div className=" items-center bg-[#9A0E1D] text-white py-8 px-20 ">
      <h1 className="text-3xl mt-2 font-bold">
        DANH SÁCH ĐƠN ĐẶT MÓN TẠI NHÀ HÀNG THIÊN PHÚ
      </h1>
      <div className="flex items-center justify-end">
        <FieldTimeOutlined color="white" style={{ fontSize: 50 }} />
        <p className="text-4xl font-semibold ml-4">{currentTime}</p>
      </div>
    </div>
  );
};

export default Header;
