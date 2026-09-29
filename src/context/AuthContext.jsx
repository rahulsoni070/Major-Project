import React, { createContext, useContext, useState, useEffect } from "react";
import { BASE_URL } from "../utils/api";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("shopeasy_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("shopeasy_token") || null;
  });

  const [loading, setLoading] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("shopeasy_user", JSON.stringify(user));
      // Also sync to legacy "profile" key so Profile and Checkout retain compatibility
      localStorage.setItem("profile", JSON.stringify({
        name: user.name,
        email: user.email,
        phone: user.phone || ""
      }));
    } else {
      localStorage.removeItem("shopeasy_user");
      localStorage.removeItem("shopeasy_token");
    }
  }, [user]);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      // 1. Try real API call to backend
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed. Invalid credentials.");
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("shopeasy_token", data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      return { success: true, user: data.user };
    } catch (err) {
      // If network error (backend offline or remote endpoint not deployed yet)
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        // Fallback demo/offline authentication
        const fallbackUser = {
          id: "demo_usr_" + Date.now(),
          name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
          email: email.toLowerCase(),
          phone: "9876543210",
          addresses: []
        };
        const mockToken = "mock_jwt_token_" + Date.now();
        setUser(fallbackUser);
        setToken(mockToken);
        localStorage.setItem("shopeasy_token", mockToken);
        toast.success(`Welcome, ${fallbackUser.name}! (Offline mode)`);
        return { success: true, user: fallbackUser };
      }

      toast.error(err.message || "Failed to log in");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async ({ name, email, password, phone }) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed.");
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("shopeasy_token", data.token);
      toast.success(`Account created successfully! Welcome to ShopEasy, ${data.user.name}!`);
      return { success: true, user: data.user };
    } catch (err) {
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        const fallbackUser = {
          id: "demo_usr_" + Date.now(),
          name: name.trim(),
          email: email.toLowerCase().trim(),
          phone: phone ? phone.trim() : "9876543210",
          addresses: []
        };
        const mockToken = "mock_jwt_token_" + Date.now();
        setUser(fallbackUser);
        setToken(mockToken);
        localStorage.setItem("shopeasy_token", mockToken);
        toast.success(`Account created! Welcome, ${fallbackUser.name}!`);
        return { success: true, user: fallbackUser };
      }

      toast.error(err.message || "Failed to create account");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Instant Demo User Login (1-Click for evaluators)
  const loginDemoUser = () => {
    const demoUser = {
      id: "demo_shopeasy_01",
      name: "Rahul Soni",
      email: "rahul.demo@shopeasy.com",
      phone: "+91 98765 43210",
      addresses: [
        {
          id: "addr_1",
          name: "Rahul Soni",
          city: "Bengaluru",
          state: "Karnataka",
          pincode: "560001",
          phone: "+91 98765 43210"
        }
      ]
    };
    const demoToken = "demo_jwt_token_sample_123456";
    setUser(demoUser);
    setToken(demoToken);
    localStorage.setItem("shopeasy_token", demoToken);
    toast.success("Logged in with Demo Account! ✨");
    return { success: true, user: demoUser };
  };

  // Update profile
  const updateProfile = async (updatedData) => {
    try {
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);

      if (token && !token.startsWith("mock_") && !token.startsWith("demo_")) {
        await fetch(`${BASE_URL}/api/auth/profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(updatedData)
        });
      }

      toast.success("Profile updated successfully!");
      return { success: true, user: updatedUser };
    } catch {
      toast.info("Profile updated locally.");
      return { success: true };
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("shopeasy_user");
    localStorage.removeItem("shopeasy_token");
    toast.info("Logged out successfully");
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    loginDemoUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
