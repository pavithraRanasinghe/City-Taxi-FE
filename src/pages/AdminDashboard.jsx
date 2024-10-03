import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { FaUsers, FaCar, FaMoneyBillWave, FaMapMarkedAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import { request } from '../common/APIManager'; // Assuming you have an APIManager for handling requests
import AdminSideNav from "../components/AdminSideNav";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalDrivers: 0,
    totalPassengers: 0,
    ongoingTrips: 0,
    totalEarnings: 0,
  });

  // Sample activities data for demonstration
  const [activities, setActivities] = useState([
    {
      driverName: "John Doe",
      action: "Completed a trip to Downtown",
      timestamp: "2024-09-25T14:48:00Z",
    },
    {
      driverName: "Jane Smith",
      action: "Updated vehicle details",
      timestamp: "2024-09-25T13:30:00Z",
    },
    {
      driverName: "Sam Lee",
      action: "Changed availability to AVAILABLE",
      timestamp: "2024-09-25T12:15:00Z",
    },
  ]);

  // Sample feedback data for demonstration
  const [feedback, setFeedback] = useState([
    {
      passengerName: "Passenger 1",
      feedback: "Rated Driver 1 - 5 Stars",
      timestamp: "2024-09-25T14:00:00Z",
    },
    {
      passengerName: "Passenger 2",
      feedback: "Rated Driver 2 - 4 Stars",
      timestamp: "2024-09-25T13:15:00Z",
    },
    {
      passengerName: "Passenger 3",
      feedback: "Reported an issue with the trip",
      timestamp: "2024-09-25T12:00:00Z",
    },
  ]);

  useEffect(() => {
    // Fetch data for the dashboard
    const fetchData = async () => {
      try {
        const response = await request("/admin/dashboard-stats", "GET"); // Example API call
        setData({
          totalDrivers: response.totalDrivers,
          totalPassengers: response.totalPassengers,
          ongoingTrips: response.ongoingTrips,
          totalEarnings: response.totalEarnings,
        });
        // Fetch activities data as well if needed
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <AdminSideNav />
      <Container fluid>
        <h2 className="my-4">Admin Dashboard</h2>
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <FaCar size={40} style={{ color: "#3498db" }} />{" "}
                {/* Blue icon for drivers */}
                <h3>{data.totalDrivers}</h3>
                <p>Total Drivers</p>
                <Link to="/admin/manage-drivers">Manage Drivers</Link>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <FaUsers size={40} style={{ color: "#2ecc71" }} />{" "}
                {/* Green icon for passengers */}
                <h3>{data.totalPassengers}</h3>
                <p>Total Passengers</p>
                <Link to="/admin/manage-passengers">Manage Passengers</Link>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <FaMapMarkedAlt size={40} style={{ color: "#e67e22" }} />{" "}
                {/* Orange icon for trips */}
                <h3>{data.ongoingTrips}</h3>
                <p>Ongoing Trips</p>
                <Link to="/admin/manage-trips">View Trips</Link>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <FaMoneyBillWave size={40} style={{ color: "#f1c40f" }} />{" "}
                {/* Yellow icon for earnings */}
                <h3>${data.totalEarnings}</h3>
                <p>Total Earnings</p>
                <Link to="/admin/reports">View Financial Reports</Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Card className="mt-4">
              <Card.Header className="bg-primary text-white">
                <h5>Recent Driver Activity</h5>
              </Card.Header>
              <ListGroup variant="flush">
                {activities.length === 0 ? (
                  <ListGroup.Item>No recent activities found.</ListGroup.Item>
                ) : (
                  activities.map((activity, index) => (
                    <ListGroup.Item
                      key={index}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong>{activity.driverName}</strong> -{" "}
                        {activity.action}
                      </div>
                      <div className="text-muted">
                        {new Date(activity.timestamp).toLocaleString()}
                      </div>
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="mt-4">
              <Card.Header className="bg-warning text-white">
                <h5>Recent Passenger Feedback</h5>
              </Card.Header>
              <ListGroup variant="flush">
                {feedback.length === 0 ? (
                  <ListGroup.Item>No recent feedback found.</ListGroup.Item>
                ) : (
                  feedback.map((item, index) => (
                    <ListGroup.Item
                      key={index}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong>{item.passengerName}</strong> - {item.feedback}
                      </div>
                      <div className="text-muted">
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AdminDashboard;
