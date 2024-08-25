import api from "./config/axios";

export const createOrder = async (data) => {
  try {
    const response = await api.post(`/order/create-order`, data);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllOrderByPhoneNumber = async (
  phoneNumber,
  pageNumber,
  pageSize
) => {
  try {
    const response = await api.get(
      `/order/get-all-order-by-phone-number/${pageNumber}/${pageSize}?phoneNumber=${phoneNumber}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
export const getOrderDetailById = async (id) => {
  try {
    const response = await api.get(`/order/get-order-detail/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
