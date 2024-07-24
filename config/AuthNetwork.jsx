import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const api = async (url, method, body) => {
    axios.defaults.baseURL = "http://192.168.0.15:8080";
    try {
        const res = await axios({
            url,
            method,
            data: body,
            headers: {
                // Authorization: `jwt ${localStorage.getItem("token")}`,
                Authorization: `Bearer ${await AsyncStorage.getItem("access_token")}`,
            },
        });
        return res;
    } catch (error) {
        console.error("Error:", error);
        throw error; // 에러를 다시 throw하여 상위 함수에서 처리할 수 있도록 함
    }
};