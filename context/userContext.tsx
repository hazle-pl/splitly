import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

interface Shop {
  shopName: string;
  accessToken: string;
  shopDomain: string;
}

interface User {
  username: string;
  plan: string;
  shops?: Shop[];
}

interface UserContextProps {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      setLoading(false);
      setUser(null);
      return;
    }
  
    try {
      const res = await fetch('/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await res.json();

      setUser({
        username: data.username,
        plan: data.plan,
        shops: data.shops || [],
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser(null);
      if (router.pathname !== '/') {
        router.push('/');
      }
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url === '/dashboard') {
        fetchUser();
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
