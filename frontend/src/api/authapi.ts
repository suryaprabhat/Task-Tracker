import axios from "axios";

import { API_BASE_URL } from "../config";

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const res = await axios.post(`${API_BASE_URL}/api/auth/login`, data);
  return res.data; // { token, user }
};

export async function signupUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Signup failed");
  }

  return result;
}

