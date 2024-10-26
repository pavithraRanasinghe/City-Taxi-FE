import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { request } from "../common/APIManager";
import * as Constants from "../common/Constants";
import "./css/Register.css";
import Loader from "../components/Loader";
import { getUser } from "../common/PersistanceManager";

const VehicleRegister = () => {
  const navigate = useNavigate();

  const [type, setVehicleType] = useState("");
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [manufacturedYear, setManufacturedYear] = useState("");
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
  const [isVehicleNumberValid, setIsVehicleNumberValid] = useState(true);
  const [isColorValid, setIsColorValid] = useState(true);
  const [isRegistrationNumberValid, setIsRegistrationNumberValid] =
    useState(true);

  const [fileErrors, setFileErrors] = useState({
    licenseError: "",
    insuranceError: "",
    photosError: "",
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

    if (
      fileErrors.licenseError ||
      fileErrors.insuranceError ||
      fileErrors.photosError
    ) {
      toast.error("Please upload valid files.");
      return;
    }

    if (type.trim() === "") {
      setIsVehicleTypeValid(false);
      return;
    }
    if (name.trim() === "") {
      setIsBrandValid(false);
      return;
    }
    if (model.trim() === "") {
      setIsModelValid(false);
      return;
    }
    const currentYear = new Date().getFullYear();
    if (
      manufacturedYear.trim() === "" ||
      isNaN(manufacturedYear) ||
      manufacturedYear >= currentYear
    ) {
      setIsManufacturedYearValid(false);
      return;
    }
    if (vehicleNumber.trim() === "") {
      setIsVehicleNumberValid(false);
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
    const driver = getUser();
    const url = "v1/vehicle";
    const body = JSON.stringify({
      type: type,
      name: name,
      model: model,
      manufacturedYear: manufacturedYear,
      vehicleNumber: vehicleNumber,
      color: color,
      registrationNumber: registrationNumber,
      driverId: driver.userId,
    });

    setLoading(true);
    request(url, Constants.POST, body)
      .then((response) => {
        toast.success("Vehicle Registered Successfully");
        clearField();
        navigate("/driver", { replace: true });
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
    setName("");
    setModel("");
    setManufacturedYear("");
    setVehicleNumber("");
    setColor("");
    setRegistrationNumber("");
    setLicense(null);
    setInsurance(null);
    setVehiclePhotos(null);
  };

  const handleChange = (e) => {
    setVehicleType(e.target.value);
  };

  return (
    <div>
      <div className="register-container">
        <h2 className="welcome">Vehicle Registration</h2>

        <Form className="m-3">
          <FloatingLabel controlId="type" label="Select Vehicle Type">
            <Form.Control
              className="mb-3"
              style={{ width: "75vw", margin: "auto" }}
              as="select"
              value={type}
              onChange={handleChange}
              aria-label="Select Vehicle Type"
            >
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
              <option value="Wheel">Three Wheeler</option>
            </Form.Control>
          </FloatingLabel>

          <FloatingLabel
            controlId="name"
            label="Name"
            className="mb-3 txtInput"
          >
            <Form.Control
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {!isBrandValid && (
              <p className="invalidText">Name cannot be empty</p>
            )}
          </FloatingLabel>

          <FloatingLabel
            controlId="model"
            label="Model"
            className="mb-3 txtInput"
          >
            <Form.Control
              type="text"
              placeholder="Model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
            {!isModelValid && (
              <p className="invalidText">Model cannot be empty</p>
            )}
          </FloatingLabel>

          <FloatingLabel
            controlId="manufacturedYear"
            label="Manufactured Year"
            className="mb-3 txtInput"
          >
            <Form.Control
              type="number"
              placeholder="Manufactured Year"
              value={manufacturedYear}
              onChange={(e) => setManufacturedYear(e.target.value)}
            />
            {!isManufacturedYearValid && (
              <p className="invalidText">Invalid manufactured year</p>
            )}
          </FloatingLabel>

          <FloatingLabel
            controlId="vehicleNumber"
            label="Vehicle Number"
            className="mb-3 txtInput"
          >
            <Form.Control
              type="text"
              placeholder="Vehicle Number"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
            />
            {!isVehicleNumberValid && (
              <p className="invalidText">Invalid vehicle number</p>
            )}
          </FloatingLabel>

          <FloatingLabel controlId="floatingSelect" label="Select Color">
            <Form.Control
              as="select"
              style={{ width: "75vw", margin: "auto" }}
              className="mb-3"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              aria-label="Select Color"
            >
              <option value="white">White</option>
              <option value="black">Black</option>
              <option value="red">Red</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="yellow">Yellow</option>
            </Form.Control>
          </FloatingLabel>

          <FloatingLabel
            controlId="registrationNumber"
            label="Registration Number"
            className="mb-3 txtInput"
          >
            <Form.Control
              type="text"
              placeholder="Registration Number"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
            />
            {!isRegistrationNumberValid && (
              <p className="invalidText">Registration number cannot be empty</p>
            )}
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
