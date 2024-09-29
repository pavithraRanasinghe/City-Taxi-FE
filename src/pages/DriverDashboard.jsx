import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaCar, FaMoneyBillWave, FaStar, FaBell } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const DriverDashboard = () => {
  // Mock data (replace this with your API data)
  const [completedTrips, setCompletedTrips] = useState(0);
  const [ongoingTrips, setOngoingTrips] = useState(1); // assuming there is 1 ongoing trip
  const [earnings, setEarnings] = useState(150.0); // Example earnings in USD
  const [rating, setRating] = useState(4.8);
  const [notifications, setNotifications] = useState(["New ride request from John Doe"]);

  useEffect(() => {
    // Fetch dashboard data like completed trips, earnings, etc. from your API
    // Example:
    // fetchDashboardData().then(data => {
    //   setCompletedTrips(data.completedTrips);
    //   setOngoingTrips(data.ongoingTrips);
    //   setEarnings(data.earnings);
    //   setRating(data.rating);
    //   setNotifications(data.notifications);
    // });
  }, []);

  return (
    <Container fluid className="mt-4">
      <h2 className="text-center">Driver Dashboard</h2>

      {/* Top Row: Key Stats */}
      <Row className="mt-4">
        {/* Completed Trips */}
        <Col md={3}>
          <Card className="text-center mb-4">
            <Card.Body>
              <FaCar size={50} color="#007bff" />
              <Card.Title className="mt-3">Completed Trips</Card.Title>
              <Card.Text>{completedTrips}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Ongoing Trips */}
        <Col md={3}>
          <Card className="text-center mb-4">
            <Card.Body>
              <FaCar size={50} color="#28a745" />
              <Card.Title className="mt-3">Ongoing Trips</Card.Title>
              <Card.Text>{ongoingTrips}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Earnings */}
        <Col md={3}>
          <Card className="text-center mb-4">
            <Card.Body>
              <FaMoneyBillWave size={50} color="#ffc107" />
              <Card.Title className="mt-3">Earnings</Card.Title>
              <Card.Text>${earnings.toFixed(2)}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Rating */}
        <Col md={3}>
          <Card className="text-center mb-4">
            <Card.Body>
              <FaStar size={50} color="#17a2b8" />
              <Card.Title className="mt-3">Rating</Card.Title>
              <Card.Text>{rating} / 5</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Notifications */}
      <Row className="mt-4">
        <Col md={12}>
          <Card>
            <Card.Header>
              <FaBell /> Notifications
            </Card.Header>
            <Card.Body>
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <div key={index} className="alert alert-info">
                    {notification}
                  </div>
                ))
              ) : (
                <p>No new notifications</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Ongoing Trip Details */}
      <Row className="mt-4">
        <Col md={12}>
          {ongoingTrips > 0 ? (
            <Card>
              <Card.Header>Ongoing Trip Details</Card.Header>
              <Card.Body>
                <p><strong>Pickup Location:</strong> 123 Main St</p>
                <p><strong>Dropoff Location:</strong> 456 Park Ave</p>
                <Button variant="success">Navigate</Button>
              </Card.Body>
            </Card>
          ) : (
            <Card>
              <Card.Body>
                <p>No ongoing trips at the moment.</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default DriverDashboard;
