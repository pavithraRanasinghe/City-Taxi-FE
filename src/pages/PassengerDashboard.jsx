import React, { useEffect, useState } from "react";
import { Card, Button, Table, Container, Row, Col } from "react-bootstrap";
import { FaUser, FaHistory, FaClock } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { getUser } from "../common/PersistanceManager";
import { request } from "../common/APIManager";
import * as Constants from "../common/Constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const PassengerDashboard = () => {
  const [currentUser, setCurrentUser] = useState();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [trip, setTrip] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    currentPassenger();
    getCurrentLocation();
    updateCurrentLocation();
    onGoingTripDetails();
  }, []);

  const currentPassenger = async () => {
    const url = `v1/passenger/${getUser().userId}`;
    await request(url, Constants.GET)
      .then((response) => {
        setCurrentUser(response);
      })
      .catch((error) => {
        console.log("ER : ", error);
      });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error retrieving location:", error);
        }
      );
    } else {
      console.error("Location service not ready");
    }
  };
  const updateCurrentLocation = async () => {
    if (currentLocation !== null) {
      const url = `v1/passenger/update-location/${getUser().userId}?longitude=${
        currentLocation.lng
      }&latitude=${currentLocation.lat}`;

      await request(url, Constants.PUT);
    }
  };

  const onGoingTripDetails = () => {
    const url = `v1/trip/passenger?passengerId=${getUser().userId}`;
    request(url, Constants.GET)
      .then((response) => {
        setTrip(response);
      })
      .catch((error) => {
        console.log("ER : ", error);
      });
  };

  // Dummy data for bookings and upcoming rides
  const bookingHistory = [
    {
      id: 1,
      date: "2023-09-21",
      driver: "John Doe",
      car: "Toyota Prius",
      price: "$25",
      status: "Completed",
    },
    {
      id: 2,
      date: "2023-09-15",
      driver: "Jane Smith",
      car: "Honda Civic",
      price: "$30",
      status: "Completed",
    },
  ];

  const upcomingRides = [
    {
      id: 1,
      date: "2023-10-01",
      driver: "Mike Johnson",
      car: "Tesla Model 3",
      pickup: "City Center",
      dropoff: "Airport",
      status: "Scheduled",
    },
  ];

  const confirmPayment = () => {
    navigate("/payment", {
      state: { tripId: trip.id },
    });
  };

  console.log("TRIP : ", trip);
  console.log("TRIP : ", currentUser);
  console.log("USER : ", trip && trip.passenger.id === currentUser.userId);
  return (
    <>
      {trip && trip.passenger.id === currentUser.id && (
        <div className="banner" onClick={confirmPayment}>
          ON A TRIP
        </div>
      )}
      <Container className="mt-5">
        <Row>
          {/* Profile Card */}
          <Col md={4}>
            <Card className="mb-4 text-center">
              <Card.Body>
                <FaUser size={60} className="mb-3" />
                <Card.Title>Passenger Profile</Card.Title>
                <Card.Text>
                  Name: {getUser().name}
                  <br />
                  Email: {getUser().email} <br />
                </Card.Text>
                <Button variant="primary">Edit Profile</Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Booking History */}
          <Col md={8}>
            <Card className="mb-4">
              <Card.Body>
                <FaHistory size={30} className="mb-3" />
                <Card.Title>Booking History</Card.Title>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Driver</th>
                      <th>Car</th>
                      <th>Price</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingHistory.map((booking) => (
                      <tr key={booking.id}>
                        <td>{booking.date}</td>
                        <td>{booking.driver}</td>
                        <td>{booking.car}</td>
                        <td>{booking.price}</td>
                        <td>{booking.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Upcoming Rides */}
        <Row>
          <Col md={12}>
            <Card>
              <Card.Body>
                <FaClock size={30} className="mb-3" />
                <Card.Title>Upcoming Rides</Card.Title>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Driver</th>
                      <th>Car</th>
                      <th>Pickup</th>
                      <th>Dropoff</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingRides.map((ride) => (
                      <tr key={ride.id}>
                        <td>{ride.date}</td>
                        <td>{ride.driver}</td>
                        <td>{ride.car}</td>
                        <td>{ride.pickup}</td>
                        <td>{ride.dropoff}</td>
                        <td>{ride.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </>
  );
};

export default PassengerDashboard;
