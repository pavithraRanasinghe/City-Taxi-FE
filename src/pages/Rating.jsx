import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Button,
  Container,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import "./css/Register.css";
import { request } from "../common/APIManager";
import * as Constants from "../common/Constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";

const Feedback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tripId = location.state?.tripId;

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [driverName, setDriverName] = useState("");
  const [feedbackList, setFeedbackList] = useState([
    {
      user: "John Doe",
      rating: 4,
      feedback:
        "Great experience! I loved the service and the staff was very friendly.",
      driver: "Driver 1", // Example driver name
    },
    {
      user: "Jane Smith",
      rating: 5,
      feedback: "Exceptional service! Highly recommend.",
      driver: "Driver 2", // Example driver name
    },
  ]);

  const [tripDetails, setTripDetails] = useState(null);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        if (tripId) {
          const response = await request(`v1/trip/${tripId}`, Constants.GET);
          setTripDetails(response);
          const driverName =
            response.driver.firstName + " " + response.driver.lastName;
          setDriverName(driverName);
        }
      } catch (error) {
        console.error("Error fetching trip details:", error);
      }
    };

    fetchTripDetails();
  }, [tripId]);

  // Handle rating change
  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  // Handle feedback input change
  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  // Handle driver name input change
  const handleDriverNameChange = (event) => {
    setDriverName(event.target.value);
  };

  // Submit feedback
  const handleSubmitFeedback = () => {
    if (rating && feedback.trim() && driverName.trim()) {
      const url = "v1/feedback";
      const body = JSON.stringify({
        comment: feedback,
        rate: rating,
        tripId: tripId,
      });
      request(url, Constants.POST, body)
        .then(() => {
          toast.success("Feedback saved");
          navigate("/passenger", { replace: true });
        })
        .catch(() => {
          toast.error("Feedback not saved");
        });

      setRating(0);
      setFeedback("");
      setDriverName(""); // Clear the driver name input after submitting
    } else {
      alert("Please provide a rating, feedback, and the driver's name.");
    }
  };

  return (
    <>
      <Container>
        {/* Feedback Form */}
        <div className="text-center">
          <h2 className="mb-4">Rate Your Experience</h2>

          {/* Star Rating Section */}
          <div className="mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                style={{
                  cursor: "pointer",
                  fontSize: "2rem",
                  color: star <= rating ? "gold" : "gray",
                }}
                onClick={() => handleRatingChange(star)}
                role="img"
                aria-label={`${star} stars`}
              >
                {star <= rating ? "★" : "☆"}
              </span>
            ))}
          </div>

          {/* Driver Name Input */}
          <Form.Group className="mb-3">
            <Form.Label>Driver's Name</Form.Label>
            <Form.Control
              disabled
              type="text"
              value={driverName}
              onChange={handleDriverNameChange}
              placeholder="Enter the driver's name"
            />
          </Form.Group>

          {/* Feedback Input */}
          <Form.Group className="mb-3">
            <Form.Label>Leave Your Feedback</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={feedback}
              onChange={handleFeedbackChange}
              placeholder="Write your feedback here..."
            />
          </Form.Group>

          {/* Submit Button */}
          <Button variant="success" onClick={handleSubmitFeedback}>
            Submit Feedback
          </Button>
        </div>

        {/* Previous Feedback Cards */}
        <Row className="mt-5">
          <Col>
            <h3 className="text-center">Previous Feedback</h3>
          </Col>
        </Row>
        <Row className="g-4">
          {feedbackList.map((item, index) => (
            <Col key={index} md={6}>
              <Card
                className="shadow-lg border-0 h-100"
                style={{ borderRadius: "15px" }}
              >
                <Card.Header
                  className="d-flex justify-content-between align-items-center"
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderBottom: "0",
                    borderRadius: "15px 15px 0 0",
                    padding: "1rem",
                  }}
                >
                  <span className="font-weight-bold">{item.user}</span>
                  <Badge bg={item.rating >= 4 ? "success" : "warning"} pill>
                    {item.rating} Stars
                  </Badge>
                </Card.Header>
                <Card.Body style={{ padding: "1.5rem" }}>
                  <Card.Text
                    className="text-muted"
                    style={{ fontStyle: "italic" }}
                  >
                    {item.feedback}
                  </Card.Text>
                  <Card.Text className="text-muted">
                    <strong>Driver:</strong> {item.driver}
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-warning">
                      {"★".repeat(item.rating) + "☆".repeat(5 - item.rating)}
                    </span>
                    <span className="text-muted small">Posted Recently</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <ToastContainer />
    </>
  );
};

export default Feedback;
