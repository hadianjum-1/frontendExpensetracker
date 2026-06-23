import axios from "axios";

const Api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // for cookies/JWT
});
console.log("Api baseURL:", import.meta.env.VITE_API_URL);
export default Api;