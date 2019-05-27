const { Component } = require('@serverless/components')

class Api extends Component {
  async default(inputs = {}) {
    this.cli.status('Deploying')

    // todo quick fix for array of objects in yaml issue
    inputs.endpoints = Object.keys(inputs.endpoints).map((e) => inputs.endpoints[e])

    const awsApiGatewayInputs = inputs

    if (awsApiGatewayInputs.endpoints.length !== 0) {
      awsApiGatewayInputs.endpoints = awsApiGatewayInputs.endpoints.map((endpoint) => {
        if (typeof endpoint.function !== 'object') {
          throw Error(`missing function for endpoint ${endpoint.method} ${endpoint.path}`)
        }
        return {
          ...endpoint,
          function: endpoint.function.arn,
          authorizer: endpoint.authorizer ? endpoint.authorizer.arn : null
        }
      })
    }

    const awsApiGateway = await this.load('@serverless/aws-api-gateway')

    const outputs = await awsApiGateway(awsApiGatewayInputs)

    this.cli.outputs(outputs)

    return outputs
  }

  async remove(inputs = {}) {
    this.cli.status('Removing')
    const awsApiGateway = await this.load('@serverless/aws-api-gateway')

    const outputs = await awsApiGateway.remove(inputs)

    this.cli.outputs(outputs)

    return outputs
  }
}

module.exports = Api
