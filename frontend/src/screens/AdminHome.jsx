import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useLogoutMutation,
  useCreateUserMutation,
  useDeleteUserMutation,
  useFetchUsersQuery,
  useUpdateUserMutation,
} from "../slices/usersApiSlice";
import { toast } from "react-toastify";
import { logout } from "../slices/authSlice";
import logo from "../assets/logo.jpg";
import { Container, Card, Form, Button, Table } from "react-bootstrap";

const AdminHome = () => {
  const { data: users = [], isLoading, refetch } = useFetchUsersQuery();
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [logoutApiCall] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogout = async () => {
    try {
      await logoutApiCall(true).unwrap();
      dispatch(logout());
      navigate("/admin");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed. Please try again.");
    }
  };

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name,
        email: selectedUser.email,
        password: "",
        confirmPassword: "",
      });
    } else {
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    }
  }, [selectedUser]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      if (selectedUser) {
        await updateUser({ id: selectedUser._id, data: formData }).unwrap();
        toast.success("User updated successfully");
        setSelectedUser(null);
      } else {
        await createUser(formData).unwrap();
        toast.success("User created successfully");
        setIsCreateMode(false);
      }
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "An error occurred");
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId).unwrap();
      toast.success("User deleted successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "An error occurred");
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section
      className="bg-neutral-200 dark:bg-neutral-700 d-flex align-items-center justify-content-center min-vh-100"
      style={{
        backgroundImage: `url(${logo})`,
        backgroundSize: "cover",
      }}
    >
      <Container className="p-4">
        <header className="d-flex justify-content-between align-items-center py-4 px-3 bg-dark bg-opacity-50 rounded mb-4">
          <div className="d-flex align-items-center">
            <p className="h4 text-light m-0"></p>
          </div>
          <div>
            <Button
              onClick={() => {
                setIsCreateMode(true);
                setSelectedUser(null);
              }}
              variant="secondary"
              className="me-2"
            >
              Create User
            </Button>
            <Button onClick={handleLogout} variant="secondary">
              Log Out
            </Button>
          </div>
        </header>

        <h1 className="mb-4">Admin Home</h1>
        <Form.Group className="mb-4">
          <Form.Control
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </Form.Group>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Button
                      variant="primary"
                      className="me-2"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsCreateMode(false);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {(selectedUser || isCreateMode) && (
          <Card className="mt-4">
            <Card.Body>
              <Card.Title>
                {selectedUser ? "Edit User" : "Create User"}
              </Card.Title>
              <Form onSubmit={handleFormSubmit}>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                  />
                </Form.Group>
                {!selectedUser && (
                  <>
                    <Form.Group className="mb-3" controlId="password">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleFormChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="confirmPassword">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleFormChange}
                      />
                    </Form.Group>
                  </>
                )}
                <Button variant="success" type="submit">
                  {selectedUser ? "Update User" : "Create User"}
                </Button>
                {selectedUser && (
                  <Button
                    variant="secondary"
                    className="ms-2"
                    onClick={() => setSelectedUser(null)}
                  >
                    Cancel
                  </Button>
                )}
              </Form>
            </Card.Body>
          </Card>
        )}
      </Container>
    </section>
  );
};

export default AdminHome;
