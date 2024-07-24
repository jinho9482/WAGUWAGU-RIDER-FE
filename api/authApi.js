import {api} from "../config/AuthNetwork";

export const getInfo = async (data) => {
  const res = await api("/riders", "get",data);
  return res;
};
export const updateInfo = async (data) => {
  const res = await api("/riders", "put",data);
  return res;
};