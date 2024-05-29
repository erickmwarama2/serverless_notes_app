const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION});
const util = require('./util.js');
const _ = require('underscore');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

exports.handler = async function(event) {
    try {

        let note_id = decodeURIComponent(event.pathParameters.note_id);

        let params = {
            TableName: tableName,
            IndexName: "note_id-index",
            KeyConditionExpression: "note_id = :note_id",
            ExpressionAttributeValues: {
                ':note_id': note_id
            },
            Limit: 1
        };

        let data = await dynamodb.query(params).promise();

        if (!_.isEmpty(data.Items)) {
            return {
                statusCode: 200,
                headers: util.getResponseHeaders(),
                body: JSON.stringify(data.Items[0])
            }
        } else {
            return {
                statusCode: 404,
                headers: util.getResponseHeaders(),
            }
        }

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