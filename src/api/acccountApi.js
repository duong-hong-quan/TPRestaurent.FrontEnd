import api from "./config/axios";

export const sendOtp = async (phoneNumber, otpType) => {
  try {
    const response = await api.post(
      `/api/account/send-otp?phoneNumber=${phoneNumber}&otp=${otpType}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
export const loginWithOtp = async (data) => {
  try {
    const response = await api.post(`/api/account/login`, data);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const verifyForReservation = async (phoneNumber, code) => {
  try {
    const response = await api.post(
      `/api/account/verify-for-reservation?phoneNumber=${phoneNumber}&code=${code}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const addNewCustomerInfo = async (data) => {
  try {
    const response = await api.post(`/api/account/add-new-customer-info`, data);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
export const verifyCustomerInfoOTP = async (phoneNumber, code, otpType) => {
  try {
    const response = await api.post(
      `/api/account/verify-customer-info-otp?phoneNumber=${phoneNumber}&otpType=${otpType}&code=${code}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
export const sendCustomerInfoOtp = async (phoneNumber, otpType) => {
  try {
    const response = await api.post(
      `/api/account/send-customer-info-otp?phoneNumber=${phoneNumber}&otpType=${otpType}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
