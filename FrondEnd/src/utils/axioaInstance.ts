import axios from "axios";

export const getAxiosInstace = () =>
  axios.create({
    baseURL: `${"https://visionmath-1.onrender.com/swagger/index.html"}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
