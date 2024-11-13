import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

export const UserContext = createContext({});

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = axios.defaults.headers.common['Authorization'];
        if (token) {
          const { data } = await axios.get('/auth/profile');
          setUser(data);
        }
      } catch (error) {
        console.warn('No user profile found. User might not be authenticated.');
      } finally {
        setReady(true);
      }
    };

    if (!user) {
      fetchUserProfile();
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );
}
