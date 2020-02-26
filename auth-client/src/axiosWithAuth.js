import axios from 'axios';
const axiosWithAuth = () => {
  return axios.create({
    baseUrl: "http://localhost:5000/",
    headers: {
      "Content-Type": "application/json"
    },
  });
};
export default axiosWithAuth;
