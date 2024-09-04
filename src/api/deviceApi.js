import api from "./config/axios";

export const getAllDevices = async (pageNumber, pageSize) => {
  try {
    const response = await api.get(
      `/device/get-all-device?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
