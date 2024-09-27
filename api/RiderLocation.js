import { api } from "../config/network";

export const saveRiderLocation = async (body) => {
  try {
    await api("/api/v1/riders/rider-locations", "post", body);
  } catch (e) {
    console.error("Errors in saveRiderLocation", e);
  }
};

export const deleteRiderLocation = async (orderId) => {
  console.log(orderId, "id for deleteRiderLocation");
  try {
    await api(`/api/v1/riders/rider-locations/${orderId}`, "delete");
  } catch (e) {
    console.error("Errors in deleteRiderLocation", e);
  }
};
