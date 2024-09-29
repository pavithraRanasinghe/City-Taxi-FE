import React, { useState, useEffect } from "react";
import { Table, Button, Container, Row, Col } from "react-bootstrap";
import { FaDownload } from "react-icons/fa";
//import { CSVLink } from "react-csv";
import "bootstrap/dist/css/bootstrap.min.css";

// Dummy Driver Data
const driversData = [
  { id: 1, name: "John Doe", email: "johndoe@taxi.com", phone: "555-1234", status: "Active", experience: "5 years", rating: "4.5" },
  { id: 2, name: "Jane Smith", email: "janesmith@taxi.com", phone: "555-5678", status: "Inactive", experience: "3 years", rating: "4.0" },
  { id: 3, name: "Sam Lee", email: "samlee@taxi.com", phone: "555-9876", status: "Active", experience: "4 years", rating: "4.3" },
];

const ManageDrivers = () => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    // In a real-world app, this data would be fetched from the server
    setDrivers(driversData);
  }, []);

  const csvHeaders = [
    { label: "ID", key: "id" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    { label: "Status", key: "status" },
    { label: "Experience", key: "experience" },
    { label: "Rating", key: "rating" },
  ];

  const csvReport = {
    filename: "Drivers_Report.csv",
    headers: csvHeaders,
    data: drivers,
  };

  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col md={9}>
          <h1>Manage Drivers</h1>
        </Col>
        <Col md={3} className="text-right">
          <Button variant="success">
            <FaDownload />{" "}
            {/* <CSVLink {...csvReport} style={{ color: "white", textDecoration: "none" }}>
              Download Driver Report
            </CSVLink> */}
          </Button>
        </Col>
      </Row>

      {/* Drivers Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Experience</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.id}>
              <td>{driver.id}</td>
              <td>{driver.name}</td>
              <td>{driver.email}</td>
              <td>{driver.phone}</td>
              <td>{driver.status}</td>
              <td>{driver.experience}</td>
              <td>{driver.rating}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ManageDrivers;
