import api from "./config/axios";

export const login = async (phoneNumber) => {
  try {
    const response = await api.post(
      `/api/account/send-otp?phoneNumber=${phoneNumber}&otp=0`
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
