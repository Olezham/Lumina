import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/app/route";
import AuthBootstrap from "@/components/AuthBootstrap";
import Toasts from "@/components/Toasts/Toasts";

const App = () => {
  return (
    <AuthBootstrap>
      <RouterProvider router={router} />
      <Toasts />
    </AuthBootstrap>
  );
};

export default App;
