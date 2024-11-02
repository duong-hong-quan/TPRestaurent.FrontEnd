import { useState } from "react";
import api from "./config/axios";

const useCallApi = () => {
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);

  const callApi = async (endpoint, method, data, config = {}) => {
    setLoading(true);
    try {
      let result;
      switch (method) {
        case "GET":
          result = await api.get(endpoint, config);
          break;
        case "POST":
          result = await api.post(endpoint, data, config);
          break;
        case "PUT":
          result = await api.put(endpoint, data, config);
          break;
        case "DELETE":
          result = await api.delete(endpoint, config);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      if (result.data.isSuccess === false) {
        setError(result.data.messages);
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

  const callMultipleApis = async (apiCalls) => {
    setLoading(true);
    setError([]);
    try {
      const responses = await Promise.all(
        apiCalls.map(({ endpoint, method, data, config }) =>
          callApi(endpoint, method, data, config)
        )
      );
      return responses;
    } catch (err) {
      setError((prevErrors) => [
        ...prevErrors,
        err.message || "Call API failed",
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { error, loading, callApi, callMultipleApis };
};

export default useCallApi;
