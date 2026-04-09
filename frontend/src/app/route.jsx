import React from "react";
import { createBrowserRouter } from "react-router-dom";
import WelcomePage from "@/components/pages/WelcomePage/WelcomePage";
import LoginPage from "@/components/pages/LoginPage/LoginPage";
import RegisterPage from "@/components/pages/RegisterPage/RegisterPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import GuestRoute from "@/components/GuestRoute";

export const router = createBrowserRouter([
  { path: "/", element: <WelcomePage /> },
  {
    path: "/login",
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <GuestRoute>
        <RegisterPage />
      </GuestRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <div>Dashboard</div>
      </ProtectedRoute>
    ),
  },
]);
