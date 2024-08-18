import api from "./config/axios";
export const getAllReservations = async (time, pageNumber, pageSize) => {
  try {
    const response = await api.get(
      `/reservation/get-all-reservation?time=${time}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (error) {}
};

export const calculateDeposit = async (data) => {
  try {
    const response = await api.post(`/reservation/calculate-deposit`, data);
    return response.data;
  } catch (error) {}
};

export const createReservation = async (data) => {
  try {
    const response = await api.post(`/reservation/create-reservation`, data);
    return response.data;
  } catch (error) {}
};
