import axios from "axios";

const ApiProvider = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/api/v1`,
})

export default ApiProvider;
