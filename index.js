const fs = require('fs');
const async = require('async');
const AWS = require('aws-sdk');
const Papa = require("papaparse");

var config = require('./config.json');


AWS.config.update({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
  region: config.region,
});

const docClient = new AWS.DynamoDB.DocumentClient({
  region: config.region
});


const READ_FROM_TABLE = "tableName"
const MAX_CHECk_LIMIT = 50;

main();

async function loadAllResults() {
  var results = [];
  var currentResults = await loadAdditionalResults();
  results = results.concat(currentResults.Items);

  while (currentResults.LastEvaluatedKey) {
    currentResults = await loadAdditionalResults(currentResults.LastEvaluatedKey)
    results = results.concat(currentResults.Items)
  }
  return results;
}

async function loadAdditionalResults(start) {
  console.log("Loading more results..."+READ_FROM_TABLE)
  var params = {
    TableName: READ_FROM_TABLE,
    //Limit: 1000,
  }

  if (start) {
    params.ExclusiveStartKey = start
  }

  return new Promise((resolve, reject) => {
    docClient.scan(params, (error, result) => {
      if (error) {
        console.log(error);
        reject(error);
      } else if (result) {
        resolve(result);
      } else {
        reject("Unknown error");
      }
    })
  })
}


async function main() {
  let tableData = await loadAllResults();
  
  //write data into CSV file
  var csv = Papa.unparse(tableData);
  fs.createWriteStream('generatedCSV/'+Date.now()+'.csv', { flags: 'w' }).write(csv);

  /*
  csv column headers are determined based on the first row in your dynamodb table.
  So it skip some fields which are not available in the first row.
  You can mention your all fields in format of array in place 'fieldArray' variable in below commented code.
  e.g. fields: ["field1", "field2", "field3", "field4"],
  or
  You can check first 50 or more records to get fields as below
  */
  /*var lengthLimit = tableData.length;
  if(tableData.length > MAX_CHECk_LIMIT) {
    lengthLimit = MAX_CHECk_LIMIT;
  }
  var fieldArray = [];
  for(var i = 0;i<lengthLimit;i++)
  {
      Object.keys(tableData[i]).forEach(function(key){
          if(fieldArray.indexOf(key) == -1)
          {
            fieldArray.push(key);
          }
      });
  }
  console.log(fieldArray);
  var csv = Papa.unparse({
    fields: fieldArray,
    data: tableData
    });
  fs.createWriteStream('generatedCSV/'+Date.now()+'.csv', { flags: 'w' }).write(csv);
  */
}


