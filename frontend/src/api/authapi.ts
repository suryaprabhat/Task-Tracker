import axios from "axios";

const API = "http://localhost:5000/api/auth";


export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const res = await axios.post(`${API}/login`, data);
  return res.data; // { token, user }
};

export async function signupUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await fetch("http://localhost:5000/api/auth/signup", {
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

