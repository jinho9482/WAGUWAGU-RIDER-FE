import { api } from "../config/network";

export const saveDeliveryHistoryDetail = async (deliveryHistoryId, body) => {
  try {
    await api(
      `/api/v1/delivery-history-details/delivery-history/${deliveryHistoryId}`,
      "post",
      body
    );
  } catch (e) {
    console.error("Errors in saveDeliveryHistoryDetail", error);
  }
};

export const getHistoryDetailsByHistoryId = async (deliveryHistoryId) => {
  try {
    const res = await api(
      `/api/v1/delivery-history-details/delivery-history/${deliveryHistoryId}`,
      "get"
    );
    console.log(res.data, "from api, getHistoryDetailsByHistoryId");
    return res.data;
  } catch (e) {
    console.error("Errors in getHistoryDetailsByHistoryId", error);
  }
};

export const getHistorySummaryByHistoryId = async (deliveryHistoryId) => {
  try {
    const res = await api(
      `/api/v1/delivery-history-details/summary/delivery-history/${deliveryHistoryId}`,
      "get"
    );
    console.log(res.data, "from api, getHistorySummaryByHistoryId");
    return res.data;
  } catch (e) {
    console.error("Errors in getHistorySummaryByHistoryId", error);
  }
};
