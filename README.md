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
- Node.js 14.18.2 with npm (6.14.15)

Also, it is assumed that a working Amazon Connect instance is already created and configured with Lambda integration, and a phone number is already claimed.

## Claim
You should first clone the project at a given location and cd to the ttec-demo-app directory. This is the root of the project and all of the commands explained below are executed relative to this directory. Moreover, all of the commands for provisioning, deployment and testing are considering a development environment and will be using the existing configuration for this environment. Note that the project supports multiple environments as long as the configuration files for the environment exist.

The commands im my environment were executed from the PowerShell on Windows.

## Backend
The backend consists of two parts: the Lambda function and SAM template for Amazon Connect and the Lambda function and SAM template for the React application.

## Backend 1
This creates a ContactFlow for an already created Amazon Connect instance and integrates with Lambda and DynamoDB to convert the phone numbers from customers into vanity numbers and saves the best 5 resulting numbers and the caller's phone number in DynamoDB table upon which it automatically tells 3 of the stored vanity numbers to the caller.

## Backend 1 installation and deployment
Go to the root of the project. Before you deploy the Call Center Lambda, you should check the config in `./backend/call-center/env/dev.json`. If you are satisfied with what is in the configuration proceed with the next steps or otherwise make adjustments before proceeding. Once you are satisfied with the configuration do the following: 

Change directory to `./backend/call-center/lambda` and run

```bash
npm i
```
Change directory to `./backend/call-center` and run the following commands

```bash
sam build --config-env dev
```

```bash
sam deploy --config-env dev --guided
```

The interactive wizard will guide you through the parameters defined in the samconfig.toml file. You can accept the defaults or change them, and provide values where required. After this, the CloudFormation Stack with all of the resources will be created. When the process finishes, you should update the Connect instance Contact flow with the Lambda function that was created so that Amazon Connect is granted a permission to invoke the Lambda.

You can log in now now in the Agent Dashboard and connect the phone number with the created ContactFlow.

NOTE: PLease note that the Contact Flow is not tested but is more as a POC. This is because while playing around for a first time with Amazon Connect I wasted the limit for claiming phone numbers and was not able to claim one to test the flow and Lambda integration. I contacted the AWS support for increasing the limit so that I can be able to claim another phone number and test the integration but the process takes several days which was not until I have sent the task. The Lambda was tested with a test event, however, which can also be found under `./backend/call-center/lambda/events`.

## Backend 1 unit tests

Tests are defined in the `./backend/call-center/lambda/test` folder. Run the following command from `./backend/call-center/lambda` to run them:

```bash
npm run test
```

## Backend 1 cleanup
To delete the application change to `./backend/call-center` directory and run:

```bash
sam delete --config-env dev
```

Note that this is the last command to run, after deleting the React application Stack as well.

## Backend 1 logging
The logs for this application will be logged in the CloudWatch log group for the created Lambda function.

## Backend 2
This creates a backend for the frontend React application that displays the vanity numbers from the last 5 callers. The Lambda function that gets the numbers from the DynamoDB table is integrated with and exposed through Amazon API Gateway endpoint.

## Backend 2 installation and deployment
Go to the root of the project. Before you deploy the React Lambda, you should check the config in `./backend/react-app/env/dev.json`. If you are satisfied with what is in the configuration proceed with the next steps or otherwise make adjustments before proceeding. Once you are satisfied with the configuration do the following: 

Change directory to `./backend/react-app/lambda` and run

```bash
npm i
```
Change directory to `./backend/react-app` and run the following commands

```bash
sam build --config-env dev
```

```bash
sam deploy --config-env dev --guided
```

The interactive wizard will guide you through the parameters defined in the samconfig.toml file. You can accept the defaults or change them. After this, the CloudFormation Stack with all of the resources will be created.

## Backend 2 unit tests

Tests are defined in the `./backend/react-app/lambda/test` folder. Run the following command from `./backend/react-app/lambda` to run them:

```bash
npm run test
```

## Backend 2 cleanup
To delete the application change to `./backend/react-app` directory and run:

```bash
sam delete --config-env dev
```

Note that this command should be run before deleting the resources for the Call Center Stack.

## Backend 2 logging
The logs for this application will be logged in the CloudWatch log group for the created Lambda function.





## Frontend
This is a very simple frontend React application that connects to Amazon API Gateway and displays the vanity numbers from the last 5 callers along with the caller phone numbers in a table view. The application was bootstrapped using create-react-app.

## Frontend installation and deployment
Go to the root of the project. Before you deploy the application to S3, you should check the config in `./frontend/vanity-numbers/.env.development`. If you are satisfied with what is in the configuration proceed with the next steps or otherwise make adjustments before proceeding (you probably would, since the API Gateway endpoint URL should be updated to point to the newly created one). Moreover, update the bucket name in `./frontend/vanity-numbers/package.json` under `upload` command to point to the bucket for hosting the application that was created through CloudFormation. Once you are satisfied with the configuration do the following: 

Change directory to `./frontend/vanity-numbers` and run

```bash
npm i
```

```bash
npm run deploy:dev
```

Once the deployment is done, you can copy the URL from the hosting website (under Properties > Static website hosting) and paste it to the browser. Voila!

## Frontend tests

Run the following command from `./frontend/vanity-numbers` to run the tests (and follow the prompt guidance):

```bash
npm run test
```

## Frontend cleanup
To delete the application, you have to go to the S3 bucket and empty it. This is the first step you should take when cleaning up the environment and CloudFormation resources.

## Architecture
The architecture diagrams for both the Call Center and React applications can be found under `./diagrams` directory.

## The Process

I created this project by integrating all of the source code for both the backend and frontend as well as the assets such as the diagrams into one common repository. This was only for the purposes of the task. However,it is a bad practice and in real world I would have separated the backend from frontend in separate repositories, making the contribution and code management more flexible and independent of each other. I would also have uploaded the diagrams to an external source, completely removing them from the project.

My challenges with this project were from the requirements. Since I have never used Amazon Connect before, although I have a little bit of experience with working on IVR platforms (such as InContact), I had to study the service and all of its possibilities before implementing the solution. This way I have also ended up hitting the AWS Account limit set for the AMazon Connect numbers (while I was playing around with the service), which have stopped me from testing the ConnectFlow and the Lambda integration (I tested the Lambda code though, with some dummy event included in the project as well).

Also, I used AWS SAM for the first time to build the deployment package from the SAM template that will automate the process of infrastructure provisioning and make testing the Lambda code easier (without having to re-deploy the code every time some changes are made). I could have used CloudFormation for infrastructure provisioning (since I have more experience with writing plain CloudFormation templates) but I wanted to learn this tool as well and I think it is really helpful, especially as it makes easier and speeds up the local development and testing.

For the local development, I have also used NoSQL Workbench and sam-dynamodb-local (https://github.com/ganshan/sam-dynamodb-local) application.

I must mention that I also did not have previous experience with React (although I have experience in developing frontend applications with HTML/CSS and Bootstrap as well as little experience with Angular and TypeScript). This was another challenge for me but I managed to create and deploy a simple web application hosted on S3 that displays the vanity numbers from the last 5 callers. I have also got my hands dirty with the way of writing unit tests for React applications.

On the other hand, all of the code is written in JavaScript ES6 to speed things up since that is what I am most comfortable working with (I could have also used TypeScript because I have a little experience with it as well but for the sake of time I stick with JavaScript)

I must say that despite these challenges I really enjoyed working on the task as it really helped me to learn a lot of new stuff during the process, which is what is most important for me.

The project structure looks like the following:
- backend
- frontend
- diagrams
- README.md

The `backend` directory is where all of the source code for the Lambda is stored along with the templates for infrastructure provisioning. There are two sub-projects in this directory: `call-center` (for creating the ContactFlow, DynamoDB table and the Lambda function that integrates with them) and `react-app` (for creating the React application backend exposed through API Gateway).

The `frontend` directory is where all of the frontend source code is stored and managed. The React application source code is in the `vanity-numbers` sub-folder.

The `diagrams` folder stores the diagrams for the architecture of both the Amazon Connect and React applications in a .png format.

The Amazon Connect ContactFlow works as follows:
1. The customer makes a call to the provided call center number that is integrated with the created ContactFlow.
2. When the call is intercepted, the customer hears a voice that is informing the customer to hold on while the vanity numbers are processed.
3. Then the Lambda function is invoked that checks if there is already a record for the customer in the DynamoDB table to return or, if there is not, it generates the vanity numbers for the caller number, stores the best 5 matches in a DynamoDB table, and returns 3 of them for presenting to the caller.
4. At the end, another prompt is played to the caller depending on the success or error of the Lambda function.
5. If the processing fails, the voice tells the customer to try again later.
6. If the processing succeeds, the voice reads the 3 returned numbers to the customer.
7. Then the customer is disconnected.

The first problem is that I cannot claim a number to test the ContactFlow because I reached the limit for claiming Amazon Connect numbers, so I only tested the Lambda code with a dummy request. The rest of the flow is not tested (I hope it will work) but is how the logical flow of events happen in the flow.

The Lambda function accepts and validates the caller's number and it makes a check to see if it already exists in the DynamoDB table. If it exists, then the raw result returned from DynamoDB is parsed and formatted in an object of 3 vanity numbers returned to the caller. If it does not exist, then the vanity numbers for the caller's number are generated, the best 5 results are stored in the DynamoDB table and 3 of them are returned to the caller. The limits for how many digits are used for generating the vanity numbers and how many of them are stored in DynamoDB are flexible and configured through a configuration. The processing is done by a recursive function that generates all of the permutations from the characters that correspond on the dial pad digits. Then, all of the generated random characters are compared against a sorted list of meaningful english words and the matches are stored for further processing. The matched words are then removed from the permutations list to avoid duplicates. If there are less than 5 (or defined limit) words in the final array, then it is filled with some of the sorted random words from the random words from the permutations list. If there are minimum of 3 numbers in the final array (this check was optional), then these are formatted and along with the caller phone number and a timestamp are stored in the DyanmoDB table.

The React application works as follows:
1. The user visits the application URL which renders a table that displays the vanity numbers from the last 5 callers along with the callers phone numbers.
2. The frontend forwards the request to an API Gateway endpoint which proxies further the request to a Lambda function.
3. The Lambda function accepts the request and makes a call to the DyanmoDB table to get the list with the phone numbers and vanity numbers from the last 5 callers. It then parses and formats the output before including it in the response expected by the frontend application. 

The Lambda function retrieves the vanity numbers and the phone numbers from the last 5 callers. This limit is also configurable. If the records does not exist, then an empty array is returned to the user. Otherwise, the result is parsed and formatted to an array of 5 objects that are returned to the user.

The problem I faced here was that I could not retrieve the last 5 records because of the way the DynamoDB stores the data, and I could not limit the query to 5 records neither, since I could not base the search on any key and condition. At least I was not able to find a better and optimum solution, so I overcome this problem by doing a scan of all of the records and then reversing them on the Lambda side to get the latest 5 caller records. This works fine for several records, but is a bad practice and could could be an issue for a large dataset because the scan reads all of the data from DynamoDB which could affect the application performance. So, a better solution should be implemented in this part.

## Improvements
This project was done with a limited time frame and is only for demo purposes. There are a lot of things that could be done differently, improved or added to make it a production ready, optimized, scalable, with a better user experience and safe from potential attacks or security breaches.

To begin with, the static content from S3 could be served through CloudFront to speed up the site and a custom domain could be registered in Route 53 to make the URL user-friendly. All of this could also be integrated with a custom SSL certificate issued through the AWS Certificate Manager service, to make the HTTP traffic secure.

Second, the API Gateway requests could be authorized by incorporating a custom token-based Lambda authorizer that will control the access to the API (one way of doing so). Also, Usage plans and API keys could also be added to the API to further secure the API and set quotas for different users.

Third, Lambda functions can be added a logic to further improve the request parameters validation and error handling. Better logging and monitoring is also a possibility through the integration of some third-party logging libraries and tools such as DataDog, AWS X-Ray etc. Configuration parameters and sensitive data can also be stored inside Parameter Store and encrypted/decrypted using KMS.

To increase the data durability we can also use the DynamoDB Global Tables to allow data replication to multiple regions, and also we can migrate to on-demand capacity mode which will make our DynamoDB capable of serving thousands of requests per second.
Another aspect is enabling the point-in-time recovery, which will provide continuous backups for our data and make our application more resilient.

Regarding the React frontend application, a register/login functionality can also be applied on top of the application that can integrate with Amazon Cognito for user management and single-sign-on capabilities. The responsiveness and the design of the application can also be improved through CSS, making it more user friendly. Some other components and functionalities could also be created, such as navigation bar, menus, logos, search capability, table pagination, exporting and importing etc., making the application feature-rich.

Ilija Gareski

