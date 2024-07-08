import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import Home from "./components/home/Home";
import Header from "./components/home/Header";
import Account from "./components/account/Account";
import ProtectedRoute from "./components/ProtectedRoute";
import { initializeSocket } from "@/stores/socketStore";
import { useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  useEffect(() => {
    const socket = initializeSocket(BACKEND_URL);
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="bg-hollow h-screen overflow-hidden">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header />
                <Home />
              </>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute
                element={
                  <>
                    <Header />
                    <Account />
                  </>
                }
              />
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
