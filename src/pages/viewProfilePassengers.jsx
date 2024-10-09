import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Container } from "react-bootstrap";
import { FaStar } from "react-icons/fa";

// Dummy Passenger Data (Same as ManagePassengers)
const passengersData = [
  { id: 1, name: "Alice Brown", email: "alice@taxi.com", phone: "555-1111", status: "Active", trips: 12, bio: "Alice is a frequent traveler and enjoys exploring new places." },
  { id: 2, name: "Bob White", email: "bob@taxi.com", phone: "555-2222", status: "Inactive", trips: 7, bio: "Bob loves adventure and has traveled extensively." },
  { id: 3, name: "Charlie Black", email: "charlie@taxi.com", phone: "555-3333", status: "Active", trips: 15, bio: "Charlie is a business professional who travels often for work." },
];

const ViewPassenger = () => {
  const { passengerId } = useParams(); // Get passenger ID from route params
  const navigate = useNavigate(); // Use navigate for going back

  // Find the passenger based on the ID
  const passenger = passengersData.find((p) => p.id === parseInt(passengerId));

  if (!passenger) {
    return <p>Passenger not found</p>;
  }

  return (
    <Container className="mt-5">
      <Button variant="secondary" onClick={() => navigate(-1)} className="mb-4">
        Back to Passengers
      </Button>

      <Card className="shadow-sm">
        <Card.Body>
          <h2>{passenger.name}</h2>
          <p><strong>Email:</strong> {passenger.email}</p>
          <p><strong>Phone:</strong> {passenger.phone}</p>
          <p><strong>Status:</strong> {passenger.status}</p>
          <p><strong>Trips:</strong> {passenger.trips}</p>
          <p><strong>Bio:</strong> {passenger.bio}</p>

          <h4>Rating</h4>
          <span className="text-warning">
            {[...Array(5)].map((star, i) => (
              <FaStar key={i} color={i < Math.round(4.5) ? "gold" : "lightgray"} /> // Assuming an average rating of 4.5 for demonstration
            ))}{" "}
            4.5
          </span>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ViewPassenger;
