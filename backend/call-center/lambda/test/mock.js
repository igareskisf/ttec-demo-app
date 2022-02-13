// Mock data

/* SAMPLE Input (simplified)
    "event": {
        "Details": {
            "ContactData": {
                "CustomerEndpoint": {
                    "Address": "+38976628343"
                }
            }
        }
    }
*/

/* SAMPLE OUTPUT (simplified)
    "statusCode": 200,
    "body": [
        {
           FirstNumber: "+38976111111",
           SecondNumber: "+38976222222",
           ThirdNumber: "+38976333333"
       } 
    ]
*/

// Input with valid request parameters
const validInput = () => {
    return {
        Details: {
            ContactData: {
                CustomerEndpoint: {
                    Address: "+38976628343"
                }
            }
        }
    }
}

// Input with invalid format
const invalidInputFormat = () => {
    return {
        Details: {
            ContactData: {
                CustomerEndpoint: {
                    Address: 'Test'
                }
            }
        }
    }
}

// Input with invalid request parameters
const invalidInput = (params) => {
    return {
        Details: {
            ContactData: {
                CustomerEndpoint: {}
            }
        }
    }
}

// Mock output from the getDynamoDBItems function
const getDynamoDBItems = async (error, empty) => {
    // Mock error
    if (error) {
        throw new Error('DynamoDB getDynamoDBItems operation failed')
    }

    // Mock empty response
    if (empty) {
        return null
    }

    // Mock success
    return {
        'customer-number': { 'S': '+38976111111' },
        'vanity-numbers': { 'L': [
            { 'S': '+3897611ABCD' },
            { 'S': '+3897611EFGH' },
            { 'S': '+3897611IJKL' },
            { 'S': '+3897611MNOP' },
            { 'S': '+3897611QRST' }
        ]}
    }
}

// Mock output from the insertDynamoDBItems function
const insertDynamoDBItems = async (error) => {
    // Mock error
    if (error) {
        throw new Error('DynamoDB insertDynamoDBItems operation failed')
    }

    // Mock success
    return {}
}

module.exports = {
    getDynamoDBItems,
    insertDynamoDBItems,
    validInput,
    invalidInputFormat,
    invalidInput
}