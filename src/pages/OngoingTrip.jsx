import React, { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { request } from "../common/APIManager";
import * as Constants from "../common/Constants";
import { getUser } from "../common/PersistanceManager";

const OngoingTrip = () => {
  const [selectedStatus, setSelectedStatus] = useState(null);

  const [tripList, setTripList] = useState([]);
  const currentUser = getUser();

  useEffect(() => {
    loadData("PENDING");
  }, []);

  const loadData = (status) => {
    setSelectedStatus(status);
    let url;
    if (currentUser.getUserType === Constants.ADMIN) {
      url = `v1/trip/status/${currentUser.userType.toLowerCase()}?status=${status}`;
    } else {
      url = `v1/trip/status/${currentUser.userType.toLowerCase()}?status=${status}&id=${
        currentUser.userId
      }`;
    }

    request(url, Constants.GET).then((response) => {
      setTripList(response);
    });
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <Button
            variant="primary"
            className="mb-4"
            disabled={selectedStatus === "PENDING"}
            onClick={() => {
              loadData("PENDING");
            }}
          >
            PENDING
          </Button>
        </Col>
        <Col>
          <Button
            variant="primary"
            className="mb-4"
            disabled={selectedStatus === "CONFIRM"}
            onClick={() => {
              loadData("CONFIRM");
            }}
          >
            ON GOING
          </Button>
        </Col>
        <Col>
          <Button
            variant="primary"
            className="mb-4"
            disabled={selectedStatus === "COMPLETE"}
            onClick={() => {
              loadData("COMPLETE");
            }}
          >
            COMPLETED
          </Button>
        </Col>
      </Row>

      {tripList.map((trip) => {
        return (
          <Card className="shadow-sm mb-2">
            <Card.Body>
              <h3>Trip ID - {trip.id}</h3>
              <p>
                <strong>Passenger Name:</strong> {trip.passenger.firstName}{" "}
                {trip.passenger.lastName}
              </p>
              <p>
                <strong>Driver Name:</strong> {trip.driver.firstName}{" "}
                {trip.driver.lastName}
              </p>
              <p>
                <strong>Vehicle:</strong> {trip.driver.vehicle.name} -{" "}
              </p>
              <p>
                <strong>License Plate:</strong>{" "}
                {trip.driver.vehicle.vehicleNumber}
              </p>
              <p>
                <strong>Pickup Location:</strong> {trip.startLocationName}
              </p>
              <p>
                <strong>Drop-Off Location:</strong> {trip.endLocationName}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="text-success">{trip.status}</span>
              </p>
            </Card.Body>
          </Card>
        );
      })}
    </Container>
  );
};

export default OngoingTrip;
