import { useState, useEffect } from "react";
import { Form, Button, Card, Image } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { setCredentials } from "../slices/authSlice";
import { useUpdateProfileUserMutation } from "../slices/usersApiSlice";

// require("../../../uploads/");

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [initialName, setInitialName] = useState("");
  const [initialEmail, setInitialEmail] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading }] = useUpdateProfileUserMutation();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setInitialName(userInfo.name);
      setInitialEmail(userInfo.email);
      setImage(userInfo.image || "");
    }
  }, [userInfo]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const formData = new FormData();
    if (name !== userInfo.name) formData.append("name", name);
    if (email !== userInfo.email) formData.append("email", email);
    if (password) formData.append("password", password);
    if (image) formData.append("image", image);
    formData.append("id", userInfo._id);

    if (formData.entries().length === 0) {
      toast.info("No changes to update");
      return;
    }

    try {
      const res = await updateProfile(formData).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Profile updated successfully");
      setIsEditing(false);
      setInitialName(name);
      setInitialEmail(email);
      setImage(null);
      setImagePreview(null);
    } catch (err) {
      if (err?.data?.message?.includes("E11000 duplicate key error")) {
        toast.error("Email already exists");
        setEmail(initialEmail);
      } else {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const cancelHandler = () => {
    setName(initialName);
    setEmail(initialEmail);
    setPassword("");
    setConfirmPassword("");
    setImage(null);
    setImagePreview(null);
    setIsEditing(false);
  };

  return (
    <FormContainer>
      <Card className="p-3">
        <h1>Update Profile</h1>
        {!isEditing ? (
          <>
            {userInfo.image && (
              <Image
                src={`../../../uploads/${userInfo.image}`}
                alt="Profile"
                roundedCircle
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  margin: "0 auto 20px",
                }}
              />
            )}
            <p>
              <strong>Name:</strong> {name}
            </p>
            <p>
              <strong>Email:</strong> {email}
            </p>
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          </>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group className="my-2">
              <Form.Label>Profile Image</Form.Label>

              <Form.Control type="file" onChange={handleImageChange} />
              {imagePreview && (
                <Image
                  src={imagePreview}
                  alt="Profile Preview"
                  roundedCircle
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    margin: "20px auto",
                  }}
                />
              )}
            </Form.Group>

            <Form.Group className="my-2" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="my-2" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="my-2" controlId="password">
              <Form.Label>
                New Password (leave blank to keep current)
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="my-2" controlId="confirmPassword">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>

            {isLoading && <Loader />}

            <Button type="submit" variant="primary" className="mt-3">
              Update
            </Button>
            <Button
              variant="secondary"
              className="mt-3 ml-2"
              onClick={cancelHandler}
            >
              Cancel
            </Button>
          </Form>
        )}
      </Card>
    </FormContainer>
  );
};

export default ProfileScreen;
