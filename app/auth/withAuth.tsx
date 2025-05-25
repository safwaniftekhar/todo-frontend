// auth/withAuth.tsx
"use client"
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts';

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  const Wrapper = (props: any) => {
    const { isLoggedIn } = useAuth();
    const router = useRouter();

    console.log("isLoggedIn",isLoggedIn)

    useEffect(() => {
      if (!isLoggedIn) {
        router.push('/login'); // Redirect to login page if not logged in
      }
    }, [isLoggedIn, router]);

    return isLoggedIn ? <WrappedComponent {...props} /> : null;
  };

  return Wrapper;
};

export default withAuth;
