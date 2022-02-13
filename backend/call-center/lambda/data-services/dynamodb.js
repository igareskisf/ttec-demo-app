const AWS = require('aws-sdk')

// Configure the DynamoDB service object
const ddb = new AWS.DynamoDB({
    region: process.env.REGION || 'localhost',
    endpoint: process.env.DYNAMODB_HOST || 'http://localhost:8000'
})

/**
* Function that retrieves the existing vanity numbers for a customer
* @param    {string}    number     Customer number
*/
const getDynamoDBItems = async (number) => {
    return new Promise((resolve, reject) => {
        ddb.query({
            TableName: process.env.DYNAMODB_TABLE || 'dummy-table',
            ExpressionAttributeNames: {
                '#CustomerNumber': 'customer-number'
            },
            ExpressionAttributeValues: {
                ':cn': {
                    'S': number
                }
            },
            KeyConditionExpression: '#CustomerNumber = :cn'
        }, function(error, data) {
            if (error) {
                reject(error)
            } else {
                if (!data.Items || data.Items.length === 0) {
                    resolve(null)
                } else {
                    resolve(data.Items[0])
                }
            }
        })
    })
}

/**
* Function that inserts the vanity numbers for a customer
* @param    {string}    number      Customer number
* @param    {Object[]}  data        List of the customer's top 5 vanity numbers
*/
const insertDynamoDBItems = async (number, data) => {
    return new Promise((resolve, reject) => {
        ddb.putItem({
            TableName: process.env.DYNAMODB_TABLE || 'dummy-table',
            ReturnConsumedCapacity: 'TOTAL',
            Item: {
                'customer-number': {
                    'S': number
                },
                'time-created': {
                    'N': new Date().getTime().toString()
                },
                'vanity-numbers': {
                    'L': data
                }
            }
        }, function(error, data) {
            if (error) {
                reject(error)
            } else {
                resolve(data)
            }
        })
    })
}

module.exports = {
    getDynamoDBItems,
    insertDynamoDBItems
}