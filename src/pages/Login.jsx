import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FloatingLabel, Form, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { request } from "../common/APIManager";
import * as Constants from "../common/Constants";
import "./css/Login.css";
import { setUser } from "../common/PersistanceManager";
import Loader from "../components/Loader";
import logoName from "../assets/logo_name.png";

const LogIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setLoading] = useState(false);

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
    login();
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
          const user = {
            userId: response.userId,
            email: response.email,
            token: response.token,
          };
          setUser(user);
          clearField();
          const type = response.userType;
          switch (type) {
            case Constants.DRIVER:
              navigate("/driver", { replace: true });
              break;
            case Constants.PASSENGER:
              navigate("/passenger", { replace: true });
              break;
            default:
              navigate("/login", { replace: true });
              break;
          }
        } else {
          toast.error("Doesn't match Credential");
        }
      })
      .catch((error) => {
        toast.error("Doesn't match Credential");
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
        <img src={logoName} alt="Profile" className="logo_name" />

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
              <p className="invalidText">Username cann't be empty</p>
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
              <p className="invalidText">Password cann't be empty</p>
            )}
          </FloatingLabel>

          <div className="btn-wrapper">
            <Button type="submit" className="mt-3 login-button">
              LOG IN
            </Button>
          </div>
        </Form>
      </div>
      <ToastContainer />
      {isLoading && <Loader />}
    </div>
  );
};

export default LogIn;
