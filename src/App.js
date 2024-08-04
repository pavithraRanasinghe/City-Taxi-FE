import { Route, Routes } from "react-router-dom";
import "./App.css";
import Register from "./pages/Register";
import LogIn from "./pages/Login";
import Home from "./pages/Home";
import RequireAuth from "./components/RequireAuth";
import DriverDashboard from "./pages/DriverDashboard";
import PassengerDashboard from "./pages/PassengerDashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<LogIn />} />
        <Route path="register" element={<Register />} />
        <Route element={<RequireAuth />}>
          <Route path="driver" element={<DriverDashboard />} />
          <Route path="passenger" element={<PassengerDashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
