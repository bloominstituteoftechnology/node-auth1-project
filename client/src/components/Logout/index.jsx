import React from "react";
import axios from "axios";
import "./index.css";

class Logout extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    axios.get("http://localhost:8800/api/logout").then(res => {
      this.props.history.push("/");
    });
    this.peops.history.push("/");
  }

  render() {
    return (
      <div>
        <h1>logging out...</h1>
      </div>
    );
  }
}

export default Logout;
