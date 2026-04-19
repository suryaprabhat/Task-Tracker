import axios from "axios";
import { API_BASE_URL } from "../config";

// A minimal axios instance for auth (no token needed)
const authAxios = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const res = await authAxios.post("/auth/login", data);
  return res.data; // { token }
};

export const signupUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await authAxios.post("/auth/signup", data);
  return res.data;
};
