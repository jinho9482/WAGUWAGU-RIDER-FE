import { api } from "../config/network";

export const createDeliveryHistoryDetail = async (deliveryHistoryId, body) => {
  try {
    await api(
      `/api/v1/delivery-history-details/delivery-history/${deliveryHistoryId}`,
      "post",
      body
    );
  } catch (e) {
    console.error("Errors in createDeliveryHistoryDetail", e);
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
    console.error("Errors in getHistoryDetailsByHistoryId", e);
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
    console.error("Errors in getHistorySummaryByHistoryId", e);
  }
};
