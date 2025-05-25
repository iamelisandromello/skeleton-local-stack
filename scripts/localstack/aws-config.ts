import { S3Client } from '@aws-sdk/client-s3'
import { SQSClient } from '@aws-sdk/client-sqs'
import { LambdaClient } from '@aws-sdk/client-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { APIGatewayClient } from '@aws-sdk/client-api-gateway'

// Credenciais locais para LocalStack (ajuste para produção)
const credentials = {
  accessKeyId: 'test',
  secretAccessKey: 'test'
}

const region = 'us-east-1'
const endpoint = 'http://localhost:4566'

export const LAMBDA_NAME = 'skeleton-local-stack'
export const BUCKET_NAME = 'meu-unico-bucket-s3'
export const SQS_QUEUE_NAME = 'skeleton-local-stack-queue'

// Exporta os clients AWS SDK v3 configurados para LocalStack
export const lambda = new LambdaClient({ region, endpoint, credentials })
export const sqs = new SQSClient({ region, endpoint, credentials })
export const s3 = new S3Client({
  region,
  endpoint,
  credentials,
  forcePathStyle: true
})
export const dynamodb = new DynamoDBClient({ region, endpoint, credentials })
export const apigateway = new APIGatewayClient({
  region,
  endpoint,
  credentials
})

export const API_NAME = 'HelloAPI'

export const API_ROUTES = [
  {
    path: '/',
    method: 'GET'
  },
  {
    path: '/hello',
    method: 'POST'
  }
]
