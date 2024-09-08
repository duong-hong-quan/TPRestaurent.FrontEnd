import api from "./config/axios";

export const getAllDishes = async (type, keyword, pageNumber, pageSize) => {
  try {
    if (!type) {
      const response = await api.get(
        `/dish/get-all-dish/${pageNumber}/${pageSize}?keyword=${keyword}`
      );
      return response.data;
    }
    if (!keyword) {
      const response = await api.get(
        `/dish/get-all-dish/${pageNumber}/${pageSize}?type=${type}`
      );
      return response.data;
    }
    if (!type && !keyword) {
      const response = await api.get(
        `/dish/get-all-dish/${pageNumber}/${pageSize}`
      );
      return response.data;
    }
    const response = await api.get(
      `/dish/get-all-dish/${pageNumber}/${pageSize}?keyword=${keyword}&type=${type}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getDishById = async (id) => {
  try {
    const response = await api.get(`/dish/get-dish-by-id/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllDishTypes = async (pageNumber, pageSize) => {
  try {
    const response = await api.get(
      `/dish/get-all-dish-type/${pageNumber}/${pageSize}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
