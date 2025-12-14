import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!sessionStorage.getItem("authToken")
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!sessionStorage.getItem("authToken"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = (token) => {
    sessionStorage.setItem("authToken", token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    sessionStorage.removeItem("authToken");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
