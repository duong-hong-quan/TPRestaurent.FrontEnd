import api from "./config/axios";
export const createPayment = async (data) => {
  try {
    const response = await api.post(`/transaction/create-payment`, data);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
export const getAllTransactions = async (
  pageNumber,
  pageSize,
  transactionStatus
) => {
  try {
    if (transactionStatus === "") {
      const response = await api.get(
        `/transaction/get-all-payment/${pageNumber}/${pageSize}`
      );
      return response.data;
    }
    const response = await api.get(
      `/transaction/get-all-payment/${pageNumber}/${pageSize}?transationStatus=${transactionStatus}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
export const updateTransactionStatus = async (
  transactionId,
  transactionStatus
) => {
  try {
    const response = await api.put(
      `update-transaction-status/${transactionId}/${transactionStatus}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
