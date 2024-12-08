import { formatDate } from "../../util/Utility";
import avt from "../../assets/imgs/avt.jpg";
import {
  Award as BronzeMedal,
  Star as SilverStar,
  Crown as GoldCrown,
  Gem as DiamondGem,
  Users as UserIcon,
} from "lucide-react";
const UserInfo = ({ userData, handleOpenUpdate }) => {
  const currentAddress = userData?.addresses?.filter(
    (address) => address.isCurrentUsed
  )[0];
    const ranks = [
      {
        userRankId: 1,
        name: "ĐỒNG",
        icon: <BronzeMedal className="w-6 h-6" />,
        color: "border-[#CD7F32]",
        textColor: "text-[#CD7F32]",
      },
      {
        userRankId: 2,
        name: "BẠC",
        icon: <SilverStar className="w-6 h-6" />,
        color: "border-[#C0C0C0]",
        textColor: "text-[#C0C0C0]",

      },
      {
        userRankId: 3,
        name: "VÀNG",
        icon: <GoldCrown className="w-6 h-6" />,
        color: "border-[#FFD700]",
        textColor: "text-[#FFD700]",

      },
      {
        userRankId: 4,
        name: "KIM CƯƠNG",
        icon: <DiamondGem className="w-6 h-6" />,
        color: "border-[#6ccde3]",
        textColor: "text-[#6ccde3]",
      },
    ];
  const customerInfoAddressName = currentAddress?.customerInfoAddressName || "";
  const rank = ranks.find((rank) => rank.id === userData?.userRankId);
  console.log(rank)
  return (
    <div className="bg-[#fff6e7] rounded-lg shadow-md p-4 max-w-7xl mx-auto my-10">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
        <div className="md:col-span-1 ">
          <img
            src={userData.avatar || avt}
            alt=""
            className="rounded-full object-cover bg-white p-4 w-32 h-32"
          />
        </div>
        <div className="ml-10 md:col-span-5 space-y-2">
          <h3 className="text-2xl font-bold text-gray-800 uppercase">
            {`${userData?.firstName} ${userData.lastName}` || "N/A"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center space-x-2 text-red-700">
              <i className="fas fa-envelope"></i>
              <p>{userData?.email || "Chưa cung cấp"}</p>
            </div>
            <div className="flex items-center space-x-2 text-red-700">
              <i className="fas fa-map-marker-alt"></i>
              <p>{customerInfoAddressName || "Chưa cung cấp"}</p>
            </div>
            <div className="flex items-center space-x-2 text-red-700">
              <i className="fas fa-phone"></i>
              <p>
                {userData?.phoneNumber
                  ? `+84 ${userData.phoneNumber}`
                  : "Chưa cung cấp"}
              </p>
            </div>
            <div className="flex items-center space-x-2 text-red-700">
              <i className="fas fa-calendar"></i>
              <p>
                {userData?.dob ? formatDate(userData.dob) : "Chưa cung cấp"}
              </p>
            </div>
            <div className="flex items-center space-x-2 text-red-700">
              <i
                className={`fas fa-check-circle ${
                  userData?.isVerified ? "text-green-700" : "text-gray-400"
                } `}
              ></i>
              <p
                className={` ${
                  userData?.isVerified ? "text-green-700" : "text-gray-700"
                } `}
              >
                {userData?.isVerified
                  ? "Tài khoản đã xác thực qua số điện thoại"
                  : "Tài khoản chưa được xác thực"}
              </p>
            </div>
            <div className="flex items-center space-x-2 ">
              <span className="text-red-700 font-semibold">Hạng: </span>
              <div
                className={`
              border-2 border-opacity-50 rounded-lg 
              text-center transform transition-all cursor-pointer flex items-center
            `}
              >
                <h3 className={`text-xl font-bold  ${rank?.textColor}`}>
                  {rank?.name}
                </h3>
                <div className={`flex justify-center  ${rank?.textColor}`}>
                  {rank?.icon}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
