// pages/dashboard.tsx
"use client";
import React from "react";
import { AuthWrapper } from "@/components/auth-wrapper";
import TodoDetail from "@/components/Task/TodoDetail";

export default function DashboardPage() {
  return (
    <AuthWrapper>
      <TodoDetail />
    </AuthWrapper>
  );
}
