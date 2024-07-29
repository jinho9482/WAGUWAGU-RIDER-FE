import axios from "axios";

// 주문 도메인의 redis 에 저장
export const updateOrderStateToRedis = async (orderId, orderState) => {
    const res = await axios.post(`http://192.168.0.20:8080/api/v1/order/request/${orderId}`
    , {data: orderState, headers : {Authorization: ""}});
    console.log(res);
    return res.data;
};

// 주문 도메인의 MongoDB에 저장
export const updateOrderStateToMongo = async (orderId, orderState) => {
    const res = await axios.post(`http://192.168.0.20:8080/api/v1/order/update/${orderId}`
    , {data: orderState, headers : {Authorization: ""}});
    console.log(res);
    return res.data;
};