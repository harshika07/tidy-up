import "../css/Header.css";
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Firebase/AuthContext";
import { Navbar, Container, Nav } from "react-bootstrap";
import logo from "../Assets/img/logo.png";

function Header(props) {
  const { cartItems } = props;
  let Homepage = "/";
  let Service_Page = "/Services";

  let About_Us = "/AboutUs";
  let Login_User = "/Login";
  let Profilepage = "/ProfilePage";
  let Admin_Page = "/Admin";
  const { currentUser, getRole } = useAuth();
  const newRole = getRole();
  console.log("here inside header role is " + newRole);
  console.log(currentUser);

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" variant="light">
        <Container fluid>
          <Link className="nav-item nav-link" to={Homepage}>
            <img className="img-responsive" src={logo} alt="brand logo" />
          </Link>

          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            className="navbar-toggler float-end"
          />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto">
              <Link className="nav-item nav-link" to={Service_Page}>
                Services Offered
              </Link>
              {/* <Link className="nav-item nav-link" to={Get_Report}>
                Get Report
              </Link> */}
              <Link className="nav-item nav-link" to={About_Us}>
                About Us
              </Link>
              {newRole === "admin" && (
                <Link className="nav-item nav-link" to={Admin_Page}>
                  Admin
                </Link>
              )}
              {!currentUser && (
                <Link className="nav-item  nav-link" to={Login_User}>
                  Login
                </Link>
              )}
              {currentUser && (
                <Link className="nav-item  nav-link" to={Profilepage}>
                  Profile
                </Link>
              )}
              {currentUser && (
                <Link to="/ShippingForm">
                  <button
                    className="btn btn-danger"
                    style={{
                      background: "#3552c8",
                      border: "none",
                      outline: "0",
                      boxShadow: "none",
                    }}
                  >
                    {cartItems.length}
                    <i className="fas fa-shopping-cart text-white"></i>{" "}
                    {console.log("cartLength " + cartItems.length)}
                  </button>
                </Link>
              )}
              {!currentUser && (
                <Link to="/Login">
                  <button
                    className="btn btn-danger"
                    style={{ border: "none", outline: "0", boxShadow: "none" }}
                  >
                    <i className="fas fa-shopping-cart text-white"></i>{" "}
                    {cartItems.length}
                    {console.log("cartLength " + cartItems.length)}
                  </button>
                </Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default Header;
