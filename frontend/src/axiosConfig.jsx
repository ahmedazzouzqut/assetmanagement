import axios from 'axios';
// create an axios instance to Ip address 
const axiosInstance = axios.create({
  //baseURL: 'http://localhost:5001', // local
  baseURL: 'http://3.25.67.165:5001', // QUT Instance
  //baseURL: 'http://3.106.127.210:5001', // My Instance
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
