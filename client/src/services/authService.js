import API from "./api";

export const register = async (userData) => {
  const response = await API.post("/auth/register", userData);
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

export const login = async (credentials) => {
  const response = await API.post("/auth/login", credentials);
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

export const getProfile = async () => {
  const response = await API.get("/auth/profile");
  return response.data;
};

export const logout = async () => {
  try {
    await API.post("/auth/logout");
  } catch (err) {
    console.error("Logout request error:", err);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};

export const saveBuyerProfile = async (profileData) => {
  const response = await API.post("/profiles/buyer", profileData);
  return response.data;
};

export const saveSupplierProfile = async (profileData) => {
  const response = await API.post("/profiles/supplier", profileData);
  return response.data;
};

export const getDashboardData = async () => {
  const response = await API.get("/profiles/dashboard");
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await API.post("/products", productData);
  return response.data;
};

export const requestPasswordReset = async (email) => {
  const response = await API.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (email, newPassword) => {
  const response = await API.post("/auth/reset-password", { email, newPassword });
  return response.data;
};

