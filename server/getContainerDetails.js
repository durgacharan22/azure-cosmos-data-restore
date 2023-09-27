const { CosmosClient } = require("@azure/cosmos");
  
  async function listContainersAndPartitionKeys(connectionString, databaseId) {
  const client = new CosmosClient(connectionString);
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

module.exports = { listContainersAndPartitionKeys };
