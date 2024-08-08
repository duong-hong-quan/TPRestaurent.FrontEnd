import api from "./config/axios";
export const getAllReservations = async (time, pageNumber, pageSize) => {
  try {
    const response = await api.get(
      `/reservation/get-all-reservation?time=${time}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (error) {}
};
