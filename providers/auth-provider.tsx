"use client";

import { signin } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";

export default function AuthProvider({ children }: PropsWithChildren) {
  const [authenticated, setAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (localStorage !== undefined) {
      const token = localStorage.getItem('token');
      if (token) {
        signin(token);
      } else {
        return router.push('/');
      }
    }

    axios.get('/api/me')
      .then(() => setAuth(true))
      .catch(() => router.push('/'));
  }, []);

  return authenticated ? children : null;
}