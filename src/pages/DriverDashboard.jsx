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
  const [completedTripCount, setCompletedTripCount] = useState(0);
  const [ongoingTripCount, setOngoingTripCount] = useState(0);
  const [ongoingTrips, setOngoingTrips] = useState([]);
  const [earnings, setEarnings] = useState(150.0);
  const [rating, setRating] = useState(4.8);

  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState(false);
  const [driver, setDriver] = useState(null);
  const [statusColor, setStatusColor] = useState("Blue");

  useEffect(() => {
    getCurrentLocation();
    loadDashboardData();
    loadTripsByStatus("PENDING");
    // updateCurrentLocation();
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
        setCompletedTripCount(response.completedTripCount);
        setOngoingTripCount(response.onGoingTripCount);
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
        setOngoingTrips(response);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const findDriver = () => {
    const url = `v1/driver/${getUser().userId}`;
    request(url, Constants.GET).then((response) => {
      console.log(response);
      switch (response.status) {
        case "AVAILABLE":
          setStatusColor("blue");
          break;
        case "BUSY":
          setStatusColor("darkred");
          break;
        case "BLOCKED":
          setStatusColor("black");
          break;
        default:
          setStatusColor("blue");
          break;
      }
      setDriver(response);
    });
  };

  const onAccept = (tripId) => {
    const url = `v1/trip/${tripId}/status?status=CONFIRM`;
    request(url, Constants.PUT)
      .then((response) => {
        toast.success("Trip Confirmed");
        loadTripsByStatus("PENDING");
      })
      .catch((error) => {
        console.log("ERROR : ", error);
        toast.error("Trip not confirmed");
      });
  };

  return (
    <>
      {getUser().onTrip && (
        <div className="banner" style={{ backgroundColor: statusColor }}>
          {driver && driver.status}
        </div>
      )}
      <Container fluid className="mt-4">
        <h2 className="text-center">Driver Dashboard</h2>

        {/* Ongoing Trip Details */}
        <Row className="mt-4">
          <Col md={12}>
            {ongoingTrips.length > 0 && (
              <>
                <Card>
                  <Card.Header>Pending Trip Details</Card.Header>
                  {ongoingTrips.map((tripDetail, index) => (
                    <Card.Body key={index}>
                      <Row>
                        <Col xs={8}>
                          <Card.Text>
                            <p>
                              <strong>Passneger :</strong>{" "}
                              {tripDetail.passenger.firstName}{" "}
                              {tripDetail.passenger.lastName}
                            </p>
                            <p>
                              <strong>Pickup Location:</strong>{" "}
                              {tripDetail.startLocationName}
                            </p>
                          </Card.Text>
                        </Col>
                        <Col xs={4} className="btn-card">
                          <Button
                            variant="success"
                            onClick={() => onAccept(tripDetail.id)}
                          >
                            ACCEPT
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  ))}
                </Card>
              </>
            )}
          </Col>
        </Row>

        {/* Top Row: Key Stats */}
        <Row className="mt-4">
          {/* Completed Trips */}
          <Col md={3}>
            <Card className="text-center mb-4">
              <Card.Body>
                <FaCar size={50} color="#007bff" />
                <Card.Title className="mt-3">Completed Trips</Card.Title>
                <Card.Text>{completedTripCount}</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {/* Ongoing Trips */}
          <Col md={3}>
            <Card className="text-center mb-4">
              <Card.Body>
                <FaCar size={50} color="#28a745" />
                <Card.Title className="mt-3">Ongoing Trips</Card.Title>
                <Card.Text>{ongoingTripCount}</Card.Text>
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
      </Container>
      <ToastContainer />
    </>
  );
};

export default DriverDashboard;
