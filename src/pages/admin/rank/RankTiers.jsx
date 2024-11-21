import {
  Award as BronzeMedal,
  Star as SilverStar,
  Crown as GoldCrown,
  Gem as DiamondGem,
  Users as UserIcon,
} from "lucide-react";

const RankTiers = () => {
  const ranks = [
    {
      id: 1,
      name: "ĐỒNG",
      icon: <BronzeMedal className="w-12 h-12 text-[#CD7F32]" />,
      color: "bg-[#CD7F32]",
      textColor: "text-[#CD7F32]",
      description: "Hạng đồng đối với những người dùng có điểm từ 0 đến 99,999",
      minPoints: 0,
      maxPoints: 99999,
    },
    {
      id: 2,
      name: "BẠC",
      icon: <SilverStar className="w-12 h-12 text-[#C0C0C0]" />,
      color: "bg-[#C0C0C0]",
      textColor: "text-[#C0C0C0]",
      description:
        "Hạng bạc đối với những người dùng có điểm từ 100,000 đến 299,999",
      minPoints: 100000,
      maxPoints: 299999,
    },
    {
      id: 3,
      name: "VÀNG",
      icon: <GoldCrown className="w-12 h-12 text-[#FFD700]" />,
      color: "bg-[#FFD700]",
      textColor: "text-[#FFD700]",
      description:
        "Hạng vàng đối với những người dùng có điểm từ 300,000 đến 499,999",
      minPoints: 300000,
      maxPoints: 499999,
    },
    {
      id: 4,
      name: "KIM CƯƠNG",
      icon: <DiamondGem className="w-12 h-12 text-[#6ccde3]" />,
      color: "bg-[#54c1d9]",
      textColor: "text-[#6ccde3]",
      description:
        "Hạng kim cương đối với những người dùng có điểm từ 500,000 trở lên",
      minPoints: 500000,
      maxPoints: Infinity,
    },
  ];

  const handleRankSelect = (rank) => {
    setSelectedRank(rank);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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
              border-2 ${rank.color}/20 border-opacity-50 rounded-lg 
              p-6 text-center transform transition-all cursor-pointer
            `}
          >
            <div className="flex justify-center mb-4">{rank.icon}</div>
            <h3 className={`text-2xl font-bold mb-2 ${rank.textColor}`}>
              {rank.name}
            </h3>
            <p className="text-gray-600 mb-4">{rank.description}</p>
            <div className="flex items-center justify-center">
              <UserIcon className="w-5 h-5 mr-2 text-gray-600" />
              <span className="text-sm text-gray-700"></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankTiers;
