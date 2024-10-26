import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useLocation } from "react-router-dom";

const AdminSideNav = () => {
  // Static user information
  const user = {
    name: "Janitha", // Static username
  };

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
              {/* Static Navigation Links */}
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link href="/home">Home</Nav.Link>
                <Nav.Link href="/driver">Driver</Nav.Link>
                <Nav.Link href="/vehicle">Vehicle</Nav.Link>
                <Nav.Link href="/customer">Customer</Nav.Link>
                <Nav.Link href="/trip">Trip</Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminSideNav;
