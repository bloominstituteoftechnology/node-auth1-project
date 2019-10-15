import axios from 'axios';

const axiosWithAuth = () => {
  return axios.create({
      headers: {
        Authorization: localStorage.getItem('token')
      }
  });
};

export default axiosWithAuth;