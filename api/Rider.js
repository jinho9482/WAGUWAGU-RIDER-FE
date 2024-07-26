import { api } from "../config/network";

export const changeActivationState = async (id, data) => {
  await api(`/api/v1/riders/${id}/activation`, "put", {onOff: data});
};