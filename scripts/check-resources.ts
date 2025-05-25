import { servicesToCheck } from '../localstack/localstack-config'

import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3'
import { SQSClient, ListQueuesCommand } from '@aws-sdk/client-sqs'
import { LambdaClient, ListFunctionsCommand } from '@aws-sdk/client-lambda'
import {
  APIGatewayClient,
  GetRestApisCommand,
  GetResourcesCommand
} from '@aws-sdk/client-api-gateway'
import {
  DynamoDBClient,
  ListTablesCommand,
  DescribeTableCommand
} from '@aws-sdk/client-dynamodb'
import {
  CloudWatchLogsClient,
  DescribeLogGroupsCommand
} from '@aws-sdk/client-cloudwatch-logs'
import { SNSClient, ListTopicsCommand } from '@aws-sdk/client-sns'
import { KinesisClient, ListStreamsCommand } from '@aws-sdk/client-kinesis'

const localConfig = {
  region: 'us-east-1',
  endpoint: 'http://localhost:4566',
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test'
  }
}

async function checkS3() {
  try {
    const client = new S3Client(localConfig)
    const result = await client.send(new ListBucketsCommand({}))
    console.log(
      '🪣 Buckets S3:',
      result.Buckets?.map((b) => b.Name)
    )
  } catch (err) {
    logError('S3', err)
  }
}

async function checkSQS() {
  try {
    const client = new SQSClient(localConfig)
    const result = await client.send(new ListQueuesCommand({}))
    console.log('📬 Filas SQS:', result.QueueUrls)
  } catch (err) {
    logError('SQS', err)
  }
}

async function checkLambda() {
  try {
    const client = new LambdaClient(localConfig)
    const result = await client.send(new ListFunctionsCommand({}))
    console.log(
      '⚙️ Lambdas:',
      result.Functions?.map((fn) => fn.FunctionName)
    )
  } catch (err) {
    logError('Lambda', err)
  }
}

async function checkAPIGateway() {
  try {
    const client = new APIGatewayClient(localConfig)
    const result = await client.send(new GetRestApisCommand({}))
    const apis = result.items || []
    console.log(
      '🌐 APIs Gateway:',
      apis.map((api) => ({ id: api.id, name: api.name }))
    )
    for (const api of apis) {
      const resources = await client.send(
        new GetResourcesCommand({ restApiId: api.id! })
      )
      console.log(
        `  📍 Rotas da API ${api.name}:`,
        resources.items?.map((r) => r.path)
      )
    }
  } catch (err) {
    logError('API Gateway', err)
  }
}

async function checkDynamoDB() {
  try {
    const client = new DynamoDBClient(localConfig)
    const result = await client.send(new ListTablesCommand({}))
    const tableNames = result.TableNames || []
    console.log('🗄️ Tabelas DynamoDB:', tableNames)
    for (const name of tableNames) {
      const desc = await client.send(
        new DescribeTableCommand({ TableName: name })
      )
      console.log(`  📄 Estrutura de ${name}:`, desc.Table?.KeySchema)
    }
  } catch (err) {
    logError('DynamoDB', err)
  }
}

async function checkCloudWatch() {
  try {
    const client = new CloudWatchLogsClient(localConfig)
    const result = await client.send(new DescribeLogGroupsCommand({}))
    console.log(
      '📘 Log Groups:',
      result.logGroups?.map((g) => g.logGroupName)
    )
  } catch (err) {
    logError('CloudWatch Logs', err)
  }
}

async function checkSNS() {
  try {
    const client = new SNSClient(localConfig)
    const result = await client.send(new ListTopicsCommand({}))
    console.log(
      '📣 Tópicos SNS:',
      result.Topics?.map((t) => t.TopicArn)
    )
  } catch (err) {
    logError('SNS', err)
  }
}

async function checkKinesis() {
  try {
    const client = new KinesisClient(localConfig)
    const result = await client.send(new ListStreamsCommand({}))
    console.log('🔀 Streams Kinesis:', result.StreamNames)
  } catch (err) {
    logError('Kinesis', err)
  }
}

function logError(service: string, err: unknown) {
  const message = err instanceof Error ? err.message : String(err)
  if (
    message.includes('InternalFailure') ||
    message.includes('Service') ||
    message.includes('is not enabled')
  ) {
    console.warn(`⚠️  Serviço ${service} não está habilitado no LocalStack.`)
  } else {
    console.error(`❌ Erro ao verificar ${service}:`, err)
  }
}

async function checkResources() {
  console.log('🔍 Verificando recursos no LocalStack...')

  if (servicesToCheck.s3) await checkS3()
  if (servicesToCheck.sqs) await checkSQS()
  if (servicesToCheck.lambda) await checkLambda()
  if (servicesToCheck.apigateway) await checkAPIGateway()
  if (servicesToCheck.dynamodb) await checkDynamoDB()
  if (servicesToCheck.cloudwatch) await checkCloudWatch()
  if (servicesToCheck.sns) await checkSNS()
  if (servicesToCheck.kinesis) await checkKinesis()
  console.log('✅ Verificação concluída.')
}

checkResources().catch((err) => {
  console.error('❌ Erro inesperado durante a verificação de recursos:', err)
  process.exit(1)
})
