const fs = require("fs");
const util = require("util");
const path = require('path');
const exec = util.promisify(require('child_process').exec);
const { CosmosClient } = require("@azure/cosmos");

async function restore(req) {

    let command = `dt.exe /s:DocumentDB /s.ConnectionString:${req.connectionString}Database=${req.databaseId}; /s.ConnectionMode:Gateway /s.Collection:${req.containerId} /t:DocumentDB /t.ConnectionString:${req.targetConnectionString}Database=${req.targetDatabaseId}; /t.ConnectionMode:Gateway /t.Collection:${req.targetContainerName}`
    try {
        // createContainerIfNotExist(req.targetConnectionString, req.targetDatabaseId, req.targetContainerName, req.targetPartitionKey)
        //     .then((container) => {
        //         console.log(`Container created or retrieved: ${req.targetDatabaseId} / ${req.targetContainerName}`);
        //     })
        //     .catch((err) => {
        //         console.error("Error:", err);
        //     });

        await ExecuteCommand(command);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

async function createContainerIfNotExist(connectionString, databaseId, containerId, partitionKey) {
    const client = new CosmosClient(connectionString);
    const { database } = await client.databases.createIfNotExists({ id: databaseId });

    const containerDefinition = {
        id: containerId,
        partitionKey: {
            paths: [partitionKey]
        },
    };

    const { container } = await database.containers.createIfNotExists(containerDefinition);

    return container;
}


async function ExecuteCommand(command) {

    // Define the relative path to the directory
    const relativePath = './../cosmos-migration-tool/';

    // Resolve the absolute path using the __dirname and the relativePath
    const absolutePath = path.resolve(__dirname, relativePath);
    try {
        const { stdout, stderr } = await exec(command, { cwd: absolutePath });
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log('Command executed successfully.');
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

module.exports = { restore };