const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION});

const util = require('./util.js');
const jwtDecode = require('jwt-decode');

const cognitoIdentity = new AWS.CognitoIdentity();
const identityPoolId = process.env.COGNITO_IDENTITY_POOL_ID;

exports.handler = async function(event) {
    try {

        let id_token = util.getIdToken(event.headers);

        let params = {
            IdentityPoolId: identityPoolId,
            Logins: {
                'accounts.google.com': id_token
            }
        };

        let data = cognitoIdentity.getId(params).promise();

        params = {
            IdentityId: data.IdentityId,
            Logins: {
                'accounts.google.com': id_token
            }
        };

        data = await cognitoIdentity.getCredentialsForIdentity(params).promise();

        let decoded = jwtDecode(id_token);
        data.user_name = decoded.name;

        return {
            statusCode: 200,
            headers: util.getResponseHeaders(),
            body: JSON.stringify(data)
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