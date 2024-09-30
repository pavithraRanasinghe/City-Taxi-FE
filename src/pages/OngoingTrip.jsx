import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Container } from "react-bootstrap";

// Dummy Trip Data
const ongoingTripsData = [
  {
    id: 1,
    passengerName: "Alice Brown",
    driverName: "John Doe",
    vehicle: "Toyota Camry",
    licensePlate: "XYZ 1234",
    pickupLocation: "123 Main St, City",
    dropOffLocation: "456 Elm St, City",
    status: "Ongoing",
  },
  {
    id: 2,
    passengerName: "Bob White",
    driverName: "Jane Smith",
    vehicle: "Honda Accord",
    licensePlate: "ABC 5678",
    pickupLocation: "789 Maple Ave, City",
    dropOffLocation: "321 Oak St, City",
    status: "Ongoing",
  },
];

const OngoingTripDetails = () => {
  const { tripId } = useParams(); // Get trip ID from route params
  const navigate = useNavigate(); // Use navigate for going back

  // Find the ongoing trip based on the ID
  const trip = ongoingTripsData.find((t) => t.id === parseInt(tripId));

  if (!trip) {
    return <p>Trip not found</p>;
  }

  return (
    <Container className="mt-5">
      <Button variant="secondary" onClick={() => navigate(-1)} className="mb-4">
        Back to Ongoing Trips
      </Button>

      <Card className="shadow-sm">
        <Card.Body>
          <h2>Ongoing Trip Details</h2>
          <p><strong>Passenger Name:</strong> {trip.passengerName}</p>
          <p><strong>Driver Name:</strong> {trip.driverName}</p>
          <p><strong>Vehicle:</strong> {trip.vehicle}</p>
          <p><strong>License Plate:</strong> {trip.licensePlate}</p>
          <p><strong>Pickup Location:</strong> {trip.pickupLocation}</p>
          <p><strong>Drop-Off Location:</strong> {trip.dropOffLocation}</p>
          <p><strong>Status:</strong> <span className="text-success">{trip.status}</span></p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OngoingTripDetails;
