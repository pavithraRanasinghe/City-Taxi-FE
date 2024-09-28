import React, { useState, useEffect } from "react";
import { Card, Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Leaflet icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const TaxiBooking = () => {
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedCar, setSelectedCar] = useState("");
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [dateTime, setDateTime] = useState("");
  const [locationError, setLocationError] = useState(false); // New state to handle location errors

  const driverVehicles = {
    "John Doe": [
      { name: "Car A", type: "Sedan", image: "https://via.placeholder.com/500x300?text=Car+A" },
      { name: "Car B", type: "SUV", image: "https://via.placeholder.com/500x300?text=Car+B" },
    ],
    "Jane Smith": [
      { name: "Car C", type: "Hatchback", image: "https://via.placeholder.com/500x300?text=Car+C" },
    ],
    "Sam Lee": [
      { name: "Car D", type: "Convertible", image: "https://via.placeholder.com/500x300?text=Car+D" },
    ],
  };

  const [vehicles, setVehicles] = useState([]);

  // Geolocation to get user's current location for pickup
  useEffect(() => {
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
    setVehicles(driverVehicles[driver]);
    setSelectedCar("");
  };

  const selectCar = (car) => {
    setSelectedCar(car);
  };

  const bookRide = () => {
    if (selectedDriver && selectedCar && pickupLocation && dropoffLocation && dateTime) {
      alert(`Ride booked successfully!\nDriver: ${selectedDriver}\nCar: ${selectedCar}\nPickup: ${pickupLocation.lat}, ${pickupLocation.lng}\nDropoff: ${dropoffLocation.lat}, ${dropoffLocation.lng}\nDate & Time: ${dateTime}`);
    } else {
      alert("Please fill in all details.");
    }
  };

  // Component for handling clicks on the map
  const LocationSelector = () => {
    const [clickCount, setClickCount] = useState(0);

    useMapEvents({
      click(e) {
        if (clickCount === 0) {
          setPickupLocation(e.latlng); // First click for pickup location
          setClickCount(1);
        } else if (clickCount === 1) {
          setDropoffLocation(e.latlng); // Second click for dropoff location
          setClickCount(2);
        }
      },
    });

    return null;
  };

  return (
    <Container>
      <div className="text-center mt-4">
        <h1>Taxi Booking Service</h1>
      </div>

      <Row className="mt-5">
        <Col md={6}>
          <h2>Select a Driver</h2>
          <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
            {Object.keys(driverVehicles).map((driver) => (
              <Card
                className="driver-item mb-3"
                key={driver}
                onClick={() => selectDriver(driver)}
                style={{ cursor: "pointer" }}
              >
                <Card.Body>
                  <h5 className="card-title">{driver}</h5>
                  <p className="card-text">
                    Experience: {driver === "John Doe" ? "5 years" : driver === "Jane Smith" ? "3 years" : "4 years"}
                  </p>
                  <p className="card-text">Rating: ⭐⭐⭐⭐☆ (4.5/5)</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Col>

        <Col md={6}>
          <h2>Select a Vehicle</h2>
          <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
            {vehicles.map((vehicle) => (
              <Card
                className="car-item mb-3"
                key={vehicle.name}
                onClick={() => selectCar(vehicle.name)}
                style={{ cursor: "pointer" }}
              >
                <img src={vehicle.image} alt={vehicle.name} style={{ width: "100%", height: "auto" }} />
                <Card.Body>
                  <h5 className="card-title">{vehicle.name}</h5>
                  <p className="card-text">Type: {vehicle.type}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Col>
      </Row>

      {/* Fallback Message when location services are off */}
      {locationError && (
        <Alert variant="warning" className="mt-4">
          <strong>Location services are off!</strong> Please enable location services in your browser or device settings to use this feature.
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
      </div>

      {/* Booking Form Section */}
      <div className="booking-form mt-5">
        <h2>Book Your Ride</h2>
        <Form>
          <Form.Group>
            <Form.Label>Selected Driver</Form.Label>
            <Form.Control type="text" value={selectedDriver} readOnly />
          </Form.Group>
          <Form.Group>
            <Form.Label>Selected Car</Form.Label>
            <Form.Control type="text" value={selectedCar} readOnly />
          </Form.Group>
          <Form.Group>
            <Form.Label>Pickup Location</Form.Label>
            <Form.Control
              type="text"
              value={pickupLocation ? `${pickupLocation.lat}, ${pickupLocation.lng}` : ""}
              readOnly
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Dropoff Location</Form.Label>
            <Form.Control
              type="text"
              value={dropoffLocation ? `${dropoffLocation.lat}, ${dropoffLocation.lng}` : ""}
              readOnly
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Date & Time</Form.Label>
            <Form.Control type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
          </Form.Group>
          <Button variant="primary" onClick={bookRide}>
            Book Now
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default TaxiBooking;
