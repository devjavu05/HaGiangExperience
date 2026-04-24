import api from "./api";

export async function login(payload) {
  const response = await api.post("/api/auth/login", payload);
  return {
    user: {
      id: response.data.id,
      username: response.data.username,
      phoneNumber: response.data.phoneNumber,
      role: response.data.role
    }
  };
}

export async function register(payload) {
  const response = await api.post("/api/auth/register", payload);
  return response.data;
}

export async function updatePhoneNumber(payload) {
  const response = await api.put("/api/auth/profile/phone-number", payload);
  return {
    user: {
      id: response.data.id,
      username: response.data.username,
      phoneNumber: response.data.phoneNumber,
      role: response.data.role
    }
  };
}
