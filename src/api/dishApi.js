import api from "./config/axios";

export const getAllDishes = async (keyword, pageNumber, pageSize) => {
  try {
    const response = await api.get(
      `/dish/get-all-dish/${pageNumber}/${pageSize}?keyword=${keyword}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
