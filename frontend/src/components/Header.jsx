import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";

function Header() {
  const { userInfo } = useSelector((state) => state.auth);
  const [logoutApiCall] = useLogoutMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log(userInfo);

  const logOutHandler = async () => {
    try {
      await logoutApiCall(userInfo.isAdmin).unwrap();
      dispatch(logout());
      navigate(userInfo.isAdmin ? "/admin" : "/login");
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <LinkContainer to={userInfo && userInfo.isAdmin ? "/adminhome" : "/"}>
          <Navbar.Brand>
            {userInfo && userInfo.isAdmin
              ? "Admin Dashboard"
              : "User Management"}
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            {userInfo ? (
              <>
                {userInfo.isAdmin ? (
                  <Nav.Link onClick={logOutHandler}>Admin Logout</Nav.Link>
                ) : (
                  <NavDropdown title={userInfo.name} id="username">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logOutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
              </>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link className="me-3">
                    <FaSignInAlt className="me-1" />
                    Sign In
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>
                    <FaUserPlus className="me-1" />
                    Sign Up
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/admin">
                  <Nav.Link className="ms-3">Admin Login</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
