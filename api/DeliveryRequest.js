import { Alert } from "react-native";
import { api } from "../config/network";

export const getDeliveryRequests = async (riderId, riderAssignRequest) => {
  try {
    const res = await api(
      `/api/v1/riders/delivery-requests/riders/${riderId}/assign`,
      "post",
      riderAssignRequest
    );
    console.log(res.data, "from api, getDeliveryRequests");
    return res.data;
  } catch (e) {
    Alert.alert("Error", "주문 정보를 가져오는 중 에러가 발생했습니다");
  }
};

export const deleteDeliveryRequest = async (id) => {
  console.log(id, "id for deleteDeliveryRequest");
  try {
    await api(`/api/v1/riders/delivery-requests/${id}`, "delete");
  } catch (e) {
    console.error("Errors in deleteDeliveryRequest", e);
  }
};

export const updateRiderAssigned = async (id) => {
  try {
    await api(`/api/v1/riders/delivery-requests/${id}`, "put");
  } catch (e) {
    console.error("Errors in updateRiderAssignedAsTrue", e);
  }
};
