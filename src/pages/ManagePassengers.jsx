import React, { useState, useEffect } from "react";
import { Card, Button, Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import { FaSearch, FaUserAlt, FaFilePdf } from "react-icons/fa";
import { jsPDF } from "jspdf";  // Import jsPDF for PDF generation
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "bootstrap/dist/css/bootstrap.min.css";

// Dummy Passenger Data
const passengersData = [
  { id: 1, name: "Alice Brown", email: "alice@taxi.com", phone: "555-1111", status: "Active", trips: 12 },
  { id: 2, name: "Bob White", email: "bob@taxi.com", phone: "555-2222", status: "Inactive", trips: 7 },
  { id: 3, name: "Charlie Black", email: "charlie@taxi.com", phone: "555-3333", status: "Active", trips: 15 },
];

const ManagePassengers = () => {
  const [passengers, setPassengers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPassengers, setFilteredPassengers] = useState([]);
  const navigate = useNavigate(); // Use useNavigate for navigation

  useEffect(() => {
    // In a real-world app, this data would be fetched from the server
    setPassengers(passengersData);
    setFilteredPassengers(passengersData);
  }, []);

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
  const exportPDF = () => {
    const doc = new jsPDF();

    // Title for the PDF
    doc.text("Passengers Report", 20, 10);

    // Table headers
    doc.autoTable({
      head: [["ID", "Name", "Email", "Phone", "Status", "Trips"]],
      body: filteredPassengers.map((passenger) => [
        passenger.id,
        passenger.name,
        passenger.email,
        passenger.phone,
        passenger.status,
        passenger.trips,
      ]),
    });

    // Save the PDF
    doc.save("passengers_report.pdf");
  };

  // Navigate to Passenger Profile page
  const viewPassengerProfile = (passengerId) => {
    navigate(`/passenger/${passengerId}`);
  };

  return (
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

      {/* Export PDF Button */}
      <Row className="mb-4">
        <Col className="text-right">
          <Button variant="danger" onClick={exportPDF}>
            <FaFilePdf /> Export PDF
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
                    <h5 className="mb-1">{passenger.name}</h5>
                    <p className="mb-0 text-muted">{passenger.email}</p>
                  </div>
                </div>

                <Card.Text>
                  <strong>Phone:</strong> {passenger.phone}
                  <br />
                  <strong>Status:</strong>{" "}
                  <span className={passenger.status === "Active" ? "text-success" : "text-danger"}>
                    {passenger.status}
                  </span>
                  <br />
                  <strong>Trips:</strong> {passenger.trips}
                </Card.Text>
              </Card.Body>

              <Card.Footer className="text-right">
                {/* Action Buttons */}
                <Button variant="outline-primary" className="mr-2" onClick={() => viewPassengerProfile(passenger.id)}>
                  View Profile
                </Button>
                <Button variant={passenger.status === "Active" ? "danger" : "success"}>
                  {passenger.status === "Active" ? "Deactivate" : "Activate"}
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ManagePassengers;
