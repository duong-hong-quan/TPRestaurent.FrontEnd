import api from "./config/axios";
export const getAllReservations = async (
  time,
  pageNumber,
  pageSize,
  status
) => {
  try {
    const response = await api.get(
      `/reservation/get-all-reservation/${pageNumber}/${pageSize}?time=${time}&status=${status}`
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
export const suggestTable = async (data) => {
  try {
    const response = await api.post(`/reservation/suggest-table`, data);
    return response.data;
  } catch (error) {}
};

export const addTableToReservation = async (reservationId, data) => {
  try {
    const response = await api.post(
      `/reservation/add-table-to-reservation?reservationId=${reservationId}`,
      data
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateReservationStatus = async (reservationId, status) => {
  try {
    const response = await api.put(
      `/reservation/update-reservation-status/${reservationId}/${status}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
