import { Route, Routes } from "react-router-dom";
import "./App.css";
import Register from "./pages/Register";
import LogIn from "./pages/Login";
import Home from "./pages/Home";
import DriverRequireAuth from "./components/DriverRequireAuth";
import DriverDashboard from "./pages/DriverDashboard";
import PassengerDashboard from "./pages/PassengerDashboard";
import VehicleRegistration from "./pages/VehicleRegistration";
import Rating from "./pages/Rating";
import Booking from "./pages/Booking";
import PassengerRequireAuth from "./components/PassengerRequireAuth";
import Admin from "./pages/AdminDashboard";
import ManageDrivers from "./pages/ManageDrivers";
import Payment from "./pages/Payment";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<LogIn />} />
        <Route path="register" element={<Register />} />
        <Route path="payment" element={<Payment />} />
        <Route element={<DriverRequireAuth />}>
          <Route path="admin" element={<Admin />} />
          <Route path="manageDrivers" element={<ManageDrivers />} />
        </Route>
        <Route element={<DriverRequireAuth />}>
          <Route path="driver" element={<DriverDashboard />} />
          <Route path="vehicle" element={<VehicleRegistration />} />
        </Route>
        <Route element={<PassengerRequireAuth />}>
          <Route path="passenger" element={<PassengerDashboard />} />
          <Route path="booking" element={<Booking />} />
          <Route path="rating" element={<Rating />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
