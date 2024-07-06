import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

interface User {
  email: string;
  profilePic: string;
  admin: boolean;
  username: string;
}

interface UserContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const initialUser: User = {
  email: "",
  profilePic: "",
  admin: false,
  username: "Anonymous",
};

const UserContext = createContext<UserContextType>({
  user: initialUser,
  setUser: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>(initialUser);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          const response = await axios.get<User>(
            `${BACKEND_URL}/api/auth/account`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = (): UserContextType => useContext(UserContext);
