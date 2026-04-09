import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/app/route";
import AuthBootstrap from "@/components/AuthBootstrap";

const App = () => {
  return (
    <AuthBootstrap>
      <RouterProvider router={router} />
    </AuthBootstrap>
  );
};

export default App;
