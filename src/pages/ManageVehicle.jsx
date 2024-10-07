import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Form,
  InputGroup,
} from "react-bootstrap";
import { FaSearch, FaCar, FaStar, FaFilePdf } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; // Replaced useHistory with useNavigate
import "bootstrap/dist/css/bootstrap.min.css";
import { request } from "../common/APIManager";
import * as Constants from "../common/Constants";
import generateExcelFile from "../util/fileUtil";

const ManageVehicle = () => {
  const [vehicle, setVehicle] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVehicle, setFilteredVehicle] = useState([]);
  const navigate = useNavigate(); // Use navigate for page navigation

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = () => {
    const url = "v1/vehicle";
    request(url, Constants.GET)
      .then((response) => {
        setVehicle(response);
        setFilteredVehicle(response);
      })
      .catch((error) => {
        console.log("Vehicle not loaded ", error);
      });
  };
  // Handle search input
  const handleSearch = (e) => {
    if (e.target.value !== undefined) {
      const query = e.target.value.toLowerCase();
      setSearchQuery(query);

      // Filter drivers based on search query
      const filtered = vehicle.filter(
        (driver) =>
          driver.name.toLowerCase().includes(query) ||
          driver.email.toLowerCase().includes(query) ||
          driver.phone.includes(query)
      );
      setFilteredVehicle(filtered);
    }
  };

  // Function to generate PDF report
  const exportReport = async () => {
    try {
      const jsonData = filteredVehicle.map((vehicle) => {
        const driver = vehicle.driver
          ? vehicle.driver.firstName + " " + vehicle.driver.lastName
          : "";
        return [
          vehicle.id,
          vehicle.name,
          vehicle.type,
          vehicle.color,
          driver,
          vehicle.vehicleNumber,
          vehicle.registrationNumber,
        ];
      });
      // Define headers as an array of objects
      const headers = [
        { header: "ID", key: "id", width: 10 },
        { header: "Name", key: "name", width: 20 },
        { header: "Type", key: "type", width: 15 },
        { header: "Color", key: "color", width: 15 },
        { header: "Driver", key: "driver", width: 15 },
        { header: "Vehicle Number", key: "vehicleNumber", width: 20 },
        { header: "Reg Number", key: "registrationNumber", width: 10 },
      ];
      await generateExcelFile(headers, jsonData, "Vehicle");
      toast.success("Report generated successful");
    } catch (error) {
      console.log("ER : ", error);
      toast.error("Failed generate Report");
    }
  };

  // Navigate to Driver Profile page
  const viewProfileDriver = (driverId) => {
    navigate("/view-driver", {
      state: { driverId: driverId },
    });
  };

  return (
    <>
      <Container className="mt-5">
        <Row className="mb-4">
          <Col md={9}>
            <h1>Manage Vehicle</h1>
          </Col>
          <Col md={3}>
            {/* Search Bar */}
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search drivers..."
                value={searchQuery}
                onChange={handleSearch}
              />
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
            </InputGroup>
          </Col>
        </Row>

        {/* Export PDF Button */}
        <Row className="mb-4">
          <Col className="text-right">
            <Button variant="success" onClick={exportReport}>
              <FaFilePdf /> Export Report
            </Button>
          </Col>
        </Row>

        {/* Drivers Cards */}
        <Row>
          {filteredVehicle.map((vehicle) => (
            <Col md={4} key={vehicle.id} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    {/* Driver Icon */}
                    <FaCar size={40} style={{ marginRight: "1rem" }} />
                    <div>
                      <h5 className="mb-1">
                        {vehicle.name} {vehicle.model}
                      </h5>
                      <p className="mb-0 text-muted">{vehicle.email}</p>
                    </div>
                  </div>

                  <Card.Text>
                    <strong>Color:</strong> {vehicle.color}
                    <br />
                    <strong>Vehicle Number:</strong> {vehicle.vehicleNumber}
                    <br />
                    <strong>Type:</strong> {vehicle.type}
                    <br />
                    {vehicle.driver && (
                      <>
                        <strong>Driver:</strong> {vehicle.driver.firstName}{" "}
                        {vehicle.driver.lastName}
                        <br />
                      </>
                    )}
                    <strong>Reg Number:</strong> {vehicle.registrationNumber}
                    <br />
                  </Card.Text>
                </Card.Body>

                <Card.Footer className="text-right">
                  {/* Action Buttons */}
                  <Button
                    variant="outline-primary"
                    style={{ marginRight: "1rem" }}
                    onClick={() => viewProfileDriver(vehicle.id)} // Navigate to the profile page
                  >
                    View Profile
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <ToastContainer />
    </>
  );
};

export default ManageVehicle;
