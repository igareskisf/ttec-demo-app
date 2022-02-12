const AWS = require('aws-sdk')

// Configure the DynamoDB service object
const ddb = new AWS.DynamoDB({
    endpoint: process.env.DYNAMODB_HOST || 'localhost'
})

// Enable CORS
const cors = {
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
    'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE',
    'Access-Control-Allow-Origin': '*'
}

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

/**
* Lambda handler
* @param    {Object} event
* @param    {Object} context
*/
exports.handler = async (event, context) => {
    try {
        // How many items to be returned
        const limit = process.env.VANITY_NUMBERS_LIMIT ? praseInt(process.env.VANITY_NUMBERS_LIMIT) : 5

        // Retrieve all the records from the DynamoDB table (inefficient scan operation; to be replaced with a query operation if possible)
        const vanityNumbers = await getDynamoDBItems()
        // console.log(vanityNumbers)

        // The results array
        let result = []

        if (vanityNumbers && vanityNumbers.length > 0) {
            // Sort the items in reverse and get the last 5 objects
            const reversedVanityNumbers = vanityNumbers.sort().reverse().slice(0, limit)

            // Iterate over the results array and create the final structure
            for (let i = 0; i < reversedVanityNumbers.length; i++) {
                // An array to collect the vanity numbers
                const numbers = []

                for (let j = 0; j < reversedVanityNumbers[i]['vanity-numbers']['L'].length; j++) {
                    numbers.push(reversedVanityNumbers[i]['vanity-numbers']['L'][j]['S'])
                }

                result.push({
                    'customer-number': reversedVanityNumbers[i]['customer-number']['S'],
                    'vanity-numbers': numbers
                }) 
            }
        }

        console.log(result)

        // Success
        return {
            statusCode: 200,
            headers: cors,
            body: JSON.stringify(result)
        }
    } catch (error) {
        // Log the error in CloudWatch
        console.log(error)

        // Failure
        return {
            statusCode: 500,
            headers: cors,
            body: JSON.stringify(error.message)
        }
    }
}