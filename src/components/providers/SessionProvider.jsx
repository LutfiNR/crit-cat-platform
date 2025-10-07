// /src/components/providers/SessionProvider.jsx
"use client";

import { SessionProvider } from 'next-auth/react';

export default function NextAuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}