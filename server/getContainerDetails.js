const { CosmosClient } = require("@azure/cosmos");

const connectionString =
  "AccountEndpoint=https://cosmos-exams-main-serverless-dev.documents.azure.com:443/;AccountKey=qZC2a1udP2LILqceHr4aYs8LLNSu0ZiNHDRafiY1yyLEj4yS35BRc0lnOObCpDy8DUpLc2Fwwx2sACDb2nma5A==;";

const client = new CosmosClient(connectionString);

async function listContainersAndPartitionKeys(databaseId) {
  const containerInfo = [];
  const database = client.database(databaseId);
  const { resources: containers } = await database.containers
    .readAll()
    .fetchAll();
  for (const container of containers) {
    const containerInfoObject = {
      containerId: container.id,
      partitionKey: container.partitionKey.paths,
    };
    containerInfo.push(containerInfoObject); // Add container info to the array
  }
  return containerInfo;
}

// Replace 'YOUR_DATABASE_ID' with the ID of your Cosmos DB database.
const databaseId = "Exams-Serverless-dev";

listContainersAndPartitionKeys(databaseId)
  .then(() => {
    console.log("Containers and Partition Keys listed successfully.");
  })
  .catch((error) => {
    console.error("Error listing Containers and Partition Keys:", error);
  });

module.exports = { listContainersAndPartitionKeys };
