import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FloatingLabel, Form, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { request } from "../common/APIManager";
import * as Constants from "../common/Constants";
import "./css/Login.css";
import { setUser } from "../common/PersistanceManager";
import Loader from "../components/Loader";
import logoName from "../assets/logo.png";

const LogIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    const queryParam = new URLSearchParams(location.search);
    const expire = queryParam.get("expire");
    if (expire) {
      toast.error("Session Expired");
    }
  }, [location.search]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  // Check for geolocation when user tries to log in
  const checkLocationServices = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Location fetched:", latitude, longitude);
          // Proceed with login since location is available
          login();
        },
        () => {
          setLocationError("Please turn on your device's location.");
          toast.error("Please turn on your device's location to continue.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = (event) => {
    event.preventDefault();

    if (username.trim() === "") {
      setIsUsernameValid(false);
      return;
    } else {
      setIsUsernameValid(true);
    }
    if (password.trim() === "") {
      setIsPasswordValid(false);
      return;
    } else {
      setIsPasswordValid(true);
    }

    // Check for location services before login
    checkLocationServices();
  };

  const login = () => {
    const url = "v1/app-user/login";
    const body = JSON.stringify({
      username: username,
      password: password,
    });
    setLoading(true);
    request(url, Constants.POST, body)
      .then((response) => {
        if (response.email !== null && response.userId !== 0) {
          let userId = null;
          if (response.userType === Constants.DRIVER) {
            userId = response.driverId;
          } else if (response.userType === Constants.PASSENGER) {
            userId = response.passengerId;
          }
          const user = {
            id: response.id,
            name: `${response.firstName} ${response.lastName}`,
            email: response.email,
            token: response.token,
            userType: response.userType,
            userId: userId,
          };
          setUser(user);
          clearField();
          const type = response.userType;
          switch (type) {
            case Constants.DRIVER:
              navigate("/driver", { replace: true });
              break;
            case Constants.PASSENGER:
              navigate("/booking", { replace: true });
              break;
            default:
              navigate("/login", { replace: true });
              break;
          }
        } else {
          toast.error("Credentials do not match");
        }
      })
      .catch((error) => {
        toast.error("Credentials do not match");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const clearField = () => {
    setUsername("");
    setPassword("");
  };

  return (
    <div>
      <div className="login-container">
        <img
          src={logoName}
          alt="Profile"
          className="logo_name"
          style={{ width: "350px", height: "auto" }}
        />

        <h2 className="welcome">WELCOME BACK</h2>
        <Form className="m-3" onSubmit={handleLogin}>
          <FloatingLabel
            controlId="username"
            label="Username"
            className="mb-3 txtInput"
          >
            <Form.Control
              type="text"
              placeholder="Username"
              value={username}
              onChange={handleUsernameChange}
            />
            {!isUsernameValid && (
              <p className="invalidText">Username can't be empty</p>
            )}
          </FloatingLabel>
          <FloatingLabel
            controlId="password"
            label="Password"
            className="mb-3 txtInput"
          >
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
            {!isPasswordValid && (
              <p className="invalidText">Password can't be empty</p>
            )}
          </FloatingLabel>

          <div className="btn-wrapper">
            <Button type="submit" className="mt-3 login-button">
              LOG IN
            </Button>
          </div>
          <p className="loginLink">
            Don't you have an account?
            <Link to={"/"} style={{ textDecoration: "none" }}>
              {" "}
              Registration
            </Link>
          </p>
        </Form>
      </div>
      <ToastContainer />
      {isLoading && <Loader />}
    </div>
  );
};

export default LogIn;
