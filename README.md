# API

The provider agnostic API Gateway Framework, powered by [Serverless Components](https://github.com/serverless/components).

## Features

- Create & manage new API Gateway REST APIs with very simple configuration.
- Extend Existing API Gateway REST APIs without disrupting other services.
- Integrate with serverless functions via the [function component](https://github.com/serverless-components/function)
- Authorize requests with authorizer functions
- Create proxy endpoints for any URL with 3 lines of code (coming soon)
- Create mock endpoints by specifying the object you'd like to return (coming soon)
- Create & manage logs to debug API Gateway requests (coming soon)
- Protect your API with API Keys (coming soon)
- Configure throttling & rate limits (coming soon)

## Table of Contents

1. [Install](#1-install)
2. [Create](#2-create)
3. [Configure](#3-configure)
4. [Deploy](#4-deploy)

### 1. Install

```shell
$ npm install -g serverless
```

### 2. Create

Just create the following simple boilerplate:

```shell
$ touch serverless.yml # more info in the "Configure" section below
$ touch index.js       # your lambda code
$ touch .env           # your AWS api keys
```
```
# .env
AWS_ACCESS_KEY_ID=XXX
AWS_SECRET_ACCESS_KEY=XXX
```

the `index.js` file should look something like this:


```js

module.exports.createUser = async (e) => {
  return {
    statusCode: 200,
    body: 'Created User'
  }
}

module.exports.getUsers = async (e) => {
  return {
    statusCode: 200,
    body: 'Got Users'
  }
}

module.exports.auth = async (event, context) => {
  return {
    principalId: 'user',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: event.methodArn
        }
      ]
    }
  }
}

```

Keep reading for info on how to set up the `serverless.yml` file.

### 3. Configure
You can configure the component to either create a new REST API from scratch, or extend an existing one.

#### Creating REST APIs
You can create new REST APIs by specifying the endpoints you'd like to create, and optionally passing a name and description for your new REST API.

```yml
# serverless.yml

name: rest-api

createUser:
  component: "@serverless/function"
  inputs:
    name: ${name}-create-user
    code: ./code
    handler: index.createUser
getUsers:
  component: "@serverless/function"
  inputs:
    name: ${name}-get-users
    code: ./code
    handler: index.getUsers
auth:
  component: "@serverless/function"
  inputs:
    name: ${name}-auth
    code: ./code
    handler: index.auth

restApi:
  component: "@serverless/api"
  inputs:
    name: ${name}
    description: Serverless REST API
    endpoints:
      - path: /users
        method: POST
        function: ${createUser}
        authorizer: ${auth}
      - path: /users
        method: GET
        function: ${getUsers}
        authorizer: ${auth}
```

#### Extending REST APIs
You can extend existing REST APIs by specifying the REST API ID. This will **only** create, remove & manage the specified endpoints without removing or disrupting other endpoints.

```yml
# serverless.yml

name: rest-api

createUser:
  component: "@serverless/function"
  inputs:
    name: ${name}-create-user
    code: ./code
    handler: index.createUser
getUsers:
  component: "@serverless/function"
  inputs:
    name: ${name}-get-users
    code: ./code
    handler: index.getUsers

restApi:
  component: "@serverless/api"
  inputs:
    id: qwertyuiop # specify the REST API ID you'd like to extend
    endpoints:
      - path: /users
        method: POST
        function: ${createUser}
      - path: /users
        method: GET
        function: ${getUsers}
```

### 4. Deploy

```shell
$ serverless

```

&nbsp;

### New to Components?

Checkout the [Serverless Components](https://github.com/serverless/components) repo for more information.
