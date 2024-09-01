import axios from "axios";
import { createContext, useEffect, useState } from "react";

interface UserContextType {
  username: string | null;
  setUsername: (username: string | null) => void;
  id: string | null;
  setId: (id: string | null) => void;
}

const defaultContext: UserContextType = {
  username: null,
  setUsername: () => {},
  id: null,
  setId: () => {},
};
export const UserContext = createContext<UserContextType>(defaultContext);

export function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [username, setUsername] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    axios.get("/profile").then((response) => {
      setId(response.data.userId);
      setUsername(response.data.username);
    });
  }, []);
  return (
    <UserContext.Provider value={{ username, setUsername, id, setId }}>
      {children}
    </UserContext.Provider>
  );
}
