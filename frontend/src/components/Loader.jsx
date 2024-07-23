import { Spinner } from "react-bootstrap";

function Loader() {
  return (
    <Spinner
      animation="border"
      role="status"
      style={{
        width: "100px",
        margin: "auto",
        height: "100px",
        display: "block",
      }}
    >
      Loader
    </Spinner>
  );
}

export default Loader;
