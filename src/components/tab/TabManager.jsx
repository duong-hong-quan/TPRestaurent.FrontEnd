import React from "react";

function TabMananger({ items, activeTab, setActiveTab }) {
  return (
    <div className="flex border-b border-gray-200">
      {items?.map((tab) => (
        <button
          key={tab.value}
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${
            activeTab === tab.value
              ? "border-b-2 border-red-700 text-red-700"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default TabMananger;
