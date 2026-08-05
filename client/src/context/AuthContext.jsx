import { createContext, useState, useEffect, useContext } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const profileData = await authService.getProfile();
          setUser((prev) => ({
            ...prev,
            _id: profileData._id,
            name: profileData.name,
            email: profileData.email,
            role: profileData.role,
            profileDetails: profileData.profile,
          }));
        } catch (error) {
          console.error("Token verification failed:", error);
          authService.logout();
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const loginUser = async (credentials) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      setUser(data);
      setToken(data.token);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (userData) => {
    setLoading(true);
    try {
      const data = await authService.register(userData);
      setUser(data);
      setToken(data.token);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
  };

  const saveBuyerOnboarding = async (data) => {
    const profile = await authService.saveBuyerProfile(data);
    setUser((prev) => ({
      ...prev,
      profileDetails: profile,
    }));
    return profile;
  };

  const saveSupplierOnboarding = async (data) => {
    const profile = await authService.saveSupplierProfile(data);
    setUser((prev) => ({
      ...prev,
      profileDetails: profile,
    }));
    return profile;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login: loginUser,
        register: registerUser,
        logout: logoutUser,
        saveBuyerOnboarding,
        saveSupplierOnboarding,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
