const LambdaTester = require('lambda-tester')
const proxyquire = require('proxyquire')
const chai = require('chai')
const expect = chai.expect

// Import DynamoDB mock function
const { getDynamoDBItems } = require('./mock.js')

// Define the common test suite
describe('React Lambda Unit Test', () => {
    let lambda = null
    
    // Mock data services
    let dataStub = {}

    beforeEach(function () {
        // Export the Lambda with mock dependencies
        lambda = proxyquire.noCallThru().load('../index.js', {
            // Replace the dependencies present inside the Lambda function with mock functions
            './data-services/dynamodb.js': dataStub
        })
    })

    describe('Successful Invocation', () => {
        before(() => {
            // Attach DynamoDB mock function to data services (mocked)
            dataStub = {
                ...dataStub,
                // Mocking DynamoDB call
                getDynamoDBItems: () => {
                    return getDynamoDBItems()
                }
            }
        })

        it('with successful response', (done) => {
            // Execute lambda function
            LambdaTester(lambda.handler)
            .event() // Passing input data
            .expectResult((result) => {
                // Tests cases
                expect(result).to.be.an('object')
                expect(result.statusCode).to.exist
                expect(result.statusCode).to.equals(200)
                expect(result.headers).to.exist
                expect(result.headers).to.be.a('object')
                expect(result.body).to.exist
                expect(result.body).to.be.a('string')
                
                done()
            })
            .catch(done) // Catch any errors
        })

        it('with result data array', (done) => {
            // Execute lambda function
            LambdaTester(lambda.handler)
            .event() // Passing input data
            .expectResult((result) => {
                // Parse the response body to convert back to JSON object
                const data = JSON.parse(result.body)

                // Tests cases
                expect(data).to.be.an('array')
                expect(data).to.have.lengthOf(5)
                expect(data[0]).to.be.an('object')
                expect(data[0]).to.have.own.property('customer-number')
                expect(data[0]['customer-number']).to.be.a('string')
                expect(data[0]['customer-number']).to.equal('+38976666666')
                expect(data[0]).to.have.own.property('vanity-numbers')
                expect(data[0]['vanity-numbers']).to.be.an('array')
                expect(data[0]['vanity-numbers']).to.have.lengthOf(5)
                expect(data[0]['vanity-numbers'][0]).to.be.a('string')
                
                done()
            })
            .catch(done) // Catch any errors
        })
    })

    describe('Successful Invocation', () => {
        before(() => {
            // Attach DynamoDB mock function to data services (mocked)
            dataStub = {
                ...dataStub,
                // Mocking DynamoDB call
                getDynamoDBItems: () => {
                    return getDynamoDBItems(false, true)
                }
            }
        })

        it('with successful response (empty result)', (done) => {
            // Execute lambda function
            LambdaTester(lambda.handler)
            .event() // Passing input data
            .expectResult((result) => {
                // Tests cases
                expect(result).to.be.an('object')
                expect(result.statusCode).to.exist
                expect(result.statusCode).to.equals(200)
                expect(result.headers).to.exist
                expect(result.headers).to.be.a('object')
                expect(result.body).to.exist
                expect(result.body).to.be.a('string')
                
                done()
            })
            .catch(done) // Catch any errors
        })

        it('with empty result', (done) => {
            // Execute lambda function
            LambdaTester(lambda.handler)
            .event() // Passing input data
            .expectResult((result) => {
                // Parse the response body to convert back to JSON object
                const data = JSON.parse(result.body)

                // Tests cases
                expect(data).to.be.an('array')
                expect(data).to.have.lengthOf(0)
                expect(data[0]).to.equal(undefined)
                
                done()
            })
            .catch(done) // Catch any errors
        })
    })

    describe('Error', () => {
        before(() => {
            // Attach DynamoDB mock function to data services (mocked)
            dataStub = {
                ...dataStub,
                // Mocking DynamoDB call
                getDynamoDBItems: () => {
                    return getDynamoDBItems(true)
                }
            }
        })

        it('with error response', (done) => {
            // Execute lambda function
            LambdaTester(lambda.handler)
            .event() // Passing input data
            .expectResult((result) => {
                // Tests cases
                expect(result).to.be.an('object')
                expect(result.statusCode).to.exist
                expect(result.statusCode).to.equals(500)
                expect(result.headers).to.exist
                expect(result.headers).to.be.a('object')
                expect(result.body).to.exist
                expect(result.body).to.be.a('string')
                
                done()
            })
            .catch(done) // Catch any errors
        })

        it('when error is from getDynamoDBItems', (done) => {
            // Execute lambda function
            LambdaTester(lambda.handler)
            .event() // Passing input data
            .expectResult((result) => {
                // Parse the response body to convert back to JSON object
                const data = JSON.parse(result.body)

                // Tests cases
                expect(data).to.be.a('string')
                expect(data).to.equal('DynamoDB operation failed')
                
                done()
            })
            .catch(done) // Catch any errors
        })
    })
})