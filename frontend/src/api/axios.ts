import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://b0mlvsx1-5000.inc1.devtunnels.ms/", // Replace with your actual API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
