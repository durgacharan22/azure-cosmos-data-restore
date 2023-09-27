// server.js
const express = require("express");
const {listContainersAndPartitionKeys} = require('./server/getContainerDetails')
const bodyParser = require('body-parser');

const app = express();
const cors = require("cors");
const port = process.env.PORT || 3001; // Use any port you prefer


// Parse JSON request bodies
app.use(bodyParser.json());

app.use(cors());

app.post("/api/getContainerDetails", async (req, res) => {
  try {
    const result = await listContainersAndPartitionKeys(req.body.connectionString, req.body.databaseId);
    res.json({ success: true, containerDetails: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
