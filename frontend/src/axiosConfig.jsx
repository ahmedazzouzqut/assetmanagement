import axios from 'axios';
// create an axios instance to Ip address 
const axiosInstance = axios.create({
  //baseURL: 'http://localhost:5001', // local
  //baseURL: 'http://13.239.234.98:5001', // live
  baseURL: 'http://3.106.127.210:5001', // live
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
