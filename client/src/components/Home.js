import React, { Component } from "react";

class Home extends Component {
  constructor() {
    super();
    this.state = {
      connectionString: "",
      databaseId: "",
      response: null,
      isLoading: false,
      error: null,
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleApiCall = () => {
    const { connectionString, databaseId } = this.state;
    this.setState({ isLoading: true, error: null });

    // Make your API call here
    fetch("/api/getContainerDetails", {
      method: "POST", // Use the appropriate HTTP method (GET, POST, etc.)
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ connectionString, databaseId }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ response: data, isLoading: false });
      })
      .catch((error) => {
        this.setState({ error: "API call error", isLoading: false });
        console.error("API call error:", error);
      });
  };

  render() {
    const { connectionString, databaseId, response, isLoading, error } =
      this.state;

    return (
      <div className="container mt-5">
        <h2 className="mb-4">API Call Component</h2>
        <div className="mb-3">
          <label htmlFor="connectionString" className="form-label">
            Connection String:
          </label>
          <input
            type="text"
            className="form-control"
            id="connectionString"
            name="connectionString"
            value={connectionString}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="databaseId" className="form-label">
            Database ID:
          </label>
          <input
            type="text"
            className="form-control"
            id="databaseId"
            name="databaseId"
            value={databaseId}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="mb-3">
          <button
            className="btn btn-primary"
            onClick={this.handleApiCall}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Make API Call"}
          </button>
        </div>
        {error && <p className="text-danger">Error: {error}</p>}
        {response && (
          <div>
            <h3 className="mt-4">API Response:</h3>
            <ul>
              {response.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export default Home;
