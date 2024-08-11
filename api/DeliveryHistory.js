import { api } from "../config/network";

export const getDeliveryHistoriesByRiderId = async (riderId) => {
  try {
    const res = await api(`/api/v1/delivery-histories/rider/${riderId}`, "get");
    console.log(res.data, "from api, getDeliveryHistoriesByRiderId");
    return res.data;
  } catch (e) {
    console.error("Errors in getDeliveryHistoriesByRiderId", e);
  }
};

export const createDeliveryHistory = async (riderId) => {
  try {
    const res = await api(
      `/api/v1/delivery-histories/rider/${riderId}`,
      "post"
    );
    console.log(res.data, "from api, createDeliveryHistory");
    return res.data;
  } catch (e) {
    console.error("Errors in createDeliveryHistory", e);
  }
};
