import { useState } from "react";
import api from "./config/axios";

const useCallApi = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const callApi = async (endpoint, method, data) => {
    setLoading(true);
    try {
      let result;
      switch (method) {
        case "GET":
          result = await api.get(endpoint);
          break;
        case "POST":
          result = await api.post(endpoint, data);
          break;
        case "PUT":
          result = await api.put(endpoint, data);
          break;
        case "DELETE":
          result = await api.delete(endpoint);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      if (result.data.isSuccess === false) {
        result.data.message.forEach((m) => {
          setError((prev) => [...(prev || []), m]);
        });
      }
      return result.data;
    } catch (err) {
      if (err instanceof Error) {
        setError([err.message]);
      } else {
        setError(["Call API failed"]);
      }
    } finally {
      setLoading(false);
    }
    return {
      data: null,
      message: ["Call API failed"],
      isSuccess: false,
    };
  };

  return { error, loading, callApi };
};

export default useCallApi;
