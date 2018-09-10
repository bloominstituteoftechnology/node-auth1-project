import axios from 'axios'
axios.credentials = true;

const URL = "localhost:9000/";

const login = async userData => {
  try {
    const res = await axios.post(`${URL}/login`);
    return res.data.status;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const register = async userData => {
  try {
    console.log('HTTP')
    const res = await axios.post(`${URL}/register`);
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