import { createContext, useEffect, useState } from "react";
import { BASE_URL } from "../services/api";
import notify from "../components/ui/notify"

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedAccessToken = localStorage.getItem("accessToken");
    const savedRefreshToken = localStorage.getItem("refreshToken");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (savedAccessToken) {
      setAccessToken(savedAccessToken);
    }

    if (savedRefreshToken) {
      setRefreshToken(savedRefreshToken);
    }

  }, []);

  const login = (user) => {
    setUser(user.data);
    setAccessToken(user.access_token);
  };

  const logout = () => {
    notify.info("Logout successful")
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  
  const loginUser = async (email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
  
    const data = await response.json();

    if (!response.ok) {
      if(response.status === 401) {
        notify.error("Invalid email or password")
        throw new Error("Invalid email or password");
      }
      notify.error(data.message || "Login failed")
      throw new Error(data.message || "Login failed");
    }

    notify.success("Login successful! Welcome back.")
    setUser(data.user);
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);

    localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      localStorage.setItem(
        "accessToken",
        data.accessToken
      );

      localStorage.setItem(
        "refreshToken",
        data.refreshToken
      );

    return data;
    } catch (error) {
      notify.error("Unable to connect");
    }

  };
  
  
  const registerUser = async (userData) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      if(response.status === 400) {
        notify.error("Registration failed")
        throw new Error(data.message || "Registration failed");
      }
      if(response.status === 409) {
        notify.error("Email already exists")
        throw new Error(data.message || "Email already exists");
      }
      notify.error("Registration failed")
      throw new Error(data.message || "Registration failed");
    }

    notify.success("Registration successful! You can now log in.");

    } catch (error) {
      notify.error("Unable to connect");
    }
  }
//   const getCurrentUser = async () => {
//     try {
//         const response = await fetch(`${BASE_URL}/users/me`, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${accessToken}`,
//             },
//         });

//         if (!response.ok) {
//             throw new Error("Failed to fetch current user");
//             setUser(null);
//             return;
//         }

//         const data = await response.json();
//         setUser(data.user || data);
//     } catch (error) {
//         console.error(error);
//         setUser(null);
//     }
//   }

//   const refreshAccessToken = async () => {
//     try {
//         const response = await fetch(`${BASE_URL}/auth/refresh`, {
//             method: "POST",
//             credentials: "include", // Include cookies for refresh token
//         });

//         const data = await response.json();
//         setAccessToken(data.access_token);
//     } catch (error) {
//         console.error(error);
//         setAccessToken(null);
//     }
//   }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        loginUser,
        registerUser,
        login,
        logout,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};