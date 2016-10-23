## Introduction

TODO

## Deploying to AWS Lambda

### Client-side

The code in `client/` is static and can be deployed anywhere as-is.

### Server-side

Before you begin, generate the source code for the server:

```bash
cd server/
make
```

then go to the AWS Management Console and:

1. Go to AWS IAM.
2. Under Policies, select "Create Policy", then "Create Your Own Policy".
3. Call it `APIGatewayLambdaInvokePolicy`:

    ```
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Resource": [
            "*"
          ],
          "Action": [
            "lambda:InvokeFunction"
          ]
        }
      ]
    }
    ```

4. Under Roles, select "Create New Role", call it `APIGatewayLambdaInvokeRole`, and choose "Amazon API Gateway". Don't attach a policy.
5. Under Policies, select "Create Policy", then "Create Your Own Policy".
6. Call it `APIGatewayLambdaExecPolicy`:

    ```
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Action": [
            "logs:*"
          ],
          "Effect": "Allow",
          "Resource": "arn:aws:logs:*:*:*"
        }
      ]
    }
    ```

7. Under Roles, select "Create New Role", call it `APIGatewayLambdaExecRole`, and choose "AWS Lambda". Attach `APIGatewayLambdaExecPolicy`.
8. Go to AWS Lambda.
9. Create a new Lambda function with a blank blueprint.
10. Select the "Node.js 4.3" runtime.
11. Upload the zip file that was generated for you in `dist/`.
12. For your Lambda function handler role, choose `APIGatewayLambdaExecPolicy`.
13. Go to AWS API Gateway.
14. Create a new API Gateway by importing the Swagger file in `server/`.
15. In the Resources view, select "GET /", go to "Integration Request", click edit next to "Lambda Function: mp3ToPodcast", re-type the name of the Lambda function, press save, and accept the permissions prompt.
16. Under "Actions", click "Deploy API" and create a new stage called "prod" -- this will give you the API URL.
