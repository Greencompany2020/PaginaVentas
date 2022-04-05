import axios from "axios";

const ApiProvider = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
})

export default ApiProvider;
