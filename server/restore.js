const fs = require("fs");
const util = require("util");
const path = require('path');
const exec = util.promisify(require('child_process').exec);

async function restore(req) {

    try {
        // let command = `dt.exe /s:DocumentDB /s.ConnectionString:${req.connectionString}Database=${req.databaseId}; /s.ConnectionMode:Gateway /s.Collection:${req.containerId} /t:DocumentDB /t.ConnectionString:${req.targetConnectionString}Database=${req.targetDatabaseId}; /t.ConnectionMode:Gateway /t.Collection:${req.targetContainerName}`
        let command = "dt.exe /s:DocumentDB /s.ConnectionString:AccountEndpoint=https://cosmos-exams-main-serverless-dev.documents.azure.com:443/;AccountKey=qZC2a1udP2LILqceHr4aYs8LLNSu0ZiNHDRafiY1yyLEj4yS35BRc0lnOObCpDy8DUpLc2Fwwx2sACDb2nma5A==;Database=Exams-Serverless-dev /s.ConnectionMode:Gateway /s.Collection:Rubrics /s.InternalFields /t:JsonFile /t.File:C:/Users/dpotukuru/Desktop/rubric3.json /t.Prettify /t.Overwrite"
        // console.log(command);
        await ExecuteCommand(command);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
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