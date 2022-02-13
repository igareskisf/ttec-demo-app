const AWS = require('aws-sdk')

// Configure the DynamoDB service object
const ddb = new AWS.DynamoDB({
    region: process.env.REGION || 'localhost',
    endpoint: process.env.DYNAMODB_HOST || 'http://localhost:8000'
})

const getDynamoDBItems = async () => {
    return new Promise((resolve, reject) => {
        ddb.scan({
            TableName: process.env.DYNAMODB_TABLE || 'dummy-table',
        }, function(error, data) {
            if (error) {
                reject(error)
            } else {
                if (!data.Items || data.Items.length === 0) {
                    resolve(null)
                } else {
                    resolve(data.Items)
                }
            }
        })
    })
}

module.exports = {
    getDynamoDBItems   
}