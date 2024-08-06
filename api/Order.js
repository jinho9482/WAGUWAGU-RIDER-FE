import axios from "axios";

// 주문 도메인의 redis 에 저장
export const updateOrderStateToRedis = async (orderId, updateRequest) => {
  try {
    const res = await axios.post(
      `http://35.223.83.225/api/v1/order/request/${orderId}`,
      updateRequest,
      { headers: { Authorization: "" } }
    );
    console.log(res, "from api, updateOrderStateToRedis");
    return res.data;
  } catch (e) {
    console.error("Errors in updateOrderStateToRedis", error);
  }
};
