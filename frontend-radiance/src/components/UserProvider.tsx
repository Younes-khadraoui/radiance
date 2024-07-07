import React, { createContext, useState, useContext, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { FETCH_USER } from "@/graphql/mutations";

export interface User {
  email: string;
  profilePic: string;
  admin: boolean;
  username: string;
  joinedGroups: string[];
  online: boolean;
}

interface UserContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

const initialUser: User = {
  email: "",
  profilePic: "",
  admin: false,
  username: "",
  joinedGroups: ["Global Group"],
  online: false,
};

const UserContext = createContext<UserContextType>({
  user: initialUser,
  setUser: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>(initialUser);
  const { data, loading, error } = useQuery(FETCH_USER);

  useEffect(() => {
    if (!loading && !error) {
      if (data && data.account) {
        setUser(data.account);
      } else {
        setUser(initialUser);
      }
    }
  }, [data, loading, error]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = (): UserContextType => useContext(UserContext);
