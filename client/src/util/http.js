import axios from 'axios'
axios.credentials = true;

const URL = "http://localhost:9000/api";

const login = async userData => {
  try {
    const res = await axios.post(`${URL}/login`, userData);
    return res.data.status;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const register = async userData => {
  try {
    console.log('HTTP')
    const res = await axios.post(`${URL}/register`, userData);
    return res.data.status;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export default {
    login,
    register
}