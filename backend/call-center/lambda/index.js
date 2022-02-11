const AWS = require('aws-sdk')
const words = require('an-array-of-english-words')

// Configure the DynamoDB service object
const ddb = new AWS.DynamoDB({
    endpoint: 'http://172.18.0.2:8000'
})

// Phone dial pad
const dialPad = ['0', '1', 'ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQRS', 'TUV', 'WXYZ']

// An array to store all of the character permutations from the dial pad
let permutationsResult = []

/**
* Function checks the validity of the customer number
* @param    {string}    number      Customer number
* @returns  {boolean}               Flag for a validity of the provided number
*/
const validateNumberFormat = (number) => {
    // The RegEx expression to match a valid phone number (minim um of 10 digits)
    const validScheme = /^\+1?(\d{10,15})$/
    return validScheme.test(number)
}

/**
* Function that retrieves the existing vanity numbers for a customer
* @param    {string}    number     Customer number
*/
const getDynamoDBItems = async (number) => {
    return new Promise((resolve, reject) => {
        ddb.query({
            TableName: 'customer-vanity-numbers-v2', //Put into an env config
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
            TableName: 'customer-vanity-numbers-v2', //Put into an env config
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

/**
* Function that calculates all of the permutations from the dial pad characters for a given input digits
* @param    {string[]}  input           An array with the dialed digits
* @param    {number}    inputLength     The length of the dialed digits array
* @param    {number}    iterator        An incremental length parameter
* @param    {string[]}  output          Temporary array with permutations
* @returns  {string[]}  result          The result array with all of the permutations
*/
const dialPadPermutations = (input, inputLength, iterator, output) => {
    if (iterator === inputLength) {
        permutationsResult.push(output.join(''))
    } else {
        // Loop through the dial pad characters and calculate recursively all of the permutations
        for (let i = 0; i < dialPad[input[iterator]].length; i++) {
            output[iterator] = dialPad[input[iterator]][i]
            dialPadPermutations(input, inputLength, iterator + 1, output)
        }
    }

    return permutationsResult
}

/**
* Lambda handler
* @param    {Object} event
* @param    {Object} context
* @param    {Object} callback
*/
exports.handler = async (event, context, callback) => {
    try {
        // How many digits will be considered for the vanity numbers
        const vanityLimit = 4 //Put into an env config

        // How many vanity numbers will be considered
        const topElements = 5 //Put into an env config

        // An array for the best 5 vanity numbers
        let finalResult = []

        // Extracting the customer number from the AWS Connect event object
        const number = event['Details']['ContactData']['CustomerEndpoint']['Address']

        if (!number) {
            throw new Error('Invalid input data')
        }

        // Validate the customer number format
        const validNumber = validateNumberFormat(number)

        if (!validNumber) {
            throw new Error('Invalid phone number format')
        }
        
        // Retrieve existing vanity numbers for the customer (if any) from DynamoDB
        const vanityNumbers = await getDynamoDBItems(number)
        console.log(vanityNumbers)

        if (!vanityNumbers) {
            // Filter the words whose length is less than or equal to the limit to reduce the array size, and sort
            const filteredWords = words.filter(word => word.length <= vanityLimit).sort()

            // Divide the number in two and use the second sequence of digits for generating random words
            const firstDigits = number.slice(0, number.length - vanityLimit)
            const lastDigitsArray = number.slice(-vanityLimit).split('')
            
            // Calculate all of the character permutations from the dial pad for the input digits
            dialPadPermutations(lastDigitsArray, lastDigitsArray.length, 0, [])

            // Iterate over the resulted array and put any obtained meaningful words into the result array
            for (let i = 0; i < permutationsResult.length; i++) {
                if (filteredWords.includes(permutationsResult[i].toLowerCase())) {
                    finalResult.push(permutationsResult[i])
                    // Remove the word that is already in the result array to prevent duplicates 
                    permutationsResult.splice(permutationsResult.indexOf(permutationsResult[i]), 1)
                }
            }

            // Extend the result array with random character combinations in case it has fewer elements
            if (finalResult.length < topElements) {
                finalResult = finalResult.concat(permutationsResult.slice(0, topElements - finalResult.length))
            }

            if (finalResult.length >= 3) {
                console.log('Insert vanity numbers into DynamoDB table')

                // An array for the vanity numbers formatted for storing in DynamoDB
                const dynamoDBItems = []

                // Format the vanity numbers for storing in DynamoDB
                for (let i = 0; i < finalResult.length; i++) {
                    // finalResult[i] = firstDigits + finalResult[i]
                    dynamoDBItems.push({'S': firstDigits + finalResult[i]})
                }

                // Store the vanity numbers and the customer number in DynamoDB
                await insertDynamoDBItems(number, dynamoDBItems)
            }
        } else {
            // Iterate over the result object store the vanity numbers in the array
           for (let i = 0; i < vanityNumbers['vanity-numbers']['L'].length; i++) {
               finalResult.push(vanityNumbers['vanity-numbers']['L'][i]['S'])
           }
        }

        // The callback function with the result object (first three vanity numbers) passed to the AWS Connect ContactFlow
        callback(null, {
            FirstNumber: finalResult[0],
            SecondNumber: finalResult[1],
            ThirdNumber: finalResult[2]
        })

        // Success
        return true
    } catch (error) {
        // Log the error in CloudWatch
        console.log(error)

        // The callback function with the error object passed to the AWS Connect ContactFlow
        callback(error)

        // Failure
        return false
    }
}