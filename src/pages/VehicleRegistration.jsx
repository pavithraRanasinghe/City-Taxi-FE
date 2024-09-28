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

const VehicleRegister = () => {
  const navigate = useNavigate();

  const [vehicleType, setVehicleType] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [manufacturedYear, setManufacturedYear] = useState("");
  const [registrarYear, setRegistrarYear] = useState("");
  const [color, setColor] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [license, setLicense] = useState(null);
  const [insurance, setInsurance] = useState(null);
  const [vehiclePhotos, setVehiclePhotos] = useState(null);
  const [isLoading, setLoading] = useState(false);

  // Validation
  const [isVehicleTypeValid, setIsVehicleTypeValid] = useState(true);
  const [isBrandValid, setIsBrandValid] = useState(true);
  const [isModelValid, setIsModelValid] = useState(true);
  const [isManufacturedYearValid, setIsManufacturedYearValid] = useState(true);
  const [isRegistrarYearValid, setIsRegistrarYearValid] = useState(true);
  const [isColorValid, setIsColorValid] = useState(true);
  const [isRegistrationNumberValid, setIsRegistrationNumberValid] = useState(true);

  const [fileErrors, setFileErrors] = useState({
    licenseError: "",
    insuranceError: "",
    photosError: ""
  });

  const validFileTypes = ["application/pdf", "image/jpeg", "image/jpg"];

  const handleFileValidation = (file, fileType) => {
    if (file && !validFileTypes.includes(file.type)) {
      return `Invalid ${fileType} format. Only PDF, JPG, and JPEG are allowed.`;
    }
    return "";
  };

  const handleLicenseChange = (event) => {
    const file = event.target.files[0];
    const error = handleFileValidation(file, "License");
    setLicense(file);
    setFileErrors((prev) => ({ ...prev, licenseError: error }));
  };

  const handleInsuranceChange = (event) => {
    const file = event.target.files[0];
    const error = handleFileValidation(file, "Insurance");
    setInsurance(file);
    setFileErrors((prev) => ({ ...prev, insuranceError: error }));
  };

  const handlePhotosChange = (event) => {
    const files = event.target.files;
    let photosError = "";
    for (let file of files) {
      const error = handleFileValidation(file, "Photos");
      if (error) {
        photosError = error;
        break;
      }
    }
    setVehiclePhotos(files);
    setFileErrors((prev) => ({ ...prev, photosError }));
  };

  const handleRegister = (event) => {
    event.preventDefault();

    if (fileErrors.licenseError || fileErrors.insuranceError || fileErrors.photosError) {
        toast.error("Please upload valid files.");
        return;
      }

    if (vehicleType.trim() === "") {
      setIsVehicleTypeValid(false);
      return;
    }
    if (brand.trim() === "") {
      setIsBrandValid(false);
      return;
    }
    if (model.trim() === "") {
      setIsModelValid(false);
      return;
    }
    if (manufacturedYear.trim() === "" || isNaN(manufacturedYear)) {
      setIsManufacturedYearValid(false);
      return;
    }
    if (registrarYear.trim() === "" || isNaN(registrarYear)) {
      setIsRegistrarYearValid(false);
      return;
    }
    if (color.trim() === "") {
      setIsColorValid(false);
      return;
    }
    if (registrationNumber.trim() === "") {
      setIsRegistrationNumberValid(false);
      return;
    }

    register();
  };

  const register = () => {
    const url = "v1/vehicle-register";
    const body = JSON.stringify({
      vehicleType,
      brand,
      model,
      manufacturedYear,
      registrarYear,
      color,
      registrationNumber,
    });

    setLoading(true);
    request(url, Constants.POST, body)
      .then((response) => {
        toast.success("Vehicle Registered Successfully");
        clearField();
        navigate("/dashboard");
      })
      .catch((error) => {
        toast.error("Vehicle Registration Failed");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const clearField = () => {
    setVehicleType("");
    setBrand("");
    setModel("");
    setManufacturedYear("");
    setRegistrarYear("");
    setColor("");
    setRegistrationNumber("");
    setLicense(null);
    setInsurance(null);
    setVehiclePhotos(null);
  };

  return (
    <div>
      <div className="register-container">
        <img src={logoName} alt="Logo" className="logo_name" />

        <h2 className="welcome">Vehicle Registration</h2>

        <Form className="m-3">
          <FloatingLabel controlId="vehicleType" label="Vehicle Type" className="mb-3 txtInput">
            <Form.Control
              type="text"
              placeholder="Vehicle Type"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            />
            {!isVehicleTypeValid && <p className="invalidText">Vehicle type cannot be empty</p>}
          </FloatingLabel>

          <FloatingLabel controlId="brand" label="Brand" className="mb-3 txtInput">
            <Form.Control
              type="text"
              placeholder="Brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
            {!isBrandValid && <p className="invalidText">Brand cannot be empty</p>}
          </FloatingLabel>

          <FloatingLabel controlId="model" label="Model" className="mb-3 txtInput">
            <Form.Control
              type="text"
              placeholder="Model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
            {!isModelValid && <p className="invalidText">Model cannot be empty</p>}
          </FloatingLabel>

          <FloatingLabel controlId="manufacturedYear" label="Manufactured Year" className="mb-3 txtInput">
            <Form.Control
              type="number"
              placeholder="Manufactured Year"
              value={manufacturedYear}
              onChange={(e) => setManufacturedYear(e.target.value)}
            />
            {!isManufacturedYearValid && <p className="invalidText">Invalid manufactured year</p>}
          </FloatingLabel>

          <FloatingLabel controlId="registrarYear" label="Registrar Year" className="mb-3 txtInput">
            <Form.Control
              type="number"
              placeholder="Registrar Year"
              value={registrarYear}
              onChange={(e) => setRegistrarYear(e.target.value)}
            />
            {!isRegistrarYearValid && <p className="invalidText">Invalid registrar year</p>}
          </FloatingLabel>

          <FloatingLabel controlId="color" label="Color" className="mb-3 txtInput">
            <Form.Control
              type="text"
              placeholder="Color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
            {!isColorValid && <p className="invalidText">Color cannot be empty</p>}
          </FloatingLabel>

          <FloatingLabel controlId="registrationNumber" label="Registration Number" className="mb-3 txtInput">
            <Form.Control
              type="text"
              placeholder="Registration Number"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
            />
            {!isRegistrationNumberValid && <p className="invalidText">Registration number cannot be empty</p>}
          </FloatingLabel>

          <FloatingLabel controlId="vehicleLicense" label="Upload Vehicle License" className="mb-3 txtInput">
            <Form.Control
                type="file"
                onChange={handleLicenseChange}
                accept=".pdf, .jpg, .jpeg" 
            />
            {fileErrors.licenseError && <p className="invalidText">{fileErrors.licenseError}</p>}
          </FloatingLabel>
     
          <FloatingLabel controlId="vehicleInsurance" label="Upload Vehicle Insurance" className="mb-3 txtInput">
            <Form.Control
                type="file"
                onChange={handleInsuranceChange}
                accept=".pdf, .jpg, .jpeg" 
            />
            {fileErrors.insuranceError && <p className="invalidText">{fileErrors.insuranceError}</p>}
          </FloatingLabel>

          <FloatingLabel controlId="vehiclePhotos" label="Upload Vehicle Photos" className="mb-3 txtInput">
            <Form.Control
                type="file"
                multiple
                onChange={handlePhotosChange}
                accept=".jpg, .jpeg" 
            />
            {fileErrors.photosError && <p className="invalidText">{fileErrors.photosError}</p>}
          </FloatingLabel>

          <div className="wrapper">
            <Button className="register-button" onClick={handleRegister}>
              REGISTER
            </Button>
          </div>
        </Form>
      </div>
      <ToastContainer />
      {isLoading && <Loader />}
    </div>
  );
};

export default VehicleRegister;
