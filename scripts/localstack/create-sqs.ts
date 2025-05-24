import { LAMBDA_NAME, lambda, sqs } from './aws-config'

import {
  CreateQueueCommand,
  GetQueueAttributesCommand
} from '@aws-sdk/client-sqs'
import {
  AddPermissionCommand,
  CreateEventSourceMappingCommand
} from '@aws-sdk/client-lambda'

const lambdaName = LAMBDA_NAME

export async function createQueue() {
  const queueName = 'my-queue'

  let queueUrl: string | undefined
  let queueArn: string | undefined

  try {
    const createQueueResp = await sqs.send(
      new CreateQueueCommand({ QueueName: queueName })
    )

    if (!createQueueResp.QueueUrl) {
      console.error('❌ QueueUrl não retornada pela AWS.')
      return
    }

    queueUrl = createQueueResp.QueueUrl
    console.log(`✅ Fila SQS '${queueName}' criada.`)
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'name' in err &&
      (err as { name: string }).name === 'QueueAlreadyExists'
    ) {
      console.log(`ℹ️ Fila '${queueName}' já existe.`)
    } else {
      console.error('❌ Erro ao criar fila SQS:', err)
    }
    return
  }

  try {
    const attrResp = await sqs.send(
      new GetQueueAttributesCommand({
        QueueUrl: queueUrl,
        AttributeNames: ['QueueArn']
      })
    )

    if (!attrResp.Attributes || !attrResp.Attributes.QueueArn) {
      console.error('❌ ARN da fila não encontrado.')
      return
    }

    queueArn = attrResp.Attributes.QueueArn
  } catch (err) {
    console.error('❌ Erro ao obter ARN da fila:', err)
    return
  }

  try {
    await lambda.send(
      new AddPermissionCommand({
        Action: 'lambda:InvokeFunction',
        FunctionName: lambdaName,
        Principal: 'sqs.amazonaws.com',
        StatementId: 'sqs-permission',
        SourceArn: queueArn
      })
    )
    console.log('✅ Permissão de invocação adicionada à Lambda para o SQS.')
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'name' in err &&
      (err as { name: string }).name === 'ResourceConflictException'
    ) {
      console.log('ℹ️ Permissão já existente.')
    } else {
      console.error('❌ Erro ao adicionar permissão à Lambda:', err)
    }
  }

  try {
    await lambda.send(
      new CreateEventSourceMappingCommand({
        EventSourceArn: queueArn,
        FunctionName: lambdaName,
        BatchSize: 1,
        Enabled: true
      })
    )
    console.log('✅ EventSourceMapping criado entre SQS e Lambda.')
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'name' in err &&
      (err as { name: string }).name === 'ResourceConflictException'
    ) {
      console.log('ℹ️ EventSourceMapping já existente.')
    } else {
      console.error('❌ Erro ao criar EventSourceMapping:', err)
    }
  }
}
