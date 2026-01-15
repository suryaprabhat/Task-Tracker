import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../src/pages/login";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./context/AuthContext";
import type { JSX } from "react";
import "../src/index.css";
import Signup from "./pages/Signup";


function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default entry point */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
