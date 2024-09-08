import api from "./config/axios";

export const getAllAvailibleCoupon = async (pageNumber, pageSize) => {
  try {
    const response = await api.get(
      `/coupon/get-available-coupon/${pageNumber}/${pageSize}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
