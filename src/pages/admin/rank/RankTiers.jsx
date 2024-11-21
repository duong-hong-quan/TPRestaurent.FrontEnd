import React, { useState, useEffect } from "react";
import {
  Award as BronzeMedal,
  Star as SilverStar,
  Crown as GoldCrown,
  Gem as DiamondGem,
  X as CloseIcon,
  Users as UserIcon,
} from "lucide-react";

const RankTiers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRank, setSelectedRank] = useState(null);
  const [userData, setUserData] = useState([]);

  // Sample user data from the provided JSON
  const jsonData = {
    result: {
      items: [
        {
          firstName: "Quân",
          lastName: "Dương",
          loyaltyPoint: 36395,
          userRankId: 4,
        },
        {
          firstName: "Quan",
          lastName: "Duong",
          loyaltyPoint: 466049,
          userRankId: 4,
        },
        // ... other user data can be added here
      ],
    },
  };

  const ranks = [
    {
      id: 1,
      name: "BRONZE",
      icon: <BronzeMedal className="w-12 h-12 text-[#CD7F32]" />,
      color: "bg-[#CD7F32]",
      textColor: "text-[#CD7F32]",
      description: "Hạng đồng đối với những người dùng có điểm từ 0 đến 99,999",
      minPoints: 0,
      maxPoints: 99999,
    },
    {
      id: 2,
      name: "SILVER",
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
      name: "GOLD",
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
      name: "DIAMOND",
      icon: <DiamondGem className="w-12 h-12 text-[#6ccde3]" />,
      color: "bg-[#54c1d9]",
      textColor: "text-[#6ccde3]",
      description:
        "Hạng kim cương đối với những người dùng có điểm từ 500,000 trở lên",
      minPoints: 500000,
      maxPoints: Infinity,
    },
  ];

  useEffect(() => {
    // Process user data to group users by rank
    const processedUserData = ranks.map((rank) => ({
      ...rank,
      users: jsonData.result.items.filter(
        (user) => user.userRankId === rank.id
      ),
    }));
    setUserData(processedUserData);
  }, []);

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
        {userData.map((rank) => (
          <div
            key={rank.id}
            onClick={() => handleRankSelect(rank)}
            className={`
              border-2 ${rank.color}/20 border-opacity-50 rounded-lg 
              p-6 text-center transform transition-all cursor-pointer
              hover:scale-105 hover:shadow-xl
              ${
                selectedRank?.id === rank.id
                  ? `${rank.color}/50 border-opacity-100 scale-105 shadow-xl`
                  : ""
              }
            `}
          >
            <div className="flex justify-center mb-4">{rank.icon}</div>
            <h3 className={`text-2xl font-bold mb-2 ${rank.textColor}`}>
              {rank.name}
            </h3>
            <p className="text-gray-600 mb-4">{rank.description}</p>
            <div className="flex items-center justify-center">
              <UserIcon className="w-5 h-5 mr-2 text-gray-600" />
              <span className="text-sm text-gray-700">
                {rank.users.length} Users
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && selectedRank && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`
            relative bg-white rounded-lg p-8 max-w-md w-full 
            border-4 ${selectedRank.color}/30
          `}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            >
              <CloseIcon className="w-6 h-6" />
            </button>

            <div className="flex justify-center mb-4">{selectedRank.icon}</div>
            <h3
              className={`text-3xl font-bold text-center mb-4 ${selectedRank.textColor}`}
            >
              {selectedRank.name}
            </h3>
            <p className="text-gray-700 text-center mb-6">
              {selectedRank.description}
            </p>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-800 text-center mb-4">
                Người dùng trong hạng:
              </h4>
              {selectedRank.users.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {selectedRank.users.map((user) => (
                    <div
                      key={user.id}
                      className="bg-gray-100 p-2 rounded text-center"
                    >
                      {user.firstName} {user.lastName}
                      <div className="text-sm text-gray-600">
                        {user.loyaltyPoint.toLocaleString()} điểm
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">
                  No users in this rank
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={closeModal}
                className={`
                  px-6 py-2 rounded-lg text-white font-bold
                  ${selectedRank.color} hover:${selectedRank.color}/80
                  transition-colors duration-300
                `}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RankTiers;
