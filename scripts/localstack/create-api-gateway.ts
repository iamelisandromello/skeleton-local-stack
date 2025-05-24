import { LAMBDA_NAME, lambda, apigateway } from './aws-config'

import {
  CreateRestApiCommand,
  GetResourcesCommand,
  CreateResourceCommand,
  PutMethodCommand,
  PutIntegrationCommand
} from '@aws-sdk/client-api-gateway'
import { GetFunctionCommand } from '@aws-sdk/client-lambda'

async function setupApiGateway() {
  // Recupera ARN da função Lambda
  const lambdaData = await lambda.send(
    new GetFunctionCommand({ FunctionName: LAMBDA_NAME })
  )
  const lambdaArn = lambdaData.Configuration?.FunctionArn
  if (!lambdaArn) throw new Error('Lambda não encontrada.')

  // Cria API
  const api = await apigateway.send(
    new CreateRestApiCommand({ name: 'HelloAPI' })
  )

  const restApiId = api.id
  if (!restApiId) throw new Error('ID da API não encontrado.')

  // Recupera recurso raiz
  const rootResources = await apigateway.send(
    new GetResourcesCommand({ restApiId })
  )

  const rootId = rootResources.items?.[0]?.id
  if (!rootId) throw new Error('Root resource não encontrado.')

  // Cria recurso /hello
  const resource = await apigateway.send(
    new CreateResourceCommand({
      restApiId,
      parentId: rootId,
      pathPart: 'hello'
    })
  )

  const resourceId = resource.id
  if (!resourceId) throw new Error('ID do recurso não encontrado.')

  // Define método POST
  await apigateway.send(
    new PutMethodCommand({
      restApiId,
      resourceId,
      httpMethod: 'POST',
      authorizationType: 'NONE'
    })
  )

  // Integra com a Lambda
  await apigateway.send(
    new PutIntegrationCommand({
      restApiId,
      resourceId,
      httpMethod: 'POST',
      type: 'AWS_PROXY',
      integrationHttpMethod: 'POST',
      uri: `arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/${lambdaArn}/invocations`
    })
  )

  console.log(
    `✅ API Gateway configurado.\n🔗 Endpoint: http://localhost:4566/restapis/${restApiId}/local/_user_request_/hello`
  )
}

setupApiGateway().catch(console.error)
