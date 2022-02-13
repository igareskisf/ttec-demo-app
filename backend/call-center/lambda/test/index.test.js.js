const LambdaTester = require('lambda-tester')
const proxyquire = require('proxyquire')
const chai = require('chai')
const expect = chai.expect

// Internal dependencies
const validator = require('../validation/validator.js')
const helpers = require('../utils/helpers.js')

// Import DynamoDB mock function
const { validInput, invalidInputFormat, invalidInput, getDynamoDBItems, insertDynamoDBItems } = require('./mock.js')

// Define the common test suite
describe('Call Center Lambda Unit Test', () => {
    let lambda = null
    
    // Mock data services
    let dataStub = {}

    beforeEach(function () {
        // Export the Lambda with mock dependencies
        lambda = proxyquire.noCallThru().load('../index.js', {
            // Replace the dependencies present inside the Lambda function with mock functions
            './data-services/dynamodb.js': dataStub,
            './validation/validator.js': validator,
            './utils/helpers.js': helpers
        })
    })

    describe('Successful Invocation', () => {
        let mockData = null

        before(() => {
            // Attach DynamoDB mock functions to data services (mocked)
            dataStub = {
                ...dataStub,
                // Mocking DynamoDB calls
                getDynamoDBItems: () => {
                    return getDynamoDBItems()
                },
                insertDynamoDBItems: () => {
                    return insertDynamoDBItems()
                }
            }

            // Get valid mock input
            mockData = validInput
        })

        it('with successful response', (done) => {
            // Execute lambda function
            LambdaTester(lambda.handler)
            .event(mockData) // Passing input data
            .expectResult((result) => {
                // Tests cases
                expect(result).to.be.an('object')
                expect(result).to.have.own.property('FirstNumber')
                expect(result.FirstNumber).to.be.a('string')
                expect(result.FirstNumber).to.equal('+3897611ABCD')
                expect(result).to.have.own.property('SecondNumber')
                expect(result.SecondNumber).to.be.a('string')
                expect(result.SecondNumber).to.equal('+3897611EFGH')
                expect(result).to.have.own.property('ThirdNumber')
                expect(result.ThirdNumber).to.be.a('string')
                expect(result.ThirdNumber).to.equal('+3897611IJKL')
                
                done()
            })
            .catch(done) // Catch any errors
        })
    })

    describe('Successful Invocation', () => {
        let mockData = null

        before(() => {
            // Attach DynamoDB mock functions to data services (mocked)
            dataStub = {
                ...dataStub,
                // Mocking DynamoDB calls
                getDynamoDBItems: () => {
                    return getDynamoDBItems(false, true)
                },
                insertDynamoDBItems: () => {
                    return insertDynamoDBItems()
                }

            }

            // Get valid mock input
            mockData = validInput
        })

        it('with successful response (when no records found in DynamoDB)', (done) => {
            // Execute lambda function
            LambdaTester(lambda.handler)
            .event(mockData) // Passing input data
            .expectResult((result) => {
                // Tests cases
                expect(result).to.be.an('object')
                expect(result).to.have.own.property('FirstNumber')
                expect(result.FirstNumber).to.be.a('string')
                expect(result).to.have.own.property('SecondNumber')
                expect(result.SecondNumber).to.be.a('string')
                expect(result).to.have.own.property('ThirdNumber')
                expect(result.ThirdNumber).to.be.a('string')
                
                done()
            })
            .catch(done) // Catch any errors
        })
    })

    describe('Error', () => {
        let mockData = null

        before(() => {
            // Attach DynamoDB mock functions to data services (mocked)
            dataStub = {
                ...dataStub,
                // Mocking DynamoDB calls
                getDynamoDBItems: () => {
                    return getDynamoDBItems(true)
                },
                insertDynamoDBItems: () => {
                    return insertDynamoDBItems()
                }

            }

            // Get valid mock input
            mockData = validInput
        })

        it('when getDynamoDBItems fails', (done) => {
            // Execute lambda function
            LambdaTester(lambda.handler)
            .event(mockData) // Passing input data
            .expectError((error) => {
                // Tests cases
                expect(error.message).to.exist
                expect(error.message).to.be.a('string')
                expect(error.message).to.equal('DynamoDB getDynamoDBItems operation failed')
                
                done()
            })
            .catch(done) // Catch any errors
        })
    })

    describe('Error', () => {
        let mockData = null

        before(() => {
            // Attach DynamoDB mock functions to data services (mocked)
            dataStub = {
                ...dataStub,
                // Mocking DynamoDB calls
                getDynamoDBItems: () => {
                    return getDynamoDBItems(false, true)
                },
                insertDynamoDBItems: () => {
                    return insertDynamoDBItems(true)
                }

            }

            // Get valid mock input
            mockData = validInput
        })

        it('when insertDynamoDBItems fails', (done) => {
            // Execute lambda function
            LambdaTester(lambda.handler)
            .event(mockData) // Passing input data
            .expectError((error) => {
                // Tests cases
                expect(error.message).to.exist
                expect(error.message).to.be.a('string')
                expect(error.message).to.equal('DynamoDB insertDynamoDBItems operation failed')
                
                done()
            })
            .catch(done) // Catch any errors
        })
    })

    describe('Error', () => {
        let mockData = null

        before(() => {
            // Attach DynamoDB mock functions to data services (mocked)
            dataStub = {
                ...dataStub,
                // Mocking DynamoDB calls
                getDynamoDBItems: () => {
                    return getDynamoDBItems()
                },
                insertDynamoDBItems: () => {
                    return insertDynamoDBItems()
                }
            }

            // Get invalid mock input
            mockData = invalidInputFormat
        })

        it('with invalid input format', (done) => {
            // Execute lambda function
            LambdaTester(lambda.handler)
            .event(mockData) // Passing input data
            .expectError((error) => {
                // Tests cases
                expect(error.message).to.exist
                expect(error.message).to.be.a('string')
                expect(error.message).to.equal('Invalid phone number format')
                
                done()
            })
            .catch(done) // Catch any errors
        })
    })

    describe('Error', () => {
        let mockData = null

        before(() => {
            // Attach DynamoDB mock functions to data services (mocked)
            dataStub = {
                ...dataStub,
                // Mocking DynamoDB calls
                getDynamoDBItems: () => {
                    return getDynamoDBItems()
                },
                insertDynamoDBItems: () => {
                    return insertDynamoDBItems()
                }
            }

            // Get invalid mock input
            mockData = invalidInput
        })

        it('with invalid input data', (done) => {
            // Execute lambda function
            LambdaTester(lambda.handler)
            .event(mockData) // Passing input data
            .expectError((error) => {
                // Tests cases
                expect(error.message).to.exist
                expect(error.message).to.be.a('string')
                expect(error.message).to.equal('Invalid input data')
                
                done()
            })
            .catch(done) // Catch any errors
        })
    })
})