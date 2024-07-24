import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import logo from "../assets/logo.jpg";
import { Container, Card, Form, Button } from "react-bootstrap";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/adminhome");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/adminhome");
    } catch (err) {
      toast.error(err?.data?.message || "An error occurred.");
    }
  };

  return (
    <section
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{
        backgroundImage: `url(${logo})`,
        backgroundSize: "cover",
      }}
    >
      <Container className="d-flex justify-content-center">
        <Card
          className="p-4 shadow-lg"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <Card.Body>
            <div className="text-center mb-4">
              <h1 className="h3 mb-3 font-weight-normal">Admin Login</h1>
              <p className="text-muted">Please log in to your account</p>
            </div>
            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Button
                type="submit"
                variant="primary"
                className="w-100"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log in"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </section>
  );
};

export default AdminLogin;
