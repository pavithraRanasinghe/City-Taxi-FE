import React, { useState, useEffect } from "react";
import { Card, Button, Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import { FaSearch, FaCar, FaStar, FaFilePdf } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; // Replaced useHistory with useNavigate
import "bootstrap/dist/css/bootstrap.min.css";
import { request } from "../common/APIManager";
import * as Constants from "../common/Constants";
import generateExcelFile from "../util/fileUtil";

// Dummy Driver Data
const driversData = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@taxi.com",
    phone: "555-1234",
    status: "Active",
    experience: "5 years",
    rating: 4.5,
    bio: "John has been a professional driver for 5 years. He is known for his friendly demeanor and timely service.",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "janesmith@taxi.com",
    phone: "555-5678",
    status: "Inactive",
    experience: "3 years",
    rating: 4.0,
    bio: "Jane is a dedicated driver with 3 years of experience. She ensures a comfortable and safe ride for her passengers.",
  },
  {
    id: 3,
    name: "Sam Lee",
    email: "samlee@taxi.com",
    phone: "555-9876",
    status: "Active",
    experience: "4 years",
    rating: 4.3,
    bio: "Sam has been driving for 4 years and has a reputation for efficiency and professionalism.",
  },
];

const ManageDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const navigate = useNavigate(); // Use navigate for page navigation

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = () => {
    const url = "v1/driver";
    request(url, Constants.GET)
      .then((response) => {
        setDrivers(response);
        setFilteredDrivers(response);
      })
      .catch((error) => {
        console.log("Divers not loaded ", error);
      });
  };
  // Handle search input
  const handleSearch = (e) => {
    if (e.target.value !== undefined) {
      const query = e.target.value.toLowerCase();
      setSearchQuery(query);

      // Filter drivers based on search query
      const filtered = drivers.filter(
        (driver) =>
          driver.name.toLowerCase().includes(query) ||
          driver.email.toLowerCase().includes(query) ||
          driver.phone.includes(query)
      );
      setFilteredDrivers(filtered);
    }
  };

  // Function to generate PDF report
  const exportPDF = async () => {
    try {
      const jsonData = filteredDrivers.map((driver) => [
        driver.id,
        driver.firstName,
        driver.lastName,
        driver.contact,
        driver.status,
        driver.rate,
      ]);

      // Define headers as an array of objects
      const headers = [
        { header: "ID", key: "id", width: 10 },
        { header: "First Name", key: "firstName", width: 20 },
        { header: "Last Name", key: "lastName", width: 20 },
        { header: "Contact", key: "contact", width: 15 },
        { header: "Status", key: "status", width: 15 },
        { header: "Rate", key: "rate", width: 10 },
      ];
      // const jsonData = JSON.stringify(aa);
      console.log("JSON : ", jsonData);
      await generateExcelFile(headers, jsonData, "Drivers");
    } catch (error) {
      console.log("ER : ", error);
      toast.error("Failed generate Report");
    }
  };

  // Navigate to Driver Profile page
  const viewProfileDriver = (driverId) => {
    navigate(`/driver/${driverId}`); // Use navigate instead of history.push
  };

  const onActivate = (driverId, toActive) => {
    const url = `v1/driver/${driverId}/update-status?status=${
      toActive ? "AVAILABLE" : "BLOCKED"
    }`;
    request(url, Constants.PUT)
      .then(() => {
        toast.success("Driver update success");
        loadDrivers();
      })
      .catch(() => {
        toast.error("Driver update failed");
      });
  };

  return (
    <>
      <Container className="mt-5">
        <Row className="mb-4">
          <Col md={9}>
            <h1>Manage Drivers</h1>
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
            <Button variant="danger" onClick={exportPDF}>
              <FaFilePdf /> Export PDF
            </Button>
          </Col>
        </Row>

        {/* Drivers Cards */}
        <Row>
          {filteredDrivers.map((driver) => (
            <Col md={4} key={driver.id} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    {/* Driver Icon */}
                    <FaCar size={40} style={{ marginRight: "1rem" }} />
                    <div>
                      <h5 className="mb-1">
                        {driver.firstName} {driver.lastName}
                      </h5>
                      <p className="mb-0 text-muted">{driver.email}</p>
                    </div>
                  </div>

                  <Card.Text>
                    <strong>Phone:</strong> {driver.contact}
                    <br />
                    <strong>Status:</strong>{" "}
                    <span
                      className={
                        driver.status === "AVAILABLE"
                          ? "text-success"
                          : "text-danger"
                      }
                    >
                      {driver.status}
                    </span>
                    <br />
                    <strong>Rating:</strong>{" "}
                    <span className="text-warning">
                      {[...Array(5)].map((star, i) => (
                        <FaStar
                          key={i}
                          color={
                            i < Math.round(driver.rate) ? "gold" : "lightgray"
                          }
                        />
                      ))}{" "}
                      {driver.rate}
                    </span>
                  </Card.Text>
                </Card.Body>

                <Card.Footer className="text-right">
                  {/* Action Buttons */}
                  <Button
                    variant="outline-primary"
                    style={{ marginRight: "1rem" }}
                    onClick={() => viewProfileDriver(driver.id)} // Navigate to the profile page
                  >
                    View Profile
                  </Button>
                  <Button
                    variant={
                      ["AVAILABLE", "BUSY"].includes(driver.status)
                        ? "danger"
                        : "success"
                    }
                    onClick={() => {
                      onActivate(
                        driver.id,
                        !["AVAILABLE", "BUSY"].includes(driver.status)
                      );
                    }}
                  >
                    {["AVAILABLE", "BUSY"].includes(driver.status)
                      ? "Deactivate"
                      : "Activate"}
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

export default ManageDrivers;
