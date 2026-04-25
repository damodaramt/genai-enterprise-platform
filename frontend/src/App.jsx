import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Chat from "./pages/Chat.jsx";

/**
 * SAFE AUTH CHECK
 */
const isAuthenticated = () => {
  try {
    return typeof window !== "undefined" && !!localStorage.getItem("token");
  } catch {
    return false;
  }
};

/**
 * PROTECTED ROUTE
 */
function PrivateRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

/**
 * PUBLIC ROUTE
 */
function PublicRoute({ children }) {
  if (isAuthenticated()) {
    return <Navigate to="/chat" replace />;
  }
  return children;
}

export default function App() {
  const auth = isAuthenticated();

  return (
    <Routes>
      {/* ROOT */}
      <Route
        path="/"
        element={<Navigate to={auth ? "/chat" : "/login"} replace />}
      />

      {/* LOGIN */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* CHAT */}
      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
