// server.js
const express = require("express");
const {listContainersAndPartitionKeys} = require('./server/getContainerDetails')

const app = express();
const cors = require("cors");
const port = process.env.PORT || 3001; // Use any port you prefer

app.use(cors());

app.post("/api/getContainerDetails", async (req, res) => {
  console.log(req);
  try {
    const databaseId = 'Exams-Serverless-dev';
    const result = await listContainersAndPartitionKeys(databaseId);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
  res.json({ message: "Hello from the API!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
