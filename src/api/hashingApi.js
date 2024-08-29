import api from "./config/axios";
export const decodeHashing = async (value, key) => {
  try {
    const response = await api.get(
      `/api/hashing/decode-hashing?value=${value}&key=${key}`
    );
    return response.data;
  } catch (error) {}
};
