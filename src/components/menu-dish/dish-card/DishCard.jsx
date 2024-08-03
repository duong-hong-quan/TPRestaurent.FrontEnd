import React from "react";
import { StarFilled } from "@ant-design/icons";

export const DishCard = () => {
  return (
    <div className=" mt-16">
      <div className="relative pt-20 pb-4 px-4 bg-white rounded-lg shadow-2xl my-4 mx-2 text-center">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img
            src="https://s3-alpha-sig.figma.com/img/62f9/82bc/377a67314fcee620f0c8791bf2c0b7f2?Expires=1723420800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=DfbUwQo1s9YMArTXLgR9LxPMiEAHWlOLc5KWg2Ktoqtvg8Q8LGJECW6lj~GSwNKHKRhDBjRfyTxcHeaBjKLIkomAY17MXuGlzH4nB1QO6YBlFTuNQDvEiqe1qtjBDY6HSkcmP2KkxiSYrGRq-LQoMIBt5T5i1IxyCQCgjeKGJHT~-MzNdB25H-LHwbxW4JcMRDzes4EGou0LeSN~fgz1oufcDXduzZg4dzbYDqyVH1ABCDdnDmucPgYrZCrXPun~ff7zfI3RtHtPG23VZXhMwXm~pZsJCgve1gqbMV3p5ZlIcWkS9c9P1JX0R~RMLt4FsVj0D66VEtQv3LFZoJ7~yg__"
            alt="Chân gà lợn sửa sốt lủ mỳ"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
        </div>
        <div className="mt-4">
          <h3 className="font-bold text-red-600 text-lg mb-2">
            Chân gà lợn sửa sốt lủ mỳ
          </h3>
          <div className="flex justify-center items-center mb-2">
            <StarFilled className="text-yellow-400 mr-1" />
            <span className="text-gray-700">4.8 (1.2k)</span>
          </div>
          <p className="text-red-600 font-bold text-xl">78.000đ</p>
        </div>
      </div>
    </div>
  );
};

export default DishCard;
