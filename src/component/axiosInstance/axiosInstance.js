import axios from "axios";

// Create an axios instance with a global base URL
const Axios = axios.create({
  baseURL: "https://defeated-anatola-kiru-e1ff93d7.koyeb.app/",
});

export default Axios;
