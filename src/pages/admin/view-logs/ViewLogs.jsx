import { useEffect, useState } from "react";
import { LogsApi, TestApi } from "../../../api/endpoint";
import useCallApi from "../../../api/useCallApi";
import { formatDateTime } from "../../../util/Utility";
import { Button, message } from "antd";
import TabMananger from "../../../components/tab/TabManager";
import LoadingOverlay from "../../../components/loading/LoadingOverlay";

const ViewLogs = () => {
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  const { callApi, loading } = useCallApi();
  const handleTabChange = (value) => {
    setActiveTab(value);
    renderTab();
  };
  const renderTab = () => {
    if (activeTab === 0) {
      return (
        <iframe
          src="https://thienphurestaurant.ambitiouspebble-c5ac496e.southeastasia.azurecontainerapps.io/hangfire"
          className="w-full h-[1080px]"
        ></iframe>
      );
    } else {
      return (
        <div
          style={{
            border: "1px solid #e5e7eb",
          }}
          className="h-[850px] p-4 overflow-y-scroll bg-white text-blue-800  shadow-lg font-montserrat rounded-lg"
        >
          <h1 className="text-xl text-center uppercase  font-bold mb-4">
            System Logs
          </h1>
          {loading ? (
            <p className="animate-pulse">Loading...</p>
          ) : (
            <ul className="space-y-2">
              {logs.length > 0 &&
                logs?.map((log) => (
                  <li
                    key={log.id}
                    className="whitespace-pre-wrap border-b border-gray-700 pb-2"
                  >
                    <span className="text-black ">
                      [{formatDateTime(log.timestamp)}]
                    </span>
                    <br />
                    {log.message}
                  </li>
                ))}
            </ul>
          )}
        </div>
      );
    }
  };

  const fetchLogs = async () => {
    const response = await callApi(`${LogsApi.READ_LOG}`, "GET");
    setLogs(response);
  };
  const triggerLogNow = async () => {
    await callApi(`${TestApi.ADD_CHECK_HACKED}`, "POST");
    await fetchLogs();
    message.success("Truy xuất thành công");
  };
  useEffect(() => {
    if (activeTab == 1) {
      fetchLogs();
    }
  }, [activeTab]);

  return (
    <div className="py-4 px-2 mb-4 bg-white rounded-lg">
      <LoadingOverlay isLoading={loading} />
      <TabMananger
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        items={[
          { label: "Theo dõi các tiến trình ngầm", value: 0 },
          { label: "Truy xuất dấu hiệu bất thường", value: 1 },
        ]}
      />

      <div className="flex justify-end mb-4">
        <Button
          className="bg-red-800 text-white mr-2"
          onClick={async () => await fetchLogs()}
          loading={loading}
        >
          Tải lại log
        </Button>
        <Button
          className="bg-red-800 text-white"
          onClick={async () => await triggerLogNow()}
          loading={loading}
        >
          Truy xuất log
        </Button>
      </div>

      {renderTab()}
    </div>
  );
};

export default ViewLogs;
