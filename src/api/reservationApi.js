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
export const getAllReservationByPhoneNumber = async (
  phoneNumber,
  status,
  pageNumber,
  pageSize
) => {
  try {
    const response = await api.get(
      `/reservation/get-all-reservation-by-phone-number/${pageNumber}/${pageSize}?phoneNumber=${phoneNumber}&status=${status}`
    );
    return response.data;
  } catch (error) {}
};

export const getReservationById = async (id) => {
  try {
    const response = await api.get(`/reservation/get-reservation-detail/${id}`);
    return response.data;
  } catch (error) {}
};
