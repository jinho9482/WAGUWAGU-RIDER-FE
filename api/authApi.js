import {api} from "../config/AuthNetwork";

export const getInfo = async (data) => {
  const res = await api("/api/v1/riders", "get",data);
  return res;
};
export const updateInfo = async (data) => {
  const res = await api("/api/v1/riders", "put",data);
  return res;
};
export const saveActivityArea = async (data) => {
  const res = await api("/api/v1/riders?activityArea="+data.riderActivityArea, "post");
  return res;
};

export const deleteActivityArea = async (data) => {
  const res = await api("/api/v1/riders", "delete",data);
  return res;
};