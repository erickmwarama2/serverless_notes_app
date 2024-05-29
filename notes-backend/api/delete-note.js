const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION});
const util = require('./util.js');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

exports.handler = async function(event) {
    try {

        let timestamp = parseInt(event.pathParameters.timestamp);

        let params = {
            TableName: tableName,
            Key: {
                user_id: util.getUserId(event.headers),
                timestamp
            }
        };

        await dynamodb.delete(params).promise();

        return {
            statusCode: 200,
            headers: util.getResponseHeaders()
        };
    } catch (error) {
        console.log("Error", error);

        return {
            statusCode: error.statusCode ?? 500,
            headers: util.getResponseHeaders(),
            body: JSON.stringify({
                error: error.name ? error.name : "Exception",
                message: error.message ? error.message : "Unknown Error"
            })
        };
    }
}