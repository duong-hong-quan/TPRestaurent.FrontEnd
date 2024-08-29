import api from "./config/axios";
export const addToStoreCredit = async (data) => {
  try {
    const response = await api.post(
      `/store-credit/add-to-store-credit?trantransactionId=${data}`
    );
    return response.data;
  } catch (error) {}
};
