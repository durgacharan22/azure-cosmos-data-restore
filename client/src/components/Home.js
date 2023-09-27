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
      expandedRow: null, // Track the expanded row index
      targetConnectionString: "",
      targetDatabaseId: "",
      targetContainerName: "",
      targetPartitionKey: "",
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  getContainerdetails = () => {
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
        this.setState({ response: data.containerDetails, isLoading: false });
      })
      .catch((error) => {
        this.setState({ error: "API call error", isLoading: false });
        console.error("API call error:", error);
      });
  };

  handleExpandRow = (index) => {
    this.setState({ expandedRow: index });
  };

  handleSubmit = () => {
    // Make your API call here with the four values
    const {
      connectionString,
      databaseId,
      targetConnectionString,
      targetDatabaseId,
      targetContainerName,
      targetPartitionKey,
      response,
      expandedRow,
    } = this.state;

    const containerId =
      response && response[expandedRow] ? response[expandedRow].containerId : null;
    const partitionKey =
      response && response[expandedRow] ? response[expandedRow].partitionKey.join(", ") : null;

    const requestData = {
      connectionString,
      targetConnectionString,
      databaseId,
      targetDatabaseId,
      containerId,
      partitionKey,
      targetContainerName,
      targetPartitionKey,
    };

    this.setState({ isLoading: true, error: null });

    fetch("/api/restoreContainer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the API response as needed
        this.setState({ isLoading: false });
      })
      .catch((error) => {
        this.setState({ error: "API call error", isLoading: false });
        console.error("API call error:", error);
      });
  };

  render() {
    const {
      connectionString,
      databaseId,
      response,
      isLoading,
      error,
      expandedRow,
      targetConnectionString,
      targetDatabaseId,
      targetContainerName,
      targetPartitionKey,
    } = this.state;

    return (
      <div className="container mt-5">
        <h2 className="mb-4">Cosmos Restore Tool</h2>
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
            onClick={this.getContainerdetails} // This should be handleSubmit
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Get Info"}
          </button>
        </div>
        {error && <p className="text-danger">Error: {error}</p>}
        {response && (
          <div>
            <h3 className="mt-4">Container Details:</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Container ID</th>
                  <th>Partition Key</th>
                </tr>
              </thead>
              <tbody>
                {response.map((item, index) => (
                  <React.Fragment key={index}>
                    <tr onClick={() => this.handleExpandRow(index)}>
                      <td>{item.containerId}</td>
                      <td>{item.partitionKey.join(", ")}</td>
                    </tr>
                    {expandedRow === index && (
                      <tr className="table-warning">
                        <td colSpan="3">
                          <div className="form-group">
                            <label htmlFor="targetConnectionString">
                              Target Connection String:
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="targetConnectionString"
                              name="targetConnectionString"
                              value={targetConnectionString}
                              onChange={this.handleInputChange}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="targetDatabaseId">
                              Target Database ID:
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="targetDatabaseId"
                              name="targetDatabaseId"
                              value={targetDatabaseId}
                              onChange={this.handleInputChange}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="targetContainerName">
                              Target Container Name (Optional):
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="targetContainerName"
                              name="targetContainerName"
                              value={targetContainerName}
                              onChange={this.handleInputChange}
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="targetPartitionKey">
                              Target Partition Key (Optional):
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="targetPartitionKey"
                              name="targetPartitionKey"
                              value={targetPartitionKey}
                              onChange={this.handleInputChange}
                            />
                          </div>
                          <button
                            className="btn btn-primary"
                            onClick={this.handleSubmit}
                            disabled={isLoading}
                          >
                            {isLoading ? "Submitting..." : "Submit"}
                          </button>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}

export default Home;