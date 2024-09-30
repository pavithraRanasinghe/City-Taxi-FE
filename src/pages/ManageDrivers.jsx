import React, { useState, useEffect } from "react";
import { Card, Button, Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import { FaSearch, FaCar, FaStar, FaFilePdf } from "react-icons/fa";
import { jsPDF } from "jspdf"; // Import jsPDF for PDF generation
import { useNavigate } from "react-router-dom"; // Replaced useHistory with useNavigate
import "bootstrap/dist/css/bootstrap.min.css";

// Dummy Driver Data
const driversData = [
  { id: 1, name: "John Doe", email: "johndoe@taxi.com", phone: "555-1234", status: "Active", experience: "5 years", rating: 4.5, bio: "John has been a professional driver for 5 years. He is known for his friendly demeanor and timely service." },
  { id: 2, name: "Jane Smith", email: "janesmith@taxi.com", phone: "555-5678", status: "Inactive", experience: "3 years", rating: 4.0, bio: "Jane is a dedicated driver with 3 years of experience. She ensures a comfortable and safe ride for her passengers." },
  { id: 3, name: "Sam Lee", email: "samlee@taxi.com", phone: "555-9876", status: "Active", experience: "4 years", rating: 4.3, bio: "Sam has been driving for 4 years and has a reputation for efficiency and professionalism." },
];

const ManageDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const navigate = useNavigate(); // Use navigate for page navigation

  useEffect(() => {
    // In a real-world app, this data would be fetched from the server
    setDrivers(driversData);
    setFilteredDrivers(driversData);
  }, []);

  // Handle search input
  const handleSearch = (e) => {
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
  };

  // Function to generate PDF report
  const exportPDF = () => {
    const doc = new jsPDF();

    // Title for the PDF
    doc.text("Drivers Report", 20, 10);

    // Table headers
    doc.autoTable({
      head: [["ID", "Name", "Email", "Phone", "Status", "Experience", "Rating"]],
      body: filteredDrivers.map((driver) => [
        driver.id,
        driver.name,
        driver.email,
        driver.phone,
        driver.status,
        driver.experience,
        driver.rating,
      ]),
    });

    // Save the PDF
    doc.save("drivers_report.pdf");
  };

  // Navigate to Driver Profile page
  const viewProfileDriver = (driverId) => {
    navigate(`/driver/${driverId}`); // Use navigate instead of history.push
  };

  return (
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
                  <FaCar size={40} className="mr-3" />
                  <div>
                    <h5 className="mb-1">{driver.name}</h5>
                    <p className="mb-0 text-muted">{driver.email}</p>
                  </div>
                </div>

                <Card.Text>
                  <strong>Phone:</strong> {driver.phone}
                  <br />
                  <strong>Status:</strong>{" "}
                  <span className={driver.status === "Active" ? "text-success" : "text-danger"}>
                    {driver.status}
                  </span>
                  <br />
                  <strong>Experience:</strong> {driver.experience}
                  <br />
                  <strong>Rating:</strong>{" "}
                  <span className="text-warning">
                    {[...Array(5)].map((star, i) => (
                      <FaStar key={i} color={i < Math.round(driver.rating) ? "gold" : "lightgray"} />
                    ))}{" "}
                    {driver.rating}
                  </span>
                </Card.Text>
              </Card.Body>

              <Card.Footer className="text-right">
                {/* Action Buttons */}
                <Button
                  variant="outline-primary"
                  className="mr-2"
                  onClick={() => viewProfileDriver(driver.id)} // Navigate to the profile page
                >
                  View Profile
                </Button>
                <Button variant={driver.status === "Active" ? "danger" : "success"}>
                  {driver.status === "Active" ? "Deactivate" : "Activate"}
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ManageDrivers;
