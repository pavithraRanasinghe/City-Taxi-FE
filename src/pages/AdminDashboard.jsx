import React from "react";
import { Card, Button, Table, Container, Row, Col } from "react-bootstrap";
import { FaUsers, FaCar, FaRoute, FaTachometerAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminDashboard = () => {
  // Dummy data for drivers, passengers, and trips
  const drivers = [
    { id: 1, name: "John Doe", email: "johndoe@taxi.com", status: "Active" },
    { id: 2, name: "Jane Smith", email: "janesmith@taxi.com", status: "Inactive" },
  ];

  const passengers = [
    { id: 1, name: "Mark Johnson", email: "markjohnson@example.com", trips: 10 },
    { id: 2, name: "Sophie Lee", email: "sophielee@example.com", trips: 5 },
  ];

  const trips = [
    { id: 1, driver: "John Doe", passenger: "Mark Johnson", status: "Completed", price: "$20" },
    { id: 2, driver: "Jane Smith", passenger: "Sophie Lee", status: "Cancelled", price: "$15" },
  ];

  return (
    <Container className="mt-5">
      <Row>
        {/* Drivers Section */}
        <Col md={4}>
          <Card className="mb-4 text-center">
            <Card.Body>
              <FaCar size={60} className="mb-3" />
              <Card.Title>Drivers</Card.Title>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((driver) => (
                    <tr key={driver.id}>
                      <td>{driver.name}</td>
                      <td>{driver.email}</td>
                      <td>{driver.status}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button variant="primary">Manage Drivers</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Passengers Section */}
        <Col md={4}>
          <Card className="mb-4 text-center">
            <Card.Body>
              <FaUsers size={60} className="mb-3" />
              <Card.Title>Passengers</Card.Title>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Trips</th>
                  </tr>
                </thead>
                <tbody>
                  {passengers.map((passenger) => (
                    <tr key={passenger.id}>
                      <td>{passenger.name}</td>
                      <td>{passenger.email}</td>
                      <td>{passenger.trips}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button variant="primary">Manage Passengers</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Trips Section */}
        <Col md={4}>
          <Card className="mb-4 text-center">
            <Card.Body>
              <FaRoute size={60} className="mb-3" />
              <Card.Title>Trips</Card.Title>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Driver</th>
                    <th>Passenger</th>
                    <th>Status</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((trip) => (
                    <tr key={trip.id}>
                      <td>{trip.driver}</td>
                      <td>{trip.passenger}</td>
                      <td>{trip.status}</td>
                      <td>{trip.price}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button variant="primary">Manage Trips</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Additional Section */}
      <Row>
        <Col md={12}>
          <Card className="text-center">
            <Card.Body>
              <FaTachometerAlt size={60} className="mb-3" />
              <Card.Title>Dashboard Overview</Card.Title>
              <p>Monitor and manage drivers, passengers, and trips effectively.</p>
              <Button variant="success">View Detailed Reports</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
