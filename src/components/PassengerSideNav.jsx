import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import { getUser } from "../common/PersistanceManager";
import { useLocation } from "react-router-dom";

const PassengerSideNav = () => {
  const user = getUser();
  const location = useLocation();
  const currentPath = location.pathname;
  const header = currentPath.startsWith("/")
    ? currentPath.slice(1)
    : currentPath; // Remove leading slash

  return (
    <>
      <Navbar expand={false} className="bg-body-tertiary mb-3">
        <Container fluid>
          <Navbar.Toggle
            aria-controls={`offcanvasNavbar-expand-${false}`}
            style={{ marginLeft: 0 }}
          />
          <Navbar.Brand href="#">{header.toUpperCase()}</Navbar.Brand>
          <Navbar.Text className="justify-content-end">
            Signed in as: {user.name}
          </Navbar.Text>
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-${false}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${false}`}
            placement="start"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${false}`}>
                Menu
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link href="passenger">Home</Nav.Link>
                <Nav.Link href="booking">Booking</Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};

export default PassengerSideNav;
