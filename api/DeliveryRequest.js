import { api } from "../config/network";

export const getDeliveryRequests = async (id, riderAssignRequest) => {
  const res = await api(`/api/v1/delivery-requests/riders/${id}/assign`, "post", riderAssignRequest);
  console.log(res.data);
  return res.data;
};

export const deleteDeliveryRequest = async (id) => {
  const res = await api(`/api/v1/delivery-requests/${id}`, "post");
  console.log(res.data);
  return res.data;
};