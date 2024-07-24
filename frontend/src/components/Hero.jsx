import Card from "react-bootstrap/Card";
import { useSelector } from "react-redux";

function Hero() {
  const { userInfo } = useSelector((state) => state.auth);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Card style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>Welcome, {userInfo.name}!</Card.Title>
          <Card.Text>
            to have you here. Explore our site and enjoy your experience!
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Hero;
