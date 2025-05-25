// pages/dashboard.tsx
"use client";
import React from "react";
import Dashboard from "@/components/Dashboard/Dashboard";
import { AuthWrapper } from "@/components/auth-wrapper";

// import Dashboard from '../../components/Dashboard/Dashboard';

export default function DashboardPage() {
  return (
    <AuthWrapper>
      <Dashboard />
    </AuthWrapper>
  );
}
