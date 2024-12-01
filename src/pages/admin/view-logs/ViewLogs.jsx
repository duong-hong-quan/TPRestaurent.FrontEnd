import { useEffect, useState } from "react";
import { LogsApi } from "../../../api/endpoint";
import useCallApi from "../../../api/useCallApi";
import { formatDateTime } from "../../../util/Utility";

const Viewlogs = () => {
  const [logs, setLogs] = useState([]);
  const { callApi, error, loading } = useCallApi();
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await callApi(`${LogsApi.READ_LOG}`, "GET");
        setLogs(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="p-4">
      <h1>Logs</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {logs?.map((log) => (
            <li key={log.id}>
              {log.message} {formatDateTime(log.timestamp)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default Viewlogs;
