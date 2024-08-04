import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { request } from "../common/APIManager";
import * as Constants from "../common/Constants";
import "./css/Register.css";
import Loader from "../components/Loader";
import logoName from "../assets/logo_name.png";

const Register = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [isLoading, setLoading] = useState(false);

  //Validation
  const [isFirstNameValid, setIsFirstNameValid] = useState(true);
  const [isLastNameValid, setIsLastNameValid] = useState(true);
  const [isContactValid, setIsContactValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPassworValid] = useState(true);
  const [isPasswordLengthValid, setIsPassworLengthValid] = useState(true);
  const [isRePasswordValid, setIsRePassworValid] = useState(true);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
    if (firstName.length < 1) {
      setIsFirstNameValid(false);
    } else {
      setIsFirstNameValid(true);
    }
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handleContactChange = (event) => {
    setContact(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (password.length < 7) {
      setIsPassworLengthValid(false);
    } else {
      setIsPassworLengthValid(true);
    }
  };

  const handleRepasswordChange = (event) => {
    setRepassword(event.target.value);
  };

  const handleRegister = (event) => {
    event.preventDefault();
    if (firstName.trim() === "") {
      setIsFirstNameValid(false);
      return;
    } else {
      setIsFirstNameValid(true);
    }
    if (lastName.trim() === "") {
      setIsLastNameValid(false);
      return;
    } else {
      setIsLastNameValid(true);
    }
    if (contact.trim() === "") {
      setIsContactValid(false);
      return;
    } else {
      setIsContactValid(true);
    }
    if (email.trim() === "" || !emailRegex.test(email)) {
      setIsEmailValid(false);
      return;
    } else {
      setIsEmailValid(true);
    }
    if (password.trim() === "") {
      setIsPassworValid(false);
      return;
    } else {
      setIsPassworValid(true);
    }
    if (repassword.trim() === "") {
      setIsRePassworValid(false);
      return;
    } else {
      setIsRePassworValid(true);
    }
    if (password !== repassword) {
      toast.error("Password doesn't match");
      return;
    }

    register();
  };

  const register = () => {
    const url = "v1/app-user";
    const body = JSON.stringify({
      firstName: firstName,
      lastName: lastName,
      username: email,
      contact: contact,
      password: password,
      userType: "DRIVER",
    });
    setLoading(true);
    request(url, Constants.POST, body)
      .then((response) => {
        clearField();
        console.log("Registration Success : ", response);
        toast.success("Registration Successful");
        navigate("/login");
      })
      .catch((error) => {
        console.log("ERROR : ", error);
        toast.error("Registration not complete");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const clearField = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setContact("");
    setPassword("");
    setRepassword("");
  };

  return (
    <div>
      <div className="register-container">
        <img src={logoName} alt="Profile" className="logo_name" />

        <h2 className="welcome">Register New Account</h2>

        <Form className="m-3">
          <FloatingLabel
            controlId="firstName"
            label="First Name"
            className="mb-3 txtInput"
          >
            <Form.Control
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={handleFirstNameChange}
            />
            {!isFirstNameValid && (
              <p className="invalidText">First Name cann't be empty</p>
            )}
          </FloatingLabel>
          <FloatingLabel
            controlId="lastName"
            label="Last Name"
            className="mb-3 txtInput"
          >
            <Form.Control
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={handleLastNameChange}
            />
            {!isLastNameValid && (
              <p className="invalidText">Last Name cann't be empty</p>
            )}
          </FloatingLabel>
          <FloatingLabel
            controlId="contact"
            label="Phone Number"
            className="mb-3 txtInput"
          >
            <Form.Control
              type="text"
              placeholder="Phone Number"
              value={contact}
              onChange={handleContactChange}
            />
            {!isContactValid && (
              <p className="invalidText">Phone Number cann't be empty</p>
            )}
          </FloatingLabel>
          <FloatingLabel
            controlId="email"
            label="Email"
            className="mb-3 txtInput"
          >
            <Form.Control
              type="text"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
            />
            {!isEmailValid && (
              <p className="invalidText">Please enter valid email</p>
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
            {!isPasswordLengthValid && (
              <p className="invalidText">
                Password must has least 8 characters
              </p>
            )}
          </FloatingLabel>
          <FloatingLabel
            controlId="rePassword"
            label="Re-Enter Password"
            className="mb-3 txtInput"
          >
            <Form.Control
              type="password"
              placeholder="Re-Enter Password"
              value={repassword}
              onChange={handleRepasswordChange}
            />
            {!isRePasswordValid && (
              <p className="invalidText">Password should be verified</p>
            )}
          </FloatingLabel>
          <div className="wrapper">
            <Button className="register-button" onClick={handleRegister}>
              REGISTER
            </Button>
          </div>
          <p className="loginLink">
            Did you have an account?
            <Link to={"/login"} style={{ textDecoration: "none" }}>
              {" "}
              Log In
            </Link>
          </p>
        </Form>
      </div>
      <ToastContainer />
      {isLoading && <Loader />}
    </div>
  );
};

export default Register;
