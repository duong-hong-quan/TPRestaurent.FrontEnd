import { useState } from "react";
import api from "./config/axios";

const useFormApi = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0], // Assuming single file upload
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const submitForm = async (endpoint, method) => {
    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      let result;
      switch (method) {
        case "GET":
          result = await api.get(endpoint);
          break;
        case "POST":
          result = await api.post(endpoint, data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          break;
        case "PUT":
          result = await api.put(endpoint, data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          break;
        case "DELETE":
          result = await api.delete(endpoint);
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

  return { formData, error, loading, handleInputChange, submitForm };
};

export default useFormApi;
