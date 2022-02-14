# ttec-demo-app

This is a demo project that converts the phone numbers from customers connecting to an Amazon Connect ContactFlow into vanity numbers and saves the best 5 resulting numbers along with the caller phone number in a DynamoDB table. "Best" 5 numbers are considered all of the numbers that include meaningful english words in their form (meaningful is viewed as a word that is included in a library of english words used in the project), sorted by ascending order. If there are no 5 words used from the library, then "meaningful" are the randomly generated sequences of characters that map to the dial pad umbers (also in ascending order). After the vanity numbers are stored in DynamoDB, the prompt automatically presents 3 of the vanity possibilities.

There is also a second part of the project that is a React frontend application integrated with Amazon API Gateway and Lambda. The application exposes a frontend web UI that lists the vanity numbers from the 5 last callers, along with their phone numbers.

## Project Overview
The project is a full repository consisting of the frontend application, backend API Gateway and Amazon Connect ContactFlow Lambda functions and IaC templates, as well as the architecture diagrams, separated in different directories.

**NOTE:** All of the commands for resource provisioning, building, deployment and testing are considering a `development` environment and will be using the existing configuration for this environment. However, the project supports multiple environments configuration.

**NOTE:** I used `PowerShell` on Windows to execute the CLI commands.

## Prerequisites
To be able to build and deploy this project to AWS you will need to install and configure the following:

- [AWS Account](https://aws.amazon.com/console/)
- [AWS CLI](https://awscli.amazonaws.com/AWSCLIV2.msi)
- [AWS SAM CLI](https://github.com/aws/aws-sam-cli/releases/latest/download/AWS_SAM_CLI_64_PY3.msi)
- [Node.js](https://nodejs.org/dist/v16.14.0/node-v16.14.0-x64.msi)
- [Amazon Connect instance](https://docs.aws.amazon.com/connect/latest/adminguide/tutorial1-set-up-your-instance.html)

To deploy the project, first you clone the GitHub [repository](https://github.com/igareskisf/ttec-demo-app.git) at a location on your local machine `cd` to the `ttec-demo-app` directory. This is the root of the project and all of the commands explained below are executed relative to this directory. 

## The Backend
The backend consists of two parts:
- Lambda function and SAM template for the Amazon Connect ContactFlow Stack
- Lambda function and SAM template for the React application backend

## Amazon Connect ContactFlow
This project incorporates the creation of a ContactFlow resource for an already operating Amazon Connect instance and integrates it with Lambda and DynamoDB to convert the phone numbers from the customers into vanity numbers and store the best 5 resulting numbers along with the caller's phone number, upon which it automatically presents 3 of the stored vanity numbers back to the caller.

## Amazon Connect ContactFlow Installation and Deployment
Before you deploy the Stack you should check the configuration in `./backend/call-center/env/dev.json`. If you are satisfied with the parameters you can proceed with the next steps or otherwise you can make adjustments before proceeding. Once you are satisfied with the configuration do the following: 

Change directory to `./backend/call-center/lambda` and run

```bash
npm i
```
Change directory to `./backend/call-center` and run

```bash
sam build --config-env dev
```
followed by

```bash
sam deploy --config-env dev --guided
```

The interactive wizard will guide you through the parameters defined in the `samconfig.toml` configuration file. You can accept the defaults or change them. Provide values where required. After that, the CloudFormation Stack with all of the resources will be created. When the process finishes, you should [update](https://docs.aws.amazon.com/connect/latest/adminguide/connect-lambda-functions.html) the operating Amazon Connect instance with the Lambda function that was created. This way the Amazon Connect is granted a permission to invoke the Lambda.

Now you can log in in Amazon Connect and link the phone number used for testing with the created ContactFlow.

## Amazon Connect ContactFlow Unit Tests

Tests are defined in the `./backend/call-center/lambda/test` folder. Run the following command from `./backend/call-center/lambda` to run them:

```bash
npm run test
```

## Amazon Connect Cleanup
To delete the application, change directory to `./backend/call-center` and run

```bash
sam delete --config-env dev
```

**NOTE:** That is the last command to run when doing a cleanup. Before it you should remove the React application Stack and the application itself as well.

## Amazon Connect Logging
The logs for this application will be stored in the CloudWatch log group for the created Lambda function.

## React Backend
This project incorporates the creation of an API Gateway that integrates with a Lambda function that returns the vanity numbers from the last 5 callers, used in the frontend application.

## React Backend Installation and Deployment
Before you deploy this Stack, you should check the config in `./backend/react-app/env/dev.json`. If you are satisfied with what is in the configuration proceed with the next steps or otherwise make adjustments before proceeding. Once you are satisfied with the configuration do the following: 

Change directory to `./backend/react-app/lambda` and run

```bash
npm i
```
Change directory to `./backend/react-app` and run

```bash
sam build --config-env dev
```
followed by

```bash
sam deploy --config-env dev --guided
```

The interactive wizard will guide you through the parameters defined in the samconfig.toml file. You can accept the defaults or change them. After this, the CloudFormation Stack with all of the resources will be created.

## React Backend Unit Tests

Tests are defined in the `./backend/react-app/lambda/test` folder. Run the following command from `./backend/react-app/lambda` to run them:

```bash
npm run test
```

## React Backend Cleanup
To delete the application, change directory to `./backend/react-app` and run

```bash
sam delete --config-env dev
```

**NOTE:** This command should be executed before deleting the resources for the Amazon Connect Stack.

## React Backend Logging
The logs for this application will be logged in the CloudWatch log group for the created Lambda function.

## React Frontend
This is a very simple frontend React application that connects to an Amazon API Gateway endpoint and displays the vanity numbers from the last 5 callers along with the caller's phone numbers in a table view. The application was bootstrapped using `create-react-app`.

## React App Installation and Deployment
Before you deploy the application to S3, you should check the config in `./frontend/vanity-numbers/.env.development`. If you are satisfied with what is in the configuration proceed with the next steps or otherwise make adjustments before proceeding (you probably would, because the API Gateway endpoint URL has to be updated to point to the newly created one). Update the bucket name in `./frontend/vanity-numbers/package.json` under the `upload` command to point to the bucket created for hosting the React frontend as well. Once you are satisfied with the configuration do the following: 

Change directory to `./frontend/vanity-numbers` and run

```bash
npm i
```
followed by

```bash
npm run deploy:dev
```

Once the deployment is done, you can copy the URL from the hosting website (under **Properties > Static website hosting**) and paste it to the browser. 

Voila!

## React App Unit Tests

Run the following command from `./frontend/vanity-numbers` (and follow the prompt guidance) to run the tests:

```bash
npm run test
```

## React App Cleanup
To delete the application, you have to go to the S3 bucket where the application is hosted and empty it. This is the first step you should take when cleaning up the environment and the CloudFormation resources.

## Architecture
The architecture diagrams for both of the backend applications are located in the `./diagrams` directory. They are stored in .png format.

## Challenges
I created this project by integrating all of the source code for both the backend and frontend as well as the architecture diagram assets into one common repository. This was done only for the purposes of this task. However, this is a bad practice and should be avoided in the real scenarios, where I would have separated the backend from the frontend into separate repositories, making the contribution and code management more flexible and independent from each other. I would also have uploaded the diagrams to an external source, completely removing them from the project.

The challenges I have encountered working on this project came from the requirements. I have never used Amazon Connect before, although I have a little bit of experience working with IVR platforms (InContact). First I had to study the service and all of its possibilities before implementing the solution. This way I ended up hitting a limit set for the Amazon Connect numbers (while I was playing around with the service), which has stopped me from testing the ConnectFlow and the Lambda integration (I have tested the Lambda code and DynamoDB operations only, with a dummy event (found in `./backend/call-center/lambda/events`) that is included in the project directory as well).

Moreover, I used AWS SAM for the first time to build the deployment package from a SAM template to automate the process of infrastructure provisioning and make testing faster and easier (without having to re-deploy the code every time I made changes or updates). I could have used plain CloudFormation though (I have experience with it) but I wanted to learn this tool and I found out that it is really helpful, especially as it makes the local development and testing easier and faster.

For the local development, I have also used [NoSQL Workbench](https://s3.amazonaws.com/nosql-workbench/NoSQL%20Workbench-win-3.2.1.exe) and the [sam-dynamodb-local](https://github.com/ganshan/sam-dynamodb-local) application with [Docker](https://www.docker.com/).

I have to mention here that I also did not have any previous experience with React (although I have experience in developing frontend applications with HTML/CSS and Bootstrap as well as a little experience with Angular and TypeScript). This was another challenge for me but I managed to create and deploy a simple React web application hosted on S3 to display the vanity numbers from the last 5 callers. I have also got my hands dirty with writing some unit tests for React for the first time.

On the other hand, all of the source code is written in JavaScript ES6 to speed things up a little, since that is the language I am most comfortable with (I could have also used TypeScript because I have a little experience with it as well but for the sake of time constraint I went with JavaScript).

All in all, I must say that despite all of the mentioned challenges above, I really enjoyed working on this task as it helped me to learn a lot of new stuff during the process, and that is what was most important for me.

## Project Structure

The main project structure consists of the following directories and files:
- backend
- frontend
- diagrams
- README.md

The `backend` directory is where all of the source code for the Lambda functions along with the IaC templates is stored. There are two sub-projects (sub-directories) in this directory: 
- `call-center` - contains the Amazon Connect Lambda source code and IaC template for provisioning the Lambda function, IAM Role, DyndamoDB table and the Amazon Connect ContactFlow
- `react-app` - contains the React backend Lambda source code and IaC template for provisioning the API Gateway, Lambda function and IAM Roles for the API and the Lambda, as well as the S3 bucket and the Policy for deploying and accessing the frontend application.

The `frontend` directory is where all of the frontend source code is stored and managed. The React application source code is in the `vanity-numbers` sub-folder.

The `diagrams` folder stores the architecture diagrams for the applications in a .png format.

## Process Flows and Code Explained

**The Amazon Connect flow works as follows:**
1. The customer makes a call to the provided Amazon Connect number that is integrated with the created ContactFlow.
2. When the call is intercepted, the customer hears a voice that informs the customer to hold on while the phone number is processed for vanity numbers generation.
3. The Lambda function is invoked that checks if there is already a record for the customer in the DynamoDB table or, if there is no record, it generates the vanity numbers from the caller number and stores the best 5 matches in a DynamoDB table. Then it returns 3 of the vanity numbers to the caller.
4. At the end, another prompt is played to the caller depending on the success or failure of the Lambda function.
 - If the processing fails, the voice tells the caller to try again later.
 - If the processing succeeds, the voice presents 3 vanity numbers to the caller.
5. The ContactFlow ends and the caller is disconnected.

The problem here was that I was no able to claim a number to test the ContactFlow Lambda integration with because I reached out the limit for creating new Amazon Connect numbers while playing around with the service for the first time. The testing was made only for the Lambda source code, with a dummy request. The rest of the flow is not tested (I hope it will work :)), so the steps above just represent how the logical execution of events should happen in the created ContactFlow.

The Lambda function accepts and validates the caller's number, and makes a check to see if the number already exists in the DynamoDB table. If it exists, then the raw result returned from DynamoDB is parsed and formatted as an object of 3 vanity numbers that are returned to the caller. Otherwise, a function that generates the vanity numbers is called and the best 5 results are stored in the DynamoDB table while 3 of them are returned back to the caller. The limits for how many digits are used for the vanity numbers and how many of them are stored in DynamoDB are flexible and configurable. The function that generates the vanity numbers is a recursive function that tries all the permutations from the characters that correspond to the dial pad digits. Afterwards the generated random characters are compared against a sorted list of meaningful english words and the matches are stored in an array for further processing. The matched words are removed from the permutations list to avoid duplicates. If there are less than 5 words in the final array, then it is filled with some of the sorted random words that are left in the permutations list. At the end, if there are minimum of 3 numbers in the array (this check was optional), then they are formatted and along with the caller's phone number and a timestamp are stored in the DyanmoDB table.

**The React application works as follows:**
1. The user visits the application URL which renders page with a table that displays the vanity numbers from the last 5 callers along with their phone numbers.
2. The frontend forwards the request to an API Gateway endpoint which proxies further the request to a Lambda function for processing.
3. The Lambda function accepts the request and makes a call to the DyanmoDB table to get the list with the phone numbers and vanity numbers from the last 5 callers. It then parses and formats the output before including it in the response expected by the frontend application. 

The Lambda function retrieves from DynamoDB the vanity numbers and the phone numbers from the last 5 callers. This limit is also configurable. If there are no records, then an empty array is returned to the user. Otherwise, the result is parsed and formatted to an array of 5 objects that are returned to the user.

The problem I faced here was that I was not able not retrieve the last 5 records because of the way the DynamoDB stores data. Moreover, I was not able not limit the query to 5 records neither, because I could not base the search on any key or a condition. I overcome this problem by doing a full scan of the records and then reversing them in the Lambda code to get the latest 5 caller records. This works fine for several records but it is a bad practice in the real world scenarios and could could be a potential issue for a large dataset, because the scan reads all of the data from DynamoDB and that could affect the application performance. So, a better solution has to be implemented for this part, which I cannot remind of at this point.

## Improvements
This POC was done in a limited time frame and is only for demo purposes. There are a lot of things that could be done differently, could be improved or added to optimize the project, make it scalable, with a better user experience, safe from potential attacks or security breaches, and ready for production.

To begin with, the static content from S3 could be served through CloudFront to speed up the site, and a custom domain could be registered in Route 53 to make the URL more user-friendly. All of this could be integrated with a custom SSL certificate issued through the AWS Certificate Manager, to make the HTTP traffic secure.

Second, the API Gateway requests could be authorized by incorporating a custom token-based Lambda authorizer (one way of doing it) that will control the API access. Moreover, usage plans and API keys could also be added to further secure the API and set quotas for different users and use cases.

Third, Lambda functions can be enriched with a logic to further improve the request parameters validation and error handling. Better logging and monitoring is also a possibility through integration of some third-party logging libraries and tools such as DataDog, AWS X-Ray etc. Configuration parameters could be stored inside the Parameter Store and sensitive information should be encrypted/decrypted using KMS.

Furthermore, to increase the data durability we can also use the DynamoDB Global Tables to allow for multi-region data replication, and also we can migrate to the on-demand capacity mode, which will make our DynamoDB capable of serving thousands of requests per second with a minimum latency. Another aspect is enabling the point-in-time recovery parameter, which will provide continuous backups for our data and make our application more resilient.

Regarding the React frontend application, a register/login functionality could be applied on top of the application that can integrate with Amazon Cognito for user management and single-sign-on capabilities. The responsiveness and the design of the application could also be improved through CSS, making it more user friendly. Some other components and functionalities could be created and added to the frontend as well, such as navigation bar, menus, logos, search capabilities, table pagination, exporting and importing functionality etc., making the application feature-rich.