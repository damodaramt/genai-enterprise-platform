import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Chat from "./pages/Chat";

/**
 * AUTH CHECK
 */
const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

/**
 * PROTECTED ROUTE
 */
function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

/**
 * PUBLIC ROUTE (prevent logged-in user accessing login)
 */
function PublicRoute({ children }) {
  return !isAuthenticated() ? children : <Navigate to="/chat" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ROOT REDIRECT */}
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <Navigate to="/chat" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
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
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
