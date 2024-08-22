import api from "../api/config/axios";
export const getCurrentTableSession = async () => {
  try {
    const response = await api.get(`/table-session/get-current-table-session`);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
export const getTableSessionById = async (id) => {
  try {
    const response = await api.get(
      `/table-session/get-table-session-by-id/${id}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const updatePrelistOrderStatus = async (data) => {
  try {
    const response = await api.post(
      `/table-session/update-prelist-order-status`,
      data
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
