import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Home from "./pages/Home/Home";
import SignUp from "./pages/Auth/SignUp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/login" />} /> {/* Redirect unknown routes */}
      </Routes>
    </Router>
  );
}

export default App;
