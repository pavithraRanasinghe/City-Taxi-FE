import React, { useEffect, useState } from "react";
import { Card, Container } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { request } from "../common/APIManager";
import * as Constants from "../common/Constants";

const DriverProfile = () => {
  const location = useLocation();
  const driverId = location.state?.driverId;
  const [driver, setDriver] = useState(null);

  useEffect(() => {
    if (driverId) {
      const url = `v1/driver/${driverId}`;
      request(url, Constants.GET)
        .then((response) => {
          setDriver(response);
        })
        .catch((error) => {
          console.log("Error : ", error);
        });
    }
  }, []);

  return (
    <>
      {driver && (
        <Container className="mt-5">
          {/* Back button to navigate to the previous page */}
          <Card className="shadow-sm">
            <Card.Body>
              <h2>
                {driver.firstName} {driver.lastName}
              </h2>
              <p>
                <strong>ID:</strong> {driver.id}
              </p>
              <p>
                <strong>Phone:</strong> {driver.contact}
              </p>
              <p>
                <strong>Status:</strong> {driver.status}
              </p>

              <h4>Rating</h4>
              <span className="text-warning">
                {[...Array(5)].map((star, i) => (
                  <FaStar
                    key={i}
                    color={i < Math.round(driver.rate) ? "gold" : "lightgray"}
                  />
                ))}{" "}
                {driver.rate}
              </span>
            </Card.Body>
          </Card>
        </Container>
      )}
    </>
  );
};

export default DriverProfile;
