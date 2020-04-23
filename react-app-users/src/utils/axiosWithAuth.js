import axios from 'axios';

 const axiosWithAuth = () => {
    const token = localStorage.getItem("token");

    return axios.create({
        headers: {
            Authorization: token
        },
        baseURL: "http://localhost:5050"
    });
};
export default axiosWithAuth;