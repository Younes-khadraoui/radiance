import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import Home from "./components/home/Home";
import Header from "./components/home/Header";
import Account from "./components/account/Account";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="bg-hollow h-screen">
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
