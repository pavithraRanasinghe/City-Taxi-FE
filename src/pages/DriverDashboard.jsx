import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaCar, FaMoneyBillWave, FaStar } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { request } from "../common/APIManager";
import * as Constants from "../common/Constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUser } from "../common/PersistanceManager";
import "./css/DriverDashboard.css";

const DriverDashboard = () => {
  const [completedTrips, setCompletedTrips] = useState(0);
  const [ongoingTrips, setOngoingTrips] = useState([]);
  const [earnings, setEarnings] = useState(150.0);
  const [rating, setRating] = useState(4.8);

  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState(false);
  const [driver, setDriver] = useState(null);

  useEffect(() => {
    getCurrentLocation();
    loadDashboardData();
    loadTripsByStatus("PENDING");
    updateCurrentLocation();
    findDriver();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          setLocationError(false); // Reset error if location is successfully retrieved
        },
        (error) => {
          setLocationError(true); // Set error when geolocation is denied or unavailable
          console.error("Error retrieving location:", error);
        }
      );
    } else {
      setLocationError(true); // Set error if the browser doesn't support Geolocation API
    }
  };

  const updateCurrentLocation = () => {
    if (currentLocation !== null) {
      const url = `v1/driver/update-location/${getUser().userId}?longitude=${
        currentLocation.lng
      }&latitude=${currentLocation.lat}`;

      request(url, Constants.PUT).catch((error) => {
        if (error !== 200) toast.error("Location not updated");
      });
    }
  };

  const loadDashboardData = () => {
    const url = `v1/dashboard/${getUser().userId}`;
    request(url, Constants.GET)
      .then((response) => {
        setCompletedTrips(response.completedTripCount);
        setOngoingTrips(response.ongoingTripCount);
        setEarnings(response.totalEarning);
        setRating(response.rating);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const loadTripsByStatus = (status) => {
    const url = `v1/trip/trips/driver?driverId=${
      getUser().userId
    }&status=${status}`;

    request(url, Constants.GET)
      .then((response) => {
        console.log("RESPONSE : ", response);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const findDriver = () => {
    const url = `v1/driver/${getUser().userId}`;
    request(url, Constants.GET).then((response) => {
      setDriver(response);
    });
  };

  return (
    <>
      <Container fluid className="mt-4">
        <h2 className="text-center">Driver Dashboard</h2>
        <div className="driver-status">{driver && driver.status}</div>

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
        {/* <Row className="mt-4">
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
        </Row> */}

        {/* Ongoing Trip Details */}
        <Row className="mt-4">
          <Col md={12}>
            {ongoingTrips > 0 ? (
              <>
                <Card>
                  <Card.Header>Ongoing Trip Details</Card.Header>
                  {ongoingTrips.map((tripDetail) => {
                    <Card.Body>
                      <Row>
                        <Col>
                          <Card.Text>
                            <p>
                              <strong>Pickup Location:</strong> 123 Main St
                            </p>
                          </Card.Text>
                        </Col>
                        <Col>
                          <Button variant="success">Navigate</Button>
                        </Col>
                      </Row>
                    </Card.Body>;
                  })}
                </Card>
              </>
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
      <ToastContainer />
    </>
  );
};

export default DriverDashboard;
