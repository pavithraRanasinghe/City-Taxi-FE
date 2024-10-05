import React, { useState, useEffect } from "react";
import { Card, Button, Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import { FaSearch, FaUserAlt, FaFilePdf } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "bootstrap/dist/css/bootstrap.min.css";
import { request } from "../common/APIManager";
import * as Constants from "../common/Constants";
import generateExcelFile from "../util/fileUtil";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManagePassengers = () => {
  const [passengers, setPassengers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPassengers, setFilteredPassengers] = useState([]);
  const navigate = useNavigate(); // Use useNavigate for navigation

  useEffect(() => {
    loadPassengers();
  }, []);

  const loadPassengers = () => {
    const url = "v1/passenger";
    request(url, Constants.GET)
      .then((response) => {
        setPassengers(response);
        setFilteredPassengers(response);
      })
      .catch((error) => {
        console.log("Divers not loaded ", error);
      });
  };

  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter passengers based on search query
    const filtered = passengers.filter(
      (passenger) =>
        passenger.name.toLowerCase().includes(query) ||
        passenger.email.toLowerCase().includes(query) ||
        passenger.phone.includes(query)
    );
    setFilteredPassengers(filtered);
  };

  // Function to generate PDF report
  const exportExcel = async () => {
    try {
      const jsonData = filteredPassengers.map((passenger) => [
        passenger.id,
        passenger.firstName,
        passenger.lastName,
        passenger.contact,
        passenger.tripCount,
      ]);

      // Define headers as an array of objects
      const headers = [
        { header: "ID", key: "id", width: 10 },
        { header: "FirstName", key: "firstName", width: 20 },
        { header: "LastName", key: "lastName", width: 30 },
        { header: "Phone", key: "contact", width: 15 },
        { header: "Trips", key: "tripCount", width: 10 },
      ];

      // Generate the Excel file with the fetched data and headers
      await generateExcelFile(headers, jsonData, "Passenger1");
      toast.success("Report generated successful");
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate report");
    }
  };

  // Navigate to Passenger Profile page
  const viewPassengerProfile = (passengerId) => {
    navigate(`/passenger/${passengerId}`);
  };

  return (
    <>
      <Container className="mt-5">
        <Row className="mb-4">
          <Col md={9}>
            <h1>Manage Passengers</h1>
          </Col>
          <Col md={3}>
            {/* Search Bar */}
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search passengers..."
                value={searchQuery}
                onChange={handleSearch}
              />
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
            </InputGroup>
          </Col>
        </Row>

        {/* Export Report Button */}
        <Row className="mb-4">
          <Col className="text-right">
            <Button variant="success" onClick={exportExcel}>
              <FaFilePdf /> Export Report
            </Button>
          </Col>
        </Row>

        {/* Passengers Cards */}
        <Row>
          {filteredPassengers.map((passenger) => (
            <Col md={4} key={passenger.id} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    {/* Profile Icon */}
                    <FaUserAlt size={40} className="mr-3" />
                    <div>
                      <h5 className="mb-1">
                        {passenger.firstName} {passenger.lastName}
                      </h5>
                    </div>
                  </div>

                  <Card.Text>
                    <strong>Phone:</strong> {passenger.contact}
                    <br />
                    <strong>Trips:</strong> {passenger.tripCount}
                  </Card.Text>
                </Card.Body>

                <Card.Footer className="text-right">
                  {/* Action Buttons */}
                  <Button
                    variant="outline-primary"
                    className="mr-2"
                    style={{ marginRight: "1rem" }}
                    onClick={() => viewPassengerProfile(passenger.id)}
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

export default ManagePassengers;
