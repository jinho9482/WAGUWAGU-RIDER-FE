import { Alert } from "react-native";
import { api } from "../config/network";

export const getDeliveryRequests = async (riderId, riderAssignRequest) => {
  try {
    const res = await api(
      `/api/v1/delivery-requests/riders/${riderId}/assign`,
      "post",
      riderAssignRequest
    );
    console.log(res.data, "from api, getDeliveryRequests");
    return res.data;
  } catch (e) {
    Alert.alert("Error", "주문 정보를 가져오는 중 에러가 발생했습니다");
  }
};

export const moveDeliveryRequestToPostgres = async (id, riderId) => {
  try {
    console.log(riderId);
    await api(`/api/v1/delivery-requests/${id}/rider/${riderId}`, "post");
  } catch (e) {
    console.error("Errors in moveDeliveryRequestToPostgres", error);
  }
};

export const deleteDeliveryRequest = async (id) => {
  try {
    await api(`/api/v1/delivery-requests/${id}`, "delete");
  } catch (e) {
    console.error("Errors in deleteDeliveryRequest", error);
  }
};
