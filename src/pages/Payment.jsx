import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from "react-router-dom";
import { request } from "../common/APIManager";
import Loader from "../components/Loader";
import * as Constants from "../common/Constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaymentView = () => {
  const [loading, setLoading] = useState(true);
  const [tripDetails, setTripDetails] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const tripId = location.state?.tripId;

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await request(`v1/trip/${tripId}`, Constants.GET);
        setTripDetails(response);
      } catch (error) {
        console.error("Error fetching trip details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [tripId]);

  const handlePayment = async () => {
    try {
      const response = await request(
        `v1/trip/${tripId}/end-trip`,
        Constants.PUT
      );
      toast.success("Payment success");
      navigate("/rating", {
        state: { tripId: tripId },
      });
      setPaymentStatus(response.status);
    } catch (error) {
      toast.error("Ride payment failed");
      console.error("Error processing payment:", error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Container>
        <h2 className="my-4">Payment View for Trip ID: {tripId}</h2>
        {tripDetails ? (
          <Card>
            <Card.Header className="bg-info text-white">
              <h5>Trip Details</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p>
                    <strong>Passenger Name:</strong>{" "}
                    {tripDetails.passenger.firstName}{" "}
                    {tripDetails.passenger.lastName}
                  </p>
                  <p>
                    <strong>Driver Name:</strong> {tripDetails.driver.firstName}{" "}
                    {tripDetails.driver.lastName}
                  </p>
                  <p>
                    <strong>Pickup Location:</strong>{" "}
                    {tripDetails.startLocationName}
                  </p>
                  <p>
                    <strong>Drop-off Location:</strong>{" "}
                    {tripDetails.endLocationName}
                  </p>
                  <p>
                    <strong>Trip Distance:</strong> {tripDetails.distance} km
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <strong>Trip Fare:</strong> ${tripDetails.price}
                  </p>
                  <p>
                    <strong>Status:</strong> {tripDetails.status}
                  </p>
                  <p>
                    <strong>Payment Status:</strong>{" "}
                    {paymentStatus || "Pending"}
                  </p>
                </Col>
              </Row>
              <Button variant="success" onClick={handlePayment}>
                Process Payment
              </Button>
              {paymentStatus && (
                <p className="mt-3">Payment Status: {paymentStatus}</p>
              )}
            </Card.Body>
          </Card>
        ) : (
          <p>No trip details found.</p>
        )}
      </Container>
      <ToastContainer />
    </>
  );
};

export default PaymentView;
