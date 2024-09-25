import React, { useState } from "react";
import { Card, Form, Button, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const TaxiBooking = () => {
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedCar, setSelectedCar] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [dateTime, setDateTime] = useState("");

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

  const selectDriver = (driver) => {
    setSelectedDriver(driver);
    setVehicles(driverVehicles[driver]); // Update vehicles based on selected driver
    setSelectedCar(""); // Reset car selection
  };

  const selectCar = (car) => {
    setSelectedCar(car);
  };

  const bookRide = () => {
    if (selectedDriver && selectedCar && pickupLocation && dropoffLocation && dateTime) {
      alert(`Ride booked successfully!\nDriver: ${selectedDriver}\nCar: ${selectedCar}\nPickup: ${pickupLocation}\nDropoff: ${dropoffLocation}\nDate & Time: ${dateTime}`);
    } else {
      alert("Please fill in all details.");
    }
  };

  return (
    <Container>
      <div className="text-center mt-4">
        <h1>Taxi Booking Service</h1>
      </div>

      <Row className="mt-5">
        {/* Driver List Section */}
        <Col md={6}>
          <h2>Select a Driver</h2>
          <div style={{ maxHeight: '400px', overflowY: 'scroll' }}>
            {Object.keys(driverVehicles).map(driver => (
              <Card className="driver-item mb-3" key={driver} onClick={() => selectDriver(driver)} style={{ cursor: 'pointer' }}>
                <Card.Body>
                  <h5 className="card-title">{driver}</h5>
                  <p className="card-text">Experience: {driver === "John Doe" ? "5 years" : driver === "Jane Smith" ? "3 years" : "4 years"}</p>
                  <p className="card-text">Rating: ⭐⭐⭐⭐☆ (4.5/5)</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Col>

        {/* Vehicle List Section */}
        <Col md={6}>
          <h2>Select a Vehicle</h2>
          <div style={{ maxHeight: '400px', overflowY: 'scroll' }}>
            {vehicles.map(vehicle => (
              <Card className="car-item mb-3" key={vehicle.name} onClick={() => selectCar(vehicle.name)} style={{ cursor: 'pointer' }}>
                <img src={vehicle.image} alt={vehicle.name} style={{ width: '100%', height: 'auto' }} />
                <Card.Body>
                  <h5 className="card-title">{vehicle.name}</h5>
                  <p className="card-text">Type: {vehicle.type}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Col>
      </Row>

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
            <Form.Control type="text" placeholder="Enter pickup location" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Dropoff Location</Form.Label>
            <Form.Control type="text" placeholder="Enter dropoff location" value={dropoffLocation} onChange={(e) => setDropoffLocation(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Date & Time</Form.Label>
            <Form.Control type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
          </Form.Group>
          <Button variant="primary" onClick={bookRide}>Book Now</Button>
        </Form>
      </div>
    </Container>
  );
};

export default TaxiBooking;
