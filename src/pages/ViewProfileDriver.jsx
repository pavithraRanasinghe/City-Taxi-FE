import React from "react";
import { useParams, useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import { Card, Button, Container } from "react-bootstrap";
import { FaStar } from "react-icons/fa";

// Dummy Driver Data (Same as ManageDrivers)
const driversData = [
  { id: 1, name: "John Doe", email: "johndoe@taxi.com", phone: "555-1234", status: "Active", experience: "5 years", rating: 4.5, bio: "John has been a professional driver for 5 years. He is known for his friendly demeanor and timely service." },
  { id: 2, name: "Jane Smith", email: "janesmith@taxi.com", phone: "555-5678", status: "Inactive", experience: "3 years", rating: 4.0, bio: "Jane is a dedicated driver with 3 years of experience. She ensures a comfortable and safe ride for her passengers." },
  { id: 3, name: "Sam Lee", email: "samlee@taxi.com", phone: "555-9876", status: "Active", experience: "4 years", rating: 4.3, bio: "Sam has been driving for 4 years and has a reputation for efficiency and professionalism." },
];

const DriverProfile = () => {
  const { driverId } = useParams(); // Get driver ID from route params
  const navigate = useNavigate(); // Use useNavigate for navigation

  // Find the driver based on the ID
  const driver = driversData.find((driver) => driver.id === parseInt(driverId));

  if (!driver) {
    return <p>Driver not found</p>;
  }

  return (
    <Container className="mt-5">
      {/* Back button to navigate to the previous page */}
      <Button variant="secondary" onClick={() => navigate(-1)} className="mb-4">
        Back to Drivers
      </Button>

      <Card className="shadow-sm">
        <Card.Body>
          <h2>{driver.name}</h2>
          <p><strong>Email:</strong> {driver.email}</p>
          <p><strong>Phone:</strong> {driver.phone}</p>
          <p><strong>Status:</strong> {driver.status}</p>
          <p><strong>Experience:</strong> {driver.experience}</p>
          <p><strong>Bio:</strong> {driver.bio}</p>

          <h4>Rating</h4>
          <span className="text-warning">
            {[...Array(5)].map((star, i) => (
              <FaStar key={i} color={i < Math.round(driver.rating) ? "gold" : "lightgray"} />
            ))}{" "}
            {driver.rating}
          </span>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DriverProfile;
