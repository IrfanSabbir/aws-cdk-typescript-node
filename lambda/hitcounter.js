const { DynamoDB, Lambda } = require('aws-sdk');

exports.handler = async function(event) {
  console.log("request:", JSON.stringify(event, null, 2));

  // create AWS SDK clients
  const docClient = new DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
  const lambda = new Lambda();

  // update dynamo entry for "path" with hits++

  const params = {
    TableName: process.env.HITS_TABLE_NAME,
    Item: {
      name:  event.path,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  };
 
  await docClient.put(params).promise()
  // await docClient.updateItem({
  //   Key: { path: { S: event.path } },
  //   UpdateExpression: 'ADD hits :incr', 
  //   ExpressionAttributeValues: { ':incr': {N: '1' } }
  // }).promise();

  // call downstream function and capture response
  const resp = await lambda.invoke({
    FunctionName: process.env.DOWNSTREAM_FUNCTION_NAME,
    Payload: JSON.stringify(event)
  }).promise();

  console.log('downstream response:', JSON.stringify(resp, undefined, 2));

  // return response back to upstream caller
  return JSON.parse(resp.Payload);
};

