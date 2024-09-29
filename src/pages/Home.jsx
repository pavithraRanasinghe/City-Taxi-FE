import "./css/Home.css";
import logoName from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { DRIVER, PASSENGER } from "../common/Constants";
import { Button } from "react-bootstrap";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="home-container">
        <img src={logoName} alt="Profile" className="logo_name" style={{ width: '350px', height: 'auto' }} />


        <h2 className="welcome">WELCOME TO CITY TAXI</h2>
      </div>
      <div className="home-btn-wrapper">
        <Button
          onClick={() =>
            navigate("/register", {
              state: { userType: DRIVER },
            })
          }
          className="mt-3 home-button"
        >
          Register as a DRIVER
        </Button>
      </div>
      <div className="home-btn-wrapper">
        <Button
          onClick={() =>
            navigate("/register", {
              state: { userType: PASSENGER },
            })
          }
          className="mt-3 home-button"
        >
          Register as a PASSENGER
        </Button>
      </div>
      <p className="hint-text">Already Registered</p>
      <div className="home-btn-wrapper">
        <Button onClick={() => navigate("/login")} className="mt-3 home-button">
          LOGIN
        </Button>
      </div>
    </>
  );
};

export default Home;
