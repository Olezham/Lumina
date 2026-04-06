import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import WelcomePage from "@/components/pages/WelcomePage/WelcomePage";
import LoginPage from "@/components/pages/LoginPage/LoginPage";
import RegisterPage from "@/components/pages/RegisterPage/RegisterPage";
import ProtectedRoute from "@/components/ProtectedRoute";
// import DashboardPage from "./pages/DashboardPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <WelcomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
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

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
