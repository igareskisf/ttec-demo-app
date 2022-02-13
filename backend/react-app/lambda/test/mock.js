// Mock data

/* SAMPLE OUTPUT (simplified)
    "statusCode": 200,
    "body": [
        {
           customer-number: "+38976111111"
           vanity-numbers: [
               "+3897611ABCD",
               "+3897611EFGH",
               "+3897611IJKL",
               "+3897611MNOP",
               "+3897611QRST"
           ]
       } 
    ]
*/

// Mock output from the DynamoDB function
const getDynamoDBItems = async (error, empty) => {
    // Mock error
    if (error) {
        throw new Error('DynamoDB operation failed')
    }

    // Mock empty response
    if (empty) {
        return null
    }

    // Mock success
    return [
        {
            'customer-number': { 'S': '+38976111111' },
            'vanity-numbers': { 'L': [
                { 'S': '+3897611ABCD' },
                { 'S': '+3897611EFGH' },
                { 'S': '+3897611IJKL' },
                { 'S': '+3897611MNOP' },
                { 'S': '+3897611QRST' }
            ]}
        },
        {
            'customer-number': { 'S': '+38976222222' },
            'vanity-numbers': { 'L': [
                { 'S': '+3897622ABCD' },
                { 'S': '+3897622EFGH' },
                { 'S': '+3897622IJKL' },
                { 'S': '+3897622MNOP' },
                { 'S': '+3897622QRST' }
            ]}
        },
        {
            'customer-number': { 'S': '+38976333333' },
            'vanity-numbers': { 'L': [
                { 'S': '+3897633ABCD' },
                { 'S': '+3897633EFGH' },
                { 'S': '+3897633IJKL' },
                { 'S': '+3897633MNOP' },
                { 'S': '+3897633QRST' }
            ]}
        },
        {
            'customer-number': { 'S': '+38976444444' },
            'vanity-numbers': { 'L': [
                { 'S': '+3897644ABCD' },
                { 'S': '+3897644EFGH' },
                { 'S': '+3897644IJKL' },
                { 'S': '+3897644MNOP' },
                { 'S': '+3897644QRST' }
            ]}
        },
        {
            'customer-number': { 'S': '+38976555555' },
            'vanity-numbers': { 'L': [
                { 'S': '+3897655ABCD' },
                { 'S': '+3897655EFGH' },
                { 'S': '+3897655IJKL' },
                { 'S': '+3897655MNOP' },
                { 'S': '+3897655QRST' }
            ]}
        },
        {
            'customer-number': { 'S': '+38976666666' },
            'vanity-numbers': { 'L': [
                { 'S': '+3897666ABCD' },
                { 'S': '+3897666EFGH' },
                { 'S': '+3897666IJKL' },
                { 'S': '+3897666MNOP' },
                { 'S': '+3897666QRST' }
            ]}
        },
    ]
}

module.exports = {
    getDynamoDBItems
}