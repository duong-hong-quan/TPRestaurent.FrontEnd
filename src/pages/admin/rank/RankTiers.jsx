import React from "react";
import {
  Award as BronzeMedal,
  Star as SilverStar,
  Crown as GoldCrown,
  Gem as DiamondGem,
  Users as UserIcon,
} from "lucide-react";
import { formatPrice } from "../../../util/Utility";

const RankTiers = ({ rankData, handleViewRankDetail }) => {
  const ranks = [
    {
      userRankId: 1,
      name: "ĐỒNG",
      icon: <BronzeMedal className="w-12 h-12" />,
      color: "border-[#CD7F32]",
      textColor: "text-[#CD7F32]",
      stats: rankData?.find((r) => r.userRank === 1),
    },
    {
      userRankId: 2,
      name: "BẠC",
      icon: <SilverStar className="w-12 h-12" />,
      color: "border-[#C0C0C0]",
      textColor: "text-[#C0C0C0]",

      stats: rankData.find((r) => r.userRank === 2),
    },
    {
      userRankId: 3,
      name: "VÀNG",
      icon: <GoldCrown className="w-12 h-12" />,
      color: "border-[#FFD700]",
      textColor: "text-[#FFD700]",

      stats: rankData.find((r) => r.userRank === 3),
    },
    {
      userRankId: 4,
      name: "KIM CƯƠNG",
      icon: <DiamondGem className="w-12 h-12" />,
      color: "border-[#6ccde3]",
      textColor: "text-[#6ccde3]",
      stats: rankData.find((r) => r.userRank === 4),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center text-red-800 mb-8">
        XẾP HẠNG
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ranks.map((rank) => (
          <div
            key={rank.id}
            className={`
              border-2 ${rank.color} rounded-lg 
              p-6 text-center transform hover:scale-105 
              transition-all duration-200 cursor-pointer
              hover:shadow-lg
            `}
            onClick={() => handleViewRankDetail(rank)}
          >
            <div className={`flex justify-center mb-4 ${rank.textColor}`}>
              {rank.icon}
            </div>
            <h3 className={`text-2xl font-bold mb-2 ${rank.textColor}`}>
              {rank.name}
            </h3>
            <p className="text-gray-600 text-sm mb-4">{rank.description}</p>
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <UserIcon className="w-5 h-5 mr-2 text-gray-600" />
                <span className="text-sm text-gray-700">
                  {rank.stats?.total || 0} thành viên
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Chi tiêu tối thiểu: {formatPrice(rank.stats?.minimumSpent)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankTiers;
