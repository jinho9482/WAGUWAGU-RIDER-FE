import axios from "axios";
export const api = async (url, method, body, params) => {
//   const getToken = () => {
//     if (
//       url === "/api/v1/auths/signUp" ||
//       url === "/api/v1/auths/signIn" ||
//       url === "/api/v1/posts/top5/recent" ||
//       url === "/api/v1/posts/top5/like" ||
//       url === "/api/v1/posts/top5/diaries" ||
//       url.startsWith("/api/v1/auths/loginId") ||
//       url.startsWith("/api/v1/auths/email") ||
//       url === "/api/v1/posts/recent" ||
//       url === "/api/v1/auths/findLoginId" ||
//       url === "/api/v1/auths/findPassword" ||
//       // url === "/api/v1/posts/recent"
//       // url === "/api/v1/expense-details"
//       url === "/api/v1/posts/recent/diaries" ||
//       url.startsWith("/api/v1/country/info/") ||
//       url.startsWith("/api/v1/auths/loginId/") ||
//       url.startsWith("/api/v1/auths/email/") ||
//       url.startsWith("/api/v1/posts/public/") ||
//       url.startsWith("/api/v1/diaries/posts") ||
//       url.startsWith("/api/v1/expense-details/chart/postId/")
//     )
//       return "";
//     return "Bearer " + localStorage.getItem("token");
//   };

  const res = await axios({
    url,
    method,
    baseURL: "http://192.168.45.90:8080", // baseURL
    data: body,
    params: params,
    headers: {
      Authorization: "",
      // Authorization: []
    },
  });

  return res;
};
