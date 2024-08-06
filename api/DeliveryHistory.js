import { api } from "../config/network";

export const getDeliveryHistoriesByRiderId = async (riderId) => {
  try {
    const res = await api(`/api/v1/delivery-histories/rider/${riderId}`, "get");
    console.log(res.data, "from api, getDeliveryHistoriesByRiderId");
    return res.data;
  } catch (e) {
    console.error("Errors in getDeliveryHistoriesByRiderId", error);
  }
};
