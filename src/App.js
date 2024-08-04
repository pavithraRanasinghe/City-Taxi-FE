import { Route, Routes } from "react-router-dom";
import "./App.css";
import Register from "./pages/Register";
import LogIn from "./pages/Login";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<LogIn />} />
        <Route path="register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
