import api from "./config/axios";
export const getAllConfig = async (pageNumber, pageSize) => {
  try {
    const response = await api.get(
      `/configuration/get-all-config/${pageNumber}/${pageSize}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
