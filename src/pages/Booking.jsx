import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/Booking.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { request } from "../common/APIManager";
import * as Constants from "../common/Constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUser } from "../common/PersistanceManager";
import PassengerSideNav from "../components/PassengerSideNav";
import { useNavigate } from "react-router-dom";

// Leaflet icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const Booking = () => {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [clickCount, setClickCount] = useState(0);
  const [locationError, setLocationError] = useState(false);
  const [driverList, setDriverList] = useState([]);
  const [showDrivers, setShowDrivers] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState(null);

  const navigate = useNavigate();
  // Geolocation to get user's current location for pickup
  useEffect(() => {
    const currentUser = getUser();

    if (currentUser.onTrip) {
      navigate("/passenger", { replace: true });
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPickupLocation({ lat: latitude, lng: longitude });
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
  }, []);

  const selectDriver = (driver) => {
    setSelectedDriver(driver);
    setSelectedDriverId(driver.driverId);
  };

  const searchDrivers = () => {
    setShowDrivers(true);
    const url = `v1/driver/search?longitude=${pickupLocation.lng}&latitude=${pickupLocation.lat}`;
    request(url, Constants.GET)
      .then((response) => {
        const dataList = response.map((driver) => ({
          driverId: driver.id,
          driverName: `${driver.firstName} ${driver.lastName}`,
          vehicleName: driver.vehicle.name,
          vehicleNumber: driver.vehicle.vehicleNumber,
        }));
        setDriverList(dataList);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  // Component for handling clicks on the map
  const LocationSelector = () => {
    useMapEvents({
      click(e) {
        if (clickCount === 0) {
          setPickupLocation(e.latlng); // First click for pickup location
          setClickCount(1);
        } else if (clickCount === 1) {
          setDropoffLocation(e.latlng); // Second click for dropoff location
          setClickCount(0);
        }
      },
    });

    return null;
  };

  const clearSelection = () => {
    setClickCount(0);
    setPickupLocation(null);
    setDropoffLocation(null);
  };

  const placeTrip = () => {
    const body = JSON.stringify({
      startLongitude: pickupLocation.lng,
      startLatitude: pickupLocation.lat,
      endLongitude: dropoffLocation.lng,
      endLatitude: dropoffLocation.lat,
      startLocationName: "START LOC",
      endLocationName: "END LOC",
      driverId: selectedDriver.driverId,
      passengerId: getUser().userId,
    });
    const url = "v1/trip";
    request(url, Constants.POST, body)
      .then((response) => {
        navigate("/passenger", { replace: true });
        toast.success("Trip Saved");
      })
      .catch(() => {
        toast.error("Failed to book a trip");
      });
  };

  return (
    <>
      <PassengerSideNav />
      <Container>
        <div className="text-center mt-4">
          <h1>Taxi Booking Service</h1>
        </div>

        {/* Fallback Message when location services are off */}
        {locationError && (
          <Alert variant="warning" className="mt-4">
            <strong>Location services are off!</strong> Please enable location
            services in your browser or device settings to use this feature.
          </Alert>
        )}

        {/* Map Section */}
        <div className="mt-5">
          <h2>Select Pickup & Dropoff Location</h2>
          <MapContainer
            center={[7.8731, 80.7718]} // Sri Lanka coordinates
            zoom={8}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {pickupLocation && <Marker position={pickupLocation} />}
            {dropoffLocation && <Marker position={dropoffLocation} />}

            <LocationSelector />
          </MapContainer>
          <Button
            className="btn-clear"
            variant="primary"
            onClick={clearSelection}
          >
            Clear Selection
          </Button>
        </div>

        {/* Booking Form Section */}
        <div className="booking-form mt-1">
          <h2>Book Your Ride</h2>
          <Form>
            <Form.Group>
              <Form.Label>Pickup Location</Form.Label>
              <Form.Control
                type="text"
                value={
                  pickupLocation
                    ? `${pickupLocation.lat}, ${pickupLocation.lng}`
                    : ""
                }
                readOnly
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Dropoff Location</Form.Label>
              <Form.Control
                type="text"
                value={
                  dropoffLocation
                    ? `${dropoffLocation.lat}, ${dropoffLocation.lng}`
                    : ""
                }
                readOnly
              />
            </Form.Group>
            <Button
              className="btn-search"
              variant="primary"
              onClick={searchDrivers}
            >
              Search Drivers
            </Button>
            {showDrivers && (
              <Row className="mt-1">
                <Col md={6}>
                  <h2>Select a Driver</h2>
                  <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
                    {driverList.length === 0 && (
                      <>
                        <h3>Drivers not found</h3>
                      </>
                    )}
                    {driverList.length > 0 &&
                      driverList.map((driver, index) => (
                        <Card
                          className="driver-item mb-3"
                          key={index}
                          onClick={() => selectDriver(driver)}
                          style={{
                            cursor: "pointer",
                            border:
                              selectedDriverId === driver.driverId
                                ? "2px solid blue"
                                : "none",
                          }} // Change border color if selected
                        >
                          <Card.Body>
                            <h5 className="card-title">{driver.driverName}</h5>
                            <p className="card-text">
                              Vehicle : {driver.vehicleName}
                            </p>
                            <p className="card-text">
                              Rating: ⭐⭐⭐⭐☆ (4.5/5)
                            </p>
                          </Card.Body>
                        </Card>
                      ))}
                  </div>
                </Col>
              </Row>
            )}
          </Form>
          <Form>
            <Form.Group>
              <Form.Label>Selected Driver</Form.Label>
              <Form.Control
                type="text"
                value={selectedDriver && selectedDriver.driverName}
                readOnly
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Selected Car</Form.Label>
              <Form.Control
                type="text"
                value={selectedDriver && selectedDriver.vehicleName}
                readOnly
              />
            </Form.Group>
            <Button
              className="btn-search"
              variant="primary"
              onClick={placeTrip}
            >
              Start a Ride
            </Button>
          </Form>
        </div>
        <ToastContainer />
      </Container>
    </>
  );
};

export default Booking;
