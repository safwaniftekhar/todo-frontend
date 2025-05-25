'use client'
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
interface AuthContextType {
  isLoggedIn: boolean;
  login: (token:string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); 

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []); 

  if (isLoggedIn === null) {
    return <div>Loading...</div>;
  }

  const login = (token:string) => {
    setIsLoggedIn(true);
    console.log("token", token)
    localStorage.setItem('access_token', token); 
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('access_token');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = ()=> {
  return useContext(AuthContext);
};