import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import { getUser } from "../common/PersistanceManager";
import { useLocation } from "react-router-dom";
import { ADMIN, DRIVER, OPERATOR, PASSENGER } from "../common/Constants";
import { LogOut } from "../common/UserManager";

const AdminSideNav = () => {
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
            <Offcanvas.Body
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <div style={{ flex: 1 }}>
                {getUser().userType === ADMIN && (
                  <Nav className="justify-content-end flex-grow-1 pe-3">
                    <Nav.Link href="/admin">Home</Nav.Link>
                    <Nav.Link href="/admin/manage-drivers">Drivers</Nav.Link>
                    <Nav.Link href="/admin/manage-passenger">
                      Passengers
                    </Nav.Link>
                    <Nav.Link href="/admin/manage-vehicle">Vehicle</Nav.Link>
                    <Nav.Link href="/trips">Trips</Nav.Link>
                  </Nav>
                )}
                {getUser().userType === DRIVER && (
                  <Nav className="justify-content-end flex-grow-1 pe-3">
                    <Nav.Link href="driver">Home</Nav.Link>
                    <Nav.Link href="/trips">Trips</Nav.Link>
                    <Nav.Link href="/vehicle">Vehicle</Nav.Link>
                  </Nav>
                )}
                {getUser().userType === OPERATOR && (
                  <Nav className="justify-content-end flex-grow-1 pe-3">
                    <Nav.Link href="/all-operator">Home</Nav.Link>
                    <Nav.Link href="/trips">Trips</Nav.Link>
                  </Nav>
                )}
                {getUser().userType === PASSENGER && (
                  <Nav className="justify-content-end flex-grow-1 pe-3">
                    <Nav.Link href="passenger">Home</Nav.Link>
                    <Nav.Link href="booking">Booking</Nav.Link>
                    <Nav.Link href="/trips">Trips</Nav.Link>
                  </Nav>
                )}
              </div>
              {/* Add Logout Link at the bottom */}
              <Nav className="justify-content-end pe-3">
                <Nav.Link onClick={() => LogOut()}>Logout</Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminSideNav;
