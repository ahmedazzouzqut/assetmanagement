import axios from 'axios';
// create an axios instance to url
const axiosInstance = axios.create({
  //baseURL: 'http://localhost:5001', // local
  baseURL: 'http://3.27.181.204:5001', // live
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
