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
import RoutingMachine from "../components/RouteMachine";
import { useLocation, useNavigate } from "react-router-dom";

// Leaflet icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const ViewTripDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tripId = location.state?.tripId;

  const [selectedDriver, setSelectedDriver] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [locationError, setLocationError] = useState(false);

  // Passenger
  const [passengerFirstName, setPassengerFirstName] = useState(null);
  const [passengerLastName, setPassengerLastName] = useState(null);
  const [passengerContact, setPassengerContact] = useState(null);

  const handlePassengerFirstNameChange = (event) => {
    setPassengerFirstName(event.target.value);
  };

  const handlePassengerLastNameChange = (event) => {
    setPassengerLastName(event.target.value);
  };

  const handlePassengerContactChange = (event) => {
    setPassengerContact(event.target.value);
  };

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

    getTripDetail();
  }, []);

  const getTripDetail = () => {
    if (tripId) {
      const url = `v1/trip/${tripId}`;
      request(url, Constants.GET)
        .then((response) => {
          setPassengerFirstName(response.passenger.firstName);
          setPassengerLastName(response.passenger.lastName);
          setPassengerContact(response.passenger.contact);
          setSelectedDriver(response.driver);
          setPickupLocation({
            lng: response.startLocation.coordinates[0],
            lat: response.startLocation.coordinates[1],
          });

          setDropoffLocation({
            lng: response.endLocation.coordinates[0],
            lat: response.endLocation.coordinates[1],
          });
        })
        .catch((error) => {
          toast.error("Trip details not found");
          navigate("/driver", { replace: true });
        });
    }
  };

  const placeTrip = () => {
    const url = `v1/trip/${tripId}/status?status=CONFIRM`;
    request(url, Constants.PUT)
      .then((response) => {
        toast.success("Trip Confirmed");
        navigate("/driver", { replace: true });
      })
      .catch((error) => {
        console.log("ERROR : ", error);
        toast.error("Trip not confirmed");
      });
  };

  return (
    <>
      <Container>
        <div className="text-center mt-4">
          <h1>Trip Details</h1>
        </div>

        {/* Fallback Message when location services are off */}
        {locationError && (
          <Alert variant="warning" className="mt-4">
            <strong>Location services are off!</strong> Please enable location
            services in your browser or device settings to use this feature.
          </Alert>
        )}

        <div className="mt-1">
          <Form>
            <Form.Group>
              <Form.Label>Passenger First Name</Form.Label>
              <Form.Control
                type="text"
                value={passengerFirstName}
                onChange={handlePassengerFirstNameChange}
                readOnly
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Passenger Last Name</Form.Label>
              <Form.Control
                type="text"
                value={passengerLastName}
                onChange={handlePassengerLastNameChange}
                readOnly
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Passenger Contact</Form.Label>
              <Form.Control
                type="text"
                value={passengerContact}
                onChange={handlePassengerContactChange}
                readOnly
              />
            </Form.Group>
          </Form>
        </div>

        {/* Map Section */}
        <div className="mt-5">
          <MapContainer
            center={[7.8731, 80.7718]}
            zoom={8}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {pickupLocation && <Marker position={pickupLocation} />}
            {dropoffLocation && <Marker position={dropoffLocation} />}

            <RoutingMachine
              pickupLocation={pickupLocation}
              dropoffLocation={dropoffLocation}
            />
          </MapContainer>
        </div>

        {/* Booking Form Section */}
        <div className="booking-form mt-1">
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
          </Form>
          <Form>
            <Form.Group>
              <Form.Label>Selected Driver</Form.Label>
              <Form.Control
                type="text"
                value={
                  selectedDriver &&
                  `${selectedDriver.firstName} ${selectedDriver.lastName}`
                }
                readOnly
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Selected Car</Form.Label>
              <Form.Control
                type="text"
                value={selectedDriver && selectedDriver.vehicle.name}
                readOnly
              />
            </Form.Group>
            <Button
              className="btn-search"
              variant="primary"
              onClick={placeTrip}
            >
              Accept a Ride
            </Button>
          </Form>
        </div>
        <ToastContainer />
      </Container>
    </>
  );
};

export default ViewTripDetails;
