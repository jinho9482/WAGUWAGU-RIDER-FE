import { api } from "../config/network";

export const updateOrderState = async (id, orderState) => {
  const res = await api(`/api/v1/order/request/${id}`, "post", {state: orderState});
  console.log(res.data);
  return res.data;
};