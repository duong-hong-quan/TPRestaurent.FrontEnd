import { formatDate } from "../../util/Utility";

const UserInfo = ({ userData, handleOpenUpdate }) => {
  return (
    <div className="bg-[#fff6e7] rounded-lg shadow-md p-4 max-w-7xl mx-auto my-10">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
        <div className="md:col-span-1"></div>
        <div className="ml-10 md:col-span-5 space-y-2">
          <h3 className="text-2xl font-bold text-gray-800 uppercase">
            {userData?.name || "N/A"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center space-x-2 text-red-700">
              <i className="fas fa-envelope"></i>
              <p>{userData?.email || "Chưa cung cấp"}</p>
            </div>
            <div className="flex items-center space-x-2 text-red-700">
              <i className="fas fa-map-marker-alt"></i>
              <p>{userData?.address || "Chưa cung cấp"}</p>
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
                  ? "Tài khoản đã xác thực"
                  : "Tài khoản chưa được xác thực"}
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              className="mt-4 bg-red-800 text-white font-bold py-2 px-4 rounded"
              onClick={handleOpenUpdate}
            >
              Cập nhật thông tin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
