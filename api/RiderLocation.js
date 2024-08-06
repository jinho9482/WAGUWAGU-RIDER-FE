import { api } from "../config/network";

export const saveRiderLocation = async (body) => {
  try {
    await api("/api/v1/rider-locations", "post", body);
  } catch (e) {
    console.error("Errors in saveRiderLocation", error);
  }
};

export const deleteRiderLocation = async (orderId) => {
  try {
    await api(`/api/v1/rider-locations/${orderId}`, "get");
  } catch (e) {
    console.error("Errors in deleteRiderLocation", error);
  }
};
