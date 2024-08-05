import { useState } from "react";
import ReservationList from "../../../components/reservation/reservation-list/ReservationList";

const PersonalReservation = () => {
  const tabs = [
    { id: "all", label: "Tất cả" },
    { id: "pending", label: "Chờ xác nhận" },
    { id: "confirmed", label: "Đã xác nhận" },
    { id: "completed", label: "Đã hoàn thành" },
    { id: "canceled", label: "Đã hủy" },
  ];

  const [activeTab, setActiveTab] = useState("all");

  // Mock reservations data (replace with actual data fetching logic)
  const reservations = [
    {
      id: "1",
      status: "pending",
      date: "10/08/2024",
      time: "19:00",
      partySize: 4,
      restaurantName: "Nhà hàng A",
    },
    {
      id: "2",
      status: "confirmed",
      date: "15/08/2024",
      time: "20:30",
      partySize: 2,
      restaurantName: "Nhà hàng B",
    },
    // Add more reservations...
  ];

  const filteredReservations = reservations.filter((reservation) => {
    if (activeTab === "all") return true;
    return reservation.status === activeTab;
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case "all":
      case "pending":
      case "confirmed":
      case "completed":
      case "canceled":
        return <ReservationList reservations={filteredReservations} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h1 className="uppercase text-red-700 font-bold text-2xl mb-6">
        Đặt bàn của tôi
      </h1>

      <div className="mb-4">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                activeTab === tab.id
                  ? "border-b-2 border-red-700 text-red-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">{renderTabContent()}</div>
    </div>
  );
};

export default PersonalReservation;
