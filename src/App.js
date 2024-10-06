import { Route, Routes, useLocation } from "react-router-dom";
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
import ManagePassengers from "./pages/ManagePassengers";
import ViewDriver from "./pages/ViewProfileDriver";
import ViewPassenger from "./pages/viewProfilePassengers";
import OngoingTrip from "./pages/OngoingTrip";
import FinanceReport from "./pages/FinanceReport";
import AdminRequireAuth from "./components/AdminRequireAuth";
import AdminSideNav from "./components/AdminSideNav";
import CallOperatorBooking from "./pages/CallOperatorBooking";

function App() {
  const location = useLocation();
  return (
    <>
      {!location.pathname.startsWith("/register") &&
        !location.pathname.startsWith("/login") && <AdminSideNav />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<LogIn />} />
        <Route path="register" element={<Register />} />
        <Route path="admin" element={<Admin />} />
        <Route path="viewDrivers" element={<ViewDriver />} />
        <Route path="viewPassenger" element={<ViewPassenger />} />
        <Route path="trips" element={<OngoingTrip />} />
        <Route path="call-operator" element={<CallOperatorBooking />} />
        <Route element={<AdminRequireAuth />}>
          <Route path="admin/manage-drivers" element={<ManageDrivers />} />
          <Route path="admin/manage-passenger" element={<ManagePassengers />} />
        </Route>
        <Route path="finance" element={<FinanceReport />} />
        <Route element={<DriverRequireAuth />}>
          <Route path="driver" element={<DriverDashboard />} />
          <Route path="vehicle" element={<VehicleRegistration />} />
        </Route>
        <Route element={<PassengerRequireAuth />}>
          <Route path="passenger" element={<PassengerDashboard />} />
          <Route path="booking" element={<Booking />} />
          <Route path="rating" element={<Rating />} />
          <Route path="payment" element={<Payment />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
