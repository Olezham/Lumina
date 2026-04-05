import React from "react";
import { Routes, Route } from "react-router-dom";
import WelcomePage from "@/components/pages/WelcomePage/WelcomePage";
// import DashboardPage from "./pages/DashboardPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      {/* <Route path="/app" element={<DashboardPage />} /> */}{" "}
      {/* Это прошлый App.jsx с использыванием api ( api буду переписывать) */}
    </Routes>
  );
};

export default App;
