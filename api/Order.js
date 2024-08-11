import axios from "axios";

// 주문 도메인의 redis 에 저장
export const updateOrderStateToRedis = async (orderId, updateRequest) => {
  try {
    await axios.post(
      `http://35.223.83.225/api/v1/order/request/${orderId}`,
      updateRequest
      // { headers: { Authorization: "" } }
    );
  } catch (e) {
    console.error("Error in updateOrderStateToRedis", e);
  }
};
