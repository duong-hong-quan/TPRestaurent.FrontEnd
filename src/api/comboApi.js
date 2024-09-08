import api from "./config/axios";

export const getAllCombo = async (keyword, pageNumber, pageSize) => {
  try {
    const response = await api.get(
      `/combo/get-all-combo/${pageNumber}/${pageSize}?keyword=${keyword}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getComboById = async (id) => {
  try {
    const response = await api.get(`/combo/get-combo-by-id/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
