import { useEffect, useState } from "react";
import { LogsApi } from "../../../api/endpoint";
import useCallApi from "../../../api/useCallApi";
import { formatDateTime } from "../../../util/Utility";

const ViewLogs = () => {
  const [logs, setLogs] = useState([]);
  const { callApi, loading } = useCallApi();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await callApi(`${LogsApi.READ_LOG}`, "GET");
        setLogs(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-4 rounded-lg">
      <h1 className="text-xl font-bold mb-4">System Logs</h1>
      {loading ? (
        <p className="animate-pulse">Loading...</p>
      ) : (
        <ul className="space-y-2">
          {logs?.map((log) => (
            <li
              key={log.id}
              className="whitespace-pre-wrap border-b border-gray-700 pb-2"
            >
              <span className="text-gray-400">
                [{formatDateTime(log.timestamp)}]
              </span>{" "}
              {log.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewLogs;
