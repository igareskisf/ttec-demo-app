# ttec-demo-app

This is a demo project that converts the phone numbers from customers connecting to Amazon Connect into vanity numbers and saves the best 5 resulting numbers and the caller's phone number in a DynamoDB table. Best 5 numbers are considered all of the numbers that include meaningful english words in their form (meaningful is defined according to the library of english words used in the projects), sorted by ascending order. If there are no 5 words to be used from the library, then the empty slots are filled with randomly generated characters that map to the numbers (also in ascending order). After the vanity numbers are stored in DynamoDB, the agent automatically says 3 of the vanity possibilities.

There is also a second part of the project where a React frontend application is integrated with Amazon API Gateway and Lambda, and lists the vanity numbers from the 5 last callers, along with their phone numbers.

## Structure Overview
The project is a full repository of the frontend application, backend API Gateway and Amazon Connect integrations, as well as the architecture diagrams.

## Prerequisites
To be able to run and test the project locally and/or build and deploy to AWS you will need to install and configure the following tools and libraries installed:
- Docker
- AWS CLI
- AWS SAM CLI
- AWS Account
- Node.js 14.18.2 with npm
## Backend
The backend consists of two parts: the Lambda function and SAM template for Amazon Connect and the Lambda function and SAM template 


## Backend 1 installation and deployment

## Backend 1 unit tests

## Backend 1 cleanup

## Backend 2 installation and deployment

## Backend 2 unit tests

## Backend 2 cleanup

## Frontend explanation

## Frontend installation and deployment

## Frontend unit tests

## Frontend cleanup

## Architecture

## The Process

## Issues

## Improvements