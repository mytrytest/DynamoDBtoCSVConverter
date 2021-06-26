# DynamoDBtoCSVConverter

## Project setup

```
npm install
```

### update config.json

First of all, put AWS accessKeyId, secretAccessKey and DynamoDB region in config.json 
<br />Put your DynamoDB table in READ_FROM_TABLE variable.
<br />MAX_CHECk_LIMIT variable will check first number of records to get all fields from DynamoDB table.
### run project

```
npm start
```


csv column headers are determined based on the first row in your dynamodb table.
So it skip some fields which are not available in the first row.
You can mention your all fields in format of array in place 'fieldArray' variable in below commented code.
e.g. fields: ["field1", "field2", "field3", "field4"],
or
You can check first 50 or more records to get fields as below
Please check my commented code from line number 78.

